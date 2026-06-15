const express = require("express");
const { getEmissionFactors } = require("../controllers/emissionFactorController");
const validateRequest = require("../middleware/validateRequest");
const { validateGetEmissionFactors } = require("../validations/emissionFactorValidation");

const router = express.Router();

router.get("/", validateGetEmissionFactors, validateRequest, getEmissionFactors);

module.exports = router;
