const express = require("express");
const {
  createActivity,
  deleteActivity,
  getActivities,
  getActivity,
  updateActivity
} = require("../controllers/activityController");

const router = express.Router();

router.route("/").get(getActivities).post(createActivity);
router.route("/:id").get(getActivity).put(updateActivity).delete(deleteActivity);

module.exports = router;
