import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fetches remote data with loading and error state management.
 * @param {() => Promise<any>} fetcher - Async function that returns data
 */
export const useApiData = (fetcher) => {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      setError("");
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Request failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, loading, setError, setData, reload };
};
