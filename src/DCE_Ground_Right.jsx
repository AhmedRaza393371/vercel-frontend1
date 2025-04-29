// import React, { useEffect, useState } from "react";
// import GaugeChart from "react-gauge-chart";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import Sidebar from "./Sidebar";

// const API_URL = "http://localhost:5000/api/data?deviceId=2"; // Filter for DeviceID: 2
// const HISTORICAL_API_URL = "http://localhost:5000/api/historical-data?deviceId=2"; // Filter for DeviceID: 2

// const DCE_Ground_Right = () => {
//   const [sensorData, setSensorData] = useState([]);
//   const [historicalData, setHistoricalData] = useState({
//     "H2": [],
//     "C2H5OH": [],
//     "CO": [],
//     "CO2": [],
//     "CH4": [],
//     "ALCOHOL": [],
//     "HUMIDITY": []
//   });
//   const [hourlyData, setHourlyData] = useState({});
//   const [viewMode, setViewMode] = useState("1min"); // Toggle between "1min" and "1hour"
//   const maxDataPoints = 12;
//   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

//   // Fetch real-time data every 5 seconds
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const data = await response.json();

//         console.log("🔍 Raw Real-time API Data (DeviceID: 2):", JSON.stringify(data, null, 2));

//         if (data?.body?.Readings) {
//           const updatedReadings = data.body.Readings.map(sensor => ({
//             ...sensor,
//             PPM: isNaN(sensor.PPM) || sensor.PPM === Infinity ? 0 : sensor.PPM
//           }));

//           console.log("🔍 Updated Real-time Sensor Data (DeviceID: 2):", updatedReadings);
//           setSensorData(updatedReadings);
//           updateMinuteTrendData(updatedReadings);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching data for DeviceID: 2:", error);
//       }
//     };

//     fetchData(); // Initial fetch
//     const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch 1-Hour Historical Data every minute
//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const response = await fetch(HISTORICAL_API_URL);
//         const data = await response.json();

//         console.log("🔍 Raw Historical API Data (DeviceID: 2):", JSON.stringify(data, null, 2));

//         // Format the hourly data for chart display with 5-minute intervals
//         const formattedData = {};

//         Object.keys(data).forEach(gasName => {
//           // Get the last hour's data
//           const gasData = data[gasName]?.filter(point => {
//             const timestamp = new Date(point.timestamp);
//             const now = new Date();
//             // Filter data for the last 1 hour
//             return timestamp >= new Date(now.setHours(now.getHours() - 1));
//           }) || [];

//           // Group data into 5-minute intervals
//           const intervalData = [];
//           let lastTime = '';
//           let sumPPM = 0;
//           let count = 0;

//           // Iterate over gasData and group into 5-minute intervals
//           gasData.forEach((dataPoint) => {
//             const date = new Date(dataPoint.timestamp);
//             const timeLabel = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes() - (date.getMinutes() % 5)).padStart(2, "0")}`;

//             if (lastTime === timeLabel) {
//               sumPPM += dataPoint.ppm;
//               count++;
//             } else {
//               if (lastTime !== '') {
//                 intervalData.push({
//                   time: lastTime,
//                   ppm: sumPPM / count
//                 });
//               }
//               lastTime = timeLabel;
//               sumPPM = dataPoint.ppm;
//               count = 1;
//             }
//           });

//           // Add the last interval
//           if (lastTime !== '') {
//             intervalData.push({
//               time: lastTime,
//               ppm: sumPPM / count
//             });
//           }

//           formattedData[gasName] = intervalData;
//         });

//         setHourlyData(formattedData);
//       } catch (error) {
//         console.error("❌ Error fetching historical data for DeviceID: 2:", error);
//       }
//     };

//     fetchHistoricalData(); // Fetch data on mount
//     const interval = setInterval(fetchHistoricalData, 60000); // Refresh hourly data every minute
//     return () => clearInterval(interval);
//   }, []);

//   // Update Historical Data for Trends (1-minute data)
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

//       console.log("📊 Updated 1-Minute Trend Data (DeviceID: 2):", JSON.stringify(newData, null, 2));
//       return newData;
//     });
//   };

//   // Get the correct data for the current view
//   const getTrendData = (gasName) => {
//     if (viewMode === "1hour") {
//       return hourlyData[gasName] || [];
//     }
//     return historicalData[gasName] || [];
//   };

//   // Format the PPM value for display
//   const formatPPM = (ppm) => {
//     return ppm ? ppm.toFixed(2) : "0.00";
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar 
//         isSidebarCollapsed={isSidebarCollapsed} 
//         setSidebarCollapsed={setSidebarCollapsed}
//       />
      
//       <div className="flex-1 bg-gray-900 text-gray-100 overflow-auto">
//         <div className="p-4">
//           <h1 className="font-bold text-4xl md:text-5xl mb-6 text-blue-400 text-center">DCE Ground Floor Right</h1>

//           {/* View Mode Toggle */}
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

//           {/* Grid Layout */}
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
//                             percent={sensor.PPM / 500}
//                             colors={sensor.PPM < 50 ? ["#73BF69", "#56A64B", "#37872D"] : ["#F2495C", "#E02F44", "#C4162A"]}
//                             arcWidth={0.3}
//                             needleColor="#FFFFFF"
//                             needleBaseColor="#5794F2"
//                             textColor="transparent"
//                             animate={true}
//                             cornerRadius={6}
//                           />
//                           <div className="absolute bottom-1 flex flex-col items-center">
//                             <div className="text-xl font-bold text-blue-300">{formatPPM(sensor.PPM)} PPM</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Trend Chart */}
//                     <div className="lg:w-2/3 mt-3 lg:mt-0">
//                       <h3 className="text-lg font-semibold text-blue-400 mb-1 text-center lg:text-left">
//                         {viewMode === "1min" ? "1-Minute Trend" : "1-Hour Trend"}
//                       </h3>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart data={getTrendData(sensor.GasName)}>
//                           <defs>
//                             <linearGradient id={`colorGradient-${sensor.GasName}`} x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#5A9F7A" stopOpacity={0.8} />
//                               <stop offset="95%" stopColor="#5A9F7A" stopOpacity={0.1} />
//                             </linearGradient>
//                           </defs>
//                           <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                           <XAxis dataKey="time" stroke="#aaa" />
//                           <YAxis stroke="#aaa" domain={[0, 100]} />
//                           <Tooltip />
//                           <Area 
//                             type="monotone" 
//                             dataKey="ppm" 
//                             stroke="#5A9F7A" 
//                             fill={`url(#colorGradient-${sensor.GasName})`} 
//                             strokeWidth={2}
//                             isAnimationActive={true}
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-2 text-center py-10">
//                 <p className="text-center text-gray-400">Waiting for new data from DeviceID: 2...</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DCE_Ground_Right;