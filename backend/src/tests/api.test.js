const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Activity = require("../models/Activity");
const CarbonRecord = require("../models/CarbonRecord");
const Goal = require("../models/Goal");
const EmissionFactor = require("../models/EmissionFactor");

const TEST_MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecobuddy-test";

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(TEST_MONGO_URI);

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

  test("GET /api/health - returns API health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.database).toBe("connected");
  });

  test("POST /api/activities - creates activity with carbon calculation", async () => {
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
    expect(response.body.data.emission).toBe(10.5);
    expect(response.body.data.emissionFactor).toBe(0.21);

    createdActivityId = response.body.data._id;
  });

  test("PUT /api/activities/:id - updates quantity and recalculates emissions", async () => {
    const response = await request(app)
      .put(`/api/activities/${createdActivityId}`)
      .send({ quantity: 100 });

    expect(response.status).toBe(200);
    expect(response.body.data.quantity).toBe(100);
    expect(response.body.data.emission).toBe(21);
  });

  test("POST /api/activities - rejects invalid negative quantity", async () => {
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

  test("POST /api/activities - rejects invalid category", async () => {
    const response = await request(app)
      .post("/api/activities")
      .send({
        category: "InvalidCategory",
        activityType: "Car",
        quantity: 10,
        date: "2026-06-13"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/recommendations - returns carbon reduction suggestions", async () => {
    const response = await request(app).get("/api/recommendations");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test("GET /api/dashboard - returns aggregated dashboard metrics", async () => {
    const response = await request(app).get("/api/dashboard");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("totalFootprint");
    expect(response.body.data).toHaveProperty("carbonScore");
    expect(Array.isArray(response.body.data.categoryEmissions)).toBe(true);
  });

  test("GET /api/emission-factors - returns emission factor catalog", async () => {
    const response = await request(app).get("/api/emission-factors?category=Transport");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data.every((factor) => factor.category === "Transport")).toBe(true);
  });

  test("POST /api/goals - creates a reduction target", async () => {
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
    expect(response.body.data.title).toBe("Reduce transport emissions");
    expect(response.body.data.status).toBe("active");

    createdGoalId = response.body.data._id;
  });

  test("PATCH /api/goals/:id/complete - marks goal completed", async () => {
    const response = await request(app).patch(`/api/goals/${createdGoalId}/complete`);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("completed");
    expect(response.body.data.progress).toBe(100);
  });

  test("GET /api/reports - returns report payload", async () => {
    const response = await request(app).get("/api/reports?type=weekly");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("total");
    expect(Array.isArray(response.body.data.categoryBreakdown)).toBe(true);
  });

  test("GET /api/reports/download/pdf - generates PDF report", async () => {
    const response = await request(app).get("/api/reports/download/pdf?type=weekly");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/pdf/);
    expect(response.body.length).toBeGreaterThan(100);
  });

  test("GET /api/activities/:id - returns 400 for invalid identifier", async () => {
    const response = await request(app).get("/api/activities/not-a-valid-id");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/activities/:id - returns 404 for missing activity", async () => {
    const response = await request(app).get(`/api/activities/${new mongoose.Types.ObjectId()}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test("DELETE /api/activities/:id - removes activity and carbon record", async () => {
    const response = await request(app).delete(`/api/activities/${createdActivityId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const checkRecord = await CarbonRecord.findOne({ activity: createdActivityId });
    expect(checkRecord).toBeNull();
  });
});
