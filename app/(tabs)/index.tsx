import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { useRouter } from "expo-router";

import MovieCard from "@/components/MovieCard";

import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

/**
 * Index Screen 
 * @summary
 * Displays a list of latest movies with a search bar.
 * 
 * @returns The rendered Index screen component.
 */
export default function Index() {

  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }));

  const renderHeader = () => (
    <View className="px-5 flex-col gap-2 mt-20">
      <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />
      <SearchBar
        onPress={() => router.push("/search")}
        placeholder="Search for a movie"
      />
      <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
    </View>
  );

  if (moviesLoading) {
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

  if (moviesError) {
    return (
      <View className="flex-1 bg-primary justify-center px-5">
        <Image source={images.bg} className="absolute w-full z-0" />
        <Text className="text-white text-center text-lg">
          Error: {moviesError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <FlatList
        data={movies}
        ListHeaderComponent={renderHeader}
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
