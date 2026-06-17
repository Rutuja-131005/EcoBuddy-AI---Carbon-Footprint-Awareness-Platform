export const validateGoalForm = (form) => {
  const errors = {};
  
  if (!form.title || !form.title.trim()) {
    errors.title = "Goal title is required";
  }
  
  const reduction = Number(form.targetReduction);
  if (!Number.isFinite(reduction) || reduction <= 0) {
    errors.targetReduction = "Target reduction must be a positive number";
  } else if (reduction > 999999) {
    errors.targetReduction = "Target reduction exceeds maximum allowed value";
  }
  
  if (!form.targetDate || isNaN(new Date(form.targetDate).getTime())) {
    errors.targetDate = "Valid target date is required";
  } else if (new Date(form.targetDate) < new Date()) {
    errors.targetDate = "Target date must be in the future";
  }
  
  if (form.baselineEmission !== "" && form.baselineEmission !== undefined) {
    const baseline = Number(form.baselineEmission);
    if (!Number.isFinite(baseline) || baseline < 0) {
      errors.baselineEmission = "Baseline emission must be a positive number";
    }
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
