import React, { useEffect, useState } from "react";
import { Modal, Dimensions, Animated } from "react-native";
import { Button, ButtonText, Text, View } from "@gluestack-ui/themed";
import { Play, Star, NotebookPen, X, Crown } from "lucide-react-native";

interface UnlockProgressModalProps {
  visible: boolean,
  onClose: () => void,
  onContinue?: () => void,
  showItineraryCreate: () => void,
  onUpgradeToPremium?: () => void,
  watchedAds: number,
  totalAds: number
}

export const UnlockProgressModal: React.FC<UnlockProgressModalProps> = ({ 
  visible, 
  onClose, 
  onContinue,
  showItineraryCreate,
  onUpgradeToPremium,
  watchedAds, 
  totalAds 
}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [progressWidth] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      // Animação de entrada do modal
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(progressWidth, {
          toValue: (watchedAds / totalAds) * 100,
          duration: 600,
          useNativeDriver: false,
        })
      ]).start();
      
      // Animação de pulse para o botão atual
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      return () => {
        pulseAnimation.stop();
      };
    } else {
      animatedValue.setValue(0);
      progressWidth.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [animatedValue, progressWidth, pulseAnim, totalAds, visible, watchedAds]);

  const scaleValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacityValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const progressWidthInterpolated = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const renderAdIcon = (index: number) => {
    const isWatched = index < watchedAds;
    const isCurrent = index === watchedAds;
    
    const iconComponent = (
      <View
        key={index}
        backgroundColor={isWatched ? "#4CAF50" : isCurrent ? "#2752B7" : "#E0E0E0"}
        borderRadius={25}
        width={50}
        height={50}
        justifyContent="center"
        alignItems="center"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={isWatched ? 0.3 : 0.1}
        shadowRadius={4}
        elevation={isWatched ? 5 : 2}
      >
        {isWatched ? (
          <Star size={24} color="#FFFFFF" fill="#FFFFFF" />
        ) : isCurrent ? (
          <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <Play size={24} color="#9E9E9E" />
        )}
      </View>
    );

    // Aplicar animação de pulse apenas no botão atual
    if (isCurrent && watchedAds < totalAds) {
      return (
        <Animated.View
          key={index}
          style={{
            transform: [{ scale: pulseAnim }],
          }}
        >
          {iconComponent}
        </Animated.View>
      );
    }

    return iconComponent;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View
        flex={1}
        backgroundColor="rgba(0, 0, 0, 0.7)"
        justifyContent="center"
        alignItems="center"
        paddingHorizontal={20}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }}
        >
          <View
            backgroundColor="#FFFFFF"
            borderRadius={25}
            padding={30}
            width={Dimensions.get('window').width - 40}
            maxWidth={400}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.3}
            shadowRadius={20}
            elevation={10}
          >
            {/* Header */}
            <View alignItems="center" marginBottom={25}>
              <View
                backgroundColor="#2752B7"
                borderRadius={30}
                width={60}
                height={60}
                justifyContent="center"
                alignItems="center"
                marginBottom={15}
              >
                <NotebookPen size={30} color="#FFFFFF" />
              </View>
              <Text
                fontSize={24}
                fontWeight="bold"
                color="#2752B7"
                textAlign="center"
                marginBottom={5}
              >
                Crie seu Itinerário
              </Text>
              <Text
                fontSize={16}
                color="#666666"
                textAlign="center"
                lineHeight={22}
              >
                Assista 3 anúncios para criar seu itinerário gratuitamente, ajudando assim os desenvolvedores
              </Text>
            </View>

            {/* Progress Bar */}
            <View marginBottom={25}>
              <View
                backgroundColor="#E8F4FD"
                borderRadius={15}
                height={12}
                overflow="hidden"
                marginBottom={15}
              >
                <Animated.View
                  style={{
                    width: progressWidthInterpolated,
                    height: '100%',
                    backgroundColor: '#2752B7',
                    borderRadius: 15,
                  }}
                />
              </View>
              <Text
                fontSize={14}
                color="#666666"
                textAlign="center"
                fontWeight="600"
              >
                {watchedAds} de {totalAds} anúncios assistidos
              </Text>
            </View>

            {/* Ad Icons */}
            <View
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={30}
              paddingHorizontal={10}
              position="relative"
            >
              {/* Connecting lines - melhoradas para ir de uma bolinha à outra */}
              {Array.from({ length: totalAds - 1 }, (_, index) => {
                const spacing = (Dimensions.get('window').width - 80 - 60) / (totalAds - 1); // Calcular espaçamento dinâmico
                return (
                  <View
                    key={`line-${index}`}
                    position="absolute"
                    left={35 + (index * spacing)}
                    width={spacing - 30}
                    height={3}
                    backgroundColor={index < watchedAds - 1 ? "#4CAF50" : "#E0E0E0"}
                    top={23.5}
                    zIndex={-1}
                    borderRadius={2}
                  />
                );
              })}
              
              {Array.from({ length: totalAds }, (_, index) => renderAdIcon(index))}
            </View>

            {/* Status Message */}
            <View
              backgroundColor={watchedAds === totalAds ? "#E8F5E8" : "#F8F9FA"}
              borderRadius={15}
              padding={15}
              marginBottom={25}
            >
              <Text
                fontSize={16}
                color={watchedAds === totalAds ? "#2E7D32" : "#2752B7"}
                textAlign="center"
                fontWeight="600"
              >
                {watchedAds === totalAds 
                  ? "Parabéns! Itinerário desbloqueado!" 
                  : `Faltam ${totalAds - watchedAds} anúncios para desbloquear`
                }
              </Text>
              {watchedAds === totalAds && (
                <Text
                  fontSize={14}
                  color="#666666"
                  textAlign="center"
                  marginTop={5}
                >
                  Agora você pode criar seu itinerário personalizado
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            <View marginBottom={15}>
              <Button
                backgroundColor={watchedAds === totalAds ? "#4CAF50" : "#2752B7"}
                borderRadius={20}
                height={55}
                onPress={watchedAds === totalAds ? showItineraryCreate : onContinue}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 6 }}
                shadowOpacity={0.3}
                shadowRadius={12}
                elevation={8}
                borderWidth={0}
                overflow="hidden"
              >
                <View
                  backgroundColor="rgba(255, 255, 255, 0.1)"
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  height="50%"
                  borderTopLeftRadius={20}
                  borderTopRightRadius={20}
                />
                <ButtonText
                  color="#FFFFFF"
                  fontSize={17}
                  fontWeight="700"
                  letterSpacing={0.5}
                >
                  {watchedAds === totalAds ? "Criar Itinerário" : "Continuar"}
                </ButtonText>
              </Button>
            </View>

            {/* Premium Button */}
            {onUpgradeToPremium && (
              <Button
                backgroundColor="transparent"
                borderColor="#FFD700"
                borderWidth={2}
                borderRadius={20}
                height={50}
                onPress={onUpgradeToPremium}
                shadowColor="#FFD700"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.2}
                shadowRadius={8}
                elevation={5}
              >
                <View flexDirection="row" alignItems="center">
                  <Crown size={20} color="#FFD700" style={{ marginRight: 8 }} />
                  <ButtonText
                    color="#FFD700"
                    fontSize={15}
                    fontWeight="600"
                  >
                    Upgrade para Premium
                  </ButtonText>
                </View>
              </Button>
            )}

            {/* Close Button */}
            <Button
              position="absolute"
              top={15}
              right={15}
              width={35}
              height={40}
              borderRadius="100%"
              backgroundColor="rgba(0, 0, 0, 0.1)"
              onPress={onClose}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
              elevation={2}
            >
              <X size={18} color="#666666" />
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
