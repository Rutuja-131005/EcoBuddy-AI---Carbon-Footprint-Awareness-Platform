import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Activities from "../pages/Activities";
import Goals from "../pages/Goals";
import Reports from "../pages/Reports";
import Recommendations from "../pages/Recommendations";
import EmptyState from "../components/EmptyState";
import ActivityForm from "../components/ActivityForm";
import Navbar from "../components/Navbar";
import App from "../App";
import { api } from "../services/api";

jest.mock("../services/api", () => ({
  api: {
    getDashboard: jest.fn(),
    getActivities: jest.fn(),
    getEmissionFactors: jest.fn(),
    createActivity: jest.fn(),
    updateActivity: jest.fn(),
    deleteActivity: jest.fn(),
    getGoals: jest.fn(),
    createGoal: jest.fn(),
    completeGoal: jest.fn(),
    deleteGoal: jest.fn(),
    getRecommendations: jest.fn(),
    getReport: jest.fn(),
    downloadReportPdf: jest.fn()
  }
}));

jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>
}));

const mockFactors = [
  {
    category: "Transport",
    activityType: "Car",
    factor: 0.21,
    unit: "kg CO2e per km"
  }
];

describe("EcoBuddy AI Frontend Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test 1: Application renders successfully", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText("EcoBuddy AI").length).toBeGreaterThan(0);
    });
  });

  test("Test 2: Landing page renders", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    expect(screen.getAllByText("EcoBuddy AI").length).toBeGreaterThan(0);
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
  });

  test("Test 3: Navigation renders primary routes", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Activities")).toBeInTheDocument();
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Goals")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  test("Test 4: Activity form renders required fields", () => {
    render(<ActivityForm factors={mockFactors} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Activity type")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add activity/i })).toBeInTheDocument();
  });

  test("Test 5: Dashboard loads correctly", async () => {
    api.getDashboard.mockResolvedValueOnce({
      totalFootprint: 120.5,
      monthlyTotal: 45.2,
      carbonScore: { score: 75, label: "Good", tone: "improving" },
      categoryEmissions: [{ category: "Transport", total: 45.2 }],
      weeklyTrend: [],
      monthlyTrend: [],
      recentActivities: [],
      goals: []
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Carbon footprint overview")).toBeInTheDocument();
    });

    expect(screen.getByText("Total footprint")).toBeInTheDocument();
    expect(screen.getByText("Current month")).toBeInTheDocument();
    expect(screen.getByText("Carbon score")).toBeInTheDocument();
  });

  test("Test 6: Activities page loads activity table", async () => {
    api.getActivities.mockResolvedValueOnce([
      {
        _id: "1",
        category: "Transport",
        activityType: "Car",
        quantity: 10,
        emission: 2.1,
        date: "2026-06-13",
        notes: ""
      }
    ]);
    api.getEmissionFactors.mockResolvedValueOnce(mockFactors);

    render(
      <MemoryRouter>
        <Activities />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Track daily carbon activity")).toBeInTheDocument();
    });

    expect(screen.getByRole("cell", { name: "Car" })).toBeInTheDocument();
  });

  test("Test 7: Empty state rendering", () => {
    render(<EmptyState title="No items found" description="Create an item to see progress." />);

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Create an item to see progress.")).toBeInTheDocument();
  });

  test("Test 8: Dashboard API failure shows error state", async () => {
    api.getDashboard.mockRejectedValueOnce(new Error("API Request Failed"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("API Request Failed")).toBeInTheDocument();
    });
  });

  test("Test 9: Activities page shows error when API fails", async () => {
    api.getActivities.mockRejectedValueOnce(new Error("Unable to load activities"));
    api.getEmissionFactors.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <Activities />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Unable to load activities")).toBeInTheDocument();
    });
  });

  test("Test 10: Activity form submits payload", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<ActivityForm factors={mockFactors} onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText("Quantity"));
    await user.type(screen.getByLabelText("Quantity"), "12");
    await user.click(screen.getByRole("button", { name: /add activity/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "Transport",
        activityType: "Car",
        quantity: 12
      })
    );
  });

  test("Test 11: Goals page renders goal cards", async () => {
    api.getGoals.mockResolvedValueOnce([
      {
        _id: "goal-1",
        title: "Reduce transport emissions",
        status: "active",
        targetReduction: 20,
        targetDate: "2026-07-13",
        baselineEmission: 100,
        currentEmission: 80,
        progress: 50,
        notes: ""
      }
    ]);

    render(
      <MemoryRouter>
        <Goals />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Reduction targets")).toBeInTheDocument();
    });

    expect(screen.getByText("Reduce transport emissions")).toBeInTheDocument();
  });

  test("Test 12: Recommendations page renders cards", async () => {
    api.getRecommendations.mockResolvedValueOnce([
      {
        _id: "rec-1",
        title: "Use public transport",
        description: "Switch one car trip to bus travel.",
        category: "Transport",
        estimatedReduction: 5,
        priority: "high"
      }
    ]);

    render(
      <MemoryRouter>
        <Recommendations />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Dynamic reduction suggestions")).toBeInTheDocument();
    });

    expect(screen.getByText("Use public transport")).toBeInTheDocument();
  });

  test("Test 13: Reports page renders report summary", async () => {
    api.getReport.mockResolvedValueOnce({
      total: 12,
      averageDaily: 1.7,
      label: "Weekly report",
      startDate: "2026-06-01",
      endDate: "2026-06-07",
      categoryBreakdown: [{ category: "Transport", total: 12 }],
      dailyTrend: [{ date: "2026-06-01", total: 12 }],
      records: [
        {
          _id: "record-1",
          activityType: "Car",
          category: "Transport",
          recordedAt: "2026-06-01",
          emission: 12
        }
      ]
    });

    render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Carbon reports")).toBeInTheDocument();
    });

    expect(screen.getByText("Report total")).toBeInTheDocument();
    expect(screen.getByText("Car")).toBeInTheDocument();
  });
});
