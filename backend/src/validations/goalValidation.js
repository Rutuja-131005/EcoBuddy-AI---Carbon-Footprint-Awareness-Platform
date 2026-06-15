const { body, param } = require("express-validator");

const validateGoalId = [param("id").isMongoId().withMessage("Goal ID must be a valid identifier.")];

const validateCreateGoal = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Goal title is required.")
    .trim()
    .isLength({ max: 120 })
    .withMessage("Goal title must be 120 characters or fewer."),
  body("targetReduction")
    .exists()
    .withMessage("Target reduction is required.")
    .isFloat({ min: 0 })
    .withMessage("Target reduction must be a non-negative number."),
  body("targetDate")
    .exists({ checkFalsy: true })
    .withMessage("Target date is required.")
    .isISO8601()
    .withMessage("Target date must be a valid ISO date."),
  body("baselineEmission")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Baseline emission must be a non-negative number."),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be 500 characters or fewer.")
];

const validateUpdateGoal = [
  validateGoalId[0],
  body("title")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Goal title must be 120 characters or fewer."),
  body("targetReduction")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Target reduction must be a non-negative number."),
  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be a valid ISO date."),
  body("baselineEmission")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Baseline emission must be a non-negative number."),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be 500 characters or fewer."),
  body("status")
    .optional()
    .isIn(["active", "completed"])
    .withMessage("Status must be active or completed.")
];

module.exports = {
  validateGoalId,
  validateCreateGoal,
  validateUpdateGoal
};
