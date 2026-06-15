/**
 * Lightweight structured logger for server-side diagnostics.
 * Avoids leaking sensitive details to API clients.
 */
const logError = (message, error) => {
  if (process.env.NODE_ENV === "test") return;

  const payload = {
    message,
    name: error?.name,
    detail: error?.message
  };

  if (process.env.NODE_ENV !== "production" && error?.stack) {
    payload.stack = error.stack;
  }

  // eslint-disable-next-line no-console
  console.error(JSON.stringify(payload));
};

module.exports = {
  logError
};
