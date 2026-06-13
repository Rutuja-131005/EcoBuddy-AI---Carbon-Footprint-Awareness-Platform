const CarbonRecord = require("../models/CarbonRecord");
const Goal = require("../models/Goal");
const { startOfMonth } = require("../utils/dateUtils");
const { createError } = require("../utils/errors");
const { round } = require("../utils/normalize");

const getCurrentMonthlyEmission = async () => {
  const start = startOfMonth(new Date());

  const [result] = await CarbonRecord.aggregate([
    {
      $match: {
        recordedAt: {
          $gte: start,
          $lte: new Date()
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$emission" }
      }
    }
  ]);

  return round(result?.total || 0);
};

const withProgress = (goal, currentMonthlyEmission) => {
  const plain = typeof goal.toObject === "function" ? goal.toObject() : goal;
  const baselineEmission = Number(plain.baselineEmission) || 0;
  const targetReduction = Number(plain.targetReduction) || 0;
  const reductionAchieved = Math.max(0, baselineEmission - currentMonthlyEmission);
  const progress =
    targetReduction > 0 ? Math.min(100, round((reductionAchieved / targetReduction) * 100)) : 0;

  return {
    ...plain,
    currentEmission: currentMonthlyEmission,
    reductionAchieved: round(reductionAchieved),
    progress
  };
};

const listGoalsWithProgress = async () => {
  const [goals, currentMonthlyEmission] = await Promise.all([
    Goal.find().sort({ status: 1, targetDate: 1 }),
    getCurrentMonthlyEmission()
  ]);

  return goals.map((goal) => withProgress(goal, currentMonthlyEmission));
};

const createGoal = async (payload) => {
  const currentMonthlyEmission = await getCurrentMonthlyEmission();
  const baselineEmission =
    payload.baselineEmission === undefined || payload.baselineEmission === ""
      ? currentMonthlyEmission
      : Number(payload.baselineEmission);

  const goal = await Goal.create({
    ...payload,
    baselineEmission,
    currentEmission: currentMonthlyEmission
  });

  return withProgress(goal, currentMonthlyEmission);
};

const updateGoal = async (id, payload) => {
  const goal = await Goal.findById(id);

  if (!goal) {
    throw createError(404, "Goal not found.");
  }

  Object.assign(goal, payload);
  const currentMonthlyEmission = await getCurrentMonthlyEmission();
  const decorated = withProgress(goal, currentMonthlyEmission);

  goal.currentEmission = decorated.currentEmission;
  goal.progress = decorated.progress;

  await goal.save();
  return withProgress(goal, currentMonthlyEmission);
};

const completeGoal = async (id) => {
  const goal = await Goal.findById(id);

  if (!goal) {
    throw createError(404, "Goal not found.");
  }

  const currentMonthlyEmission = await getCurrentMonthlyEmission();
  const decorated = withProgress(goal, currentMonthlyEmission);

  goal.status = "completed";
  goal.completedAt = new Date();
  goal.currentEmission = decorated.currentEmission;
  goal.progress = 100;

  await goal.save();
  return withProgress(goal, currentMonthlyEmission);
};

module.exports = {
  completeGoal,
  createGoal,
  getCurrentMonthlyEmission,
  listGoalsWithProgress,
  updateGoal,
  withProgress
};
