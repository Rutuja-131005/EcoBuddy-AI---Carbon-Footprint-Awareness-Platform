const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Goal = require("../models/Goal");
const { parseActivityBody, parseGoalBody } = require("../utils/payloadParser");
const { sendCreated, sendSuccess } = require("../utils/response");
const { errorHandler, notFound } = require("../middleware/errorHandler");

const TEST_MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecobuddy-test";

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  await Goal.deleteMany({});
  await mongoose.disconnect();
});

describe("Utility and middleware unit tests", () => {
  test("parseActivityBody coerces quantity and date", () => {
    const payload = parseActivityBody({
      category: "Transport",
      activityType: "Car",
      quantity: "12.5",
      date: "2026-06-13"
    });

    expect(payload.quantity).toBe(12.5);
    expect(payload.date).toBeInstanceOf(Date);
  });

  test("parseGoalBody coerces numeric goal fields", () => {
    const payload = parseGoalBody({
      title: "Reduce transport",
      targetReduction: "15",
      targetDate: "2026-07-01",
      baselineEmission: "80"
    });

    expect(payload.targetReduction).toBe(15);
    expect(payload.baselineEmission).toBe(80);
    expect(payload.targetDate).toBeInstanceOf(Date);
  });

  test("response helpers send standardized payloads", () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status, json };

    sendSuccess(res, { ok: true });
    sendCreated(res, { created: true });

    expect(status).toHaveBeenCalledWith(200);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ success: true, data: { ok: true } });
    expect(json).toHaveBeenCalledWith({ success: true, data: { created: true } });
  });

  test("errorHandler maps cast errors to 400", () => {
    const err = new Error("Cast failed");
    err.name = "CastError";

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid resource identifier."
    });
  });

  test("errorHandler hides internal server error details", () => {
    const err = new Error("Database exploded");
    err.statusCode = 500;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
  });

  test("notFound forwards 404 errors", () => {
    const next = jest.fn();
    notFound({ originalUrl: "/api/missing" }, {}, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404
      })
    );
  });

  test("GET unknown route returns 404 JSON", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/dashboard rejects unsupported query params", async () => {
    const response = await request(app).get("/api/dashboard?foo=bar");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("DELETE /api/goals/:id removes a goal", async () => {
    const createResponse = await request(app)
      .post("/api/goals")
      .send({
        title: "Temporary goal",
        targetReduction: 10,
        targetDate: "2026-08-01"
      });

    const goalId = createResponse.body.data._id;
    const deleteResponse = await request(app).delete(`/api/goals/${goalId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });
});
