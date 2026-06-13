const asyncHandler = require("express-async-handler");
const { getDashboard } = require("../services/dashboardService");

const getDashboardHandler = asyncHandler(async (req, res) => {
  const dashboard = await getDashboard();

  res.json({
    success: true,
    data: dashboard
  });
});

module.exports = {
  getDashboard: getDashboardHandler
};
