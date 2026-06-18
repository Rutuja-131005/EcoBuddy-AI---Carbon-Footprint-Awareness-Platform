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
  
  const hasScriptTags = (str) => /<script\b[^>]*>[\s\S]*?<\/script>/gi.test(str);

  if (activity.notes && hasScriptTags(activity.notes)) {
    errors.notes = "Invalid characters detected in notes.";
  }

  if (hasScriptTags(activity.category) || hasScriptTags(activity.activityType)) {
    errors.category = "Invalid characters detected.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
