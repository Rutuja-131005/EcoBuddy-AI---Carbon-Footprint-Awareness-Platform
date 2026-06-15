const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const validateRequest = require("../middleware/validateRequest");
const { validateDashboardQuery } = require("../validations/dashboardValidation");

const router = express.Router();

router.get("/", validateDashboardQuery, validateRequest, getDashboard);

module.exports = router;
