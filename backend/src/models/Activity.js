const mongoose = require("mongoose");
const { CATEGORIES } = require("../utils/constants");

const activitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: CATEGORIES,
      required: true
    },
    activityType: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"]
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    emissionFactor: {
      type: Number,
      min: 0,
      default: 0
    },
    emission: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

activitySchema.index({ date: -1 });
activitySchema.index({ category: 1, date: -1 });

module.exports = mongoose.model("Activity", activitySchema);
