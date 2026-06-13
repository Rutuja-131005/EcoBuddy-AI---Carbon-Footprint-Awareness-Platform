const asyncHandler = require("express-async-handler");
const Activity = require("../models/Activity");
const { createActivity, deleteActivity, updateActivity } = require("../services/emissionService");
const { CATEGORIES } = require("../utils/constants");
const { createError } = require("../utils/errors");
const { parseDate } = require("../utils/normalize");

const activityPayload = (body, partial = false) => {
  const payload = {};

  ["category", "activityType", "quantity", "date", "notes"].forEach((key) => {
    if (body[key] !== undefined) payload[key] = body[key];
  });

  if (!partial) {
    ["category", "activityType", "quantity"].forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        throw createError(400, `${key} is required.`);
      }
    });
  }

  if (payload.category && !CATEGORIES.includes(payload.category)) {
    throw createError(400, `Category must be one of: ${CATEGORIES.join(", ")}.`);
  }

  if (payload.quantity !== undefined) {
    payload.quantity = Number(payload.quantity);
    if (!Number.isFinite(payload.quantity) || payload.quantity < 0) {
      throw createError(400, "Quantity must be a non-negative number.");
    }
  }

  if (payload.date) {
    const parsed = parseDate(payload.date);
    if (!parsed) throw createError(400, "Date must be a valid date.");
    payload.date = parsed;
  }

  return payload;
};

const getActivities = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category);

  const activities = await Activity.find(filter).sort({ date: -1, createdAt: -1 });

  res.json({
    success: true,
    data: activities
  });
});

const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    throw createError(404, "Activity not found.");
  }

  res.json({
    success: true,
    data: activity
  });
});

const createActivityHandler = asyncHandler(async (req, res) => {
  const activity = await createActivity(activityPayload(req.body));

  res.status(201).json({
    success: true,
    data: activity
  });
});

const updateActivityHandler = asyncHandler(async (req, res) => {
  const activity = await updateActivity(req.params.id, activityPayload(req.body, true));

  res.json({
    success: true,
    data: activity
  });
});

const deleteActivityHandler = asyncHandler(async (req, res) => {
  const activity = await deleteActivity(req.params.id);

  res.json({
    success: true,
    data: activity,
    message: "Activity deleted."
  });
});

module.exports = {
  createActivity: createActivityHandler,
  deleteActivity: deleteActivityHandler,
  getActivities,
  getActivity,
  updateActivity: updateActivityHandler
};
