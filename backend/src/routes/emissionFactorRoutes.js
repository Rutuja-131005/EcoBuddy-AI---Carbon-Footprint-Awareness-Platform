const express = require("express");
const { getEmissionFactors } = require("../controllers/emissionFactorController");

const router = express.Router();

router.get("/", getEmissionFactors);

module.exports = router;
