export const validateReportFilters = (filters) => {
  const errors = {};
  
  if (!filters.type) {
    errors.type = "Report type is required";
  } else if (!["weekly", "monthly", "category-wise"].includes(filters.type)) {
    errors.type = "Invalid report type";
  }

  if (filters.startDate && filters.endDate) {
    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      errors.dateRange = "Start date cannot be after end date";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
