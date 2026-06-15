const express = require("express");
const { downloadReportPdf, getReport } = require("../controllers/reportController");
const validateRequest = require("../middleware/validateRequest");
const { validateGetReport } = require("../validations/reportValidation");

const router = express.Router();

router.get("/", validateGetReport, validateRequest, getReport);
router.get("/download/pdf", validateGetReport, validateRequest, downloadReportPdf);

module.exports = router;
