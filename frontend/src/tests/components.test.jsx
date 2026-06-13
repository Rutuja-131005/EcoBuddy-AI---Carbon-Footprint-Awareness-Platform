import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import EmptyState from "../components/EmptyState";
import App from "../App";
import { api } from "../services/api";

jest.mock("../services/api", () => ({
  api: {
    getDashboard: jest.fn()
  }
}));

// Mock react-chartjs-2 components to prevent canvas context issues
jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>
}));

describe("EcoBuddy AI Frontend Components Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test 1: Application renders successfully", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Wait for the lazy loaded Landing component to render
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

  test("Test 3: Dashboard loads correctly", async () => {
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

  test("Test 4: Empty state rendering", () => {
    render(<EmptyState title="No items found" description="Create an item to see progress." />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Create an item to see progress.")).toBeInTheDocument();
  });

  test("Test 5: API failure handling", async () => {
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
});
