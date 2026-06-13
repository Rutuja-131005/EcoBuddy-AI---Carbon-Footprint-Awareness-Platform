import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import ActivityForm from "../components/ActivityForm";
import ActivityTable from "../components/ActivityTable";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import { formatKg } from "../utils/formatters";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [factors, setFactors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    const [activityData, factorData] = await Promise.all([api.getActivities(), api.getEmissionFactors()]);
    setActivities(activityData);
    setFactors(factorData);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        await loadData();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      if (editing) {
        await api.updateActivity(editing._id, payload);
      } else {
        await api.createActivity(payload);
      }
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this activity?");
    if (!confirmed) return;

    try {
      setError("");
      await api.deleteActivity(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const total = activities.reduce((sum, activity) => sum + (Number(activity.emission) || 0), 0);

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><LoadingState /></main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Activity Management"
        title="Track daily carbon activity"
        description="Create, update, and remove transport, electricity, food, water, shopping, and waste records."
      />
      <ErrorBanner message={error} />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={PlusCircle} label="Logged activities" value={activities.length} helper="Total records" />
        <StatCard icon={PlusCircle} label="Calculated emissions" value={formatKg(total)} helper="From all activities" tone="blue" />
        <StatCard icon={PlusCircle} label="Emission factors" value={factors.length} helper="Available calculator factors" tone="amber" />
      </section>

      <ActivityForm
        factors={factors}
        initialData={editing}
        onCancel={() => setEditing(null)}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ActivityTable activities={activities} onDelete={handleDelete} onEdit={setEditing} />
    </main>
  );
};

export default Activities;
