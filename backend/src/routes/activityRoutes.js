const express = require("express");
const {
  createActivity,
  deleteActivity,
  getActivities,
  getActivity,
  updateActivity
} = require("../controllers/activityController");
const validateRequest = require("../middleware/validateRequest");
const {
  validateGetActivities,
  validateCreateActivity,
  validateUpdateActivity,
  validateActivityId
} = require("../validations/activityValidation");

const router = express.Router();

router.route("/").get(validateGetActivities, validateRequest, getActivities).post(validateCreateActivity, validateRequest, createActivity);
router.route("/:id").get(validateActivityId, validateRequest, getActivity).put(validateUpdateActivity, validateRequest, updateActivity).delete(validateActivityId, validateRequest, deleteActivity);

module.exports = router;
