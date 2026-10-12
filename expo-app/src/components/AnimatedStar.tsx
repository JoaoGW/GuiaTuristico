import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

interface AnimatedStarProps {
  size?: number;
  style?: any;
  delay?: number;
  duration?: number;
}

export default function AnimatedStar({ size = 24, style, delay = 0, duration = 1600 }: AnimatedStarProps) {
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity, delay, duration]);

  return (
    <Animated.View style={[{ opacity }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Polygon
          points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
          fill="#fff7b2"
          stroke="#ffe066"
          strokeWidth={1}
        />
      </Svg>
    </Animated.View>
  );
}
