const asyncHandler = require("express-async-handler");
const { listRecommendations } = require("../services/recommendationService");

const getRecommendations = asyncHandler(async (req, res) => {
  const regenerate = req.query.regenerate !== "false";
  const recommendations = await listRecommendations({ regenerate });

  res.json({
    success: true,
    data: recommendations
  });
});

module.exports = {
  getRecommendations
};
