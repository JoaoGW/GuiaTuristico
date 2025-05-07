import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Box, Text, VStack, View } from '@gluestack-ui/themed';

import { NavigationBar } from '@components/NavigationBar';
import { UserInfo } from '@components/UserInfo';
import { GoPremium } from '@components/GoPremium';
import { CurrentStatusBar } from '@components/CurrentStatusBar';
import { HomeDestinations } from '@components/Home/Destinations';

import { loadDestinations } from '@utils/imageLoader';

import { TrendingUp } from 'lucide-react-native';

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
    <Box flex={1} bg="#FDFDFD">
      <CurrentStatusBar />
      <FlatList
        data={destinations}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <VStack space="md" px={6} mt={4}>
            <UserInfo />
            <View flexDirection='row' alignItems='center'>
              <TrendingUp color="black" size={30} style={{ marginRight: 8 }}/>
              <Text fontSize="$2xl" fontWeight="$bold" color="$black" mt={6}>
                Destinos Populares
              </Text>
            </View>
          </VStack>
        }
        renderItem={({ item }) => (
          <Box flex={1} px={4} py={2}>
            <HomeDestinations item={item} />
          </Box>
        )}
        ListFooterComponent={<Box />}
        contentContainerStyle={{ paddingBottom: 35 }}
      />
      <NavigationBar />
    </Box>
  );
}