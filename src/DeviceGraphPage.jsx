import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
const DeviceGraphPage = () => {
  const { deviceId } = useParams(); // Fetch the device ID from the URL

  // Mock data for different devices based on position
  const deviceData = {
    'ground-floor-left': [
      { name: 'Jan', pm25: 35, co2: 650, voc: 0.45, no2: 21, o3: 18 },
      { name: 'Feb', pm25: 28, co2: 680, voc: 0.38, no2: 19, o3: 15 },
      // More data for this device...
    ],
    'ground-floor-right': [
      { name: 'Jan', pm25: 32, co2: 620, voc: 0.50, no2: 20, o3: 14 },
      { name: 'Feb', pm25: 30, co2: 640, voc: 0.45, no2: 18, o3: 12 },
      // More data for this device...
    ],
    'first-floor-left': [
      { name: 'Jan', pm25: 45, co2: 710, voc: 0.55, no2: 22, o3: 19 },
      { name: 'Feb', pm25: 40, co2: 680, voc: 0.47, no2: 21, o3: 17 },
      // More data for this device...
    ],
    'first-floor-right': [
      { name: 'Jan', pm25: 38, co2: 695, voc: 0.49, no2: 23, o3: 20 },
      { name: 'Feb', pm25: 33, co2: 660, voc: 0.43, no2: 20, o3: 15 },
      // More data for this device...
    ]
  };

  // Get the data for the selected device from the mock data
  const dataForDevice = deviceData[deviceId] || [];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg font-semibold text-white">{deviceId.replace('-', ' ').toUpperCase()}</h1>
              <p className="text-sm text-gray-400">Indoor Air Quality Monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-900 p-4">
          <h2 className="text-white text-xl mb-4">Sensor Data for {deviceId.replace('-', ' ').toUpperCase()}</h2>

          {/* Display Graph for the selected device */}
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            {/* For simplicity, using a placeholder graph */}
            <div className="flex justify-center items-center h-64 text-gray-400">
              <span>Graph Placeholder for {deviceId.replace('-', ' ').toUpperCase()}</span>
            </div>
          </div>

          {/* Display data in table format */}
          <table className="min-w-full text-gray-400">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-left">PM25</th>
                <th className="px-4 py-2 text-left">CO2</th>
                <th className="px-4 py-2 text-left">VOC</th>
                <th className="px-4 py-2 text-left">NO2</th>
                <th className="px-4 py-2 text-left">O3</th>
              </tr>
            </thead>
            <tbody>
              {dataForDevice.map((data, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-4 py-2">{data.name}</td>
                  <td className="px-4 py-2">{data.pm25}</td>
                  <td className="px-4 py-2">{data.co2}</td>
                  <td className="px-4 py-2">{data.voc}</td>
                  <td className="px-4 py-2">{data.no2}</td>
                  <td className="px-4 py-2">{data.o3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceGraphPage;
