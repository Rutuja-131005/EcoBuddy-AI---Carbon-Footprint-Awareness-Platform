import { calculateEmission } from '../utils/carbonCalculator';

describe('carbonCalculator', () => {
  describe('Transport Calculations', () => {
    test('Calculates standard Car emissions correctly', () => {
      expect(calculateEmission('Transport', 'Car', 100)).toBe(21);
      expect(calculateEmission('Transport', 'Car', 0)).toBe(0);
    });

    test('Calculates Electric Vehicle emissions correctly', () => {
      expect(calculateEmission('Transport', 'Electric Vehicle', 100)).toBe(5);
    });
  });

  describe('Utility Calculations', () => {
    test('Calculates Electricity emissions correctly', () => {
      expect(calculateEmission('Utility', 'Electricity', 100)).toBe(23.3);
    });
  });

  describe('Edge Cases and Invalid Inputs', () => {
    test('Returns 0 for negative values', () => {
      expect(calculateEmission('Transport', 'Car', -50)).toBe(0);
    });

    test('Returns 0 for empty string values', () => {
      expect(calculateEmission('Transport', 'Car', '')).toBe(0);
      expect(calculateEmission('Transport', 'Car', '   ')).toBe(0);
    });

    test('Returns 0 for invalid string inputs', () => {
      expect(calculateEmission('Transport', 'Car', 'abc')).toBe(0);
      expect(calculateEmission('Transport', 'Car', '100abc')).toBe(21); // parseFloat parses 100
      expect(calculateEmission('Transport', 'Car', NaN)).toBe(0);
    });

    test('Returns 0 for unknown categories or types', () => {
      expect(calculateEmission('Unknown', 'Car', 100)).toBe(0);
      expect(calculateEmission('Transport', 'Spaceship', 100)).toBe(0);
    });
  });
});
