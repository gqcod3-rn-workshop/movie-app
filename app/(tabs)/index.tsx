import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { useRouter } from "expo-router";
import { getTrendingMovies } from "../../services/appwrite";

import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

/**
 * Index Screen 
 * @summary
 * Displays a list of latest movies with a search bar and trending movies section.
 * 
 * @returns The rendered Index screen component.
 */
export default function Index() {

  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }));

  /**
   * Use focus effect to refetch trending movies when the screen is focused.
   */
  useFocusEffect(
    useCallback(() => {
      refetchTrending();
    }, [refetchTrending])
  );

  if (moviesLoading || trendingLoading) {
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

  if (moviesError || trendingError) {
    return (
      <View className="flex-1 bg-primary justify-center px-5">
        <Image source={images.bg} className="absolute w-full z-0" />
        <Text className="text-white text-center text-lg">
          Error: {moviesError?.message || trendingError?.message || "Something went wrong"}
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
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies && trendingMovies.length > 0 && (
              <View className="mt-5">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.$id}
                />
              </View>
            )}

            <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
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
      />
    </View>
  );
}