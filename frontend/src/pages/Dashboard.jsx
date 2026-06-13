import { useEffect, useMemo, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Activity, BarChart3, Gauge, Target, TrendingDown } from "lucide-react";
import ChartPanel from "../components/ChartPanel";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import { baseChartOptions, chartColors, softChartColors } from "../utils/chartConfig";
import { formatDate, formatKg } from "../utils/formatters";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");
        setDashboard(await api.getDashboard());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const categoryPieData = useMemo(() => {
    const items = dashboard?.categoryEmissions || [];
    return {
      labels: items.map((item) => item.category),
      datasets: [
        {
          data: items.map((item) => item.total),
          backgroundColor: softChartColors,
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    };
  }, [dashboard]);

  const weeklyData = useMemo(() => {
    const items = dashboard?.weeklyTrend || [];
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          label: "Weekly emissions",
          data: items.map((item) => item.total),
          backgroundColor: "rgba(15, 118, 110, 0.78)",
          borderRadius: 6
        }
      ]
    };
  }, [dashboard]);

  const monthlyData = useMemo(() => {
    const items = dashboard?.monthlyTrend || [];
    return {
      labels: items.map((item) => item.label),
      datasets: [
        {
          label: "Monthly emissions",
          data: items.map((item) => item.total),
          borderColor: chartColors[1],
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          pointBackgroundColor: chartColors[1],
          fill: true,
          tension: 0.35
        }
      ]
    };
  }, [dashboard]);

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><LoadingState /></main>;

  const activeGoals = dashboard?.goals?.filter((goal) => goal.status === "active") || [];
  const latestGoal = activeGoals[0];
  const pieOptions = {
    ...baseChartOptions,
    scales: undefined
  };

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Carbon footprint overview"
        description="A single view of total emissions, trends, category hotspots, recent activity, and reduction goal progress."
      />
      <ErrorBanner message={error} />

      {dashboard ? (
        <>
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Activity} label="Total footprint" value={formatKg(dashboard.totalFootprint)} helper="All logged activity" />
            <StatCard icon={TrendingDown} label="Current month" value={formatKg(dashboard.monthlyTotal)} helper="Month-to-date emissions" tone="blue" />
            <StatCard
              icon={Gauge}
              label="Carbon score"
              value={`${dashboard.carbonScore.score}/100`}
              helper={dashboard.carbonScore.label}
              tone="amber"
            />
            <StatCard icon={Target} label="Active goals" value={activeGoals.length} helper={latestGoal ? latestGoal.title : "No active goals"} tone="violet" />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ChartPanel title="Category-wise emissions" subtitle="Total kg CO2e by source">
              {dashboard.categoryEmissions.length ? <Pie data={categoryPieData} options={pieOptions} /> : <EmptyState title="No category data" />}
            </ChartPanel>
            <ChartPanel title="Weekly trend" subtitle="Last eight weeks">
              <Bar data={weeklyData} options={baseChartOptions} />
            </ChartPanel>
          </section>

          <ChartPanel title="Monthly trend" subtitle="Last six months" height="h-96">
            <Line data={monthlyData} options={baseChartOptions} />
          </ChartPanel>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-700" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-slate-950">Recent activities</h2>
              </div>
              <div className="grid gap-3">
                {(dashboard.recentActivities || []).map((activity) => (
                  <div key={activity._id} className="flex flex-col gap-1 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{activity.activityType}</p>
                      <p className="text-sm text-slate-500">{activity.category} · {formatDate(activity.date)}</p>
                    </div>
                    <p className="text-sm font-semibold text-teal-800">{formatKg(activity.emission)}</p>
                  </div>
                ))}
                {dashboard.recentActivities?.length === 0 ? <EmptyState title="No recent activities" /> : null}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="text-lg font-semibold text-slate-950">Progress toward goals</h2>
              {latestGoal ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-900">{latestGoal.title}</p>
                    <p className="text-sm font-bold text-teal-800">{Math.round(latestGoal.progress || 0)}%</p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.min(100, latestGoal.progress || 0)}%` }} />
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm text-slate-600">
                    <div className="flex justify-between gap-4">
                      <dt>Target reduction</dt>
                      <dd className="font-semibold text-slate-900">{formatKg(latestGoal.targetReduction)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Target date</dt>
                      <dd className="font-semibold text-slate-900">{formatDate(latestGoal.targetDate)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <EmptyState title="No active goal" description="Create a reduction target to track progress here." />
              )}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
};

export default Dashboard;
