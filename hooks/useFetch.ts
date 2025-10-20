import { useCallback, useEffect, useState } from "react";

/**
 * Custom UseFetch Hook
 * @summary
 * This hook simplifies data fetching in React components. It manages loading, error, and data states,
 * and provides a refetch function to manually trigger data fetching.
 *
 * @template T - The type of data being fetched.
 * @param fetchFunction - A function that returns a promise for the data to be fetched.
 * @param autoFetch - Whether to automatically fetch data on mount (default: true).
 * @returns An object containing the fetched data, loading state, error state, and refetch/reset functions.
 */
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchFunction();

            setData(result);
        }
        catch(err) {
            setError(err instanceof Error ? err : new Error('An error ocurred'));
        }
        finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;