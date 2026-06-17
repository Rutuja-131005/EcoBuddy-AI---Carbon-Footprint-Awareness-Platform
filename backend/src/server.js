const dotenv = require("dotenv");
const { validateEnv } = require("./utils/env");

validateEnv();
dotenv.config();

const logger = require("./utils/logger");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    logger.info(`EcoBuddy AI API running on port ${PORT}`);
  });
};

const handleGracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed.");
      const mongoose = require("mongoose");
      await mongoose.disconnect();
      logger.info("Database connection closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception! Shutting down gracefully...", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
