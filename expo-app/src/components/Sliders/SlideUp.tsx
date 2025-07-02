import { View, StyleSheet } from "react-native";
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

  const flingGesture = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      position.value = withTiming(position.value - 100, { duration: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));

  const styles = StyleSheet.create({
    slider: {
      minHeight: 200,
      width: "100%",
      backgroundColor: '#FDFDFD',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'absolute',
      bottom: 0
    },
  });

  return (
    <GestureDetector gesture={flingGesture}>
      <Animated.View
        style={[animatedStyle, styles.slider]}
        accessibilityLabel="Deslize para cima para expandir"
      >
        <View></View>
        <View></View>
      </Animated.View>
    </GestureDetector>
  );
}