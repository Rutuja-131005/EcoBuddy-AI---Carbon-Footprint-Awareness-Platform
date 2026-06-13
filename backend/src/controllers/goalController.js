const asyncHandler = require("express-async-handler");
const Goal = require("../models/Goal");
const {
  completeGoal,
  createGoal,
  getCurrentMonthlyEmission,
  listGoalsWithProgress,
  updateGoal,
  withProgress
} = require("../services/goalService");
const { createError } = require("../utils/errors");
const { parseDate } = require("../utils/normalize");

const goalPayload = (body, partial = false) => {
  const payload = {};

  ["title", "targetReduction", "targetDate", "baselineEmission", "notes", "status"].forEach((key) => {
    if (body[key] !== undefined) payload[key] = body[key];
  });

  if (!partial) {
    ["title", "targetReduction", "targetDate"].forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        throw createError(400, `${key} is required.`);
      }
    });
  }

  ["targetReduction", "baselineEmission"].forEach((key) => {
    if (payload[key] !== undefined && payload[key] !== "") {
      payload[key] = Number(payload[key]);
      if (!Number.isFinite(payload[key]) || payload[key] < 0) {
        throw createError(400, `${key} must be a non-negative number.`);
      }
    }
  });

  if (payload.targetDate) {
    const parsed = parseDate(payload.targetDate);
    if (!parsed) throw createError(400, "Target date must be a valid date.");
    payload.targetDate = parsed;
  }

  return payload;
};

const getGoals = asyncHandler(async (req, res) => {
  const goals = await listGoalsWithProgress();

  res.json({
    success: true,
    data: goals
  });
});

const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    throw createError(404, "Goal not found.");
  }

  const currentMonthlyEmission = await getCurrentMonthlyEmission();

  res.json({
    success: true,
    data: withProgress(goal, currentMonthlyEmission)
  });
});

const createGoalHandler = asyncHandler(async (req, res) => {
  const goal = await createGoal(goalPayload(req.body));

  res.status(201).json({
    success: true,
    data: goal
  });
});

const updateGoalHandler = asyncHandler(async (req, res) => {
  const goal = await updateGoal(req.params.id, goalPayload(req.body, true));

  res.json({
    success: true,
    data: goal
  });
});

const completeGoalHandler = asyncHandler(async (req, res) => {
  const goal = await completeGoal(req.params.id);

  res.json({
    success: true,
    data: goal
  });
});

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findByIdAndDelete(req.params.id);

  if (!goal) {
    throw createError(404, "Goal not found.");
  }

  res.json({
    success: true,
    data: goal,
    message: "Goal deleted."
  });
});

module.exports = {
  completeGoal: completeGoalHandler,
  createGoal: createGoalHandler,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal: updateGoalHandler
};
