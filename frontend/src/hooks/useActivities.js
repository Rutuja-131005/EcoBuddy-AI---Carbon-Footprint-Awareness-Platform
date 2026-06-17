import { useCallback, useEffect, useState } from "react";
import { activityService } from "../services/activityService";
import { carbonService } from "../services/carbonService";

export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [factors, setFactors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [activityData, factorData] = await Promise.all([activityService.getActivities(), carbonService.getEmissionFactors()]);
      setActivities(activityData?.data || activityData || []); // Handle paginated response structure if present
      setFactors(factorData?.data || factorData || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      setError("");
      await loadData();
      setLoading(false);
    };

    run();
  }, [loadData]);

  const handleSubmit = useCallback(
    async (payload) => {
      try {
        setSubmitting(true);
        setError("");
        if (editing) {
          await activityService.updateActivity(editing._id, payload);
        } else {
          await activityService.createActivity(payload);
        }
        setEditing(null);
        await loadData();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [editing, loadData]
  );

  const handleDelete = useCallback(
    async (id) => {
      const confirmed = window.confirm("Delete this activity?");
      if (!confirmed) return;

      try {
        setError("");
        await activityService.deleteActivity(id);
        await loadData();
      } catch (err) {
        setError(err.message);
      }
    },
    [loadData]
  );

  const handleEdit = useCallback((activity) => {
    setEditing(activity);
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
  }, []);

  return {
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
  };
};
