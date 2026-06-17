const logger = require("../utils/logger");

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  const isProduction = process.env.NODE_ENV === "production";
  let statusCode = err.statusCode || res.statusCode;
  statusCode = statusCode && statusCode !== 200 ? statusCode : 500;

  let message = err.message || "Server error";
  let details;

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    details = Object.values(err.errors).map((error) => error.message);
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "A matching record already exists.";
  }

  // Log full error details for debugging (server-side only)
  logger.error(message, {
    error: err.message,
    stack: err.stack,
    statusCode,
    url: req.originalUrl,
    method: req.method
  });

  // Send minimal info to client
  const response = {
    success: false,
    message
  };

  // Only include details in development mode
  if (!isProduction && details) {
    response.details = details;
  }

  if (err.code && typeof err.code === "string") {
    response.errorCode = err.code;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
  notFound
};
