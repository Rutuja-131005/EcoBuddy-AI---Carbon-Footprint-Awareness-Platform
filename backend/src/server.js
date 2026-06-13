const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

dotenv.config();

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`EcoBuddy AI API running on port ${PORT}`);
  });
};

const handleGracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");
      const mongoose = require("mongoose");
      await mongoose.disconnect();
      console.log("Database connection closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception! Shutting down gracefully...", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
