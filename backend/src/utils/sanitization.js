const xss = require("xss");

const sanitizeText = (text) => {
  if (typeof text !== "string") return "";
  
  return xss(text, {
    whiteList: {}, // empty, means filter out all tags
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ["script"] // the script tag is a special case, we need to filter out its content
  }).trim();
};

const sanitizeActivityPayload = (payload) => {
  if (!payload) return payload;
  
  const sanitized = { ...payload };
  if ("notes" in payload && typeof payload.notes === "string") sanitized.notes = sanitizeText(payload.notes);
  if ("activityType" in payload && typeof payload.activityType === "string") sanitized.activityType = sanitizeText(payload.activityType);
  if ("category" in payload && typeof payload.category === "string") sanitized.category = sanitizeText(payload.category);
  return sanitized;
};

module.exports = { sanitizeText, sanitizeActivityPayload };
