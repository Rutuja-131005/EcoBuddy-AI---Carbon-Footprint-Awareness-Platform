const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Activity = require("../models/Activity");
const EmissionFactor = require("../models/EmissionFactor");
const Goal = require("../models/Goal");
const Recommendation = require("../models/Recommendation");
const { createActivity, syncCarbonRecord } = require("../services/emissionService");
const { normalizeKey } = require("../utils/normalize");

dotenv.config();

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const emissionFactors = [
  {
    category: "Transport",
    activityType: "Car",
    factor: 0.21,
    unit: "kg CO2e per km",
    description: "Average passenger car emissions per kilometer."
  },
  {
    category: "Transport",
    activityType: "Bike",
    factor: 0,
    unit: "kg CO2e per km",
    description: "Cycling has no direct operational emissions."
  },
  {
    category: "Transport",
    activityType: "Bus",
    factor: 0.08,
    unit: "kg CO2e per km",
    description: "Average bus passenger emissions per kilometer."
  },
  {
    category: "Transport",
    activityType: "Train",
    factor: 0.04,
    unit: "kg CO2e per km",
    description: "Average train passenger emissions per kilometer."
  },
  {
    category: "Transport",
    activityType: "Flight",
    factor: 0.25,
    unit: "kg CO2e per km",
    description: "Average short-haul flight passenger emissions per kilometer."
  },
  {
    category: "Transport",
    activityType: "Other Transport",
    factor: 0.12,
    unit: "kg CO2e per km",
    description: "Fallback transport estimate.",
    isDefault: true
  },
  {
    category: "Electricity",
    activityType: "Electricity",
    factor: 0.82,
    unit: "kg CO2e per kWh",
    description: "Grid electricity emissions per kWh.",
    isDefault: true
  },
  {
    category: "Food",
    activityType: "Meat Meal",
    factor: 5.8,
    unit: "kg CO2e per meal",
    description: "Meat-heavy meal estimate."
  },
  {
    category: "Food",
    activityType: "Vegetarian Meal",
    factor: 1.4,
    unit: "kg CO2e per meal",
    description: "Plant-forward meal estimate."
  },
  {
    category: "Food",
    activityType: "Food",
    factor: 2.2,
    unit: "kg CO2e per meal",
    description: "Fallback food estimate.",
    isDefault: true
  },
  {
    category: "Water",
    activityType: "Shower",
    factor: 0.35,
    unit: "kg CO2e per minute",
    description: "Estimated hot water emissions per shower minute."
  },
  {
    category: "Water",
    activityType: "Water Usage",
    factor: 0.001,
    unit: "kg CO2e per liter",
    description: "General treated water estimate.",
    isDefault: true
  },
  {
    category: "Shopping",
    activityType: "Clothing",
    factor: 15,
    unit: "kg CO2e per item",
    description: "Average new clothing item estimate."
  },
  {
    category: "Shopping",
    activityType: "Electronics",
    factor: 75,
    unit: "kg CO2e per item",
    description: "Small electronics purchase estimate."
  },
  {
    category: "Shopping",
    activityType: "Shopping",
    factor: 10,
    unit: "kg CO2e per item",
    description: "Fallback shopping estimate.",
    isDefault: true
  },
  {
    category: "Waste",
    activityType: "Landfill Waste",
    factor: 1.2,
    unit: "kg CO2e per kg",
    description: "Landfill waste estimate per kilogram."
  },
  {
    category: "Waste",
    activityType: "Recycling",
    factor: 0.2,
    unit: "kg CO2e per kg",
    description: "Sorted recycling estimate per kilogram."
  },
  {
    category: "Waste",
    activityType: "Waste",
    factor: 0.9,
    unit: "kg CO2e per kg",
    description: "Fallback waste estimate.",
    isDefault: true
  }
];

const sampleActivities = [
  {
    category: "Transport",
    activityType: "Car",
    quantity: 62,
    date: daysAgo(1),
    notes: "Commute and errands"
  },
  {
    category: "Electricity",
    activityType: "Electricity",
    quantity: 88,
    date: daysAgo(2),
    notes: "Weekly household electricity usage"
  },
  {
    category: "Food",
    activityType: "Meat Meal",
    quantity: 4,
    date: daysAgo(3),
    notes: "Meals logged this week"
  },
  {
    category: "Transport",
    activityType: "Bus",
    quantity: 35,
    date: daysAgo(5),
    notes: "Public transport trips"
  },
  {
    category: "Water",
    activityType: "Shower",
    quantity: 48,
    date: daysAgo(7),
    notes: "Estimated shower minutes"
  },
  {
    category: "Shopping",
    activityType: "Clothing",
    quantity: 2,
    date: daysAgo(12),
    notes: "New clothing purchases"
  },
  {
    category: "Waste",
    activityType: "Landfill Waste",
    quantity: 8,
    date: daysAgo(14),
    notes: "General household waste"
  },
  {
    category: "Transport",
    activityType: "Train",
    quantity: 120,
    date: daysAgo(24),
    notes: "Intercity train trip"
  },
  {
    category: "Electricity",
    activityType: "Electricity",
    quantity: 95,
    date: daysAgo(32),
    notes: "Monthly electricity reading"
  }
];

const seedRecommendations = [
  {
    title: "Log activities every Friday",
    description:
      "A consistent weekly logging habit makes trends and reduction targets more accurate.",
    category: "Transport",
    estimatedReduction: 3,
    priority: 5,
    source: "seed"
  },
  {
    title: "Review one household appliance",
    description:
      "Pick one appliance this week and check whether it can run less often, at a lower setting, or be replaced with a more efficient option.",
    category: "Electricity",
    estimatedReduction: 5,
    priority: 4,
    source: "seed"
  }
];

const upsertEmissionFactors = async () => {
  await Promise.all(
    emissionFactors.map((factor) =>
      EmissionFactor.findOneAndUpdate(
        {
          category: factor.category,
          normalizedActivityType: normalizeKey(factor.activityType)
        },
        factor,
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      )
    )
  );
};

const seedActivities = async () => {
  const count = await Activity.countDocuments();
  if (count > 0) {
    const existing = await Activity.find();
    await Promise.all(existing.map((activity) => syncCarbonRecord(activity)));
    return;
  }

  for (const activity of sampleActivities) {
    await createActivity(activity);
  }
};

const seedGoals = async () => {
  const count = await Goal.countDocuments();
  if (count > 0) return;

  await Goal.create({
    title: "Cut this month by 50 kg CO2e",
    targetReduction: 50,
    targetDate: daysAgo(-30),
    baselineEmission: 210,
    notes: "Focus on transport and electricity first."
  });
};

const seedRecommendationData = async () => {
  const count = await Recommendation.countDocuments({ source: "seed" });
  if (count > 0) return;

  await Recommendation.insertMany(seedRecommendations);
};

const run = async () => {
  await connectDB();

  await upsertEmissionFactors();
  await seedActivities();
  await seedGoals();
  await seedRecommendationData();

  console.log("Seed data ready.");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
