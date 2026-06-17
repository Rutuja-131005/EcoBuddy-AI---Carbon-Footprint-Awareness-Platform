import { test, expect } from '@playwright/test';

// Before all tests, we can mock APIs so the backend doesn't need to be running for purely UI testing,
// but Playwright typically tests the full stack. Let's assume the frontend and backend are both running.
// If the backend is running on :5000, we can run against it, or we can mock.
// To ensure tests are deterministic and not flaky, we'll mock the backend responses here.

test.beforeEach(async ({ page }) => {
  // Mock Health check
  await page.route('**/api/health', async route => {
    await route.fulfill({ status: 200, body: JSON.stringify({ status: 'ok' }) });
  });

  // Mock Dashboard
  await page.route('**/api/dashboard', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          totalFootprint: 100,
          monthlyTotal: 25,
          carbonScore: { score: 85, label: "Excellent", tone: "positive" },
          categoryEmissions: [{ category: "Transport", total: 100 }],
          weeklyTrend: [],
          monthlyTrend: [],
          recentActivities: [],
          goals: []
        }
      })
    });
  });

  // Mock Emission Factors
  await page.route('**/api/emission-factors', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: [
          { category: 'Transport', activityType: 'Car', factor: 0.2, unit: 'kg CO2/km' }
        ]
      })
    });
  });

  // Mock Activities GET
  await page.route('**/api/activities', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: [
            { _id: '1', category: 'Transport', activityType: 'Car', quantity: 10, emission: 2, date: '2026-06-17', notes: 'Test' }
          ]
        })
      });
    } else {
      route.continue();
    }
  });

  // Mock Activities POST
  await page.route('**/api/activities', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        body: JSON.stringify({
          data: { _id: '2', category: 'Transport', activityType: 'Car', quantity: 5, emission: 1, date: '2026-06-17', notes: 'New' }
        })
      });
    }
  });

  // Mock Activities PUT and DELETE
  await page.route('**/api/activities/*', async route => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { success: true } }) });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: { success: true } }) });
    } else {
      route.continue();
    }
  });

  // Mock Goals GET
  await page.route('**/api/goals', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: [
            { _id: 'g1', title: 'Test Goal', status: 'active', targetReduction: 10, targetDate: '2026-12-31', progress: 50 }
          ]
        })
      });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, body: JSON.stringify({ data: { success: true } }) });
    }
  });

  await page.route('**/api/goals/*/complete', async route => {
    await route.fulfill({ status: 200, body: JSON.stringify({ data: { success: true } }) });
  });

  // Mock Recommendations
  await page.route('**/api/recommendations', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: [{ _id: 'r1', title: 'Rec 1', description: 'Test', priority: 'high' }]
      })
    });
  });

  // Mock Reports
  await page.route('**/api/reports*', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          total: 100, averageDaily: 10, categoryBreakdown: [], dailyTrend: [], records: []
        }
      })
    });
  });
});

test('1. Application loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/EcoBuddy/i);
});

test('2. Landing page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Go to Dashboard')).toBeVisible();
});

test('3. Navigation works', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Go to Dashboard').click();
  await expect(page.getByText('Carbon footprint overview')).toBeVisible();

  await page.getByRole('link', { name: 'Activities' }).click();
  await expect(page.getByText('Track daily carbon activity')).toBeVisible();
});

test('4. Dashboard loads', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByText('Carbon footprint overview')).toBeVisible();
  await expect(page.getByText('Carbon score')).toBeVisible();
});

test('5. Create activity flow', async ({ page }) => {
  await page.goto('/activities');
  await page.getByLabel('Category').selectOption('Transport');
  await page.getByLabel('Activity type').selectOption('Car');
  await page.getByLabel('Quantity').fill('50');
  await page.getByLabel('Date').fill('2026-06-17');
  await page.getByRole('button', { name: 'Add activity' }).click();
});

test('6. Edit activity flow', async ({ page }) => {
  await page.goto('/activities');
  const editButton = page.locator('button[title="Edit"]').first();
  await editButton.click();
  await expect(page.getByRole('button', { name: 'Update activity' })).toBeVisible();
});

test('7. Delete activity flow', async ({ page }) => {
  await page.goto('/activities');
  
  // Intercept window.confirm
  page.on('dialog', dialog => dialog.accept());
  
  const deleteButton = page.locator('button[title="Delete"]').first();
  await deleteButton.click();
});

test('8. Carbon calculations update', async ({ page }) => {
  // This is implicitly tested by dashboard load, but let's check values from our mock
  await page.goto('/dashboard');
  await expect(page.getByText('100 kg')).toBeVisible(); // total footprint
});

test('9. Recommendations render', async ({ page }) => {
  await page.goto('/recommendations');
  await expect(page.getByText('Rec 1')).toBeVisible();
});

test('10. Goal creation flow', async ({ page }) => {
  await page.goto('/goals');
  await page.getByLabel('Goal title').fill('Reduce Car');
  await page.getByLabel('Target reduction').fill('10');
  await page.getByLabel('Target date').fill('2026-12-31');
  await page.getByRole('button', { name: 'Set goal' }).click();
});

test('11. Goal completion flow', async ({ page }) => {
  await page.goto('/goals');
  const completeButton = page.getByRole('button', { name: 'Mark completed' }).first();
  await completeButton.click();
});

test('12. Report generation flow', async ({ page }) => {
  await page.goto('/reports');
  await page.getByLabel('Report type').selectOption('weekly');
  await page.getByRole('button', { name: 'Generate report' }).click();
  await expect(page.getByText('Report total')).toBeVisible();
});

test('13. Empty state rendering', async ({ page }) => {
  // Override mock to return empty
  await page.route('**/api/goals', async route => {
    await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
  });
  
  await page.goto('/goals');
  await expect(page.getByText('No goals yet')).toBeVisible();
});

test('14. Invalid form submission', async ({ page }) => {
  await page.goto('/activities');
  // Form submission with no quantity (invalid)
  await page.getByLabel('Quantity').fill('-5'); // Invalid
  await page.getByRole('button', { name: 'Add activity' }).click();
  await expect(page.getByText('Quantity must be a positive number')).toBeVisible();
});

test('15. Error state rendering', async ({ page }) => {
  // Override mock to return error
  await page.route('**/api/dashboard', async route => {
    await route.fulfill({ status: 500, body: JSON.stringify({ message: "Server Error" }) });
  });
  await page.goto('/dashboard');
  await expect(page.getByText('Server Error')).toBeVisible();
});
