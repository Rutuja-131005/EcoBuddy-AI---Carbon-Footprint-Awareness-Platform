const rateLimit = require("express-rate-limit");

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: false,
  optionsSuccessStatus: 200
};

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 150),
  skip: (req) => req.method === "GET", // Skip for read operations
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Only 30 writes per 15 minutes
  skip: (req) => req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE",
  message: {
    success: false,
    message: "Too many write requests. Please wait before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  corsOptions,
  globalLimiter,
  strictLimiter
};
