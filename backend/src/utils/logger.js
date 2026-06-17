const fs = require("fs");
const path = require("path");

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getCurrentTimestamp = () => new Date().toISOString();

const generateCorrelationId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const formatLog = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: getCurrentTimestamp(),
    level,
    message,
    ...data,
    correlationId: data.correlationId || generateCorrelationId()
  });
};

const logger = {
  error: (message, data = {}) => {
    const logEntry = formatLog("ERROR", message, data);
    console.error(logEntry);
    fs.appendFileSync(path.join(logDir, "error.log"), logEntry + "\n");
  },

  warn: (message, data = {}) => {
    if (LOG_LEVELS.warn <= LOG_LEVELS[process.env.LOG_LEVEL || "info"]) {
      const logEntry = formatLog("WARN", message, data);
      console.warn(logEntry);
      fs.appendFileSync(path.join(logDir, "combined.log"), logEntry + "\n");
    }
  },

  info: (message, data = {}) => {
    if (LOG_LEVELS.info <= LOG_LEVELS[process.env.LOG_LEVEL || "info"]) {
      const logEntry = formatLog("INFO", message, data);
      console.log(logEntry);
      fs.appendFileSync(path.join(logDir, "combined.log"), logEntry + "\n");
    }
  },

  debug: (message, data = {}) => {
    if (LOG_LEVELS.debug <= LOG_LEVELS[process.env.LOG_LEVEL || "info"]) {
      const logEntry = formatLog("DEBUG", message, data);
      console.debug(logEntry);
    }
  },

  // Backwards compatibility with existing logError
  logError: (message, error) => {
    const data = {
      name: error?.name,
      detail: error?.message,
      ...(process.env.NODE_ENV !== "production" && error?.stack ? { stack: error.stack } : {})
    };
    logger.error(message, data);
  }
};

module.exports = logger;
