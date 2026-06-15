const Activity = require("../models/Activity");
const CarbonRecord = require("../models/CarbonRecord");
const {
  addMonths,
  isoDate,
  monthKey,
  monthLabel,
  startOfMonth,
  startOfWeek
} = require("../utils/dateUtils");
const { round } = require("../utils/normalize");
const { listGoalsWithProgress } = require("./goalService");

const getRecordsSince = async (startDate) =>
  CarbonRecord.find({ recordedAt: { $gte: startDate } }).sort({ recordedAt: 1 }).lean();

const buildWeeklyTrend = (records) => {
  const currentWeek = startOfWeek(new Date());
  const weeks = Array.from({ length: 8 }, (_, index) => {
    const weekStart = new Date(currentWeek);
    weekStart.setDate(currentWeek.getDate() - (7 - index) * 7);
    return {
      key: isoDate(weekStart),
      label: isoDate(weekStart),
      total: 0
    };
  });

  const lookup = new Map(weeks.map((week) => [week.key, week]));

  records.forEach((record) => {
    const key = isoDate(startOfWeek(new Date(record.recordedAt)));
    const bucket = lookup.get(key);
    if (bucket) bucket.total = round(bucket.total + record.emission);
  });

  return weeks;
};

const buildMonthlyTrend = (records) => {
  const currentMonth = startOfMonth(new Date());
  const months = Array.from({ length: 6 }, (_, index) => {
    const monthStart = addMonths(currentMonth, index - 5);
    return {
      key: monthKey(monthStart),
      label: monthLabel(monthStart),
      total: 0
    };
  });

  const lookup = new Map(months.map((month) => [month.key, month]));

  records.forEach((record) => {
    const key = monthKey(new Date(record.recordedAt));
    const bucket = lookup.get(key);
    if (bucket) bucket.total = round(bucket.total + record.emission);
  });

  return months;
};

const carbonScore = (monthlyTotal) => {
  const score = Math.max(0, Math.min(100, Math.round(100 - monthlyTotal / 5)));

  if (score >= 80) return { score, label: "Excellent", tone: "low-impact" };
  if (score >= 60) return { score, label: "Good", tone: "improving" };
  if (score >= 40) return { score, label: "Moderate", tone: "watch" };
  return { score, label: "High impact", tone: "action-needed" };
};

const getDashboard = async () => {
  const now = new Date();
  const startEightWeeksAgo = startOfWeek(now);
  startEightWeeksAgo.setDate(startEightWeeksAgo.getDate() - 7 * 7);
  const startSixMonthsAgo = addMonths(startOfMonth(now), -5);
  const startCurrentMonth = startOfMonth(now);

  const [trendRecords, totalsResult, categoryResult, recentActivities, goals] = await Promise.all([
    getRecordsSince(startSixMonthsAgo < startEightWeeksAgo ? startSixMonthsAgo : startEightWeeksAgo),
    CarbonRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$emission" } } }
    ]),
    CarbonRecord.aggregate([
      { $group: { _id: "$category", total: { $sum: "$emission" } } },
      { $project: { category: "$_id", total: 1, _id: 0 } },
      { $match: { total: { $gt: 0 } } }
    ]),
    Activity.find().sort({ date: -1, createdAt: -1 }).limit(6).lean(),
    listGoalsWithProgress()
  ]);

  const totalFootprint = round(totalsResult[0]?.total || 0);
  const monthlyTotal = round(
    trendRecords
      .filter((record) => new Date(record.recordedAt) >= startCurrentMonth)
      .reduce((sum, record) => sum + record.emission, 0)
  );

  return {
    totalFootprint,
    monthlyTotal,
    carbonScore: carbonScore(monthlyTotal),
    categoryEmissions: categoryResult.map(item => ({
      category: item.category,
      total: round(item.total)
    })),
    weeklyTrend: buildWeeklyTrend(trendRecords),
    monthlyTrend: buildMonthlyTrend(trendRecords),
    recentActivities,
    goals
  };
};

module.exports = {
  getDashboard
};
