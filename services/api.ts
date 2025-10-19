/**
 * TMDB API configuration and request handlers.
 */
export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
};

/**
 * Generic API request handler with error handling and response parsing
 * @param endpoint - API endpoint URL
 * @param options - Fetch options (optional)
 * @returns Promise with parsed JSON response
 */
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Builds API endpoint URL with query parameters
 * @param path - API path
 * @param params - Query parameters object (values may be string, number, boolean or undefined)
 * @returns Complete API URL
 */
const buildEndpoint = (path: string, params?: Record<string, string | number | boolean | undefined>): string => {
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const fullUrl = `${TMDB_CONFIG.BASE_URL}/${cleanPath}`;
    const url = new URL(fullUrl);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
};

/**
 * Fetches movies from TMDB API
 * @param query - Search query (optional)
 * @returns Promise with array of movies
 */
export const fetchMovies = async ({ query }: { query?: string } = {}): Promise<Movie[]> => {
    const path = query ? '/search/movie' : '/discover/movie';
    const params = query
        ? { query: encodeURIComponent(query) }
        : { sort_by: 'popularity.desc' };

    const endpoint = buildEndpoint(path, params);
    const data = await apiRequest<{ results: Movie[] }>(endpoint);

    return data.results;
};

/**
 * Fetches detailed information for a specific movie
 * @param movieId - Movie ID
 * @returns Promise with movie details
 */
export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
    const endpoint = buildEndpoint(`/movie/${movieId}`, {
        api_key: TMDB_CONFIG.API_KEY!
    });

    return apiRequest<MovieDetails>(endpoint);
};