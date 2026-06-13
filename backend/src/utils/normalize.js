const normalizeKey = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const round = (value, digits = 2) => {
  const number = Number(value) || 0;
  return Number(number.toFixed(digits));
};

const parseDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

module.exports = {
  normalizeKey,
  parseDate,
  round
};
