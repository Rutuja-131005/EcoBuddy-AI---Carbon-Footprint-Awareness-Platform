const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const activityRoutes = require("./routes/activityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const emissionFactorRoutes = require("./routes/emissionFactorRoutes");
const goalRoutes = require("./routes/goalRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { loadEnv } = require("./config/env");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { corsOptions, globalLimiter, strictLimiter } = require("./middleware/security");

dotenv.config();
loadEnv();

const app = express();
app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "512kb" }));
app.use(mongoSanitize({ replaceWith: "_" }));
app.use(xss());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(globalLimiter);
app.use(strictLimiter);

app.get("/api/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    message: dbState === 1 ? "EcoBuddy AI API is healthy." : "EcoBuddy AI API is running but database is unavailable.",
    database: dbStatus
  });
});

app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/emission-factors", emissionFactorRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
