const { query } = require("express-validator");

const validateRecommendations = [
  query("regenerate")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Regenerate must be true or false.")
];

module.exports = {
  validateRecommendations
};
