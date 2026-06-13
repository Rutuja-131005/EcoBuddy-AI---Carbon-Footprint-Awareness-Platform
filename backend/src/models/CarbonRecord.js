const mongoose = require("mongoose");
const { CATEGORIES } = require("../utils/constants");

const carbonRecordSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
      unique: true
    },
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
      min: 0
    },
    emissionFactor: {
      type: Number,
      required: true,
      min: 0
    },
    emission: {
      type: Number,
      required: true,
      min: 0
    },
    recordedAt: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

carbonRecordSchema.index({ recordedAt: -1 });
carbonRecordSchema.index({ category: 1, recordedAt: -1 });

module.exports = mongoose.model("CarbonRecord", carbonRecordSchema);
