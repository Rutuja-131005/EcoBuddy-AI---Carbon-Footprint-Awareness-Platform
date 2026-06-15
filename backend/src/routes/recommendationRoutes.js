const express = require("express");
const { getRecommendations } = require("../controllers/recommendationController");
const validateRequest = require("../middleware/validateRequest");
const { validateRecommendations } = require("../validations/recommendationValidation");

const router = express.Router();

router.get("/", validateRecommendations, validateRequest, getRecommendations);

module.exports = router;
