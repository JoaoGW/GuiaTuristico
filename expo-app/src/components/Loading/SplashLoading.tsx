import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { VStack, Spinner, HStack } from '@gluestack-ui/themed';

interface SplashLoadingProps {
  message?: string;
}

export function SplashLoading({ message = "Carregando recursos..." }: SplashLoadingProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    });

    const scaleIn = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.2)),
    });

    Animated.parallel([fadeIn, scaleIn]).start();
  }, []);

  return (
    <View style={{
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <VStack space="lg" alignItems="center">
          <HStack space="md" alignItems="center">
            <Spinner size="large" color="#FFFFFF" />
            <View style={{ width: 4 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[0, 1, 2].map((index) => (
                <LoadingDot key={index} delay={index * 200} />
              ))}
            </View>
          </HStack>
          
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontFamily: 'Poppins_400Regular',
            textAlign: 'center',
            opacity: 0.9,
          }}>
            {message}
          </Text>
        </VStack>
      </Animated.View>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(() => animate());
    };

    const timeout = setTimeout(animate, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 2,
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
        transform: [{
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1.2],
          }),
        }],
      }}
    />
  );
}
