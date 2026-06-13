const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Activity = require("../models/Activity");
const CarbonRecord = require("../models/CarbonRecord");
const Goal = require("../models/Goal");
const EmissionFactor = require("../models/EmissionFactor");

const TEST_MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecobuddy-test";

beforeAll(async () => {
  // Disconnect any active connections to prevent collision
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(TEST_MONGO_URI);

  // Setup seed database requirements
  await EmissionFactor.deleteMany({});
  await EmissionFactor.create([
    {
      category: "Transport",
      activityType: "Car",
      factor: 0.21,
      unit: "kg CO2e per km",
      description: "Passenger car"
    },
    {
      category: "Transport",
      activityType: "Other Transport",
      factor: 0.12,
      unit: "kg CO2e per km",
      isDefault: true,
      description: "Fallback transport"
    }
  ]);
});

afterAll(async () => {
  await Activity.deleteMany({});
  await CarbonRecord.deleteMany({});
  await Goal.deleteMany({});
  await EmissionFactor.deleteMany({});
  await mongoose.disconnect();
});

describe("EcoBuddy AI Backend API Integration Tests", () => {
  let createdActivityId;
  let createdGoalId;

  // Test 1: Activity creation and Carbon calculation
  test("POST /api/activities - should create activity and return correct carbon calculation", async () => {
    const response = await request(app)
      .post("/api/activities")
      .send({
        category: "Transport",
        activityType: "Car",
        quantity: 50,
        date: "2026-06-13",
        notes: "Work commute"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.emission).toBe(10.5); // 50 * 0.21
    expect(response.body.data.emissionFactor).toBe(0.21);

    createdActivityId = response.body.data._id;
  });

  // Test 2: Activity update
  test("PUT /api/activities/:id - should update quantity and recalculate emissions", async () => {
    const response = await request(app)
      .put(`/api/activities/${createdActivityId}`)
      .send({
        quantity: 100
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.quantity).toBe(100);
    expect(response.body.data.emission).toBe(21); // 100 * 0.21
  });

  // Test 3: Error handling for invalid input
  test("POST /api/activities - should fail with 400 for negative quantity or invalid category", async () => {
    const response = await request(app)
      .post("/api/activities")
      .send({
        category: "Transport",
        activityType: "Car",
        quantity: -10,
        date: "2026-06-13"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test 4: Recommendation engine returns recommendations
  test("GET /api/recommendations - should return carbon reduction suggestions", async () => {
    const response = await request(app).get("/api/recommendations");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test 5: Goals creation
  test("POST /api/goals - should create a new reduction target", async () => {
    const response = await request(app)
      .post("/api/goals")
      .send({
        title: "Reduce transport emissions",
        targetReduction: 20,
        targetDate: "2026-07-13",
        baselineEmission: 100,
        notes: "Drive less"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe("Reduce transport emissions");
    expect(response.body.data.status).toBe("active");

    createdGoalId = response.body.data._id;
  });

  // Test 6: Complete goal
  test("PATCH /api/goals/:id/complete - should mark a goal completed", async () => {
    const response = await request(app)
      .patch(`/api/goals/${createdGoalId}/complete`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("completed");
    expect(response.body.data.progress).toBe(100);
  });

  // Test 7: Activity delete
  test("DELETE /api/activities/:id - should remove activity and associated carbon record", async () => {
    const response = await request(app).delete(`/api/activities/${createdActivityId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const checkRecord = await CarbonRecord.findOne({ activity: createdActivityId });
    expect(checkRecord).toBeNull();
  });
});
