import { Client, ID, Query, TablesDB } from 'appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tablesDB = new TablesDB(client);

/**
 * Update Search Count
 * @summary
 * This function updates the search count for a given query and movie. If the query already exists in the database, it increments the count by 1.
 * If the query does not exist, it creates a new row with the search term, movie details, and initializes the count to 1.
 * 
 * @param query The search query string
 * @param movie The movie object containing movie details
 */
export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.equal("search_term", [query])
            ]
        });

        const rows = result.rows;

        if (rows.length > 0) {
            const existingMovie = rows[0];

            await tablesDB.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: existingMovie.$id,
                data: {
                    count: existingMovie.count + 1,
                }
            });
        } else {
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    search_term: query,
                    movie_id: movie.id,
                    title: movie.title,
                    count: 1,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
};

/**
 * Get Trending Movies
 * @summary
 * This function retrieves the top 5 trending movies based on their search count from the database.
 * 
 * @returns A promise that resolves to an array of trending movies or undefined if an error occurs.
 */
export const getTrendingMovies = async (): Promise<
    TrendingMovie[] | undefined
> => {
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.limit(5),
                Query.orderDesc("count")
            ]
        });

        return result.rows as unknown as TrendingMovie[];
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};