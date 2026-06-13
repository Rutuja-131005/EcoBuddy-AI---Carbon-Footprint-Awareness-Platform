const mongoose = require("mongoose");
const { CATEGORIES } = require("../utils/constants");
const { normalizeKey } = require("../utils/normalize");

const emissionFactorSchema = new mongoose.Schema(
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
    normalizedActivityType: {
      type: String,
      required: true,
      trim: true
    },
    factor: {
      type: Number,
      required: true,
      min: [0, "Emission factor cannot be negative"]
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

emissionFactorSchema.index(
  { category: 1, normalizedActivityType: 1 },
  { unique: true }
);

emissionFactorSchema.pre("validate", function setNormalizedType(next) {
  this.normalizedActivityType = normalizeKey(this.activityType);
  next();
});

module.exports = mongoose.model("EmissionFactor", emissionFactorSchema);
