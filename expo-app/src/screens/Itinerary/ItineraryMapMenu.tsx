import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Image, Alert, Platform } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from 'expo-constants';

import { Button, ButtonText, View, Text, ButtonIcon, ScrollView } from "@gluestack-ui/themed";

import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';

import { Maps } from "@components/Maps/Maps";
import { SlideUpItinerary } from "@components/Sliders/SlideUpItinerary";
import { ChooseBackgroundDialog } from "@components/Dialogs/ChooseBackgroundDialog";
import { SaveItineraryDialog } from "@components/Dialogs/SaveItineraryDialog";

import { generateItinerary } from '@utils/gptRequests';
import { useNotificationStore } from '@utils/notificationStore';
import { filterItineraryData, filterUserPreferences } from '@utils/dataFilters';


import { AuthNavigationProp } from "@routes/auth.routes";

import { CreatingItinerary } from "../../../@types/CreatingItinerary";
import { CategoriesCounterTypes } from "../../../@types/CategoriesCounterTypes";

import DefaultStatsBackground from "@assets/background.webp";

import { Bed, ChevronLeft, Compass, FileDown, Globe, Landmark, Palette, PartyPopper, Plane, ShoppingBag, TreePine, UtensilsCrossed } from 'lucide-react-native';

import { exportItineraryToPDF } from './html/printExportItinerary';

let RewardedAd: any, RewardedAdEventType: any, TestIds: any;
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    const admobModule = require('react-native-google-mobile-ads');
    RewardedAd = admobModule.RewardedAd;
    RewardedAdEventType = admobModule.RewardedAdEventType;
    TestIds = admobModule.TestIds;
  } catch (error) {
    console.log('AdMob module not available:', error);
  }
}

type ShowMapStatsInformationType = {
  show: "Map" | "Stats"
}

export function ItineraryMapMenu() {
  const route = useRoute<RouteProp<{ params: { itineraryData: CreatingItinerary, userPreferences: string[], visaIssue: any } }, 'params'>>();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any[]>(() => {
    const existingItinerary = route.params?.itineraryData?.itinerary;
    return Array.isArray(existingItinerary) && existingItinerary.length > 0 ? existingItinerary : [];
  });
  const [isExporting, setIsExporting] = useState(false);
  const [hideBackButton, setHideBackButton] = useState<boolean>(false);
  const [showMapStatsInformation, setShowMapStatsInformation] = useState<ShowMapStatsInformationType["show"]>("Map");
  const [firstLatitude, setFirstLatitude] = useState<number>();
  const [firstLongitude, setFirstLongitude] = useState<number>();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [openChooseBackground, setOpenChooseBackground] = useState<boolean>(false);
  const [imageBackground, setImageBackground] = useState<string>("");
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [isNewItinerary, setIsNewItinerary] = useState<boolean>(false);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [categoriesCounter, setCategoriesCounter] = useState<CategoriesCounterTypes>({
    touristAttractions: 0,
    restaurant: 0,
    accomodation: 0,
    nightLife: 0,
    parks: 0,
    shopping: 0,
    culture: 0,
    travel: 0
  });

  const categoriesOptions = ["Ponto Turístico", "Gastronomia", "Hospedagem", "Vida Noturna", "Parques", "Shopping", "Cultura", "Viagens"]

  const navigation = useNavigation<AuthNavigationProp>();

  const addNotification = useNotificationStore(state => state.addNotification);

  const mapUserPositionRef = useRef<MapView | null>(null);
  const rewardedRef = useRef<any>(null);

  const ITINERARY_STORAGE_KEY = '@eztripai_allUserTripItineraries';
  const BACKGROUND_STORAGE_KEY = '@eztripai_statsBackground';

  const getCorrectIdForPlatform = () => {
    if(Platform.OS === "android"){
      return process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID;
    }
    return process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID;
  };

  // Sem módulo de anúncios, `rewardedRef` fica vazio e a exportação segue sem anúncio.
  const loadAd = () => {
    if (isExpoGo || !RewardedAd || !RewardedAdEventType || !TestIds) {
      return;
    }

    try {
      const adUnitId = __DEV__ ? TestIds.REWARDED : getCorrectIdForPlatform();
      const newRewarded = RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['travel', 'tourism', 'vacation'],
      });

      rewardedRef.current = newRewarded;

      const unsubscribeLoaded = newRewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setAdLoaded(true);
        },
      );

      newRewarded.load();

      return () => {
        unsubscribeLoaded();
      };
    } catch (error) {
      console.log('Error loading ad:', error);
      rewardedRef.current = null;
    }
  };

  // Detectar se é um roteiro novo ou já existente (somente ao montar)
  const checkIfNewItinerary = useEffectEvent(async () => {
    try {
      // Primeiro, verifica se tem a flag isNew nos params
      if (route.params.itineraryData.isNew === true) {
        setIsNewItinerary(true);
        return;
      }

      const savedItineraries = await AsyncStorage.getItem(ITINERARY_STORAGE_KEY);
      if (savedItineraries) {
        const itineraries: CreatingItinerary[] = JSON.parse(savedItineraries);
        const exists = itineraries.some(item => 
          item.title === filteredItineraryData.title &&
          item.dateBegin === route.params.itineraryData.dateBegin
        );
        setIsNewItinerary(!exists);
      } else {
        setIsNewItinerary(true);
      }
    } catch (error) {
      console.error('Erro ao verificar itinerário:', error);
      setIsNewItinerary(false);
    }
  });

  useEffect(() => {
    const start = async () => {
      await checkIfNewItinerary();
    };
    start();
  }, []);

  // Função para salvar alterações em um roteiro existente
  const saveExistingItinerary = async () => {
    try {
      const savedItineraries = await AsyncStorage.getItem(ITINERARY_STORAGE_KEY);
      if (savedItineraries) {
        const itineraries: CreatingItinerary[] = JSON.parse(savedItineraries);
        const index = itineraries.findIndex(item => 
          item.title === filteredItineraryData.title &&
          new Date(item.dateBegin).getTime() === new Date(route.params.itineraryData.dateBegin).getTime()
        );

        if (index !== -1) {
          // Atualizar o roteiro existente com os dados atuais
          const currentItinerary = itinerary.length > 0 ? itinerary : route.params.itineraryData.itinerary;
          
          itineraries[index] = {
            ...itineraries[index],
            itinerary: currentItinerary,
            visitPreferences: filteredUserPreferences,
            contacts: filteredItineraryData.contacts
          };

          await AsyncStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(itineraries));
          // DEBUG: console.log('Alterações salvas com sucesso');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar alterações do itinerário:', error);
    }
  };

  // Função para salvar um novo roteiro
  const saveNewItinerary = async (status: "Planejado" | "Rascunho", coverImage?: string) => {
    try {
      const savedItineraries = await AsyncStorage.getItem(ITINERARY_STORAGE_KEY);
      const itineraries: CreatingItinerary[] = savedItineraries ? JSON.parse(savedItineraries) : [];

      const newTrip: CreatingItinerary = {
        title: filteredItineraryData.title,
        dateBegin: route.params.itineraryData.dateBegin,
        dateEnd: route.params.itineraryData.dateEnd,
        days: filteredItineraryData.days,
        continent: filteredItineraryData.continent,
        countries: filteredItineraryData.countries,
        originCountry: filteredItineraryData.originCountry,
        visa: filteredItineraryData.visa,
        budget: filteredItineraryData.budget,
        peopleQuantity: filteredItineraryData.peopleQuantity,
        acconpanying: filteredItineraryData.acconpanying,
        tripStyle: filteredItineraryData.tripStyle,
        locomotionMethod: filteredItineraryData.locomotionMethod,
        specialWish: filteredItineraryData.specialWish,
        visitPreferences: filteredUserPreferences,
        contacts: filteredItineraryData.contacts,
        itinerary: itinerary.length > 0 ? itinerary : route.params.itineraryData.itinerary,
        status: status,
        coverImage: coverImage,
        isNew: false
      };

      itineraries.push(newTrip);
      await AsyncStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(itineraries));
      
      addNotification({
        title: "Roteiro Salvo",
        description: `Seu roteiro foi salvo como ${status}`,
        routeIcon: Globe
      });
    } catch (error) {
      console.error('Erro ao salvar novo itinerário:', error);
    }
  };

  // Função para lidar com o botão de voltar
  const handleBackPress = () => {
    const currentItinerary = itinerary.length > 0 ? itinerary : route.params.itineraryData.itinerary;
    const hasItinerary = currentItinerary && (Array.isArray(currentItinerary) ? currentItinerary.length > 0 : Object.keys(currentItinerary).length > 0);
    
    if (!hasItinerary) {
      navigation.navigate("GenerateItineraryMenu");
      return;
    }

    if (isNewItinerary) {
      // Mostrar modal de salvamento para novo itinerário
      setOpenSaveDialog(true);
    } else {
      // Salvar automaticamente e navegar de volta
      saveExistingItinerary().then(() => {
        navigation.navigate("GenerateItineraryMenu");
      });
    }
  };

  // Carregar background salvo ao iniciar
  useEffect(() => {
    const loadSavedBackground = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem(BACKGROUND_STORAGE_KEY);
        if (savedBackground) {
          setImageBackground(savedBackground);
        }
      } catch (error) {
        console.error('Erro ao carregar background salvo:', error);
      }
    };

    loadSavedBackground();
  }, []);

  // Carregar anúncio ao montar o componente
  const onMount = useEffectEvent(() => {
    loadAd();
  });

  useEffect(() => {
    onMount();
  }, []);

  // Aplicando filtros aos dados recebidos
  const filteredItineraryData = filterItineraryData(route.params.itineraryData);
  const filteredUserPreferences = filterUserPreferences(route.params.userPreferences || []);

  const {
    dateBegin, 
    dateEnd,
    days, 
    continent, 
    countries,
    originCountry,
    budget, 
    peopleQuantity, 
    acconpanying, 
    tripStyle, 
    locomotionMethod,
    specialWish
  } = filteredItineraryData;

  // Preparando lista de países se não for o Modo Surpresa e também estilo de viagem e os métodos de locomoção que serão utilizados
  const allCountriesTogether = countries && countries.length > 0
    ? countries.map((country: string) => country + ", ").join("")
    : "";
  const allTripStylesTogether = tripStyle && tripStyle.length > 0
    ? tripStyle.map((style: string) => style + " e ").join("")
    : "";
  const allVehicleTypesTogether = locomotionMethod && locomotionMethod.length > 0
    ? locomotionMethod.map((method: string) => method + ", ").join("")
    : "";

  // Texto final do "Preparando os parâmetros inseridos pelo usuário"
  const preferencesAllDefinedText = `Início da viagem em ${ dateBegin } e o fim em ${ dateEnd }, possuindo ${ days } dias de viagem.
  Iremos para ${ continent } e aos países ${ allCountriesTogether } (Não acrescente outros locais). Somos ${ acconpanying } com ${ peopleQuantity } pessoas e
  de ${ originCountry }. Temos um orçamento de ${ budget }. Viagem com foco em ${ allTripStylesTogether }, utilizaremos ${ allVehicleTypesTogether }
  e temos um desejo para a viagem: ${ specialWish }. Gostamos de ${ filteredUserPreferences?.join(', ') }.`;

  const preferencesSurpriseDestinationText = `Início da viagem em ${ dateBegin } e o fim em ${ dateEnd }, possuindo ${ days } dias de viagem.
  Somos ${ acconpanying } com ${ peopleQuantity } pessoas e de ${ originCountry }. Temos um orçamento de ${ budget }. Viagem com foco 
  em ${ allTripStylesTogether }, utilizaremos ${ allVehicleTypesTogether } e temos um desejo para a viagem: ${ specialWish }. 
  Gostamos de ${ filteredUserPreferences?.join(', ') }.`;

  const answerPattern = `DAY-> Número do dia; DATE-> YYYY-MM-DD; LOCATION-> Cidade, País; 
  TIMELINE-> { TIME-> HH:MM; TITLE-> Descrição da atividade; DESCRIPTION-> Detalhes adicionais
  COORDINATES-> xx.xxxxx e yy.yyyyy; CATEGORY-> String vazia; };
  SUGGESTEDACTIVITIES->[Atividade extra recomendada 1, Atividade extra recomendada 2];
  PIXABAYTAGS->Tags relevantes para encontrar uma imgaem na API do Pixabay separadas por vírgula`;

  function possibleCategoriesOptionsTogether(){
    let options = "";
    categoriesOptions.forEach(element => {
      options += (element + ", ");
    });

    return options;
  }

  // Função para converter o PlainText estruturado em Object
  const parseAnswerPatternToItinerary = (textResponse: string): any[] => {
    const itinerary: any[] = [];
    
    // Divide por DAY-> para separar cada dia
    const dayBlocks = textResponse.split(/DAY->/g).filter(block => block.trim());
    
    dayBlocks.forEach((dayBlock, index) => {
      const dayNumber = index + 1;
      let currentDay: any = {
        day: dayNumber,
        date: "",
        location: "",
        timeline: [],
        suggestedActivities: [],
        pixabayTags: "",
        images: []
      };

      // Parse da data
      const dateMatch = dayBlock.match(/DATE->\s*([\d-]+)/);
      if (dateMatch) {
        currentDay.date = dateMatch[1].trim();
      }

      // Parse da localização
      const locationMatch = dayBlock.match(/LOCATION->\s*([^;]+)/);
      if (locationMatch) {
        currentDay.location = locationMatch[1].trim();
      }

      // Parse das atividades do timeline - busca por cada bloco entre chaves
      const timelineMatches = dayBlock.match(/\{[^}]+\}/g);
      if (timelineMatches) {
        timelineMatches.forEach(timelineBlock => {
          const timeMatch = timelineBlock.match(/TIME->\s*(\d{1,2}:\d{2})/);
          const titleMatch = timelineBlock.match(/TITLE->\s*([^;]+)/);
          const descMatch = timelineBlock.match(/DESCRIPTION->\s*([^;]+)/);
          const coordMatch = timelineBlock.match(/COORDINATES->\s*([-\d.]+)\s*e\s*([-\d.]+)/);
          const categoryMatch = timelineBlock.match(/CATEGORY->\s*([^;}]*)/);

          if (timeMatch && titleMatch) {
            const coordinates = coordMatch 
              ? `${coordMatch[1]},${coordMatch[2]}` 
              : "0.0000,0.0000";

            const activity = {
              time: timeMatch[1].trim(),
              title: titleMatch[1].trim(),
              description: descMatch ? descMatch[1].trim() : titleMatch[1].trim(),
              coordinates: coordinates,
              category: categoryMatch ? categoryMatch[1].trim() : ""
            };

            currentDay.timeline.push(activity);
          }
        });
      }

      // Parse das atividades sugeridas
      const activitiesMatch = dayBlock.match(/SUGGESTEDACTIVITIES->\s*\[([^\]]+)\]/);
      if (activitiesMatch) {
        currentDay.suggestedActivities = activitiesMatch[1]
          .split(',')
          .map(activity => activity.trim());
      }

      // Parse das tags do Pixabay
      const tagsMatch = dayBlock.match(/PIXABAYTAGS->\s*([^;]+)/);
      if (tagsMatch) {
        currentDay.pixabayTags = tagsMatch[1].trim();
      }

      // Só adiciona o dia se tiver pelo menos uma atividade
      if (currentDay.timeline.length > 0) {
        itinerary.push(currentDay);
      }
    });

    return itinerary;
  };

  const generateDetailed = async () => {
    const prompt = `Gere um itinerário turístico completo e detalhado para uma viagem. Para cada dia, use EXATAMENTE este formato: ${ answerPattern }. Use apenas os dados fornecidos do usuário: ${ preferencesAllDefinedText }. Retorne apenas o texto no formato mostrado, sem explicações extras. Seja específico nos nomes dos locais. IMPORTANTE: Cada dia DEVE ter NO MÍNIMO 3 atividades e NO MÁXIMO 8 atividades no TIMELINE. NUNCA gere menos de 3 atividades por dia. Retorne descrições ricas em detalhes com no mínimo 10 palavras. As opções de categorias são (retorne apenas 1): ${ possibleCategoriesOptionsTogether() }`;

    try {
      // Verifica se já existe itinerário nos parâmetros
      const hasExistingItinerary = route.params?.itineraryData?.itinerary && 
        typeof route.params.itineraryData.itinerary === 'object' &&
        Object.keys(route.params.itineraryData.itinerary).length > 0;

      if (!hasExistingItinerary) {
        setLoading(true);
        setItinerary([]);
  
        const result = await generateItinerary(prompt);
        
        if (!result || typeof result !== 'string') {
          throw new Error('Resposta inválida da API');
        }

        // Converte PlainText estruturado para Object
        const generatedItinerary = parseAnswerPatternToItinerary(result);
        
        if (generatedItinerary.length === 0) {
          throw new Error('Não foi possível processar o formato da resposta da IA');
        }
        
        setItinerary(generatedItinerary);

        navigation.setParams({
          itineraryData: {
            ...route.params.itineraryData,
            itinerary: generatedItinerary,
            isNew: true
          }
        });
  
        addNotification({
          title: "Novo Roteiro Pronto",
          description: "Um novo roteiro para a sua incrível próxima viagem foi gerado pela Inteligência Artificial. Confira já!",
          routeIcon: Globe
        });
      }
    } catch (error) {
      console.error('Erro ao gerar roteiro detalhado:', error);
      setItinerary([]);
    } finally {
      setLoading(false);
    }
  }

  const generateSurprise = async () => {
    try {
      // Verifica se já existe itinerário nos parâmetros
      const hasExistingItinerary = route.params?.itineraryData?.itinerary && 
        typeof route.params.itineraryData.itinerary === 'object' &&
        Object.keys(route.params.itineraryData.itinerary).length > 0;

      if (!hasExistingItinerary) {
        setLoading(true);
        setItinerary([]);
  
        // ETAPA 1: Pedir para a IA escolher um destino surpresa baseado nas preferências
        const destinationPrompt = `Você é um especialista em viagens. Baseado nas seguintes preferências do viajante, escolha UM continente específico e de 1 a 3 países que sejam perfeitos para esta viagem surpresa.
          Preferências do viajante: ${preferencesSurpriseDestinationText}
          Retorne APENAS no seguinte formato (sem explicações adicionais):
          CONTINENT-> Nome do Continente
          COUNTRIES-> País 1, País 2, País 3
          Escolha destinos que combinem com o orçamento, estilo de viagem e preferências mencionadas. Seja específico e criativo na escolha.`;

        const destinationResult = await generateItinerary(destinationPrompt);
        
        if (!destinationResult || typeof destinationResult !== 'string') {
          throw new Error('Resposta inválida da API ao escolher destino');
        }

        // Parse do destino escolhido
        const continentMatch = destinationResult.match(/CONTINENT->\s*([^\n]+)/);
        const countriesMatch = destinationResult.match(/COUNTRIES->\s*([^\n]+)/);
        
        const selectedContinent = continentMatch ? continentMatch[1].trim() : "Europa";
        const selectedCountries = countriesMatch 
          ? countriesMatch[1].split(',').map(c => c.trim()).filter(c => c.length > 0)
          : ["França"];

        const selectedCountriesText = selectedCountries.join(', ');

        // ETAPA 2: Gerar o itinerário detalhado com o destino escolhido
        const surprisePreferencesText = `Início da viagem em ${dateBegin} e o fim em ${dateEnd}, possuindo ${days} dias de viagem.
          Iremos para ${selectedContinent} e aos países ${selectedCountriesText} (Não acrescente outros locais). Somos ${acconpanying} com ${peopleQuantity} pessoas e
          de ${originCountry}. Temos um orçamento de ${budget}. Viagem com foco em ${allTripStylesTogether}, utilizaremos ${allVehicleTypesTogether}
          e temos um desejo para a viagem: ${specialWish}. Gostamos de ${filteredUserPreferences?.join(', ')}.`;

        const itineraryPrompt = `Gere um itinerário turístico completo e detalhado para uma viagem. Para cada dia, use EXATAMENTE este formato: ${answerPattern}. Use apenas os dados fornecidos do usuário: ${surprisePreferencesText}. Retorne apenas o texto no formato mostrado, sem explicações extras. Seja específico nos nomes dos locais. IMPORTANTE: Cada dia DEVE ter NO MÍNIMO 3 atividades e NO MÁXIMO 8 atividades no TIMELINE. NUNCA gere menos de 3 atividades por dia. Retorne descrições ricas em detalhes com no mínimo 10 palavras. As opções de categorias são (retorne apenas 1): ${possibleCategoriesOptionsTogether()}`;

        const result = await generateItinerary(itineraryPrompt);
        
        if (!result || typeof result !== 'string') {
          throw new Error('Resposta inválida da API ao gerar itinerário');
        }

        // Parse do PlainText estruturado para formato de objeto
        const generatedItinerary = parseAnswerPatternToItinerary(result);
        
        if (generatedItinerary.length === 0) {
          throw new Error('Não foi possível processar o formato da resposta da IA');
        }
        
        setItinerary(generatedItinerary);

        // Atualiza os parâmetros com o continente e países escolhidos pela IA
        navigation.setParams({
          itineraryData: {
            ...route.params.itineraryData,
            continent: selectedContinent,
            countries: selectedCountries,
            itinerary: generatedItinerary,
            isNew: true
          }
        });
  
        addNotification({
          title: "Destino Surpresa Revelado!",
          description: `Sua viagem surpresa será para ${ selectedCountriesText }! Confira o roteiro completo.`,
          routeIcon: Globe
        });
      }
    } catch (error) {
      console.error('Erro ao gerar roteiro surpresa:', error);
      setItinerary([]);
    } finally {
      setLoading(false);
    }
  }

  // Função para converter itinerário em pontos para o mapa em um dia específico que estará selecionado
  const convertItineraryToMapPoints = (itineraryData: any[], dayIndex: number): {title: string, description: string, coordinate: {latitude: number, longitude: number}}[] => {    
    const points: {title: string, description: string, coordinate: {latitude: number, longitude: number}}[] = [];
    
    if (!Array.isArray(itineraryData)) {
      return points;
    }

    // Busca o dia específico pelo index dele
    const selectedDayData = itineraryData.find(day => day.day === dayIndex + 1);
    
    if (selectedDayData && selectedDayData.timeline && Array.isArray(selectedDayData.timeline)) {
      selectedDayData.timeline.forEach((activity: any) => {
        if (activity.coordinates && activity.coordinates !== "0.0000,0.0000") {
          const coordinates = activity.coordinates.replace(/\s+/g, '');
          const [lat, lng] = coordinates.split(/[;,]/).map((coord: string) => parseFloat(coord.trim()));
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const point = {
              title: activity.title || 'Atividade',
              description: `${activity.time} - ${activity.description || activity.title}`,
              coordinate: {
                latitude: lat,
                longitude: lng
              }
            };
            points.push(point);
          }
        }
      });
    }
    return points;
  };

  // Gera o roteiro quando as preferências ficam prontas. As funções de geração ficam fora
  // das dependências para não disparar novas requisições à IA a cada renderização.
  const startItineraryGeneration = useEffectEvent(async (countriesText: string, tripStylesText: string, vehicleTypesText: string) => {
    // Na montagem o itinerário existente já é o estado inicial (mesma referência, sem nova renderização).
    const existingItinerary = route.params?.itineraryData?.itinerary;
    if (existingItinerary && Array.isArray(existingItinerary) && existingItinerary.length > 0) {
      setItinerary(existingItinerary);
      return;
    }

    // Só executa geração se não há itinerário nos parâmetros
    const hasExistingItinerary = route.params?.itineraryData?.itinerary && 
      typeof route.params.itineraryData.itinerary === 'object' &&
      Object.keys(route.params.itineraryData.itinerary).length > 0;

    if (!hasExistingItinerary && tripStylesText !== "" && vehicleTypesText !== "") {
      if (countries && countries.length > 0) {
        if (countriesText !== "") {
          await generateDetailed();
        }
      } else {
        await generateSurprise();
      }
    }
  });

  useEffect(() => {
    const start = async () => {
      await startItineraryGeneration(allCountriesTogether, allTripStylesTogether, allVehicleTypesTogether);
    };
    start();
  }, [allCountriesTogether, allTripStylesTogether, allVehicleTypesTogether]);

  // Define as coordenadas iniciais do mapa baseado no primeiro ponto do itinerário;
  // sem ponto válido, vale o valor informado pelo SlideUpItinerary.
  const itineraryFirstCoordinates = useMemo(() => {
    const firstDay = itinerary[0];
    if (!firstDay || !firstDay.timeline || firstDay.timeline.length === 0) return null;

    const firstActivity = firstDay.timeline.find((activity: any) => 
      activity.coordinates && activity.coordinates !== "0.0000,0.0000"
    );
    if (!firstActivity || !firstActivity.coordinates) return null;

    const coordinates = firstActivity.coordinates.replace(/\s+/g, '');
    const [lat, lng] = coordinates.split(/[;,]/).map((coord: string) => parseFloat(coord.trim()));
    return !isNaN(lat) && !isNaN(lng) ? { latitude: lat, longitude: lng } : null;
  }, [itinerary]);

  const mapInitialLatitude = itineraryFirstCoordinates?.latitude ?? firstLatitude;
  const mapInitialLongitude = itineraryFirstCoordinates?.longitude ?? firstLongitude;

  // Função para salvar o background escolhido
  const handleBackgroundChange = async (imagePath: any) => {
    try {
      setImageBackground(imagePath);
      await AsyncStorage.setItem(BACKGROUND_STORAGE_KEY, imagePath.toString());
    } catch (error) {
      console.error('Erro ao salvar background:', error);
    }
  };

  // Função auxiliar para realizar a exportação
  const performExport = async () => {
    if (isExporting || !itinerary || itinerary.length === 0) {
      return;
    }

    try {
      setIsExporting(true);
      
      // Formatar o nome do arquivo com título e datas
      const fileName = `${filteredItineraryData.title || "Roteiro"}_${dateBegin}_${dateEnd}`.replace(/\s+/g, '_');
      
      await exportItineraryToPDF({
        itinerary: itinerary,
        title: filteredItineraryData.title || "Roteiro de Viagem",
        dateBegin: dateBegin,
        dateEnd: dateEnd,
        fileName: fileName
      });
    } catch (error) {
      console.error('Erro ao exportar itinerário:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar itinerário com anúncio
  const handleExportItinerary = () => {
    if (adLoaded && rewardedRef.current && !isExpoGo) {
      try {
        rewardedRef.current.show();
        const unsubscribeEarned = rewardedRef.current.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            performExport();
          }
        );
        return () => unsubscribeEarned();
      } catch (error) {
        console.log('Error showing ad:', error);
        performExport();
      }
    } else {
      if (isExpoGo) {
        Alert.alert(
          'Anúncio Simulado',
          'No ExpoGo, os anúncios são simulados. Em uma build de produção, um anúncio real seria exibido aqui.',
          [
            {
              text: 'OK',
              onPress: () => {
                performExport();
              }
            }
          ]
        );
      } else {
        performExport();
      }
    }
  };

  const styles = StyleSheet.create({
    containerStyle: {
      marginTop: 135,
      marginBottom: 175,
      marginHorizontal: 15,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 10,
    },
    glass: {
      width: 166,
      height: 140,
      borderRadius: 15,
      flexDirection: 'column',
      margin: 5,
    }
  });

  return (
    <View flex={1} position="relative">
      {
        hideBackButton === false 
        ? 
          <View>
            <Button 
              bgColor="lightgray"
              borderRadius={100}
              zIndex={10}
              w={50}
              h={50}
              style={{ position: "absolute", top: 65, left: 10 }} 
              onPress={ handleBackPress }
            >
              <ButtonIcon as={ ChevronLeft } color="#000" size="xl" />
            </Button>
            <View flexDirection="row" position="absolute" top={70} right={10} zIndex={1}>
              <Button 
                bgColor={ showMapStatsInformation === "Map" ? "#2752B7" : "lightgray" } 
                borderTopLeftRadius={10}
                borderBottomLeftRadius={10}
                borderTopRightRadius={0}
                borderBottomRightRadius={0}
                onPress={ () => setShowMapStatsInformation("Map") }
                marginBottom={5}
              >
                <ButtonText color={ showMapStatsInformation === "Map" ? "#FFF" : "#000" }>Mapa</ButtonText>
              </Button>
              <Button 
                bgColor={ showMapStatsInformation === "Stats" ? "#2752B7" : "lightgray" }
                borderTopLeftRadius={0}
                borderBottomLeftRadius={0}
                borderTopRightRadius={10}
                borderBottomRightRadius={10}
                onPress={ () => setShowMapStatsInformation("Stats") }
              >
                <ButtonText color={ showMapStatsInformation === "Stats" ? "#FFF" : "#000" }>Stats</ButtonText>
              </Button>
            </View>
          </View>
        : null
      }
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        {
          showMapStatsInformation === "Map"
          ?
            <Maps 
              ref={ mapUserPositionRef } 
              initialLatitude={ mapInitialLatitude?.toString() } 
              initialLongitude={ mapInitialLongitude?.toString() } 
              itineraryPlaces={ convertItineraryToMapPoints(itinerary, selectedDay) } 
            />
          :
            <View flex={1}>
              <Image
                source={ imageBackground === "" ? DefaultStatsBackground : imageBackground }
                style={{ position: "absolute", width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <ScrollView>
                <GlassContainer spacing={10} style={ styles.containerStyle }>
                  {
                    !hideBackButton && (
                      <>
                        <GlassView style={ styles.glass } glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Compass size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.touristAttractions }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Pontos Turísticos</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Compass size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.touristAttractions }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Pontos Turísticos</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <UtensilsCrossed size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.restaurant }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Restaurantes</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <UtensilsCrossed size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.restaurant }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Restaurantes</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Bed size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.accomodation }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Hospedagens</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Bed size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.accomodation }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Hospedagens</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <PartyPopper size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.nightLife }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Vida Noturna</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <PartyPopper size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.nightLife }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Vida Noturna</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <TreePine size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.parks }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Parques</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <TreePine size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.parks }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Parques</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <ShoppingBag size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.shopping }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Shopping</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <ShoppingBag size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.shopping }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Shopping</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Landmark size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.culture }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Cultura</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Landmark size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.culture }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Cultura</Text>
                        </View>
                    }
                  </GlassView>
                  <GlassView style={styles.glass} glassEffectStyle="clear">
                    {
                      isLiquidGlassAvailable()
                        ?
                        <View flex={1} p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Plane size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.travel }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Viagem</Text>
                        </View>
                        :
                        <View flex={1} bgColor="rgba(255, 255, 255, 0.452)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                          <View
                            p={12}
                            borderRadius={50}
                            bgColor="rgba(255, 255, 255, 0.2)"
                            mb={12}
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Plane size={45} color="#FFF" strokeWidth={2.25} />
                            <Text fontSize="$4xl" fontWeight="$semibold" color="#FDFDFD">{ categoriesCounter.travel }</Text>
                          </View>
                          <Text fontSize="$lg" fontWeight="$semibold" color="#FDFDFD" textAlign="center">Viagem</Text>
                        </View>
                    }
                  </GlassView>
                  <View style={{ ...styles.glass, marginBottom: 70 }}>
                    <View flex={1} bgColor="rgba(255, 255, 255, 0.7)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                      <Button 
                        bgColor="transparent"
                        width="100%"
                        onPress={ () => setOpenChooseBackground(true) }
                      >
                        <View
                          p={12}
                          mb={12}
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                        >
                          <Palette size={45} color="#000" strokeWidth={2.25} />
                        </View>
                      </Button>
                      <Text fontSize="$lg" fontWeight="$semibold" color="#000" textAlign="center">Alterar Background</Text>
                    </View>
                  </View>
                  <View style={{ ...styles.glass, marginBottom: 35 }}>
                    <View flex={1} bgColor="rgba(255, 255, 255, 0.7)" p={12} borderRadius={20} justifyContent="center" alignItems="center">
                      <Button 
                        bgColor="transparent"
                        width="100%"
                        onPress={ handleExportItinerary }
                        disabled={ isExporting || loading }
                      >
                        <View
                          p={12}
                          mb={12}
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                        >
                          <FileDown size={45} color="#000" strokeWidth={2.25} />
                        </View>
                      </Button>
                      <Text fontSize="$lg" fontWeight="$semibold" color="#000" textAlign="center">Exportar{"\n"}Itinerário</Text>
                    </View>
                  </View>
                      </>
                    )
                  }
                </GlassContainer>
              </ScrollView>
            </View>
        }
      </View>
      <View position="absolute" bottom={0} left={0} right={0}>
        <SafeAreaView>
          <SlideUpItinerary
            isLoading={ loading }
            hideBackButton={ setHideBackButton }
            setFirstLatitude={ setFirstLatitude }
            setFirstLongitude={ setFirstLongitude }
            setSelectedDay={ setSelectedDay }
            setCategoriesCounter={ setCategoriesCounter }
          />
        </SafeAreaView>
      </View>
      {
        openChooseBackground 
          ? <ChooseBackgroundDialog showAlertDialog={ openChooseBackground } handleClose={ () => setOpenChooseBackground(false) } imageUri={ handleBackgroundChange } /> 
          : null
      }
      {
        openSaveDialog
          ? <SaveItineraryDialog 
              showAlertDialog={ openSaveDialog } 
              handleClose={ () => {
                setOpenSaveDialog(false);
                // Navegar sem salvar
                navigation.navigate("GenerateItineraryMenu");
              }} 
              onSave={ async (status, imageUri) => {
                await saveNewItinerary(status, imageUri);
                setIsNewItinerary(false);
                navigation.navigate("GenerateItineraryMenu");
              }} 
            /> 
          : null
      }
    </View>
  )
}