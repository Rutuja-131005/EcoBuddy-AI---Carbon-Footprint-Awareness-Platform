const Activity = require("../models/Activity");
const CarbonRecord = require("../models/CarbonRecord");
const EmissionFactor = require("../models/EmissionFactor");
const { createError } = require("../utils/errors");
const { normalizeKey, round } = require("../utils/normalize");

const getEmissionFactor = async (category, activityType) => {
  const normalizedActivityType = normalizeKey(activityType);

  const exact = await EmissionFactor.findOne({
    category,
    normalizedActivityType
  }).lean();

  if (exact) return exact;

  const categoryDefault = await EmissionFactor.findOne({
    category,
    isDefault: true
  }).lean();

  if (categoryDefault) return categoryDefault;

  return {
    factor: 0,
    unit: "unit",
    activityType: "Unknown",
    description: "No emission factor found; emission defaults to zero."
  };
};

const calculateEmission = async ({ category, activityType, quantity }) => {
  const numericQuantity = Number(quantity);

  if (!Number.isFinite(numericQuantity) || numericQuantity < 0) {
    throw createError(400, "Quantity must be a non-negative number.");
  }

  const factor = await getEmissionFactor(category, activityType);
  const emissionFactor = Number(factor.factor) || 0;

  return {
    emissionFactor,
    emission: round(numericQuantity * emissionFactor),
    factorMeta: factor
  };
};

const syncCarbonRecord = async (activity) => {
  const recordPayload = {
    activity: activity._id,
    category: activity.category,
    activityType: activity.activityType,
    quantity: activity.quantity,
    emissionFactor: activity.emissionFactor,
    emission: activity.emission,
    recordedAt: activity.date,
    notes: activity.notes
  };

  await CarbonRecord.findOneAndUpdate(
    { activity: activity._id },
    recordPayload,
    { new: true, upsert: true, runValidators: true }
  );
};

const createActivity = async (payload) => {
  const calculated = await calculateEmission(payload);

  const activity = await Activity.create({
    ...payload,
    emissionFactor: calculated.emissionFactor,
    emission: calculated.emission
  });

  await syncCarbonRecord(activity);
  return activity;
};

const updateActivity = async (id, payload) => {
  const activity = await Activity.findById(id);

  if (!activity) {
    throw createError(404, "Activity not found.");
  }

  Object.assign(activity, payload);

  const calculated = await calculateEmission({
    category: activity.category,
    activityType: activity.activityType,
    quantity: activity.quantity
  });

  activity.emissionFactor = calculated.emissionFactor;
  activity.emission = calculated.emission;

  await activity.save();
  await syncCarbonRecord(activity);

  return activity;
};

const deleteActivity = async (id) => {
  const activity = await Activity.findByIdAndDelete(id);

  if (!activity) {
    throw createError(404, "Activity not found.");
  }

  await CarbonRecord.deleteOne({ activity: id });
  return activity;
};

module.exports = {
  calculateEmission,
  createActivity,
  deleteActivity,
  getEmissionFactor,
  syncCarbonRecord,
  updateActivity
};
