const { body, param, query } = require("express-validator");
const { CATEGORIES } = require("../utils/constants");

const validateActivityId = [param("id").isMongoId().withMessage("Activity ID must be a valid identifier.")];

const validateGetActivities = [
  query("category")
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}.`)
];

const validateCreateActivity = [
  body("category")
    .exists({ checkFalsy: true })
    .withMessage("Category is required.")
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}.`),
  body("activityType")
    .exists({ checkFalsy: true })
    .withMessage("Activity type is required.")
    .trim(),
  body("quantity")
    .exists()
    .withMessage("Quantity is required.")
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a non-negative number."),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date."),
  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be 500 characters or fewer.")
];

const validateUpdateActivity = [
  validateActivityId[0],
  body("category")
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(", ")}.`),
  body("activityType")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Activity type cannot be empty."),
  body("quantity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Quantity must be a non-negative number."),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date."),
  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be 500 characters or fewer.")
];

module.exports = {
  validateActivityId,
  validateGetActivities,
  validateCreateActivity,
  validateUpdateActivity
};
