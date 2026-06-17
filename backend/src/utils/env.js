const requiredEnvVars = [
  "MONGODB_URI",
  "NODE_ENV"
];

const optionalEnvVars = {
  PORT: "5000",
  CLIENT_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "info"
};

const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
  
  console.log("✅ All required environment variables are set");
  
  return {
    ...optionalEnvVars,
    ...process.env
  };
};

module.exports = { validateEnv };
