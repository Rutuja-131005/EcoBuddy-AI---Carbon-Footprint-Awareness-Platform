import { useCallback, useEffect, useState } from "react";
import { carbonService } from "../services/carbonService";

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRecommendations = useCallback(async () => {
    try {
      const data = await carbonService.getRecommendations();
      setRecommendations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return { recommendations, error, loading, refreshRecommendations: loadRecommendations };
};
