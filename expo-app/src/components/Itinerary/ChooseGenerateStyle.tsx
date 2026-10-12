import { ReactNode, useEffect, useState } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';

import { 
  AlertDialog, 
  AlertDialogBackdrop, 
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  View, 
  Text, 
  Icon,
  CloseIcon
} from '@gluestack-ui/themed';

import { Dices, Goal, Sparkles, MapPin, Star } from 'lucide-react-native';

type ChooseGenerateStyleTypes = {
  showModal: boolean,
  setShowModal: () => void,
  onDefinedItinerary?: () => void,
  onRandomItinerary?: () => void
}

type AnimatedCardProps = {
  children: ReactNode,
  onPress: () => void,
  colors: { primary: string, shadow: string, border: string },
  delay?: number,
  showModal: boolean,
  styles?: StyleProp<ViewStyle>,
  pressableStyles?: StyleProp<ViewStyle>,
};

function AnimatedCard({ children, onPress, colors, delay = 0, styles, pressableStyles, showModal }: AnimatedCardProps) {
  const [cardScale] = useState(() => new Animated.Value(1));
  const [cardOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (showModal) {
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }).start();
    }
  }, [showModal, cardOpacity, delay]);

  const handlePressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 150,
      friction: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 4,
    }).start();
  };

  return (
    <Animated.View
      style={[{
          flex: 1,
          transform: [{ scale: cardScale }],
          opacity: cardOpacity,
        },
        styles
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        style={[
          {
            flex: 1,
            aspectRatio: 1,
            borderRadius: 20,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 2,
            borderColor: colors.border,
          },
          pressableStyles
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function ChooseGenerateStyle({ showModal, setShowModal, onDefinedItinerary, onRandomItinerary }: ChooseGenerateStyleTypes) {
  const [scaleAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (showModal) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [showModal, scaleAnim, fadeAnim]);

  return (
    <AlertDialog isOpen={showModal} onClose={setShowModal}>
      <AlertDialogBackdrop />
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }}
      >
        <AlertDialogContent 
          w="85%" 
          maxWidth={380}
          borderRadius={24}
          bgColor="$white"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 10 }}
          shadowOpacity={0.25}
          shadowRadius={20}
          elevation={20}
        >
          <AlertDialogHeader
            borderBottomWidth={0}
            pb={0}
            pt={20}
            px={20}
          >
            <View flex={1} alignItems="center">
              <View
                p={12}
                borderRadius={50}
                bgColor="rgba(39, 82, 183, 0.1)"
                mb={16}
              >
                <Sparkles size={32} color="#2752B7" />
              </View>
              <Text 
                fontSize={24} 
                fontWeight="$bold" 
                color="$text"
                textAlign="center"
                lineHeight={28}
              >
                Escolha seu Estilo
              </Text>
              <Text 
                fontSize={16} 
                color="$gray600"
                textAlign="center"
                mt={8}
                lineHeight={22}
              >
                Como você gostaria de criar seu itinerário?
              </Text>
            </View>
            <AlertDialogCloseButton
              position="absolute"
              top={16}
              right={16}
              p={8}
              borderRadius={20}
              bgColor="rgba(0, 0, 0, 0.05)"
            >
              <Icon as={CloseIcon} size="lg" color="$gray600" />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          
          <AlertDialogBody px={20} py={20}>
            <View flexDirection="row" gap={12}>
              <AnimatedCard
                showModal={showModal}
                delay={100}
                onPress={() => onDefinedItinerary && onDefinedItinerary()}
                colors={{
                  primary: '#2752B7',
                  shadow: '#2752B7',
                  border: 'rgba(39, 82, 183, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <Goal size={32} color="#FFF" strokeWidth={2.5} />
                </View>
                <Text 
                  color="$white" 
                  fontWeight="$bold" 
                  fontSize={16}
                  textAlign="center"
                  lineHeight={20}
                >
                  Planejado
                </Text>
                <Text 
                  color="rgba(255, 255, 255, 0.9)"
                  fontSize={12}
                  textAlign="center"
                  mt={6}
                  lineHeight={16}
                >
                  Defina destinos, datas e preferências
                </Text>
              </AnimatedCard>
              
              <AnimatedCard
              
                showModal={showModal}
                delay={200}
                onPress={() => onRandomItinerary && onRandomItinerary()}
                colors={{
                  primary: '#7C3AED',
                  shadow: '#7C3AED',
                  border: 'rgba(124, 58, 237, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <Dices size={32} color="#FFF" strokeWidth={2.5} />
                </View>
                <Text 
                  color="$white" 
                  fontWeight="$bold" 
                  fontSize={16}
                  textAlign="center"
                  lineHeight={20}
                >
                  Surpresa
                </Text>
                <Text 
                  color="rgba(255, 255, 255, 0.9)" 
                  fontSize={12}
                  textAlign="center"
                  mt={6}
                  lineHeight={16}
                >
                  Deixe a IA escolher uma aventura única
                </Text>
              </AnimatedCard>
            </View>
            <AnimatedCard
              showModal={showModal}
                delay={200}
                onPress={ () => {} }
                colors={{
                  primary: '#3aa8ed',
                  shadow: '#3aa8ed',
                  border: 'rgba(58, 103, 237, 0.2)',
                }}
                styles={{
                  marginTop: 12,
                  flex: 0,
                  height: 120,
                }}
                pressableStyles={{
                  aspectRatio: 3,
                  flex: 0,
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mr={16}
                >
                  <Star size={32} color="#FFF" strokeWidth={2.5} />
                </View>
                <View flex={1}>
                  <Text 
                    color="$white" 
                    fontWeight="$bold" 
                    fontSize={16}
                    textAlign="left"
                    lineHeight={20}
                  >
                    Roteiros Prontos
                  </Text>
                  <Text 
                    color="rgba(255, 255, 255, 0.9)" 
                    fontSize={12}
                    textAlign="left"
                    mt={6}
                    lineHeight={16}
                  >
                    Escolha um dos nossos roteiros prontos feitos pela curadoria
                  </Text>
                </View>
              </AnimatedCard>

            <View
              mt={24}
              p={16}
              borderRadius={16}
              bgColor="rgba(39, 82, 183, 0.05)"
              borderWidth={1}
              borderColor="rgba(39, 82, 183, 0.1)"
            >
              <View flexDirection="row" alignItems="center" mb={8}>
                <MapPin size={20} color="#2752B7" />
                <Text 
                  fontSize={16} 
                  fontWeight="$semibold" 
                  color="$text"
                  ml={8}
                >
                  Dica Importante
                </Text>
              </View>
              <Text 
                fontSize={14} 
                color="$gray600"
                lineHeight={20}
              >
                Planejado e Surpresa utilizam IA avançada para criar experiências únicas baseadas em suas preferências e histórico de viagens.
              </Text>
            </View>
          </AlertDialogBody>
        </AlertDialogContent>
      </Animated.View>
    </AlertDialog>
  );
}