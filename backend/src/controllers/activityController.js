const asyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");
const { createActivity, deleteActivity, updateActivity } = require("../services/emissionService");
const { createError } = require("../utils/errors");
const { parseActivityBody } = require("../utils/payloadParser");
const { sendCreated, sendSuccess, sendSuccessWithMessage } = require("../utils/response");

const getActivities = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category);

  const activities = await Activity.find(filter).sort({ date: -1, createdAt: -1 });

  sendSuccess(res, activities);
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
