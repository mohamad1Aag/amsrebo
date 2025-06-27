import React, { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// تسجيل المكونات في ChartJS
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDash() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // بيانات المخططات
  const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const salesData = {
    labels,
    datasets: [
      {
        label: "المبيعات",
        data: [500, 700, 1200, 1800, 2200, 2700, 4000],
        borderColor: "#9333ea",
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersData = {
    labels,
    datasets: [
      {
        label: "الطلبات",
        data: [150, 200, 400, 600, 550, 700, 900],
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const visitorsData = {
    labels,
    datasets: [
      {
        label: "الزوار",
        data: [1000, 1200, 1500, 1700, 2000, 2500, 3000],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 bg-purple-600 rounded-md shadow-lg hover:bg-purple-700 transition"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="min-h-screen bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-200 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* مبيعات */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-center text-purple-800 font-bold mb-2">📊 المبيعات الأسبوعية</h3>
            <Line data={salesData} options={options} />
          </div>

          {/* الطلبات */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-center text-green-700 font-bold mb-2">📦 الطلبات الأسبوعية</h3>
            <Line data={ordersData} options={options} />
          </div>

          {/* الزوار */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-center text-yellow-600 font-bold mb-2">👥 الزوار</h3>
            <Line data={visitorsData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}
