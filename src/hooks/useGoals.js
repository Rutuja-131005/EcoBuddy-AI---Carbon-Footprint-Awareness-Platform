import { useCallback, useEffect, useState } from "react";
import { goalService } from "../services/goalService";

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadGoals = useCallback(async () => {
    setGoals(await goalService.getGoals());
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
        await goalService.createGoal(payload);
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
        await goalService.completeGoal(id);
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
        await goalService.deleteGoal(id);
        await loadGoals();
      } catch (err) {
        setError(err.message);
      }
    },
    [loadGoals]
  );

  return { goals, error, loading, submitting, handleSubmit, handleComplete, handleDelete, refreshGoals: loadGoals };
};
