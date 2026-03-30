import { useCallback, useEffect, useState } from "react";

export const useFetch = (fetcher, options = {}) => {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    let isMounted = true;

    if (!immediate) {
      return undefined;
    }

    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetcher, immediate]);

  return { data, loading, error, refetch: execute, setData };
};
