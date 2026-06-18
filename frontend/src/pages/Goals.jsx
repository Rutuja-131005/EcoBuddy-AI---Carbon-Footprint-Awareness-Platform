import { useCallback, useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import GoalCard from "../components/GoalCard";
import GoalForm from "../components/GoalForm";
import LoadingState from "../components/LoadingState";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import { useGoals } from "../../../src/hooks/useGoals";

const Goals = () => {
  const { goals, error, loading, submitting, handleSubmit, handleComplete, handleDelete } = useGoals();

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
