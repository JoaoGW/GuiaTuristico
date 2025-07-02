import { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";

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
        position.value = withTiming(-200, { duration: 200 });
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
    transform: [{ translateY: position.value }],
  }));

  const styles = StyleSheet.create({
    slider: {
      minHeight: 225,
      maxHeight: 300,
      width: "100%",
      backgroundColor: '#FDFDFD',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'absolute',
      bottom: 0
    },
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(flingUpGesture, flingDownGesture)}>
      <Animated.View
        style={ [animatedStyle, styles.slider] }
      >
        <View>
          <View 
            style={{ 
              borderColor: "#BBB", 
              borderWidth: .5, 
              width: 65, 
              height: 6, 
              borderRadius: 20, 
              backgroundColor: "#BBB",
              marginTop: 20,
              marginBottom: 20,
              margin: 'auto'
            }}></View>
        </View>
        <View>
          <FlatList
            data={places}
            numColumns={2}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Box flex={1} px={4} py={2}>
                { isLoading ? (
                  <Spinner size="large" color="#e9ad2d" />
                ) : (
                  location && <HomeDestinations item={ item } userLocation={{ coords: location.coords }} />
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