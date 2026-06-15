const asyncHandler = require("express-async-handler");
const Goal = require("../models/Goal");
const {
  completeGoal,
  createGoal,
  deleteGoal,
  getCurrentMonthlyEmission,
  listGoalsWithProgress,
  updateGoal,
  withProgress
} = require("../services/goalService");
const { createError } = require("../utils/errors");
const { parseGoalBody } = require("../utils/payloadParser");
const { sendCreated, sendSuccess, sendSuccessWithMessage } = require("../utils/response");

const getGoals = asyncHandler(async (req, res) => {
  const goals = await listGoalsWithProgress();
  sendSuccess(res, goals);
});

const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    throw createError(404, "Goal not found.");
  }

  const currentMonthlyEmission = await getCurrentMonthlyEmission();
  sendSuccess(res, withProgress(goal, currentMonthlyEmission));
});

const createGoalHandler = asyncHandler(async (req, res) => {
  const goal = await createGoal(parseGoalBody(req.body));
  sendCreated(res, goal);
});

const updateGoalHandler = asyncHandler(async (req, res) => {
  const goal = await updateGoal(req.params.id, parseGoalBody(req.body));
  sendSuccess(res, goal);
});

const completeGoalHandler = asyncHandler(async (req, res) => {
  const goal = await completeGoal(req.params.id);
  sendSuccess(res, goal);
});

const deleteGoalHandler = asyncHandler(async (req, res) => {
  const goal = await deleteGoal(req.params.id);
  sendSuccessWithMessage(res, goal, "Goal deleted.");
});

module.exports = {
  completeGoal: completeGoalHandler,
  createGoal: createGoalHandler,
  deleteGoal: deleteGoalHandler,
  getGoal,
  getGoals,
  updateGoal: updateGoalHandler
};
