import React from 'react';

export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Ventas</h3>
          <p className="text-3xl font-bold text-[#0f4c81] mt-2">$0.00</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Productos</h3>
          <p className="text-3xl font-bold text-[#0f4c81] mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Clientes</h3>
          <p className="text-3xl font-bold text-[#0f4c81] mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Alertas</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
