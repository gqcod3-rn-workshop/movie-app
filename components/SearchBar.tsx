import { icons } from '@/constants/icons';
import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';

interface Props {
    placeholder: string;
    onPress?: () => void
}

const SearchBar = ({ placeholder, onPress }: Props) => {

    const [search, setSearch]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('');

    return (
        <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
            <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8bff" />
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={search}
                onChangeText={setSearch}
                placeholderTextColor='#a8b5db'
                style={{ color: "#ffffff" }}
                className="flex-1 ml-2 text-white"
            />
        </View>
    );
};

export default SearchBar;
