const PDFDocument = require("pdfkit");
const CarbonRecord = require("../models/CarbonRecord");
const {
  addDays,
  daysBetweenInclusive,
  endOfDay,
  isoDate,
  monthLabel,
  startOfDay,
  startOfMonth,
  startOfWeek
} = require("../utils/dateUtils");
const { parseDate, round } = require("../utils/normalize");

const resolveReportRange = (type, startDate, endDate) => {
  const now = new Date();

  if (startDate || endDate) {
    return {
      start: startOfDay(parseDate(startDate) || now),
      end: endOfDay(parseDate(endDate) || now),
      label: "Custom range"
    };
  }

  if (type === "monthly") {
    return {
      start: startOfMonth(now),
      end: endOfDay(now),
      label: monthLabel(now)
    };
  }

  if (type === "category-wise") {
    return {
      start: startOfMonth(now),
      end: endOfDay(now),
      label: `Category-wise ${monthLabel(now)}`
    };
  }

  return {
    start: startOfWeek(now),
    end: endOfDay(now),
    label: `Week of ${isoDate(startOfWeek(now))}`
  };
};

const summarizeByCategory = (records) => {
  const totals = records.reduce((acc, record) => {
    acc[record.category] = round((acc[record.category] || 0) + record.emission);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
};

const summarizeByDay = (records, start, end) => {
  const buckets = {};
  let cursor = startOfDay(start);

  while (cursor <= end) {
    buckets[isoDate(cursor)] = 0;
    cursor = addDays(cursor, 1);
  }

  records.forEach((record) => {
    const key = isoDate(new Date(record.recordedAt));
    buckets[key] = round((buckets[key] || 0) + record.emission);
  });

  return Object.entries(buckets).map(([date, total]) => ({ date, total }));
};

const getReport = async ({ type = "weekly", category, startDate, endDate } = {}) => {
  const range = resolveReportRange(type, startDate, endDate);
  const filter = {
    recordedAt: {
      $gte: range.start,
      $lte: range.end
    }
  };

  if (category) filter.category = category;

  const [records, totalResult, categoryResult] = await Promise.all([
    CarbonRecord.find(filter)
      .populate("activity")
      .sort({ recordedAt: -1 })
      .lean(),
    CarbonRecord.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$emission" } } }
    ]),
    CarbonRecord.aggregate([
      { $match: filter },
      { $group: { _id: "$category", total: { $sum: "$emission" } } },
      { $project: { category: "$_id", total: 1, _id: 0 } },
      { $sort: { total: -1 } }
    ])
  ]);

  const total = round(totalResult[0]?.total || 0);
  const days = daysBetweenInclusive(range.start, range.end);
  const categoryBreakdown = categoryResult.map(item => ({
    category: item.category,
    total: round(item.total)
  }));

  return {
    type,
    category: category || "All",
    label: range.label,
    startDate: range.start,
    endDate: range.end,
    total,
    averageDaily: round(total / days),
    categoryBreakdown,
    dailyTrend: summarizeByDay(records, range.start, range.end),
    records
  };
};

const buildReportPdf = async (report) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).text("EcoBuddy AI Carbon Report", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#4b5563").text("Understand your impact. Reduce your footprint. Save the planet.");
    doc.moveDown();

    doc.fillColor("#111827").fontSize(12);
    doc.text(`Report: ${report.label}`);
    doc.text(`Type: ${report.type}`);
    doc.text(`Category: ${report.category}`);
    doc.text(`Range: ${isoDate(new Date(report.startDate))} to ${isoDate(new Date(report.endDate))}`);
    doc.text(`Total emissions: ${report.total} kg CO2e`);
    doc.text(`Average per day: ${report.averageDaily} kg CO2e`);
    doc.moveDown();

    doc.fontSize(14).text("Category Breakdown");
    doc.moveDown(0.4);
    if (report.categoryBreakdown.length === 0) {
      doc.fontSize(11).text("No emissions recorded in this range.");
    } else {
      report.categoryBreakdown.forEach((item) => {
        doc.fontSize(11).text(`${item.category}: ${item.total} kg CO2e`);
      });
    }

    doc.moveDown();
    doc.fontSize(14).text("Recent Activity Records");
    doc.moveDown(0.4);
    report.records.slice(0, 12).forEach((record) => {
      doc
        .fontSize(10)
        .text(
          `${isoDate(new Date(record.recordedAt))} | ${record.category} | ${record.activityType} | ${record.quantity} units | ${record.emission} kg CO2e`
        );
    });

    doc.end();
  });

module.exports = {
  buildReportPdf,
  getReport
};
