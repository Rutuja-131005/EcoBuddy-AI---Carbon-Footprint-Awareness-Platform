/**
 * Calculates carbon emissions based on category, activity type, and quantity.
 * 
 * @param {string} category - The category of the emission (e.g. "Transport", "Utility")
 * @param {string} activityType - Specific activity type (e.g. "Car", "Electric Vehicle", "Electricity")
 * @param {number|string} quantity - The amount (e.g. distance, kWh)
 * @returns {number} The calculated emission in kg CO2e
 */
export const calculateEmission = (category, activityType, quantity) => {
  if (typeof quantity === 'string' && quantity.trim() === '') {
    return 0;
  }
  
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty < 0) {
    return 0;
  }

  // Simplified factors for the frontend utility
  const factors = {
    'Transport': {
      'Car': 0.21,
      'Electric Vehicle': 0.05,
      'Bus': 0.1,
      'Train': 0.04,
      'Flight (Short)': 0.15,
      'Flight (Long)': 0.11,
    },
    'Utility': {
      'Electricity': 0.233,
      'Natural Gas': 0.184,
      'Water': 0.001,
    }
  };

  const factor = factors[category]?.[activityType] || 0;
  return Number((qty * factor).toFixed(2));
};
