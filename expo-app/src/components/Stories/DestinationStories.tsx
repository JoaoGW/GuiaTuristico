import { useState, useEffect, useRef } from 'react';
import { Modal, StatusBar, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { View, Text, Image, Progress, ProgressFilledTrack } from '@gluestack-ui/themed';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { X, MapPin, DollarSign, Calendar, Thermometer } from 'lucide-react-native';
import CountryFlag from 'react-native-country-flag';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DestinationStoriesProps {
  visible: boolean;
  onClose: () => void;
  destination: {
    id: number;
    title: string;
    countryCode: string;
    country: string;
    imagesUrlCarousel: string[];
    activities: string[];
    attractions: string[];
    averageCost: string;
    bestTimeToVisit: string;
    climate: string;
    temperature: {
      min: number;
      max: number;
    };
  } | null;
}

export function DestinationStories({ visible, onClose, destination }: DestinationStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const STORY_DURATION = 5750;
  const PROGRESS_INTERVAL = 50;

  useEffect(() => {
    if (visible && destination && !isPaused) {
      startStory();
    } else if (isPaused) {
      clearTimers();
    } else {
      resetStory();
    }

    return () => {
      clearTimers();
    };
  }, [visible, currentIndex, isPaused]);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const startStory = () => {
    clearTimers();
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = (PROGRESS_INTERVAL / STORY_DURATION) * 100;
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });
    }, PROGRESS_INTERVAL);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, STORY_DURATION);
  };

  const resetStory = () => {
    clearTimers();
    setCurrentIndex(0);
    setProgress(0);
  };

  const handleNext = () => {
    if (!destination) return;

    if (currentIndex < destination.imagesUrlCarousel.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTapLeft = () => {
    handlePrevious();
  };

  const handleTapRight = () => {
    handleNext();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getStoryContent = (index: number) => {
    const contentTypes = [
      {
        icon: MapPin,
        title: 'Localizações Importantes',
        items: destination?.attractions || [],
        color: '#2752B7',
      },
      {
        icon: Calendar,
        title: 'Melhor Época para Visitar',
        info: destination?.bestTimeToVisit || '',
        color: '#D97706',
      },
      {
        icon: DollarSign,
        title: 'Custo Médio da Viagem',
        info: destination?.averageCost || '',
        color: '#16A34A',
      },
      {
        icon: Thermometer,
        title: 'Clima Comum na Região',
        info: `${destination?.climate} • ${destination?.temperature.min}°C a ${destination?.temperature.max}°C`,
        color: '#0284C7',
      },
    ];

    return contentTypes[index % contentTypes.length];
  };

  if (!destination) return null;

  const isFirstStory = currentIndex === 0;
  const storyContent = getStoryContent(currentIndex);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View flex={1} bg="#000">
        <Image
          source={{ uri: destination.imagesUrlCarousel[currentIndex] }}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: 'absolute',
          }}
          resizeMode="cover"
          alt={destination.title}
        />

        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.3)"
        />

        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          flexDirection="row"
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={handleTapLeft}
            onLongPress={togglePause}
            delayLongPress={300}
          />
          <Pressable
            style={{ flex: 1 }}
            onPress={handleTapRight}
            onLongPress={togglePause}
            delayLongPress={300}
          />
        </View>

        <View flex={1} pt={70} px={15}>
          <View flexDirection="row" gap={4} mb={20}>
            {destination.imagesUrlCarousel.map((_, index) => (
              <View key={index} flex={1} h={3} bg="rgba(255,255,255,0.3)" borderRadius={2}>
                <Progress
                  value={
                    index < currentIndex
                      ? 100
                      : index === currentIndex
                      ? progress
                      : 0
                  }
                  size="xs"
                  bg="transparent"
                >
                  <ProgressFilledTrack bg="#fff" />
                </Progress>
              </View>
            ))}
          </View>

          <View
            position="absolute"
            bottom={40}
            left={15}
            right={15}
          >
            <View mb={20}>
              <View flexDirection="row" alignItems="center" mb={15}>
                <Text color="#fff" fontSize="$2xl" fontWeight="$bold" mr={10}>
                  {destination.title}
                </Text>
                <CountryFlag isoCode={destination.countryCode} size={30} />
              </View>

              {isFirstStory ? (
                <View>
                  <Text color="#fff" fontSize="$md" fontWeight="$semibold" mb={8}>
                    Atividades:
                  </Text>
                  <View flexDirection="row" flexWrap="wrap" gap={8}>
                    {destination.activities.map((activity, index) => (
                      <View
                        key={index}
                        bg="rgba(255,255,255,0.2)"
                        px={12}
                        py={6}
                        borderRadius={20}
                        borderWidth={1}
                        borderColor="rgba(255,255,255,0.3)"
                      >
                        <Text color="#fff" fontSize="$sm" fontWeight="$medium">
                          {activity}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View>
                  <View
                    bg={`${storyContent.color}20`}
                    borderRadius={16}
                    p={16}
                    borderWidth={1}
                    borderColor={`${storyContent.color}50`}
                  >
                    <View flexDirection="row" alignItems="center" mb={12}>
                      {storyContent.icon && (
                        <View
                          bg={storyContent.color}
                          p={8}
                          borderRadius={12}
                          mr={12}
                        >
                          <storyContent.icon size={20} color="#fff" />
                        </View>
                      )}
                      <Text color="#fff" fontSize="$lg" fontWeight="$bold">
                        {storyContent.title}
                      </Text>
                    </View>
                    
                    {storyContent.info ? (
                      <Text color="#fff" fontSize="$md" fontWeight="$semibold">
                        {storyContent.info}
                      </Text>
                    ) : storyContent.items && storyContent.items.length > 0 ? (
                      <View flexDirection="row" flexWrap="wrap" gap={8}>
                        {storyContent.items.map((item, idx) => (
                          <View
                            key={idx}
                            bg="rgba(255,255,255,0.2)"
                            px={12}
                            py={6}
                            borderRadius={16}
                            borderWidth={1}
                            borderColor="rgba(255,255,255,0.3)"
                          >
                            <Text color="#fff" fontSize="$sm" fontWeight="$medium">
                              {item}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 95,
              right: 15,
              zIndex: 10,
            }}
          >
            {isLiquidGlassAvailable() ? (
              <GlassView
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                glassEffectStyle="clear"
              >
                <X size={24} color="#fff" />
              </GlassView>
            ) : (
              <View
                bg="rgba(0,0,0,0.5)"
                w={40}
                h={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
              >
                <X size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
