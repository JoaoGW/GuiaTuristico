import { useContext } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

import { Box, Spinner, View } from "@gluestack-ui/themed";

import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { HomeDestinations } from "@components/Home/Destinations";
import { LocalFetchError } from "@components/Errors/LocalFetchError";

import { LocationContext } from "@contexts/requestDeviceLocation";

import { Place } from "../../../@types/PlacesTypes";

type PlacesSlider = {
  places: Place[],
  isLoading: boolean
}

export function SlideUp({ places, isLoading }: PlacesSlider) {
  const position = useSharedValue(0);
  const lastDirection = useSharedValue<"UP" | "DOWN" | null>(null);
  const { location } = useContext(LocationContext);

  const flingUpGesture = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (lastDirection.value !== "UP") {
        position.value = withTiming(-25, { duration: 200 });
        lastDirection.value = "UP";
      }
    });

  const flingDownGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (lastDirection.value !== "DOWN") {
        position.value = withTiming(0, { duration: 200 });
        lastDirection.value = "DOWN";
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(position.value === 0 ? 300 : 450, { duration: 200 }),
    transform: [{ translateY: position.value }],
  }));

  const styles = StyleSheet.create({
    slider: {
      width: "100%",
      backgroundColor: '#FDFDFD',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'absolute',
      bottom: 0,
    }
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(flingUpGesture, flingDownGesture)}>
      <Animated.View
        style={[animatedStyle, styles.slider]}
      >
        <View alignItems="center" pt={12} pb={8}>
          <View 
            w={50}
            h={5}
            borderRadius={10}
            bg="#D1D5DB"
          />
        </View>
        <View px={16} pb={8} pt={8}>
          <View flexDirection="row" justifyContent="center" alignItems="center">
            <Box
              bg="#2752B7"
              px={12}
              py={6}
              borderRadius={20}
            >
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                {places.length} lugares encontrados
              </Text>
            </Box>
          </View>
        </View>
        <View>
          <FlatList
            data={ places }
            keyExtractor={ (item, index) => item.id?.toString() || `place-${index}` }
            showsVerticalScrollIndicator={ false }
            renderItem={({ item }) => (
              <Box 
                flex={1} 
                px={16} 
                py={6}
                mb={8}
                mx={12}
                bg="#FFFFFF"
                borderRadius={16}
                shadowColor="#000"
                shadowOpacity={0.08}
                shadowRadius={8}
                shadowOffset={{ width: 0, height: 2 }}
                elevation={3}
              >
                { isLoading ? (
                  <Spinner size="large" color="#2752B7" />
                ) : (
                  location && <HomeDestinations item={item} userLocation={{ coords: location.coords }} currentScreen="MapsExpanded" />
                )}
              </Box>
            )}
            ListEmptyComponent={
              <LocalFetchError />
            }
            contentContainerStyle={{ paddingBottom: 35 }}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}