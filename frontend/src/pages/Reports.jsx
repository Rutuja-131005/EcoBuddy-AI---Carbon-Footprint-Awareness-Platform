import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Download, FileText } from "lucide-react";
import ChartPanel from "../components/ChartPanel";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { categories } from "../constants/categories";
import { api } from "../services/api";
import { baseChartOptions, softChartColors } from "../utils/chartConfig";
import { formatDate, formatKg } from "../utils/formatters";

const Reports = () => {
  const [filters, setFilters] = useState({
    type: "weekly",
    category: "",
    startDate: "",
    endDate: ""
  });
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const loadReport = useCallback(async (nextFilters = filters) => {
    setReport(await api.getReport(nextFilters));
  }, [filters]);

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        await loadReport();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [loadReport]);

  const updateFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        setError("");
        await loadReport(filters);
      } catch (err) {
        setError(err.message);
      }
    },
    [filters, loadReport]
  );

  const handleDownload = useCallback(async () => {
    try {
      setDownloading(true);
      setError("");
      await api.downloadReportPdf(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  }, [filters]);

  const dailyData = useMemo(() => {
    const items = report?.dailyTrend || [];
    return {
      labels: items.map((item) => item.date),
      datasets: [
        {
          label: "Daily emissions",
          data: items.map((item) => item.total),
          borderColor: "#0f766e",
          backgroundColor: "rgba(15, 118, 110, 0.14)",
          pointBackgroundColor: "#0f766e",
          fill: true,
          tension: 0.35
        }
      ]
    };
  }, [report]);

  const categoryData = useMemo(() => {
    const items = report?.categoryBreakdown || [];
    return {
      labels: items.map((item) => item.category),
      datasets: [
        {
          label: "Category emissions",
          data: items.map((item) => item.total),
          backgroundColor: softChartColors,
          borderRadius: 6
        }
      ]
    };
  }, [report]);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Reports"
        title="Carbon reports"
        description="Review weekly, monthly, category-wise, and custom-range reports with downloadable PDF output."
        action={
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </button>
        }
      />
      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" aria-label="Report filters">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="grid gap-2 text-sm font-medium text-slate-700">
            <label htmlFor="report-type">Report type</label>
            <select
              id="report-type"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
              value={filters.type}
              onChange={(event) => updateFilter("type", event.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="category-wise">Category-wise</option>
            </select>
          </div>

          <div className="grid gap-2 text-sm font-medium text-slate-700">
            <label htmlFor="report-category">Category</label>
            <select
              id="report-category"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2 text-sm font-medium text-slate-700">
            <label htmlFor="report-start-date">Start date</label>
            <input
              id="report-start-date"
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
              type="date"
              value={filters.startDate}
              max={filters.endDate || undefined}
              onChange={(event) => updateFilter("startDate", event.target.value)}
            />
          </div>

          <div className="grid gap-2 text-sm font-medium text-slate-700">
            <label htmlFor="report-end-date">End date</label>
            <input
              id="report-end-date"
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
              type="date"
              value={filters.endDate}
              min={filters.startDate || undefined}
              onChange={(event) => updateFilter("endDate", event.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Generate report
        </button>
      </form>

      {report ? (
        <>
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="Report total" value={formatKg(report.total)} helper={report.label} />
            <StatCard icon={FileText} label="Daily average" value={formatKg(report.averageDaily)} helper="Average in selected range" tone="blue" />
            <StatCard icon={FileText} label="Categories" value={report.categoryBreakdown.length} helper="With emissions" tone="amber" />
            <StatCard
              icon={FileText}
              label="Range"
              value={formatDate(report.startDate)}
              helper={`to ${formatDate(report.endDate)}`}
              tone="violet"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ChartPanel title="Daily trend" subtitle="Emissions by date" summary="Daily emissions trend for the selected report range.">
              {report.dailyTrend.length ? <Line data={dailyData} options={baseChartOptions} /> : <EmptyState title="No trend data" />}
            </ChartPanel>
            <ChartPanel title="Category-wise report" subtitle="Emissions by category" summary="Category emissions breakdown for the selected report range.">
              {report.categoryBreakdown.length ? <Bar data={categoryData} options={baseChartOptions} /> : <EmptyState title="No category data" />}
            </ChartPanel>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-950">Report records</h2>
            <div className="mt-4 grid gap-3">
              {report.records.length ? (
                report.records.map((record) => (
                  <div key={record._id} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{record.activityType}</p>
                      <p className="text-sm text-slate-500">
                        {record.category} · {formatDate(record.recordedAt)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-teal-800">{formatKg(record.emission)}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="No records in this report" />
              )}
            </div>
          </section>
        </>
      ) : null}
    </PageContainer>
  );
};

export default Reports;
