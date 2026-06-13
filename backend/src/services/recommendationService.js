const CarbonRecord = require("../models/CarbonRecord");
const Recommendation = require("../models/Recommendation");
const { CATEGORIES } = require("../utils/constants");
const { round } = require("../utils/normalize");

const templates = {
  Transport: {
    threshold: 25,
    title: "Shift short trips to lower-carbon travel",
    description:
      "Your transport emissions are a major contributor. Replace one or two car trips each week with public transport, cycling, walking, or carpooling.",
    reductionRate: 0.18
  },
  Electricity: {
    threshold: 60,
    title: "Trim high electricity usage",
    description:
      "Electricity use is running high. Raise AC temperature settings, switch to LEDs, unplug idle devices, and schedule heavy appliances during efficient hours.",
    reductionRate: 0.15
  },
  Food: {
    threshold: 20,
    title: "Choose more plant-forward meals",
    description:
      "Food emissions can drop quickly when meat-heavy meals are swapped for vegetarian, seasonal, or lower-impact protein options a few times per week.",
    reductionRate: 0.12
  },
  Water: {
    threshold: 8,
    title: "Reduce hot water demand",
    description:
      "Shorter showers, cold-water laundry, and repairing leaks can reduce both water usage and the energy needed to heat and move water.",
    reductionRate: 0.1
  },
  Shopping: {
    threshold: 25,
    title: "Buy less, choose durable",
    description:
      "Shopping emissions often come from frequent purchases. Prioritize repairs, second-hand items, and durable products with less packaging.",
    reductionRate: 0.16
  },
  Waste: {
    threshold: 10,
    title: "Divert waste from landfill",
    description:
      "Composting organics, recycling clean materials, and avoiding single-use items can meaningfully cut waste-related emissions.",
    reductionRate: 0.2
  }
};

const getThirtyDayCategoryTotals = async () => {
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const aggregates = await CarbonRecord.aggregate([
    { $match: { recordedAt: { $gte: start } } },
    { $group: { _id: "$category", total: { $sum: "$emission" } } }
  ]);

  const lookup = new Map(aggregates.map((item) => [item._id, item.total]));

  return CATEGORIES.reduce((acc, category) => {
    acc[category] = round(lookup.get(category) || 0);
    return acc;
  }, {});
};

const generateDynamicRecommendations = async () => {
  const totals = await getThirtyDayCategoryTotals();
  const recommendations = [];

  Object.entries(totals).forEach(([category, total]) => {
    const template = templates[category];
    if (!template || total < template.threshold) return;

    recommendations.push({
      title: template.title,
      description: template.description,
      category,
      estimatedReduction: Math.max(1, round(total * template.reductionRate)),
      priority: total > template.threshold * 1.8 ? 1 : 2,
      source: "dynamic",
      generatedAt: new Date()
    });
  });

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Keep your low-impact habits visible",
      description:
        "Your recent footprint is balanced. Keep logging activities weekly so trends stay accurate and small increases are easy to catch.",
      category: "Transport",
      estimatedReduction: 2,
      priority: 4,
      source: "dynamic",
      generatedAt: new Date()
    });
  }

  await Recommendation.deleteMany({ source: "dynamic" });
  await Recommendation.insertMany(recommendations);

  return recommendations;
};

const listRecommendations = async ({ regenerate = true } = {}) => {
  if (regenerate) {
    await generateDynamicRecommendations();
  }

  return Recommendation.find({ isActive: true }).sort({
    priority: 1,
    estimatedReduction: -1,
    generatedAt: -1
  });
};

module.exports = {
  generateDynamicRecommendations,
  listRecommendations
};
