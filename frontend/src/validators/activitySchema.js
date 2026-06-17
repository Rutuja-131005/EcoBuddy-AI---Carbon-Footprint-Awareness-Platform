export const validateActivityForm = (form) => {
  const errors = {};
  
  if (!form.category || !form.category.trim()) {
    errors.category = "Category is required";
  }
  
  if (!form.activityType || !form.activityType.trim()) {
    errors.activityType = "Activity type is required";
  }
  
  const num = Number(form.quantity);
  if (!Number.isFinite(num) || num < 0) {
    errors.quantity = "Quantity must be a positive number";
  } else if (num > 999999) {
    errors.quantity = "Quantity exceeds maximum allowed value";
  }
  
  if (form.date && isNaN(new Date(form.date).getTime())) {
    errors.date = "Invalid date format";
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
