const { query } = require("express-validator");
const { CATEGORIES } = require("../utils/constants");

const validateGetReport = [
  query("type")
    .optional()
    .isIn(["weekly", "monthly", "category-wise"])
    .withMessage("Report type must be weekly, monthly, or category-wise."),
  query("category")
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}.`),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date."),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date.")
];

module.exports = {
  validateGetReport
};
