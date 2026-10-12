import { ReactNode, useEffect, useState } from 'react';
import { Animated, Pressable } from 'react-native';

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

import { Bed, Compass, Landmark, PartyPopper, Plane, ShoppingBag, TreePine, UtensilsCrossed } from 'lucide-react-native';

type ItineraryCategoriesDefineTypes = {
  showModal: boolean,
  setShowModal: () => void,
  onSelectCategory: (category: string) => void
}

type AnimatedCardProps = {
  children: ReactNode,
  onPress: () => void,
  colors: { primary: string, shadow: string, border: string },
  delay?: number,
  showModal: boolean,
};

function AnimatedCard({ children, onPress, colors, delay = 0, showModal }: AnimatedCardProps) {
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
      style={{
        transform: [{ scale: cardScale }],
        opacity: cardOpacity,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        style={{
          width: 150,
          height: 120,
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
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function ItineraryCategoriesDefine({ showModal, setShowModal, onSelectCategory }: ItineraryCategoriesDefineTypes) {
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
          maxWidth="90%"
          minWidth="95%"
          borderRadius={24}
          bgColor="$white"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 10 }}
          shadowOpacity={0.25}
          shadowRadius={20}
          elevation={20}
          alignItems='center'
        >
          <AlertDialogHeader
            borderBottomWidth={0}
            pb={0}
            pt={20}
            px={20}
          >
            <View flex={1} alignItems="center" mb={5}>
              <Text 
                fontSize={24} 
                fontWeight="$bold" 
                color="$text"
                textAlign="center"
                lineHeight={28}
              >
                Defina a Categoria
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
            <View flexDirection="row" gap={12} flexWrap='wrap' justifyContent='center' ml={20}>
              <AnimatedCard
                showModal={showModal}
                delay={100}
                onPress={ () => {
                  onSelectCategory("Ponto Turístico");
                  setShowModal();
                } }
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
                  <Compass size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Ponto Turístico
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={200}
                onPress={() => {
                  onSelectCategory("Gastronomia");
                  setShowModal();
                }}
                colors={{
                  primary: '#E4572E',
                  shadow: '#E4572E',
                  border: 'rgba(228, 87, 46, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <UtensilsCrossed size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Gastronomia
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={300}
                onPress={() => {
                  onSelectCategory("Hospedagem");
                  setShowModal();
                }}
                colors={{
                  primary: '#2E8B57',
                  shadow: '#2E8B57',
                  border: 'rgba(46, 139, 87, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <Bed size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Hospedagem
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={400}
                onPress={() => {
                  onSelectCategory("Vida Noturna");
                  setShowModal();
                }}
                colors={{
                  primary: '#A259D9',
                  shadow: '#A259D9',
                  border: 'rgba(162, 89, 217, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <PartyPopper size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Vida Noturna
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={500}
                onPress={() => {
                  onSelectCategory("Parques");
                  setShowModal();
                }}
                colors={{
                  primary: '#43B0A5',
                  shadow: '#43B0A5',
                  border: 'rgba(67, 176, 165, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <TreePine size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Parques
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={600}
                onPress={() => {
                  onSelectCategory("Shopping");
                  setShowModal();
                }}
                colors={{
                  primary: '#F3AF3D',
                  shadow: '#F3AF3D',
                  border: 'rgba(243, 175, 61, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <ShoppingBag size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Shopping
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={700}
                onPress={() => {
                  onSelectCategory("Cultura");
                  setShowModal();
                }}
                colors={{
                  primary: '#F76E9A',
                  shadow: '#F76E9A',
                  border: 'rgba(247, 110, 154, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <Landmark size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Cultura
                </Text>
              </AnimatedCard>
              <AnimatedCard
                showModal={showModal}
                delay={800}
                onPress={() => {
                  onSelectCategory("Viagens");
                  setShowModal();
                }}
                colors={{
                  primary: '#3D5A80',
                  shadow: '#3D5A80',
                  border: 'rgba(61, 90, 128, 0.2)',
                }}
              >
                <View
                  p={12}
                  borderRadius={50}
                  bgColor="rgba(255, 255, 255, 0.2)"
                  mb={12}
                >
                  <Plane size={32} color="#FFF" strokeWidth={2.25} />
                </View>
                <Text
                  color="$white" 
                  fontWeight="$semibold" 
                  fontSize="$sm"
                  textAlign="center"
                  w="110%"
                >
                  Viagens
                </Text>
              </AnimatedCard>
            </View>
          </AlertDialogBody>
        </AlertDialogContent>
      </Animated.View>
    </AlertDialog>
  );
}