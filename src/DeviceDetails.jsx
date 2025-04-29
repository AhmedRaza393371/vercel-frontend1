import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "./Sidebar";
import axios from "axios";

const DeviceDetail = () => {
  const { deviceId, deviceName } = useParams();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState([]);
  const [historicalData, setHistoricalData] = useState({
    H2: [],
    C2H5OH: [],
    CO: [],
    CO2: [],
    CH4: [],
    ALCOHOL: [],
    HUMIDITY: [],
    TEMPERATURE: [],
    "DUST CONCENTRATION": [],
  });
  const [hourlyData, setHourlyData] = useState({});
  const [viewMode, setViewMode] = useState("1min");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [validDeviceIds, setValidDeviceIds] = useState([]);
  const [addedDevices, setAddedDevices] = useState([]);
  const maxDataPoints = 12;

  const API_URL = `http://localhost:5000/api/data?deviceId=${deviceId}`;
  const HISTORICAL_API_URL = `http://localhost:5000/api/historical-data?deviceId=${deviceId}`;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/devices');
        const deviceIds = response.data.map(device => device.id);
        setValidDeviceIds(deviceIds);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to validate device. Please try again later.');
      }
    };

    const loadAddedDevices = () => {
      const savedDevices = localStorage.getItem('addedDevices');
      if (savedDevices) {
        try {
          const parsedDevices = JSON.parse(savedDevices);
          if (Array.isArray(parsedDevices)) {
            setAddedDevices(parsedDevices);
          } else {
            console.error('Invalid addedDevices format in localStorage');
            setError('Invalid device data.');
          }
        } catch (err) {
          console.error('Error parsing addedDevices:', err);
          setError('Invalid device data.');
        }
      }
    };

    fetchDevices();
    loadAddedDevices();
  }, []);

  useEffect(() => {
    if (validDeviceIds.length === 0 || addedDevices.length === 0) return;

    if (!validDeviceIds.includes(deviceId)) {
      setError('Invalid device ID.');
      navigate('/dashboard');
      return;
    }

    const device = addedDevices.find(device => device.id === deviceId);
    if (!device) {
      setError('Device not registered. Please add it in the Devices section.');
      navigate('/dashboard');
      return;
    }

    const correctDeviceName = device.position;
    if (decodeURIComponent(deviceName) !== correctDeviceName) {
      console.warn(`Device name mismatch: URL=${deviceName}, Expected=${correctDeviceName}`);
      navigate(`/device/${deviceId}/${encodeURIComponent(correctDeviceName)}`);
    }
  }, [validDeviceIds, addedDevices, deviceId, deviceName, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log(`🔍 Raw Real-time API Data (DeviceID: ${deviceId}):`, JSON.stringify(data, null, 2));

        if (data?.body?.Readings) {
          const updatedReadings = data.body.Readings.map(sensor => ({
            ...sensor,
            PPM: isNaN(sensor.PPM) || sensor.PPM === Infinity ? 0 : sensor.PPM
          }));

          console.log(`🔍 Updated Real-time Sensor Data (DeviceID: ${deviceId}):`, updatedReadings);
          setSensorData(updatedReadings);
          updateMinuteTrendData(updatedReadings);
        }
      } catch (error) {
        console.error(`❌ Error fetching data for DeviceID: ${deviceId}:`, error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [API_URL]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(HISTORICAL_API_URL);
        const data = await response.json();

        console.log(`🔍 Raw Historical API Data (DeviceID: ${deviceId}):`, JSON.stringify(data, null, 2));

        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 3600000); // 1 hour ago

        const formattedData = {};
        Object.keys(data).forEach(gasName => {
          const gasData = data[gasName] || [];
          // Filter data to the last hour
          const filteredGasData = gasData.filter(point => {
            const pointTime = new Date(point.timestamp);
            return pointTime >= oneHourAgo && pointTime <= now;
          });

          // Aggregate data into 1-minute intervals
          const minuteIntervals = {};
          filteredGasData.forEach(point => {
            const pointTime = new Date(point.timestamp);
            // Round down to the nearest minute
            pointTime.setSeconds(0, 0);
            const timeKey = pointTime.toISOString();
            if (!minuteIntervals[timeKey]) {
              minuteIntervals[timeKey] = { sumPPM: 0, count: 0 };
            }
            minuteIntervals[timeKey].sumPPM += point.ppm;
            minuteIntervals[timeKey].count += 1;
          });

          // Generate 60 points, one for each minute in the last hour
          const intervalData = [];
          for (let i = 0; i < 60; i++) {
            const minuteTime = new Date(now.getTime() - (59 - i) * 60000); // Start from 59 minutes ago to now
            minuteTime.setSeconds(0, 0);
            const timeKey = minuteTime.toISOString();
            const timeLabel = minuteTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const ppm = minuteIntervals[timeKey]
              ? minuteIntervals[timeKey].sumPPM / minuteIntervals[timeKey].count
              : 0; // Default to 0 if no data for that minute

            intervalData.push({
              time: timeLabel,
              ppm: ppm
            });
          }

          formattedData[gasName] = intervalData;
        });

        console.log(`📊 Formatted 1-Hour Trend Data (DeviceID: ${deviceId}):`, JSON.stringify(formattedData, null, 2));
        setHourlyData(formattedData);
      } catch (error) {
        console.error(`❌ Error fetching historical data for DeviceID: ${deviceId}:`, error);
      }
    };

    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 60000);
    return () => clearInterval(interval);
  }, [HISTORICAL_API_URL]);

  const updateMinuteTrendData = (newReadings) => {
    setHistoricalData((prevData) => {
      const newData = { ...prevData };

      const now = new Date();
      const timeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      newReadings.forEach(({ GasName, PPM }) => {
        if (!newData[GasName]) {
          newData[GasName] = [];
        }

        newData[GasName] = [
          ...newData[GasName],
          { time: timeLabel, ppm: PPM }
        ];

        if (newData[GasName].length > maxDataPoints) {
          newData[GasName].shift();
        }
      });

      console.log(`📊 Updated 1-Minute Trend Data (DeviceID: ${deviceId}):`, JSON.stringify(newData, null, 2));
      return newData;
    });
  };

  const getTrendData = (gasName) => {
     // Normalize the gas name to match the backend's format
  const normalizedGasName = normalizeGasNameForFrontend(gasName);
    if (viewMode === "1hour") {
     // Try both formats to be safe
    const data = hourlyData[normalizedGasName] || hourlyData[gasName] || [];
    console.log(`📊 Trend Data for ${gasName} (1-Hour View):`, JSON.stringify(data, null, 2));
    return data;
    }
    return historicalData[gasName] || [];
  };

  const normalizeGasNameForFrontend = (gasName) => {
    const gasNameMap = {
      "Dust Concentrati": "DUST CONCENTRATION",
      "DUST CONCENTRATI": "DUST CONCENTRATION",
      "Alcohol": "ALCOHOL",
      // Add other mappings as needed
    };
    return gasNameMap[gasName] || gasName;
  };
  const formatPPM = (ppm) => {
    return ppm ? ppm.toFixed(2) : "0.00";
  };

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <div className="flex-1 bg-gray-900 text-gray-100 overflow-auto">
          <div className="p-4">
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-6 py-4 rounded-xl flex items-center max-w-lg mx-auto">
              <svg className="h-6 w-6 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-lg">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isSidebarCollapsed={isSidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 bg-gray-900 text-gray-100 overflow-auto">
        <div className="p-4">
          <h1 className="font-bold text-4xl md:text-5xl mb-6 text-blue-400 text-center">{decodeURIComponent(deviceName) || "Device"}</h1>

          <div className="flex items-center justify-center mb-6">
            <span className={`mr-2 ${viewMode === "1min" ? "text-blue-400 font-bold" : "text-gray-400"}`}>1-Minute</span>
            <button 
              onClick={() => setViewMode(viewMode === "1min" ? "1hour" : "1min")}
              className="relative inline-flex items-center h-6 rounded-full w-12 bg-gray-700 mx-3 focus:outline-none"
            >
              <span className={`absolute h-4 w-4 rounded-full bg-blue-400 transition-transform duration-300 ${viewMode === "1min" ? "left-1" : "transform translate-x-7"}`} />
            </button>
            <span className={`ml-2 ${viewMode === "1hour" ? "text-blue-400 font-bold" : "text-gray-400"}`}>1-Hour</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensorData.length > 0 ? (
              sensorData.map((sensor, index) => (
                <div key={index} className="bg-gray-800 shadow-lg rounded-lg border border-gray-700 p-3">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3 flex justify-center">
                      <div className="bg-gray-800 rounded-lg flex flex-col items-center justify-center">
                        <h3 className={`text-lg font-semibold uppercase mb-1 ${sensor.GasName === "H2" ? "text-blue-400" : ""}`}>
                          {sensor.GasName}
                        </h3>
                        <div className="relative w-full h-40 flex items-center justify-center">
                          <GaugeChart
                            id={`gauge-chart-${sensor.GasName}`}
                            nrOfLevels={20}
                            percent={sensor.PPM / 500}
                            colors={sensor.PPM < 50 ? ["#73BF69", "#56A64B", "#37872D"] : ["#F2495C", "#E02F44", "#C4162A"]}
                            arcWidth={0.3}
                            needleColor="#FFFFFF"
                            needleBaseColor="#5794F2"
                            textColor="transparent"
                            animate={true}
                            cornerRadius={6}
                          />
                          <div className="absolute bottom-1 flex flex-col items-center">
                            <div className="text-xl font-bold text-blue-300">{formatPPM(sensor.PPM)} PPM</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3 mt-3 lg:mt-0">
                      <h3 className="text-lg font-semibold text-blue-400 mb-1 text-center lg:text-left">
                        {viewMode === "1min" ? "1-Minute Trend" : "1-Hour Trend"}
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
  <AreaChart 
    data={getTrendData(sensor.GasName)}
    style={{ backgroundColor: "#1F2937" }} // Set explicit background
  >
    <defs>
      <linearGradient id={`colorGradient-${sensor.GasName}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#5A9F7A" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#5A9F7A" stopOpacity={0.1} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
    <XAxis 
      dataKey="time" 
      stroke="#aaa" 
      interval={getTrendData(sensor.GasName).length > 10 ? 9 : 0} 
    />
    <YAxis 
      stroke="#aaa" 
      domain={[0, 'auto']} // Automatically adjust to the data range
    />
    <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
    <Area 
      type="monotone" 
      dataKey="ppm" 
      stroke="#5A9F7A" 
      fill={`url(#colorGradient-${sensor.GasName})`} 
      strokeWidth={2}
      isAnimationActive={true}
    />
    {/* Debug element to show when there's no data */}
    {getTrendData(sensor.GasName).length <= 1 && (
      <text x="50%" y="50%" textAnchor="middle" fill="#aaa">
        No trend data available
      </text>
    )}
  </AreaChart>
</ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-center text-gray-400">Waiting for new data from DeviceID: ${deviceId}...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;


//heello



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import GaugeChart from "react-gauge-chart";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import Sidebar from "./Sidebar";
// import axios from "axios";

// const DeviceDetail = () => {
//   const { deviceId, deviceName } = useParams();
//   const navigate = useNavigate();
//   const [sensorData, setSensorData] = useState([]);
//   const [historicalData, setHistoricalData] = useState({
//     H2: [],
//     C2H5OH: [],
//     CO: [],
//     CO2: [],
//     CH4: [],
//     ALCOHOL: [],
//     HUMIDITY: [],
//     TEMPERATURE: [],
//     "DUST CONCENTRATION": [],
//   });
//   const [hourlyData, setHourlyData] = useState({});
//   const [viewMode, setViewMode] = useState("1min");
//   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [error, setError] = useState(null);
//   const [validDeviceIds, setValidDeviceIds] = useState([]);
//   const [addedDevices, setAddedDevices] = useState([]);
//   const maxDataPoints = 12;

//   // Define maximum values for each gas type to properly scale gauges
//   const gasMaxValues = {
//     H2: 100,
//     CO: 50,
//     CO2: 1000,
//     CH4: 10,
//     C2H5OH: 10,
//     ALCOHOL: 5,
//     HUMIDITY: 100,
//     TEMPERATURE: 50,
//     "DUST CONCENTRATION": 500,
//     "DUST CONCENTRATI": 500, // For possible naming inconsistency
//   };

//   const API_URL = `http://localhost:5000/api/data?deviceId=${deviceId}`;
//   const HISTORICAL_API_URL = `http://localhost:5000/api/historical-data?deviceId=${deviceId}`;

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/devices');
//         const deviceIds = response.data.map(device => device.id);
//         setValidDeviceIds(deviceIds);
//       } catch (err) {
//         console.error('Error fetching devices:', err);
//         setError('Failed to validate device. Please try again later.');
//       }
//     };

//     const loadAddedDevices = () => {
//       const savedDevices = localStorage.getItem('addedDevices');
//       if (savedDevices) {
//         try {
//           const parsedDevices = JSON.parse(savedDevices);
//           if (Array.isArray(parsedDevices)) {
//             setAddedDevices(parsedDevices);
//           } else {
//             console.error('Invalid addedDevices format in localStorage');
//             setError('Invalid device data.');
//           }
//         } catch (err) {
//           console.error('Error parsing addedDevices:', err);
//           setError('Invalid device data.');
//         }
//       }
//     };

//     fetchDevices();
//     loadAddedDevices();
//   }, []);

//   useEffect(() => {
//     if (validDeviceIds.length === 0 || addedDevices.length === 0) return;

//     if (!validDeviceIds.includes(deviceId)) {
//       setError('Invalid device ID.');
//       navigate('/dashboard');
//       return;
//     }

//     const device = addedDevices.find(device => device.id === deviceId);
//     if (!device) {
//       setError('Device not registered. Please add it in the Devices section.');
//       navigate('/dashboard');
//       return;
//     }

//     const correctDeviceName = device.position;
//     if (decodeURIComponent(deviceName) !== correctDeviceName) {
//       console.warn(`Device name mismatch: URL=${deviceName}, Expected=${correctDeviceName}`);
//       navigate(`/device/${deviceId}/${encodeURIComponent(correctDeviceName)}`);
//     }
//   }, [validDeviceIds, addedDevices, deviceId, deviceName, navigate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();

//         if (data?.body?.Readings) {
//           const updatedReadings = data.body.Readings.map(sensor => ({
//             ...sensor,
//             PPM: isNaN(sensor.PPM) || sensor.PPM === Infinity ? 0 : sensor.PPM
//           }));

//           setSensorData(updatedReadings);
//           updateMinuteTrendData(updatedReadings);
//         }
//       } catch (error) {
//         console.error(`Error fetching data for DeviceID: ${deviceId}:`, error);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [API_URL]);

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await fetch(HISTORICAL_API_URL);
//         const data = await response.json();

//         const now = new Date();
//         const oneHourAgo = new Date(now.getTime() - 3600000); // 1 hour ago

//         const formattedData = {};
//         Object.keys(data).forEach(gasName => {
//           const gasData = data[gasName] || [];
//           // Filter data to the last hour
//           const filteredGasData = gasData.filter(point => {
//             const pointTime = new Date(point.timestamp);
//             return pointTime >= oneHourAgo && pointTime <= now;
//           });

//           // Aggregate data into 1-minute intervals
//           const minuteIntervals = {};
//           filteredGasData.forEach(point => {
//             const pointTime = new Date(point.timestamp);
//             // Round down to the nearest minute
//             pointTime.setSeconds(0, 0);
//             const timeKey = pointTime.toISOString();
//             if (!minuteIntervals[timeKey]) {
//               minuteIntervals[timeKey] = { sumPPM: 0, count: 0 };
//             }
//             minuteIntervals[timeKey].sumPPM += point.ppm;
//             minuteIntervals[timeKey].count += 1;
//           });

//           // Generate 60 points, one for each minute in the last hour
//           const intervalData = [];
//           for (let i = 0; i < 60; i++) {
//             const minuteTime = new Date(now.getTime() - (59 - i) * 60000); // Start from 59 minutes ago to now
//             minuteTime.setSeconds(0, 0);
//             const timeKey = minuteTime.toISOString();
//             const timeLabel = minuteTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//             const ppm = minuteIntervals[timeKey]
//               ? minuteIntervals[timeKey].sumPPM / minuteIntervals[timeKey].count
//               : 0; // Default to 0 if no data for that minute

//             intervalData.push({
//               time: timeLabel,
//               ppm: ppm
//             });
//           }

//           formattedData[gasName] = intervalData;
//         });

//         setHourlyData(formattedData);
//       } catch (error) {
//         console.error(`Error fetching historical data for DeviceID: ${deviceId}:`, error);
//       }
//     };

//     fetchHistoricalData();
//     const interval = setInterval(fetchHistoricalData, 60000);
//     return () => clearInterval(interval);
//   }, [HISTORICAL_API_URL]);

//   const updateMinuteTrendData = (newReadings) => {
//     setHistoricalData((prevData) => {
//       const newData = { ...prevData };

//       const now = new Date();
//       const timeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

//       newReadings.forEach(({ GasName, PPM }) => {
//         if (!newData[GasName]) {
//           newData[GasName] = [];
//         }

//         newData[GasName] = [
//           ...newData[GasName],
//           { time: timeLabel, ppm: PPM }
//         ];

//         if (newData[GasName].length > maxDataPoints) {
//           newData[GasName].shift();
//         }
//       });

//       return newData;
//     });
//   };

//   const getTrendData = (gasName) => {
//     // Normalize the gas name to match the backend's format
//     const normalizedGasName = normalizeGasNameForFrontend(gasName);
//     if (viewMode === "1hour") {
//       // Try both formats to be safe
//       const data = hourlyData[normalizedGasName] || hourlyData[gasName] || [];
//       return data;
//     }
//     return historicalData[gasName] || [];
//   };

//   const normalizeGasNameForFrontend = (gasName) => {
//     const gasNameMap = {
//       "Dust Concentrati": "DUST CONCENTRATION",
//       "DUST CONCENTRATI": "DUST CONCENTRATION",
//       "Alcohol": "ALCOHOL",
//       // Add other mappings as needed
//     };
//     return gasNameMap[gasName] || gasName;
//   };

//   const formatPPM = (ppm) => {
//     return ppm ? ppm.toFixed(2) : "0.00";
//   };

//   // Calculate gauge percent based on gas-specific scale
//   const getGaugePercent = (gasName, ppm) => {
//     const maxValue = gasMaxValues[gasName] || 500; // Default to 500 if not specified
//     const percent = ppm / maxValue;
//     // Limit to range 0-1 for gauge chart
//     return Math.min(Math.max(percent, 0), 1);
//   };

//   // Determine gauge color based on relative scale for each gas
//   const getGaugeColors = (gasName, ppm) => {
//     const maxValue = gasMaxValues[gasName] || 500;
//     const percentOfMax = ppm / maxValue;
    
//     // Green to yellow to red gradient based on percentage of max
//     if (percentOfMax < 0.3) {
//       return ["#73BF69", "#56A64B", "#37872D"]; // Green shades
//     } else if (percentOfMax < 0.7) {
//       return ["#FF9830", "#FF8400", "#E07000"]; // Yellow/Orange shades
//     } else {
//       return ["#F2495C", "#E02F44", "#C4162A"]; // Red shades
//     }
//   };

//   if (error) {
//     return (
//       <div className="flex h-screen overflow-hidden">
//         <Sidebar 
//           isSidebarCollapsed={isSidebarCollapsed} 
//           setSidebarCollapsed={setSidebarCollapsed}
//         />
//         <div className="flex-1 bg-gray-900 text-gray-100 overflow-auto">
//           <div className="p-4">
//             <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-6 py-4 rounded-xl flex items-center max-w-lg mx-auto">
//               <svg className="h-6 w-6 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               <span className="text-lg">{error}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar 
//         isSidebarCollapsed={isSidebarCollapsed} 
//         setSidebarCollapsed={setSidebarCollapsed}
//       />
      
//       <div className="flex-1 bg-gray-900 text-gray-100 overflow-auto">
//         <div className="p-4">
//           <h1 className="font-bold text-4xl md:text-5xl mb-6 text-blue-400 text-center">{decodeURIComponent(deviceName) || "Device"}</h1>

//           <div className="flex items-center justify-center mb-6">
//             <span className={`mr-2 ${viewMode === "1min" ? "text-blue-400 font-bold" : "text-gray-400"}`}>1-Minute</span>
//             <button 
//               onClick={() => setViewMode(viewMode === "1min" ? "1hour" : "1min")}
//               className="relative inline-flex items-center h-6 rounded-full w-12 bg-gray-700 mx-3 focus:outline-none"
//             >
//               <span className={`absolute h-4 w-4 rounded-full bg-blue-400 transition-transform duration-300 ${viewMode === "1min" ? "left-1" : "transform translate-x-7"}`} />
//             </button>
//             <span className={`ml-2 ${viewMode === "1hour" ? "text-blue-400 font-bold" : "text-gray-400"}`}>1-Hour</span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {sensorData.length > 0 ? (
//               sensorData.map((sensor, index) => (
//                 <div key={index} className="bg-gray-800 shadow-lg rounded-lg border border-gray-700 p-3">
//                   <div className="flex flex-col lg:flex-row">
//                     <div className="lg:w-1/3 flex justify-center">
//                       <div className="bg-gray-800 rounded-lg flex flex-col items-center justify-center">
//                         <h3 className={`text-lg font-semibold uppercase mb-1 ${sensor.GasName === "H2" ? "text-blue-400" : ""}`}>
//                           {sensor.GasName}
//                         </h3>
//                         <div className="relative w-full h-40 flex items-center justify-center">
//                           <GaugeChart
//                             id={`gauge-chart-${sensor.GasName}`}
//                             nrOfLevels={20}
//                             percent={getGaugePercent(sensor.GasName, sensor.PPM)}
//                             colors={getGaugeColors(sensor.GasName, sensor.PPM)}
//                             arcWidth={0.3}
//                             needleColor="#FFFFFF"
//                             needleBaseColor="#5794F2"
//                             textColor="transparent"
//                             animate={true}
//                             cornerRadius={6}
//                           />
//                           <div className="absolute bottom-1 flex flex-col items-center">
//                             <div className="text-xl font-bold text-blue-300">{formatPPM(sensor.PPM)} PPM</div>
//                             <div className="text-xs text-gray-400">
//                               Max: {gasMaxValues[sensor.GasName] || 500} PPM
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="lg:w-2/3 mt-3 lg:mt-0">
//                       <h3 className="text-lg font-semibold text-blue-400 mb-1 text-center lg:text-left">
//                         {viewMode === "1min" ? "1-Minute Trend" : "1-Hour Trend"}
//                       </h3>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart 
//                           data={getTrendData(sensor.GasName)}
//                           style={{ backgroundColor: "#1F2937" }}
//                         >
//                           <defs>
//                             <linearGradient id={`colorGradient-${sensor.GasName}`} x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#5A9F7A" stopOpacity={0.8} />
//                               <stop offset="95%" stopColor="#5A9F7A" stopOpacity={0.1} />
//                             </linearGradient>
//                           </defs>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                           <XAxis 
//                             dataKey="time" 
//                             stroke="#aaa" 
//                             interval={getTrendData(sensor.GasName).length > 10 ? 9 : 0} 
//                           />
//                           <YAxis 
//                             stroke="#aaa" 
//                             domain={[0, dataMax => {
//                               // Use a reasonable max value based on the data or the gas type max
//                               const maxData = Math.max(...getTrendData(sensor.GasName).map(item => item.ppm), 0);
//                               const typeMax = gasMaxValues[sensor.GasName] || 500;
//                               return Math.min(Math.max(maxData * 1.2, 10), typeMax);
//                             }]}
//                           />
//                           <Tooltip 
//                             contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
//                             formatter={(value) => [`${formatPPM(value)} PPM`, sensor.GasName]}
//                           />
//                           <Area 
//                             type="monotone" 
//                             dataKey="ppm" 
//                             stroke="#5A9F7A" 
//                             fill={`url(#colorGradient-${sensor.GasName})`} 
//                             strokeWidth={2}
//                             isAnimationActive={true}
//                           />
//                           {getTrendData(sensor.GasName).length <= 1 && (
//                             <text x="50%" y="50%" textAnchor="middle" fill="#aaa">
//                               No trend data available
//                             </text>
//                           )}
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-2 text-center py-10">
//                 <p className="text-center text-gray-400">Waiting for new data from DeviceID: {deviceId}...</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeviceDetail;