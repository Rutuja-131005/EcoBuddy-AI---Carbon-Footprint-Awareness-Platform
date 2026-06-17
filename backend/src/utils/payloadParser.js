const { parseDate } = require("./normalize");
const { sanitizeActivityPayload } = require("./sanitization");

/**
 * Coerces validated activity request fields for service layer consumption.
 * Validation is handled by express-validator middleware on routes.
 * @param {object} body - Request body
 * @returns {object} Parsed activity payload
 */
const parseActivityBody = (body) => {
  const payload = {};

  ["category", "activityType", "quantity", "date", "notes"].forEach((key) => {
    if (body[key] !== undefined) payload[key] = body[key];
  });

  if (payload.quantity !== undefined) {
    payload.quantity = Number(payload.quantity);
  }

  if (payload.date) {
    payload.date = parseDate(payload.date) || new Date(payload.date);
  }

  return sanitizeActivityPayload(payload);
};

/**
 * Coerces validated goal request fields for service layer consumption.
 * @param {object} body - Request body
 * @returns {object} Parsed goal payload
 */
const parseGoalBody = (body) => {
  const payload = {};

  ["title", "targetReduction", "targetDate", "baselineEmission", "notes", "status"].forEach((key) => {
    if (body[key] !== undefined) payload[key] = body[key];
  });

  ["targetReduction", "baselineEmission"].forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== "") {
      payload[key] = Number(payload[key]);
    }
  });

  if (payload.targetDate) {
    payload.targetDate = parseDate(payload.targetDate) || new Date(payload.targetDate);
  }

  return payload;
};

module.exports = {
  parseActivityBody,
  parseGoalBody
};
