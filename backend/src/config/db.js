const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (retries = 8) => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecobuddy-ai";

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const connection = await mongoose.connect(uri, {
        autoIndex: process.env.NODE_ENV !== "production",
        serverSelectionTimeoutMS: 5000
      });

      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      if (attempt === retries) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
      }

      console.log(`MongoDB unavailable, retrying (${attempt}/${retries})...`);
      await sleep(2000);
    }
  }

  return null;
};

module.exports = connectDB;
