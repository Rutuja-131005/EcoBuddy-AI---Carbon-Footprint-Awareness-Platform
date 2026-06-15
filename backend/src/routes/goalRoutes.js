const express = require("express");
const {
  completeGoal,
  createGoal,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal
} = require("../controllers/goalController");
const validateRequest = require("../middleware/validateRequest");
const { validateCreateGoal, validateUpdateGoal, validateGoalId } = require("../validations/goalValidation");

const router = express.Router();

router.route("/").get(getGoals).post(validateCreateGoal, validateRequest, createGoal);
router.patch("/:id/complete", validateGoalId, validateRequest, completeGoal);
router.route("/:id").get(validateGoalId, validateRequest, getGoal).put(validateUpdateGoal, validateRequest, updateGoal).delete(validateGoalId, validateRequest, deleteGoal);

module.exports = router;
