const MS_PER_DAY = 24 * 60 * 60 * 1000;

const clone = (date) => new Date(date.getTime());

const startOfDay = (date = new Date()) => {
  const value = clone(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfDay = (date = new Date()) => {
  const value = clone(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const startOfWeek = (date = new Date()) => {
  const value = startOfDay(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);
  return value;
};

const startOfMonth = (date = new Date()) => {
  const value = startOfDay(date);
  value.setDate(1);
  return value;
};

const addDays = (date, days) => {
  const value = clone(date);
  value.setDate(value.getDate() + days);
  return value;
};

const addMonths = (date, months) => {
  const value = clone(date);
  value.setMonth(value.getMonth() + months);
  return value;
};

const isoDate = (date) => date.toISOString().slice(0, 10);

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (date) =>
  `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;

const daysBetweenInclusive = (start, end) =>
  Math.max(1, Math.ceil((endOfDay(end) - startOfDay(start)) / MS_PER_DAY));

module.exports = {
  addDays,
  addMonths,
  daysBetweenInclusive,
  endOfDay,
  isoDate,
  monthKey,
  monthLabel,
  startOfDay,
  startOfMonth,
  startOfWeek
};
