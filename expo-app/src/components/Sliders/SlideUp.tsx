import { StyleSheet } from "react-native";

import { View } from "@gluestack-ui/themed";

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

export function SlideUp() {
  const position = useSharedValue(0);
  const lastDirection = useSharedValue<"UP" | "DOWN" | null>(null);

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
      minHeight: 250,
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
        style={[animatedStyle, styles.slider]}
      >
        <View>
          <View 
            style={{ 
              borderColor: "#BBB", 
              borderWidth: .5, 
              width: 65, 
              height: 8, 
              borderRadius: 20, 
              backgroundColor: "#BBB",
              marginTop: 20,
              margin: 'auto'
            }}></View>
        </View>
        <View></View>
      </Animated.View>
    </GestureDetector>
  );
}