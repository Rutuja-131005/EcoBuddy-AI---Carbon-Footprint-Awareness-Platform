const asyncHandler = require("express-async-handler");
const EmissionFactor = require("../models/EmissionFactor");

const getEmissionFactors = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category);

  const factors = await EmissionFactor.find(filter).sort({ category: 1, activityType: 1 });

  res.json({
    success: true,
    data: factors
  });
});

module.exports = {
  getEmissionFactors
};
