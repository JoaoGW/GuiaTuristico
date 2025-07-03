import { useContext, useState } from "react";
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
            data={ places }
            keyExtractor={ (item) => item.id }
            showsVerticalScrollIndicator={ false }
            renderItem={({ item }) => (
              <Box flex={1} px={4} py={2}>
                { isLoading ? (
                  <Spinner size="large" color="#e9ad2d" />
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