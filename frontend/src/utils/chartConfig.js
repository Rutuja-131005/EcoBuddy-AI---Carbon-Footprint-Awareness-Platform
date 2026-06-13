import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

export const chartColors = [
  "#0f766e",
  "#2563eb",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#16a34a"
];

export const softChartColors = [
  "rgba(15, 118, 110, 0.82)",
  "rgba(37, 99, 235, 0.78)",
  "rgba(245, 158, 11, 0.82)",
  "rgba(220, 38, 38, 0.78)",
  "rgba(124, 58, 237, 0.76)",
  "rgba(22, 163, 74, 0.78)"
];

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#334155",
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || context.label || "Emission";
          const value = context.parsed?.y ?? context.parsed ?? 0;
          return `${label}: ${value} kg CO2e`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: "#64748b"
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148, 163, 184, 0.2)"
      },
      ticks: {
        color: "#64748b"
      }
    }
  }
};
