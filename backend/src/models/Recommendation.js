const mongoose = require("mongoose");
const { CATEGORIES, RECOMMENDATION_SOURCES } = require("../utils/constants");

const recommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 700
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true
    },
    estimatedReduction: {
      type: Number,
      required: true,
      min: 0
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    source: {
      type: String,
      enum: RECOMMENDATION_SOURCES,
      default: "dynamic"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

recommendationSchema.index({ category: 1, priority: 1 });
recommendationSchema.index({ source: 1, generatedAt: -1 });

module.exports = mongoose.model("Recommendation", recommendationSchema);
