const express = require("express");
const { downloadReportPdf, getReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReport);
router.get("/download/pdf", downloadReportPdf);

module.exports = router;
