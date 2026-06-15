/**
 * Sends a standardized success JSON response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [statusCode=200]
 */
const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data
  });
};

/**
 * Sends a standardized created JSON response.
 * @param {import('express').Response} res
 * @param {*} data
 */
const sendCreated = (res, data) => sendSuccess(res, data, 201);

/**
 * Sends a standardized success response with an optional message.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 */
const sendSuccessWithMessage = (res, data, message) => {
  res.json({
    success: true,
    data,
    message
  });
};

module.exports = {
  sendCreated,
  sendSuccess,
  sendSuccessWithMessage
};
