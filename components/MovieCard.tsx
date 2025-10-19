import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { icons } from '@/constants/icons';

/**
 * Movie Card Component
 * @summary
 * A functional component that displays a movie card with poster, title, rating, and release date.
 * 
 * @property {number} id - The unique identifier for the movie.
 * @property {string | null} poster_path - The path to the movie poster image.
 * @property {string} title - The title of the movie.
 * @property {number} vote_average - The average vote rating for the movie.
 * @property {string} release_date - The release date of the movie.
 * 
 * @return The rendered MovieCard component.
 */
const MovieCard = ({
    id,
    poster_path,
    title,
    vote_average,
    release_date,
}: Movie) => {

    const urlToTheMoviePoster = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : "https://placehold.co/600x400/1a1a1a/FFFFFF.png";

    return (
        <Link href={`/movie/${id}`} asChild>
            <TouchableOpacity className="w-[30%]">
                <Image
                    source={{
                        uri: urlToTheMoviePoster
                    }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                />

                <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
                    {title}
                </Text>

                <View className="flex-row items-center justify-start gap-x-1">
                    <Image source={icons.star} className="size-4" />
                    <Text className="text-xs text-white font-bold uppercase">
                        {Math.round(vote_average / 2)}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-light-300 font-medium mt-1">
                        {release_date?.split("-")[0]}
                    </Text>
                    <Text className="text-xs font-medium text-light-300 uppercase">
                        Movie
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;