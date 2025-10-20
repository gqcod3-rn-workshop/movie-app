import { useEffect, useState } from 'react';

/**
 * Custom UseDebounce Hook
 * @summary
 * This hook returns a debounced value that updates only after the specified delay has passed
 * since the last change to the input value. It is useful for optimizing performance in scenarios
 * like search input where frequent updates can lead to excessive processing.
 *
 * @template T - The type of the value to debounce.
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
function useDebounce<T>(value: T, delay: number): T {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value changes before the delay has passed
        return () => clearTimeout(handler);
    }, [value, delay]); // Only re-run if value or delay changes

    return debouncedValue;
}

export default useDebounce;
