const { query } = require("express-validator");
const { CATEGORIES } = require("../utils/constants");

const validateGetEmissionFactors = [
  query("category")
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}.`)
];

module.exports = {
  validateGetEmissionFactors
};
