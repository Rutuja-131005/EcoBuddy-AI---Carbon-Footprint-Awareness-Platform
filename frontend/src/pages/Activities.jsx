import { PlusCircle } from "lucide-react";
import ActivityForm from "../components/ActivityForm";
import ActivityTable from "../components/ActivityTable";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { formatKg } from "../utils/formatters";
import { useActivities } from "../../../src/hooks/useActivities";

const Activities = () => {
  const {
    activities,
    factors,
    editing,
    error,
    loading,
    submitting,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleCancel
  } = useActivities();

  const total = activities.reduce((sum, activity) => sum + (Number(activity.emission) || 0), 0);

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
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ActivityTable activities={activities} onDelete={handleDelete} onEdit={handleEdit} />
    </PageContainer>
  );
};

export default Activities;
