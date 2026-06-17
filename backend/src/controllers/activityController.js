const asyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");
const { createActivity, deleteActivity, updateActivity } = require("../services/emissionService");
const { createError } = require("../utils/errors");
const { parseActivityBody } = require("../utils/payloadParser");
const { sendCreated, sendSuccess, sendSuccessWithMessage } = require("../utils/response");

const VALID_CATEGORIES = require("../utils/constants").CATEGORIES || ["Energy", "Transport", "Diet", "Shopping"];

const getActivities = asyncHandler(async (req, res) => {
  const filter = {};
  
  if (req.query.category) {
    const category = String(req.query.category).trim();
    if (!VALID_CATEGORIES.includes(category)) {
      throw createError(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
    }
    filter.category = category;
  }

  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Activity.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: activities,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    throw createError(404, "Activity not found.");
  }

  sendSuccess(res, activity);
});

const createActivityHandler = asyncHandler(async (req, res) => {
  const activity = await createActivity(parseActivityBody(req.body));
  sendCreated(res, activity);
});

const updateActivityHandler = asyncHandler(async (req, res) => {
  const activity = await updateActivity(req.params.id, parseActivityBody(req.body));
  sendSuccess(res, activity);
});

const deleteActivityHandler = asyncHandler(async (req, res) => {
  const activity = await deleteActivity(req.params.id);
  sendSuccessWithMessage(res, activity, "Activity deleted.");
});

module.exports = {
  createActivity: createActivityHandler,
  deleteActivity: deleteActivityHandler,
  getActivities,
  getActivity,
  updateActivity: updateActivityHandler
};
