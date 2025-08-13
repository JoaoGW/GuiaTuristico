import { useContext, useEffect, useState } from "react";

import { SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  interpolate,
  Easing 
} from 'react-native-reanimated';

import { Text, View, Pressable, Button, ButtonIcon, AvatarBadge } from "@gluestack-ui/themed";

import { ConnectionErrorAlerter } from "@components/Errors/ConnectionErrorAlerter";

import { ArrowLeft, Mic, MicOff, Volume2, VolumeX } from "lucide-react-native";

import { useVoiceChat } from "../../hooks/useVoiceChat";

import { NetInfoContext } from "@contexts/NetInfo";

import { AuthNavigationProp } from "@routes/auth.routes";

import FelipeProfilePicture from '@assets/Mascot/Felipe_Mascot_ProfilePic.svg';

export function AIVoiceChat(){
  const [showModal, setShowModal] = useState<boolean>(true);
  
  const { isConnected } = useContext(NetInfoContext);
  
  // Usar o hook personalizado de voz
  const {
    voiceState,
    messages,
    toggleRecording,
    stopSpeaking,
    repeatMessage,
    respondWithAI,
    clearMessages,
    canRecord,
  } = useVoiceChat();

  // Animações das bolhas (mantidas do código original)
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const innerScale = useSharedValue(0.8);
  const glowScale = useSharedValue(1);
  const bubbleFloat1 = useSharedValue(0);
  const bubbleFloat2 = useSharedValue(0);
  const bubbleFloat3 = useSharedValue(0);
  const bubbleFloat4 = useSharedValue(0);
  const bubbleFloat5 = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Lidar com toggle de gravação (agora com resposta automática integrada)
  const handleToggleRecording = async () => {
    await toggleRecording();
    // A resposta agora é gerada automaticamente no hook
  };

  // Animações das bolhas (mantidas do código original)
  useEffect(() => {
    // Animar quando:
    // 1. Estiver gravando OU
    // 2. For a primeira interação (sem mensagens) OU
    // 3. Não houver transcrição ainda
    if (voiceState.isRecording || messages.length === 0) {
      // Animações principais quando gravando ou primeira interação
      scale.value = withRepeat(
        withTiming(1.08, {
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );

      rotation.value = withRepeat(
        withTiming(360, {
          duration: 12000,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      innerScale.value = withRepeat(
        withTiming(1.15, {
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      glowScale.value = withRepeat(
        withTiming(1.3, {
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );

      // Animações das bolhas flutuantes
      bubbleFloat1.value = withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      bubbleFloat2.value = withRepeat(
        withTiming(1, {
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      bubbleFloat3.value = withRepeat(
        withTiming(1, {
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      bubbleFloat4.value = withRepeat(
        withTiming(1, {
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      bubbleFloat5.value = withRepeat(
        withTiming(1, {
          duration: 2700,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      buttonScale.value = withRepeat(
        withTiming(1.1, {
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );
    } else {
      // Parar todas as animações quando não estiver gravando E já houve interação
      scale.value = withTiming(1);
      rotation.value = withTiming(0);
      innerScale.value = withTiming(0.8);
      glowScale.value = withTiming(1);
      bubbleFloat1.value = withTiming(0);
      bubbleFloat2.value = withTiming(0);
      bubbleFloat3.value = withTiming(0);
      bubbleFloat4.value = withTiming(0);
      bubbleFloat5.value = withTiming(0);
      buttonScale.value = withTiming(1);
    }
  }, [voiceState.isRecording, messages.length]);

  // Claude Sonnet 3.5: Animated style for outer bubble
  const animatedOuterStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  // Claude Sonnet 3.5: Animated style for glow/brightness
  const animatedGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glowScale.value, [1, 1.3], [0.15, 0.4]);
    return {
      transform: [{ scale: glowScale.value }],
      opacity: opacity,
    };
  });

  // Claude Sonnet 3.5: Animated style for inner bubble
  const animatedInnerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(innerScale.value, [0.8, 1.15], [0.4, 0.8]);
    return {
      transform: [{ scale: innerScale.value }],
      opacity: opacity,
    };
  });

  // Claude Sonnet 3.5: Animated style for recording button
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  // Claude Sonnet 3.5: Styles for small colored bubbles
  const animatedSmallBubble1 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, 30]);
    const translateY = interpolate(rotation.value, [0, 360], [0, -25]);
    const floatY = interpolate(bubbleFloat1.value, [0, 1], [-10, 10]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.35 }
      ],
    };
  });

  const animatedSmallBubble2 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, -35]);
    const translateY = interpolate(rotation.value, [0, 360], [0, 15]);
    const floatY = interpolate(bubbleFloat2.value, [0, 1], [-8, 12]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.4 }
      ],
    };
  });

  const animatedSmallBubble3 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, 20]);
    const translateY = interpolate(rotation.value, [0, 360], [0, 35]);
    const floatY = interpolate(bubbleFloat3.value, [0, 1], [-12, 8]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.3 }
      ],
    };
  });

  const animatedSmallBubble4 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, -15]);
    const translateY = interpolate(rotation.value, [0, 360], [0, -30]);
    const floatY = interpolate(bubbleFloat4.value, [0, 1], [-15, 5]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.28 }
      ],
    };
  });

  const animatedSmallBubble5 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, 40]);
    const translateY = interpolate(rotation.value, [0, 360], [0, -10]);
    const floatY = interpolate(bubbleFloat5.value, [0, 1], [-6, 14]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.32 }
      ],
    };
  });

  const animatedSmallBubble6 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, -25]);
    const translateY = interpolate(rotation.value, [0, 360], [0, -40]);
    const floatY = interpolate(bubbleFloat1.value, [0, 1], [-8, 10]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.26 }
      ],
    };
  });

  const animatedSmallBubble7 = useAnimatedStyle(() => {
    const translateX = interpolate(rotation.value, [0, 360], [0, 10]);
    const translateY = interpolate(rotation.value, [0, 360], [0, -45]);
    const floatY = interpolate(bubbleFloat2.value, [0, 1], [-12, 6]);
    return {
      transform: [
        { translateX },
        { translateY: translateY + floatY },
        { scale: scale.value * 0.24 }
      ],
    };
  });

  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content"/>
      <View flexDirection="column" alignContent="center">
        <View flexDirection="row" justifyContent="space-between" w="100%" alignItems="center" mr={15} px={20} mb={15}>
          <Button bgColor="transparent" onPress={ () => navigation.goBack() }>
            <ButtonIcon as={ArrowLeft} color="$black" size="xl" ml={-20} />
          </Button>
          <View flexDirection="column" alignItems="center" ml={8}>
            <Text fontSize="$lg" fontWeight="$bold">Felipe</Text>
            <View flexDirection="row">
              <Text pr={25}>Online</Text>
              <AvatarBadge />
            </View>
          </View>
          <View
            position="relative"
            justifyContent="center"
            alignItems="center"
          >
            <View
              position="absolute"
              width={55}
              height={55}
              borderRadius={27.5}
              borderWidth={2}
              borderColor="#2752B7"
              top={0}
              left={0}
              right={0}
              bottom={0}
              margin="auto"
            />
            <FelipeProfilePicture height={55} width={55} style={{ marginRight: -10 }} />
          </View>
        </View>
        
        {/* Status da conversa */}
        <Text 
          textAlign="center" 
          fontSize="$lg" 
          fontWeight="$semibold"
          maxWidth="85%"
          margin="auto"
        > 
        { voiceState.isRecording 
          ? "Pode falar, estou escutando... (máx. 15 segundos)" 
          : voiceState.isTranscribing 
          ? "Processando sua mensagem..."
          : voiceState.isSpeaking
          ? "Felipe está falando..."
          : "Toque no botão para conversar com Felipe (até 15s por mensagem)"
        }
        </Text>
        
        {/* Exibir mensagens da conversa quando não estiver gravando e houver mensagens */}
        {!voiceState.isRecording && messages.length > 0 && (
          <ScrollView 
            style={{ maxHeight: 400, marginTop: 20 }} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
          >
            {messages.map((message, index) => (
              <View 
                key={message.id}
                margin="$2" 
                marginHorizontal="$2"
                width="100%"
                maxWidth="100%"
                alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
              >
                {/* Layout para mensagens do Felipe com foto */}
                {message.type === 'assistant' && (
                  <View flexDirection="row" alignItems="flex-start" gap="$2" mb="$2" width="100%">
                    <View
                      width={35}
                      height={35}
                      borderRadius={17.5}
                      borderWidth={1.5}
                      borderColor="#2752B7"
                      justifyContent="center"
                      alignItems="center"
                      backgroundColor="white"
                      mt="$1"
                      flexShrink={0}
                    >
                      <FelipeProfilePicture height={30} width={30} />
                    </View>
                    <View flex={1} minWidth={0}>
                      <View
                        backgroundColor="#FFFFFF" 
                        padding="$4" 
                        borderRadius="$2xl"
                        borderWidth={1}
                        borderColor="$gray200"
                        shadowColor="$black"
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.1}
                        shadowRadius={4}
                        elevation={3}
                        width="100%"
                      >
                        <Text 
                          fontSize="$md" 
                          color="$gray900"
                          lineHeight="$lg"
                          flexWrap="wrap"
                        >
                          {message.text}
                        </Text>
                      </View>
                      
                      {!voiceState.isSpeaking && (
                        <View flexDirection="row" justifyContent="flex-start" mt="$2" width="100%">
                          <Pressable
                            onPress={() => repeatMessage(message.text)}
                            backgroundColor="#F3F4F6"
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$full"
                            flexDirection="row"
                            alignItems="center"
                            gap="$2"
                            shadowColor="$black"
                            shadowOffset={{ width: 0, height: 1 }}
                            shadowOpacity={0.1}
                            shadowRadius={2}
                            elevation={2}
                            flexShrink={0}
                          >
                            <Volume2 size={14} color="#2752B7" />
                            <Text fontSize="$sm" color="$gray700" fontWeight="$medium">
                              Ouvir novamente
                            </Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Layout para mensagens do usuário */}
                {message.type === 'user' && (
                  <View
                    backgroundColor="#2752B7" 
                    padding="$4" 
                    borderRadius="$2xl"
                    shadowColor="$black"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={4}
                    elevation={3}
                    maxWidth="85%"
                    alignSelf="flex-end"
                  >
                    <Text 
                      fontSize="$md" 
                      color="$white"
                      lineHeight="$lg"
                    >
                      {message.text}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
        
        {/* Exibir erros */}
        {voiceState.error && (
          <View 
            backgroundColor="$red50" 
            padding="$4" 
            margin="$4" 
            borderRadius="$lg"
            borderWidth={1}
            borderColor="$red200"
          >
            <Text fontSize="$sm" color="$red800">
              {voiceState.error}
            </Text>
          </View>
        )}

        {/* Controles adicionais */}
        <View flexDirection="row" justifyContent="center" gap="$3" padding="$4">
          {voiceState.isSpeaking && (
            <Pressable
              onPress={stopSpeaking}
              backgroundColor="#FF6B47"
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderRadius="$full"
              flexDirection="row"
              alignItems="center"
              gap="$2"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.15}
              shadowRadius={4}
              elevation={4}
            >
              <VolumeX size={16} color="white" />
              <Text color="white" fontSize="$sm" fontWeight="$medium">Parar áudio</Text>
            </Pressable>
          )}
          
          {messages.length > 0 && (
            <Pressable
              onPress={clearMessages}
              backgroundColor="#64748B"
              paddingHorizontal="$4"
              paddingVertical="$3"
              borderRadius="$full"
              flexDirection="row"
              alignItems="center"
              gap="$2"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.15}
              shadowRadius={4}
              elevation={4}
            >
              <Text color="white" fontSize="$sm" fontWeight="$medium">Limpar conversa</Text>
            </Pressable>
          )}
        </View>
      </View>
      
      <View flex={1} justifyContent="center" alignItems="center" position="relative">
        {/* Mostrar bolhas quando gravando ou primeira interação */}
        {(voiceState.isRecording || messages.length === 0) && (
          <>
            {/* Claude Sonnet 3.5: Small colored decorative bubbles */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#4AA9FF',
                  top: '20%',
                  left: '20%',
                  shadowColor: '#4AA9FF',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 5,
                },
                animatedSmallBubble1,
              ]}
            />
            
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 35,
                  height: 35,
                  borderRadius: 17.5,
                  backgroundColor: '#FF6B6B',
                  top: '25%',
                  right: '15%',
                  shadowColor: '#FF6B6B',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 5,
                },
                animatedSmallBubble2,
              ]}
            />
            
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#4ECDC4',
                  bottom: '30%',
                  left: '25%',
                  shadowColor: '#4ECDC4',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 5,
                },
                animatedSmallBubble3,
              ]}
            />

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#A8E6CF',
                  top: '18%',
                  left: '15%',
                  shadowColor: '#A8E6CF',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 6,
                  elevation: 4,
                },
                animatedSmallBubble4,
              ]}
            />

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#FFB347',
                  top: '30%',
                  right: '25%',
                  shadowColor: '#FFB347',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                  elevation: 5,
                },
                animatedSmallBubble5,
              ]}
            />

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#DDA0DD',
                  top: '12%',
                  left: '35%',
                  shadowColor: '#DDA0DD',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 6,
                  elevation: 4,
                },
                animatedSmallBubble6,
              ]}
            />

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#87CEEB',
                  top: '10%',
                  right: '30%',
                  shadowColor: '#87CEEB',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 6,
                  elevation: 4,
                },
                animatedSmallBubble7,
              ]}
            />

            {/* Claude Sonnet 3.5: Glow/brightness around main bubble */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 240,
                  height: 240,
                  borderRadius: 120,
                  backgroundColor: '#E9AD2D',
                },
                animatedGlowStyle,
              ]}
            />
          </>
        )}

        {/* Mostrar a bolha principal sempre que necessário */}
        {(voiceState.isRecording || messages.length === 0) && (
          <Animated.View
            style={[
              {
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: '#E9AD2D',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#E9AD2D',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 25,
                elevation: 15,
                borderWidth: 2,
                borderColor: '#F2D16E',
              },
              animatedOuterStyle,
            ]}
          >
            {/* Claude Sonnet 3.5: Top glass reflection */}
            <View
              position="absolute"
              top={12}
              left={12}
              width={60}
              height={30}
              backgroundColor="#ffffff"
              opacity={0.4}
              borderRadius={30}
              transform={[{ rotate: '-30deg' }]}
            />
            
            {/* Claude Sonnet 3.5: Smaller glass reflection */}
            <View
              position="absolute"
              top={28}
              right={20}
              width={25}
              height={12}
              backgroundColor="#ffffff"
              opacity={0.3}
              borderRadius={12}
              transform={[{ rotate: '45deg' }]}
            />

            {/* Claude Sonnet 3.5: Inner bubble with simulated gradient */}
            <Animated.View
              style={[
                {
                  width: 130,
                  height: 130,
                  borderRadius: 65,
                  backgroundColor: '#F2D16E',
                  opacity: 0.7,
                },
                animatedInnerStyle,
              ]}
            />
            
            {/* Claude Sonnet 3.5: Center of the bubble */}
            <View
              position="absolute"
              width={70}
              height={70}
              borderRadius={35}
              backgroundColor="#FFEAA7"
              justifyContent="center"
              alignItems="center"
              shadowColor="#E9AD2D"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={10}
              elevation={8}
            >
              <View
                width={40}
                height={40}
                borderRadius={20}
                backgroundColor="#ffffff"
                opacity={0.9}
                shadowColor="#ffffff"
                shadowOffset={{ width: 0, height: 0 }}
                shadowOpacity={0.8}
                shadowRadius={15}
                elevation={5}
              />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Botão de controle de gravação */}
      <View paddingBottom={40} paddingHorizontal={20} alignItems="center">
        <Animated.View style={animatedButtonStyle}>
          <Pressable
            onPress={handleToggleRecording}
            disabled={!canRecord}
            width={80}
            height={80}
            borderRadius={40}
            backgroundColor={
              !canRecord 
                ? "#CCCCCC" 
                : voiceState.isRecording 
                ? "#FF4444" 
                : "#888888"
            }
            justifyContent="center"
            alignItems="center"
            shadowColor={
              !canRecord 
                ? "#CCCCCC" 
                : voiceState.isRecording 
                ? "#FF4444" 
                : "#888888"
            }
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={10}
            elevation={8}
            opacity={!canRecord ? 0.5 : 1}
          >
            { voiceState.isRecording ? (
              <Mic color="white" size={35} />
            ) : (
              <MicOff color="white" size={35} />
            )}
          </Pressable>
        </Animated.View>
        <Text 
          textAlign="center" 
          fontSize="$sm" 
          color="$gray600"
          mt={10}
        >
          { !canRecord 
            ? "Aguarde..."
            : voiceState.isRecording 
            ? "Toque para parar" 
            : "Toque para começar a falar"
          }
        </Text>
      </View>

      {
        !isConnected &&
        <ConnectionErrorAlerter showModal={showModal} setShowModal={setShowModal} />
      }
    </SafeAreaView>
  )
}