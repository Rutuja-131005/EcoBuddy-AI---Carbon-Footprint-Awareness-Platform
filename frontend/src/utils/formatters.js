export { categories, categoryActivityTypes } from "../constants/categories";

export const formatKg = (value = 0) =>
  `${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2
  })} kg CO2e`;

export const formatNumber = (value = 0) =>
  Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2
  });

export const formatDate = (value) => {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

export const toInputDate = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const progressTone = (progress = 0, status = "active") => {
  if (status === "completed") return "bg-emerald-600";
  if (progress >= 70) return "bg-teal-600";
  if (progress >= 35) return "bg-amber-500";
  return "bg-rose-500";
};
