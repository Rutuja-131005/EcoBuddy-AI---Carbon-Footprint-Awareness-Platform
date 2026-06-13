const asyncHandler = require("express-async-handler");
const { buildReportPdf, getReport } = require("../services/reportService");

const getReportHandler = asyncHandler(async (req, res) => {
  const report = await getReport(req.query);

  res.json({
    success: true,
    data: report
  });
});

const downloadReportPdf = asyncHandler(async (req, res) => {
  const report = await getReport(req.query);
  const pdfBuffer = await buildReportPdf(report);
  const fileSafeLabel = report.label.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="ecobuddy-${fileSafeLabel || "report"}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = {
  downloadReportPdf,
  getReport: getReportHandler
};
