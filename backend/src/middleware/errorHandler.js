const { logError } = require("../utils/logger");

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || res.statusCode;
  statusCode = statusCode && statusCode !== 200 ? statusCode : 500;

  let message = err.message || "Server error";
  let details;

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

  if (statusCode >= 500) {
    logError("Unhandled server error", err);
    message = "An unexpected error occurred. Please try again later.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
};

module.exports = {
  errorHandler,
  notFound
};
