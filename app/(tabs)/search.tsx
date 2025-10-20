import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useDebounce from "@/hooks/useDebounce";
import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

/**
 * Search Screen
 * @summary 
 * Displays a search bar and a list of movies based on the search query.
 * 
 * @returns The rendered Search screen component if no errors occur, otherwise displays an error message.
 */
const Search = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 500);

    const {
        data: movies = [],
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({ query: debouncedQuery }), false);

    /**
     * Handles search input changes.
     * @param text The current search query text.
     */
    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };


    /**
     * Use effect Hook to trigger movie search when the debounced query changes.
     */
    useEffect(() => {
        if (debouncedQuery.trim()) {
            loadMovies();
        } else {
            reset();
        }
    }, [debouncedQuery]);


    if (loading) {
        return (
            <View className="flex-1 bg-primary justify-center">
                <Image source={images.bg} className="absolute w-full z-0" />
                <ActivityIndicator
                    size="large"
                    color="#ab8bff"
                    className="self-center"
                />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-primary justify-center px-5">
                <Image source={images.bg} className="absolute w-full z-0" />
                <Text className="text-white text-center text-lg">
                    Error: {error?.message}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" />

            <FlatList
                data={movies}
                ListHeaderComponent={
                    <View className="px-5 flex-col gap-2 mt-20">
                        <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />
                        <SearchBar
                            placeholder="Search for a movie"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                        {debouncedQuery.trim() && !loading && !error && (
                            <Text className="text-lg text-white font-bold mt-5 mb-3">
                                Search Results for{" "}
                                <Text className="text-accent">{debouncedQuery}</Text>
                            </Text>
                        )}
                    </View>
                }
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingHorizontal: 5,
                    marginBottom: 10
                }}
                contentContainerStyle={{
                    minHeight: '100%',
                    paddingBottom: 10
                }}
                showsVerticalScrollIndicator={false}
                className="mt-2 pb-32"
                ListEmptyComponent={
                    <View className="mt-10 px-5">
                        <Text className="text-center text-gray-500 text-lg">
                            {debouncedQuery.trim()
                                ? "No movies found"
                                : "Start typing to search for movies"}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default Search;