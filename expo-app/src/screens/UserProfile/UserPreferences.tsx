import { useEffect, useRef, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';

import { Box, View, ButtonGroup, Button, ButtonText, Text, Spinner, Image } from "@gluestack-ui/themed";

import { useNavigation, useRoute, RouteProp, useNavigationState } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';
import { SafeAreaView } from "react-native-safe-area-context";

import { UserPreferencesTags } from "@components/Register/Tags";
import AnimatedStar from '@components/AnimatedStar';

import { loadTags } from '@utils/tagsLoader';
import { utilsSetSelectedTags, utilsGetSelectedTags } from '@utils/selectedTagsStore';

import { CreatingItinerary } from "../../../@types/CreatingItinerary";

import FelipeMascotItinerary from "@assets/Mascot/Felipe_Mascot_Itinerary_Features.svg";

interface Tags {
  id: number;
  name: string;
  image: any;
}

export function UserPreferences() {
  const [tags, setTags] = useState<Tags[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Só controla quando todas as imagens terminaram de carregar; não é exibido.
  const loadedImageIds = useRef(new Set<number>());

  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<RouteProp<{ params: CreatingItinerary | undefined }, 'params'>>();
  const itineraryData = route.params;

  const previousRouteName = useNavigationState((state) => {
    const routes = state.routes;
    const index = state.index;
    if (index > 0) {
      return routes[index - 1].name;
    }
    return null;
  });

  useEffect(() => {
    const fetchData = async () => {
      const loadedTags = await loadTags();
      setTags(loadedTags);

      const previouslySelected = utilsGetSelectedTags();
      setSelectedTags(previouslySelected || []);
    };

    fetchData();
  }, []);

  const handleImageLoaded = (id: number) => {
    if (loadedImageIds.current.has(id)) return;
    loadedImageIds.current.add(id);

    if (loadedImageIds.current.size === tags.length) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const toggleTagSelection = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(name => name !== tagName)
        : [...prev, tagName]
    );
  };

  // Não vai exibir a página até o loading terminar
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#2752B7' }}>
        <StatusBar barStyle="light-content" backgroundColor="#2752B7" />
        <View flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="white" />
          <Text fontSize="$xl" fontWeight="$bold" color="$white" mt={10}>Agradecemos pelas informações!</Text>
          <Text color="$white" mt={5}>Aguarde enquanto processamos todos os dados...</Text>

          <View position="absolute" opacity={0} pointerEvents="none">
            {tags.map((tag) => (
              <Image
                key={tag.id}
                source={tag.image}
                onLoadEnd={() => handleImageLoaded(tag.id)}
                onError={() => handleImageLoaded(tag.id)}
                w={1}
                h={1}
                alt=""
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2752B7' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2752B7" />
      <View flexDirection="column" alignItems="center" mt={10} mb={20}>
        <View justifyContent="center" alignItems="center" style={{ width: 260, height: 260 }}>
          <AnimatedStar size={18} style={{ position: 'absolute', top: 10, left: 20, zIndex: 2 }} delay={0} duration={1400} />
          <AnimatedStar size={18} style={{ position: 'absolute', top: 60, left: 0, zIndex: 2 }} delay={700} duration={1400} />
          <AnimatedStar size={18} style={{ position: 'absolute', top: 55, right: 0, zIndex: 2 }} delay={700} duration={1400} />
          <AnimatedStar size={22} style={{ position: 'absolute', top: 20, right: 30, zIndex: 2 }} delay={100} duration={1400} />
          <AnimatedStar size={16} style={{ position: 'absolute', bottom: 20, left: 30, zIndex: 2 }} delay={600} duration={1400} />
          <AnimatedStar size={20} style={{ position: 'absolute', bottom: 10, right: 40, zIndex: 2 }} delay={900} duration={1400} />
          <AnimatedStar size={14} style={{ position: 'absolute', top: 120, left: 0, zIndex: 2 }} delay={1200} duration={1400} />
          <AnimatedStar size={15} style={{ position: 'absolute', top: 120, right: 0, zIndex: 2 }} delay={1500} duration={1400} />
          <AnimatedStar size={13} style={{ position: 'absolute', bottom: 60, right: 10, zIndex: 2 }} delay={1800} duration={1400} />
          <AnimatedStar size={17} style={{ position: 'absolute', bottom: 60, left: 10, zIndex: 2 }} delay={2100} duration={1400} />
          <View 
            position="absolute"
            width={260}
            height={260}
            bgColor='rgba(37, 99, 235, 0.5)'
            borderRadius={100}
            shadowColor="#2563eb"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={1}
            shadowRadius={20}
            elevation={10}
            zIndex={1}
          />
          <FelipeMascotItinerary width={250} height={250} style={{ zIndex: 2 }} />
        </View>
        <Text mt={15} fontWeight="$bold" fontSize="$xl" textAlign="center" color="white">
          Quais tópicos você está interessado?
        </Text>
      </View>
      
      <View flex={1} px="$2">
        <FlatList
          data={tags}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Box flex={1} px={4} py={4}>
              <UserPreferencesTags
                item={item}
                isSelected={selectedTags.includes(item.name)}
                onToggle={() => toggleTagSelection(item.name)}
              />
            </Box>
          )}
          ListFooterComponent={
            <View mt={20} flexDirection="row" justifyContent="center" mx={15}>
              <ButtonGroup width="100%" flexDirection='row' justifyContent='space-between' gap={16}>
                <Button
                  onPress={() => navigation.goBack()}
                  w="48%"
                  bgColor="#ff4d4f"
                  borderRadius={16}
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.2}
                  shadowRadius={4}
                  elevation={3}
                  $active-opacity={0.7}              
                >
                  <ButtonText color="#fff" fontWeight="$bold" fontSize={16}>Voltar</ButtonText>
                </Button>
                <Button
                  onPress={() => {
                    utilsSetSelectedTags(selectedTags);
                    if (previousRouteName === "Profile") {
                      navigation.navigate("Profile");
                    } else if (!itineraryData) {
                      // Aberto pelo menu (sem roteiro em criação): apenas salva as preferências.
                      navigation.goBack();
                    } else if (itineraryData.isSurpriseMode) {
                      // Modo Surpresa: pular checagem de visto e ir direto para o mapa
                      navigation.navigate("ItineraryMapMenu", { 
                        itineraryData: itineraryData, 
                        userPreferences: utilsGetSelectedTags(),
                        visaIssue: "Unknown" // Sem checagem de visto no modo surpresa
                      });
                    } else {
                      navigation.navigate("ItineraryVisaCheck", { itineraryData: itineraryData, userPreferences: utilsGetSelectedTags() });
                    }
                  }}
                  w="48%"
                  bgColor="#fff"
                  borderRadius={16}
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.2}
                  shadowRadius={4}
                  elevation={3}
                  $active-opacity={0.7}
                  borderWidth={2}
                  borderColor="#2752B7"              
                >
                  <ButtonText color="#2752B7" fontWeight="$bold" fontSize={16}>Finalizar</ButtonText>
                </Button>
              </ButtonGroup>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
