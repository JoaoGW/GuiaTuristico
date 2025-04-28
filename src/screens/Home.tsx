import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import { Box, Text, Image } from '@gluestack-ui/themed';

import { loadDestinations } from '@utils/imageLoader';

import { NavigationBar } from '@components/NavigationBar';
import { UserInfo } from '@components/UserInfo';
import { GoPremium } from '@components/GoPremium';
import { CurrentStatusBar } from '@components/CurrentStatusBar';
import { HomeDestinations } from '@components/Home/Destinations';

interface Destinations {
    id: number;
    name: string;
    description: string;
    image: any;
}

export function Home() {
    const [destinations, setDestinations] = useState<Destinations[]>([]);

    useEffect(() => {
        loadDestinations().then(setDestinations);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CurrentStatusBar />
            <UserInfo />
            <GoPremium />

            <Text fontSize="$lg" fontWeight="$bold"> Popular Destinations </Text>

            <FlatList showsVerticalScrollIndicator={false}
                data={destinations}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                    <HomeDestinations item={item}/>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <NavigationBar />
        </View>
    );
}
