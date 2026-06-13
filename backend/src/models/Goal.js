const mongoose = require("mongoose");
const { GOAL_STATUSES } = require("../utils/constants");

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    targetReduction: {
      type: Number,
      required: true,
      min: [0, "Target reduction cannot be negative"]
    },
    targetDate: {
      type: Date,
      required: true
    },
    baselineEmission: {
      type: Number,
      min: 0,
      default: 0
    },
    currentEmission: {
      type: Number,
      min: 0,
      default: 0
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    status: {
      type: String,
      enum: GOAL_STATUSES,
      default: "active"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

goalSchema.index({ targetDate: 1, status: 1 });

module.exports = mongoose.model("Goal", goalSchema);
