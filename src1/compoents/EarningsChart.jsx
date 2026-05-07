// src/components/EarningsChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EarningsChart = ({ dailyEarnings = [] }) => {
  // Prepare data – assuming last 7 days or whatever comes from API
  const sortedEarnings = [...dailyEarnings].sort((a, b) =>
    a._id.localeCompare(b._id)
  );

  const labels = sortedEarnings.map((item) =>
    new Date(item._id).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      // weekday: "short",   // optional
    })
  );

  const earningsData = sortedEarnings.map((item) => item.totalEarning || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Earnings (₹)",
        data: earningsData,
        backgroundColor: "#FB721D", // your brand orange
        borderColor: "#F26522",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "#F26522",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14, weight: "600" },
          color: "#4B5563",
        },
      },
      title: {
        display: true,
        text: "Daily Earnings (Last 7 Days)",
        color: "#1F2937",
        font: { size: 18, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(251, 114, 29, 0.95)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `₹ ${context.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 13 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
        ticks: {
          color: "#6B7280",
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
          font: { size: 13 },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-lg shadow-orange-500/5">
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default EarningsChart;