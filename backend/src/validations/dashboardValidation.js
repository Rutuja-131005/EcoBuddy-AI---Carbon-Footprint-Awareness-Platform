const { query } = require("express-validator");

const validateDashboardQuery = [
  query().custom((_, { req }) => {
    if (Object.keys(req.query).length > 0) {
      throw new Error("Dashboard does not accept query parameters.");
    }
    return true;
  })
];

module.exports = {
  validateDashboardQuery
};
