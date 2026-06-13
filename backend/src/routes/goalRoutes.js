const express = require("express");
const {
  completeGoal,
  createGoal,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal
} = require("../controllers/goalController");

const router = express.Router();

router.route("/").get(getGoals).post(createGoal);
router.patch("/:id/complete", completeGoal);
router.route("/:id").get(getGoal).put(updateGoal).delete(deleteGoal);

module.exports = router;
