import { useCallback, useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import GoalCard from "../components/GoalCard";
import GoalForm from "../components/GoalForm";
import LoadingState from "../components/LoadingState";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import { api } from "../services/api";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadGoals = useCallback(async () => {
    setGoals(await api.getGoals());
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        await loadGoals();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [loadGoals]);

  const handleSubmit = useCallback(
    async (payload) => {
      try {
        setSubmitting(true);
        setError("");
        await api.createGoal(payload);
        await loadGoals();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [loadGoals]
  );

  const handleComplete = useCallback(
    async (id) => {
      try {
        setError("");
        await api.completeGoal(id);
        await loadGoals();
      } catch (err) {
        setError(err.message);
      }
    },
    [loadGoals]
  );

  const handleDelete = useCallback(
    async (id) => {
      const confirmed = window.confirm("Delete this goal?");
      if (!confirmed) return;

      try {
        setError("");
        await api.deleteGoal(id);
        await loadGoals();
      } catch (err) {
        setError(err.message);
      }
    },
    [loadGoals]
  );

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
        eyebrow="Goals"
        title="Reduction targets"
        description="Set target reductions, track progress against current monthly emissions, and complete goals when targets are reached."
      />
      <ErrorBanner message={error} />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <GoalForm onSubmit={handleSubmit} submitting={submitting} />

        <section className="grid gap-4">
          {goals.length ? (
            goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} onComplete={handleComplete} onDelete={handleDelete} />
            ))
          ) : (
            <EmptyState title="No goals yet" description="Set a target to begin tracking reduction progress." />
          )}
        </section>
      </div>
    </PageContainer>
  );
};

export default Goals;
