import { useEffect, useState, useMemo } from "react";
import { StyleSheet, Dimensions, FlatList, Alert, ScrollView as RNScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, TextInput as RNTextInput } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { Box, Spinner, View, Text, Button, ButtonIcon, ButtonText, Icon } from "@gluestack-ui/themed";

import Timeline from 'react-native-timeline-flatlist';

import { ItineraryCategoriesDefine } from "@components/Itinerary/ItineraryCategoriesDefine";
import { ItinerarySliderDateShow } from "@components/Itinerary/ItinerarySliderDateShow";
import { AddExpenseModal } from "@components/Modals/AddExpenseModal";
import { ExpenseAddedModal } from "@components/Modals/ExpenseAddedModal";

import { useFavoritePlaces } from "../../hooks/useFavoritePlaces";
import { useExpenseControl } from "../../hooks/useExpenseControl";

import { AuthNavigationProp } from "@routes/auth.routes";

import { ArrowDown, ArrowUp, CalendarX, ChevronRight, Compass, HandCoins, MessageCircle, Pen, SquarePlus, UtensilsCrossed, Bed, PartyPopper, TreePine, ShoppingBag, Landmark, Plane, Heart, Clock, FileText, Tag, MapPin, Move, X } from "lucide-react-native";

import { CreatingItinerary } from "../../../@types/CreatingItinerary";
import { CategoriesCounterTypes } from "../../../@types/CategoriesCounterTypes";

type ItinerarySliderProps = {
  isLoading: boolean,
  hideBackButton: (hide: boolean) => void,
  setFirstLatitude: (latitude: number) => void,
  setFirstLongitude: (longitude: number) => void,
  setCategoriesCounter: React.Dispatch<React.SetStateAction<CategoriesCounterTypes>>,
  setSelectedDay?: (dayIndex: number) => void
}

type CalendarDaysTypes = {
  id: string,
  numberOfDay: number,
  nameOfWeekday: string
}

type TimelineItemTypes = {
  time: string,
  title: string,
  description: string,
  coordinates?: string,
  category: string
}

type DayItineraryTypes = {
  day: number,
  date: string,
  location: string,
  timeline: TimelineItemTypes[],
  suggestedActivities?: string[],
  pixabayTags?: string,
  images?: string[]
}

function parseDate(dateInput: Date | string): Date {
  if (typeof dateInput === 'string') {
    const dateOnly = dateInput.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    return new Date(year, month - 1, day);
  } else {
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
  }
}

function weekDaysCalendarConstruction(dateStart: Date | string) {
  const currentSelectedDate = parseDate(dateStart);
  const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  return weekdays[currentSelectedDate.getDay()];
}

function getDatesBetween(startDate: Date | string, endDate: Date | string): Date[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const dates: Date[] = [];
  let current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function SlideUpItinerary({ isLoading, hideBackButton, setFirstLatitude, setFirstLongitude, setSelectedDay, setCategoriesCounter }: ItinerarySliderProps) {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<RouteProp<{ params: { itineraryData: CreatingItinerary, userPreferences: string[], visaIssue: any } }, 'params'>>();
  const {
    title,
    dateBegin,
    dateEnd,
    itinerary,
  } = route.params.itineraryData;

  const { addFavoritePlace, isFavorite } = useFavoritePlaces();
  const { addExpense, expenses } = useExpenseControl();

  const allTripDays = useMemo<CalendarDaysTypes[]>(() => (
    getDatesBetween(dateBegin, dateEnd).map((date, index) => ({
      id: index.toString(),
      numberOfDay: date.getDate(),
      nameOfWeekday: weekDaysCalendarConstruction(date)
    }))
  ), [dateBegin, dateEnd]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [showExpenseAddedModal, setShowExpenseAddedModal] = useState<boolean>(false);
  const [lastAddedExpense, setLastAddedExpense] = useState<{ title: string; amount: number } | null>(null);
  const [currentExpenseContext, setCurrentExpenseContext] = useState<{ title: string, description: string, date: string, location: string } | null>(null);
  const [editingTimelineIndex, setEditingTimelineIndex] = useState<number | null>(null);
  const [itineraryState, setItineraryState] = useState<DayItineraryTypes[]>(Array.isArray(itinerary) ? itinerary : []);

  // Atualiza itineraryState quando itinerary muda
  const [prevItinerary, setPrevItinerary] = useState(itinerary);
  if (itinerary !== prevItinerary) {
    setPrevItinerary(itinerary);
    if (Array.isArray(itinerary)) {
      setItineraryState(itinerary);
    }
  }
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [addActivityPosition, setAddActivityPosition] = useState<'before' | 'after' | 'move' | null>(null);
  const [newActivityData, setNewActivityData] = useState<{ time: string, title: string, description: string, category: string, coordinates: string }>({ time: '', title: '', description: '', category: '', coordinates: '0.0000,0.0000' });
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);

  const { height: screenHeight } = Dimensions.get('window');

  const position = useSharedValue(0);
  const lastDirection = useSharedValue<"UP" | "DOWN" | null>(null);

  const flingUpGesture = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (lastDirection.value !== "UP") {
        position.value = withTiming(-25, { duration: 300 });
        lastDirection.value = "UP";
        runOnJS(hideBackButton)(true);
      }
    });

  const flingDownGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (lastDirection.value !== "DOWN") {
        position.value = withTiming(0, { duration: 300 });
        lastDirection.value = "DOWN";
        runOnJS(hideBackButton)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const isExpanded = position.value !== 0;
    const collapsedHeight = 200;
    const expandedHeight = screenHeight * 0.82;

    return {
      height: withTiming(
        isExpanded ? expandedHeight : collapsedHeight,
        { duration: 300 }
      ),
      bottom: 0,
      transform: [
        {
          translateY: withTiming(
            isExpanded ? -75 : 0,
            { duration: 300 }
          )
        }
      ],
    };
  });

  // Função para gerar horários disponíveis (agora de 00:00 a 23:59)
  const generateAvailableTimes = (beforeTime?: string, afterTime?: string): string[] => {
    const times: string[] = [];
    const startHour = beforeTime ? parseInt(beforeTime.split(':')[0]) : 0;
    const startMinute = beforeTime ? parseInt(beforeTime.split(':')[1]) : 0;
    const endHour = afterTime ? parseInt(afterTime.split(':')[0]) : 23;
    const endMinute = afterTime ? parseInt(afterTime.split(':')[1]) : 59;

    let currentHour = beforeTime ? startHour : 0;
    let currentMinute = beforeTime ? startMinute + 15 : 0;

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute = 0;
      }
      if (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        times.push(`${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);
      }
      currentMinute += 15;
    }

    return times;
  };

  const handleSelectCategory = (category: string) => {
    if (editingTimelineIndex === null) return;

    // Obtém a categoria atual antes da mudança para decrementar se necessário
    const currentActivity = itineraryState[selectedDayIndex]?.timeline?.[editingTimelineIndex];
    const oldCategory = currentActivity?.category;

    setCategoriesCounter((prev: CategoriesCounterTypes) => {
      const newCounter = { ...prev };
      
      // Decrementa a categoria antiga se ela existir
      if (oldCategory) {
        switch (oldCategory) {
          case "Ponto Turístico":
            newCounter.touristAttractions = Math.max(0, newCounter.touristAttractions - 1);
            break;
          case "Gastronomia":
            newCounter.restaurant = Math.max(0, newCounter.restaurant - 1);
            break;
          case "Hospedagem":
            newCounter.accomodation = Math.max(0, newCounter.accomodation - 1);
            break;
          case "Vida Noturna":
            newCounter.nightLife = Math.max(0, newCounter.nightLife - 1);
            break;
          case "Parques":
            newCounter.parks = Math.max(0, newCounter.parks - 1);
            break;
          case "Shopping":
            newCounter.shopping = Math.max(0, newCounter.shopping - 1);
            break;
          case "Cultura":
            newCounter.culture = Math.max(0, newCounter.culture - 1);
            break;
          case "Viagens":
            newCounter.travel = Math.max(0, newCounter.travel - 1);
            break;
        }
      }

      // Incrementa a nova categoria
      switch (category) {
        case "Ponto Turístico":
          newCounter.touristAttractions += 1;
          break;
        case "Gastronomia":
          newCounter.restaurant += 1;
          break;
        case "Hospedagem":
          newCounter.accomodation += 1;
          break;
        case "Vida Noturna":
          newCounter.nightLife += 1;
          break;
        case "Parques":
          newCounter.parks += 1;
          break;
        case "Shopping":
          newCounter.shopping += 1;
          break;
        case "Cultura":
          newCounter.culture += 1;
          break;
        case "Viagens":
          newCounter.travel += 1;
          break;
      }
      return newCounter;
    });

    setItineraryState(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const newItinerary = safePrev.map((day, idx) => {
        if (idx === selectedDayIndex) {
          const newTimeline = [...day.timeline];
          newTimeline[editingTimelineIndex] = {
            ...newTimeline[editingTimelineIndex],
            category,
          };
          return { ...day, timeline: newTimeline };
        }
        return day;
      });
      return newItinerary;
    });

    setShowCategories(false);
    setEditingTimelineIndex(null);
  };

  // Função para abrir modal de adicionar atividade em dia vazio
  const handleAddFirstActivity = () => {
    setEditingTimelineIndex(0);
    setAddActivityPosition('before');
    setNewActivityData({ time: '', title: '', description: '', category: '', coordinates: '0.0000,0.0000' });
    setSelectedCoordinates(null);
    setShowAddActivityModal(true);
  };

  // Função para abrir modal de adicionar antes
  const handleAddBefore = (index: number) => {
    setEditingTimelineIndex(index);
    setAddActivityPosition('before');
    setNewActivityData({ time: '', title: '', description: '', category: '', coordinates: '0.0000,0.0000' });
    setSelectedCoordinates(null);
    setShowAddActivityModal(true);
  };

  // Função para abrir modal de adicionar depois
  const handleAddAfter = (index: number) => {
    setEditingTimelineIndex(index);
    setAddActivityPosition('after');
    setNewActivityData({ time: '', title: '', description: '', category: '', coordinates: '0.0000,0.0000' });
    setSelectedCoordinates(null);
    setShowAddActivityModal(true);
  };

  // Função para mover/editar atividade
  const handleMoveActivity = (index: number) => {
    const activity = itineraryState[selectedDayIndex]?.timeline[index];
    if (!activity) return;

    setEditingTimelineIndex(index);
    setAddActivityPosition('move');
    setNewActivityData({
      time: activity.time,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      coordinates: activity.coordinates || '0.0000,0.0000'
    });

    // Converte coordenadas string para objeto (suporta ; e ,)
    if (activity.coordinates && activity.coordinates !== '0.0000,0.0000') {
      const coordString = activity.coordinates.replace(/\s+/g, '');
      const [lat, lng] = coordString.split(/[;,]/).map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setSelectedCoordinates({ latitude: lat, longitude: lng });
      } else {
        setSelectedCoordinates(null);
      }
    } else {
      setSelectedCoordinates(null);
    }

    setShowAddActivityModal(true);
  };

  // Função para salvar nova atividade ou edição
  const handleSaveNewActivity = () => {
    if (editingTimelineIndex === null || !addActivityPosition) return;
    if (!newActivityData.time || !newActivityData.title) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos o horário e o título da atividade.');
      return;
    }

    const coordinates = selectedCoordinates 
      ? `${selectedCoordinates.latitude.toFixed(4)}; ${selectedCoordinates.longitude.toFixed(4)}`
      : newActivityData.coordinates || '0.0000,0.0000';

    const activityData: TimelineItemTypes = {
      time: newActivityData.time,
      title: newActivityData.title,
      description: newActivityData.description || newActivityData.title,
      coordinates: coordinates,
      category: newActivityData.category
    };

    setItineraryState((prevState) => {
      const newState = [...prevState];
      const dayData = newState[selectedDayIndex];
      
      if (dayData) {
        // Inicializa timeline se estiver vazio ou undefined
        const newTimeline = dayData.timeline ? [...dayData.timeline] : [];
        
        if (addActivityPosition === 'move') {
          // Modo edição: substitui a atividade existente
          newTimeline[editingTimelineIndex] = activityData;
        } else {
          // Modo adicionar: insere nova atividade
          const insertIndex = addActivityPosition === 'before' ? editingTimelineIndex : editingTimelineIndex + 1;
          newTimeline.splice(insertIndex, 0, activityData);
        }
        
        dayData.timeline = newTimeline;
      }

      return newState;
    });

    setShowAddActivityModal(false);
    setEditingTimelineIndex(null);
    setAddActivityPosition(null);
    setNewActivityData({ time: '', title: '', description: '', category: '', coordinates: '0.0000,0.0000' });
    setSelectedCoordinates(null);
  };

  // Função para excluir visita
  const handleDeleteActivity = (index: number) => {
    const activity = itineraryState[selectedDayIndex]?.timeline[index];
    if (!activity) return;

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta atividade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const oldCategory = activity.category;
            
            // Atualiza o estado do itinerário
            setItineraryState((prevState) => {
              const newState = [...prevState];
              const dayData = { ...newState[selectedDayIndex] };
              
              if (dayData && dayData.timeline) {
                dayData.timeline = dayData.timeline.filter((_, i) => i !== index);
                newState[selectedDayIndex] = dayData;
              }

              return newState;
            });

            // Atualiza contador de categorias de forma isolada
            if (oldCategory) {
              setCategoriesCounter((prev) => {
                const newCounter = { ...prev };
                switch (oldCategory) {
                  case "Ponto Turístico":
                    newCounter.touristAttractions = Math.max(0, newCounter.touristAttractions - 1);
                    break;
                  case "Gastronomia":
                    newCounter.restaurant = Math.max(0, newCounter.restaurant - 1);
                    break;
                  case "Hospedagem":
                    newCounter.accomodation = Math.max(0, newCounter.accomodation - 1);
                    break;
                  case "Vida Noturna":
                    newCounter.nightLife = Math.max(0, newCounter.nightLife - 1);
                    break;
                  case "Parques":
                    newCounter.parks = Math.max(0, newCounter.parks - 1);
                    break;
                  case "Shopping":
                    newCounter.shopping = Math.max(0, newCounter.shopping - 1);
                    break;
                  case "Cultura":
                    newCounter.culture = Math.max(0, newCounter.culture - 1);
                    break;
                  case "Viagens":
                    newCounter.travel = Math.max(0, newCounter.travel - 1);
                    break;
                }
                return newCounter;
              });
            }
          }
        }
      ]
    );
  };

  const handleAddToFavorites = async (rowData: TimelineItemTypes, index: number) => {
    const currentDay = itineraryState[selectedDayIndex];
    
    if (!currentDay) return;

    // Gera um ID único para o local favorito
    const placeId = `${title}-${currentDay.day}-${index}-${rowData.time}`;

    // Verifica se já está nos favoritos
    if (isFavorite(placeId)) {
      Alert.alert(
        "Já está nos favoritos",
        `"${rowData.title}" já foi adicionado aos seus locais favoritos.`,
        [{ text: "OK" }]
      );
      return;
    }

    try {
      await addFavoritePlace({
        id: placeId,
        title: rowData.title,
        description: rowData.description,
        coordinates: rowData.coordinates || "0.0000,0.0000",
        category: rowData.category || "",
        location: currentDay.location,
        date: currentDay.date,
        itineraryTitle: title,
        favoritedAt: new Date().toISOString(),
        images: currentDay.images || []
      });

      Alert.alert(
        "Adicionado aos Favoritos!",
        `"${rowData.title}" foi adicionado à sua lista de locais favoritos.`,
        [{ text: "OK" }]
      );
    } catch {
      // DEBUG: console.error('Erro ao adicionar aos favoritos:', error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar este local aos favoritos. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const handleOpenExpenseModal = (rowData: TimelineItemTypes, index: number) => {
    const currentDay = itineraryState[selectedDayIndex];
    
    if (!currentDay) return;

    setCurrentExpenseContext({
      title: rowData.title,
      description: rowData.description,
      date: currentDay.date,
      location: currentDay.location
    });
    setShowExpenseModal(true);
  };

  const handleAddExpense = async (expense: { title: string; amount: number; category: any; description: string; date: string }) => {
    if (!currentExpenseContext) return;

    const expenseId = `${title}-${Date.now()}`;

    await addExpense({
      id: expenseId,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      itineraryTitle: title,
      activityTitle: currentExpenseContext.title,
      location: currentExpenseContext.location,
      createdAt: new Date().toISOString()
    });

    setShowExpenseModal(false);
    setCurrentExpenseContext(null);
    setLastAddedExpense({ title: expense.title, amount: expense.amount });
    setShowExpenseAddedModal(true);
  };

  // Função auxiliar para verificar se uma atividade está favoritada
  const checkIfFavorited = (rowData: TimelineItemTypes, index: number): boolean => {
    const currentDay = itineraryState[selectedDayIndex];
    if (!currentDay) return false;
    
    const placeId = `${title}-${currentDay.day}-${index}-${rowData.time}`;
    return isFavorite(placeId);
  };

  // Função auxiliar para obter total de gastos de uma atividade
  const getActivityExpenses = (rowData: TimelineItemTypes): number => {
    const activityExpenses = expenses.filter(
      expense => expense.itineraryTitle === title && expense.activityTitle === rowData.title
    );
    
    return activityExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Ponto Turístico":
        return Compass;
      case "Gastronomia":
        return UtensilsCrossed;
      case "Hospedagem":
        return Bed;
      case "Vida Noturna":
        return PartyPopper;
      case "Parques":
        return TreePine;
      case "Shopping":
        return ShoppingBag;
      case "Cultura":
        return Landmark;
      case "Viagens":
        return Plane;
      default:
        return SquarePlus;
    }
  };

  // Conta as categorias existentes no itinerário quando ele é carregado
  useEffect(() => {
    if (!Array.isArray(itineraryState) || itineraryState.length === 0) return;

    const categoryCount = {
      touristAttractions: 0,
      restaurant: 0,
      accomodation: 0,
      nightLife: 0,
      parks: 0,
      shopping: 0,
      culture: 0,
      travel: 0
    };

    itineraryState.forEach((day) => {
      if (day.timeline && Array.isArray(day.timeline)) {
        day.timeline.forEach((activity) => {
          if (activity.category) {
            switch (activity.category) {
              case "Ponto Turístico":
                categoryCount.touristAttractions += 1;
                break;
              case "Gastronomia":
                categoryCount.restaurant += 1;
                break;
              case "Hospedagem":
                categoryCount.accomodation += 1;
                break;
              case "Vida Noturna":
                categoryCount.nightLife += 1;
                break;
              case "Parques":
                categoryCount.parks += 1;
                break;
              case "Shopping":
                categoryCount.shopping += 1;
                break;
              case "Cultura":
                categoryCount.culture += 1;
                break;
              case "Viagens":
                categoryCount.travel += 1;
                break;
            }
          }
        });
      }
    });

    setCategoriesCounter(categoryCount);
  }, [itineraryState, setCategoriesCounter]);

  useEffect(() => {
    if (setSelectedDay) {
      setSelectedDay(selectedDayIndex);
    }
  }, [selectedDayIndex, setSelectedDay]);

  useEffect(() => {
    if (!Array.isArray(itinerary)) return;
    const dayOne = itinerary.find((day: any) => day.day === 1);

    let firstLatitude: number | undefined;
    let firstLongitude: number | undefined;

    if (dayOne && dayOne.timeline && dayOne.timeline.length > 0) {
      const firstTimelineItem = dayOne.timeline[0];
      if (firstTimelineItem.coordinates) {
        const [lat, lng] = firstTimelineItem.coordinates.split(',').map(Number);
        firstLatitude = lat;
        firstLongitude = lng;
      }
    }

    if (typeof firstLatitude === "number" && typeof firstLongitude === "number") {
      setFirstLatitude(firstLatitude);
      setFirstLongitude(firstLongitude);
    }
  }, [itinerary, setFirstLatitude, setFirstLongitude]);

  const renderDetail = (rowData: TimelineItemTypes, index: number) => {
    return (
      <View flex={1} px={2}>
        <Text
          fontSize="$lg"
          fontWeight="$bold"
          color="#2752B7"
          mb={2}
        >
          { rowData.title || 'Atividade sem título' }
        </Text>

        { rowData.description && (
          <Text
            fontSize="$sm"
            color="#666"
            lineHeight="$sm"
            mb={rowData.coordinates ? 2 : 0}
          >
            { rowData.description }
          </Text>
        )}

        { rowData.coordinates && (
          <Text
            fontSize="$xs"
            color="#999"
            fontStyle="italic"
          >
            Coordenadas: { rowData.coordinates }
          </Text>
        )}

        <Button
          flexDirection="row"
          justifyContent="space-between"
          mt={10}
          bgColor="transparent"
          borderWidth={1}
          borderColor="lightgray"
          onPress={() => {
            setEditingTimelineIndex(index);
            setShowCategories(true);
          }}
        >
          <View flexDirection="row">
            <ButtonIcon as={ getCategoryIcon(rowData.category) } color="$black" mr={8} />
            <ButtonText color="$black">{ rowData.category ? rowData.category : "Definir Categoria" }</ButtonText>
          </View>
          <ButtonIcon as={ ChevronRight } color="$black" />
        </Button>
        <Button
          flexDirection="row"
          justifyContent="space-between"
          mt={10}
          bgColor="transparent"
          borderWidth={1}
          borderColor="lightgray"
          onPress={() => handleOpenExpenseModal(rowData, index)}
        >
          <View flexDirection="row">
            <ButtonIcon as={ HandCoins } color={getActivityExpenses(rowData) > 0 ? "#2752B7" : "$black"} mr={8} />
            <ButtonText color="$black">
              {getActivityExpenses(rowData) > 0 
                ? `Gastos: R$ ${getActivityExpenses(rowData).toFixed(2)}`
                : "Adicionar Custos"}
            </ButtonText>
          </View>
          <ButtonIcon as={ ChevronRight } color="$black" />
        </Button>
        <Button 
          flexDirection="row" 
          justifyContent="space-between" 
          mt={10} 
          bgColor="transparent" 
          borderWidth={1} 
          borderColor="lightgray"
          onPress={() => handleAddToFavorites(rowData, index)}
        >
          <View flexDirection="row">
            <ButtonIcon as={ Heart } color={checkIfFavorited(rowData, index) ? "#FF0000" : "$black"} mr={8} />
            <ButtonText color="$black">
              {checkIfFavorited(rowData, index) ? "Local Favoritado" : "Favoritar Local"}
            </ButtonText>
          </View>
          <ButtonIcon as={ ChevronRight } color="$black" />
        </Button>
        {
          isEditing
            ?
            <View>
              <Button 
                flexDirection="row" 
                justifyContent="space-between" 
                mt={10} 
                bgColor="transparent" 
                borderWidth={1} 
                borderColor="lightgray"
                onPress={() => handleAddBefore(index)}
              >
                <View flexDirection="row">
                  <ButtonIcon as={ ArrowUp } color="$black" mr={8} />
                  <ButtonText color="$black">Adicionar antes</ButtonText>
                </View>
                <ButtonIcon as={ ChevronRight } color="$black" />
              </Button>
              <Button 
                flexDirection="row" 
                justifyContent="space-between" 
                mt={10} 
                bgColor="transparent" 
                borderWidth={1} 
                borderColor="lightgray"
                onPress={() => handleAddAfter(index)}
              >
                <View flexDirection="row">
                  <ButtonIcon as={ ArrowDown } color="$black" mr={8} />
                  <ButtonText color="$black">Adicionar depois</ButtonText>
                </View>
                <ButtonIcon as={ ChevronRight } color="$black" />
              </Button>
              <Button 
                flexDirection="row" 
                justifyContent="space-between" 
                mt={10} 
                bgColor="transparent" 
                borderWidth={1} 
                borderColor="lightgray"
                onPress={() => handleDeleteActivity(index)}
              >
                <View flexDirection="row">
                  <ButtonIcon as={ CalendarX } color="$black" mr={8} />
                  <ButtonText color="$black">Excluir visita</ButtonText>
                </View>
                <ButtonIcon as={ ChevronRight } color="$black" />
              </Button>
              <Button 
                flexDirection="row" 
                justifyContent="space-between" 
                mt={10} 
                bgColor="transparent" 
                borderWidth={1} 
                borderColor="lightgray"
                onPress={() => handleMoveActivity(index)}
              >
                <View flexDirection="row">
                  <ButtonIcon as={ Move } color="$black" mr={8} />
                  <ButtonText color="$black">Mover atividade</ButtonText>
                </View>
                <ButtonIcon as={ ChevronRight } color="$black" />
              </Button>
            </View>
            : null
        }
      </View>
    );
  };

  const getTimelineDataForDay = (dayIndex: number) => {  
    if (!itineraryState || !Array.isArray(itineraryState)) {
      return [];
    }

    const dayData = itineraryState.find((day: DayItineraryTypes) => day.day === dayIndex + 1);
    
    const timelineData = dayData?.timeline || [];

    return timelineData;
  };

  const styles = StyleSheet.create({
    slider: {
      width: "100%",
      backgroundColor: '#FDFDFD',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(flingUpGesture, flingDownGesture)}>
      <Animated.View
        style={[animatedStyle, styles.slider]}
      >
        <View>
          <View
            style={{
              borderColor: "#BBB",
              borderWidth: .5,
              width: 65,
              height: 6,
              borderRadius: 20,
              backgroundColor: "#BBB",
              marginTop: 15,
              marginBottom: 10,
              margin: 'auto'
            }}
          />
        </View>

        <View flex={1} px={4}>
          { isLoading ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Spinner size="large" color="#2752B7" />
              <Text mt={2} color="#666">Gerando seu itinerário...</Text>
            </Box>
          ) : (
            <View flex={1} px={8}>
              <View flexDirection="row" justifyContent="space-between" alignItems="center" mt={-5}>
                <View flex={1}>
                  <Text color="$black" fontSize="$2xl" fontWeight="$bold">{title}</Text>
                  {isEditing && (
                    <Text color="#2752B7" fontSize="$sm" fontWeight="$medium">
                      Modo de edição ativo
                    </Text>
                  )}
                </View>
                <View flexDirection="row" alignItems="center">
                  <Button
                    bgColor="lightgray"
                    borderRadius={100}
                    w={40}
                    h={40}
                    mr={10}
                    p={0}
                    onPress={() => navigation.navigate("AIChatMenu")}
                  >
                    <ButtonIcon color="#000" as={MessageCircle} size="lg" />
                  </Button>
                  <Button
                    bgColor={isEditing ? "#2752B7" : "lightgray"}
                    borderRadius={100}
                    w={40}
                    h={40}
                    p={0}
                    onPress={() => setIsEditing(!isEditing)}
                  >
                    <ButtonIcon color={isEditing ? "#fff" : "#000"} as={Pen} size="lg" />
                  </Button>
                </View>
              </View>

              { itinerary ? (
                <View flex={1} mt={15}>
                  <View>
                    <FlatList
                      data={allTripDays}
                      renderItem={({ item, index }) => (
                        <ItinerarySliderDateShow
                          nameOfWeekday={item.nameOfWeekday}
                          numberOfDay={item.numberOfDay}
                          isSelected={selectedDayIndex === index}
                          onPress={() => setSelectedDayIndex(index)}
                        />
                      )}
                      keyExtractor={item => item.id}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                  <View flex={1} mt={15} pt={10}>
                    {(() => {
                      const timelineData = getTimelineDataForDay(selectedDayIndex);
                      return timelineData.length > 0;
                    })() ? (
                      <Timeline
                        key={`timeline-${selectedDayIndex}-${isEditing}`}
                        data={getTimelineDataForDay(selectedDayIndex)}
                        renderDetail={renderDetail}
                        circleSize={24}
                        circleColor='#2752B7'
                        lineColor='#E0E0E0'
                        lineWidth={2}
                        timeContainerStyle={{
                          minWidth: 60,
                          marginTop: -8,
                          backgroundColor: '#F5F5F5',
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                        }}
                        timeStyle={{
                          textAlign: 'center',
                          backgroundColor: 'transparent',
                          color: '#2752B7',
                          fontSize: 14,
                          fontWeight: '600'
                        }}
                        innerCircle={'dot'}
                        dotColor='white'
                        dotSize={12}
                        separatorStyle={{
                          backgroundColor: '#E0E0E0'
                        }}
                        rowContainerStyle={{
                          paddingTop: 5
                        }}
                        eventContainerStyle={{
                          marginLeft: 8,
                          flex: 1
                        }}
                        titleStyle={{ display: 'none' }}
                        descriptionStyle={{ display: 'none' }}
                        isUsingFlatlist={true}
                        options={{
                          showsVerticalScrollIndicator: false,
                          style: { paddingTop: 10 }
                        } as any}
                      />
                    ) : (
                      <View flex={1} justifyContent="center" alignItems="center" gap="$4">
                        <Text color="#666" fontSize="$md" textAlign="center">
                          Nenhuma atividade programada para este dia
                        </Text>
                        <Button
                          size="sm"
                          variant="outline"
                          borderColor="#0066cc"
                          onPress={handleAddFirstActivity}
                          gap="$2"
                        >
                          <Icon as={SquarePlus} color="#0066cc" size="sm" />
                          <ButtonText color="#0066cc">Adicionar Atividade</ButtonText>
                        </Button>
                      </View>
                    )}</View>
                </View>
              ) : (
                <View flex={1} justifyContent="center" alignItems="center">
                  <Text color="#666">
                    Nenhum itinerário disponível
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <ItineraryCategoriesDefine 
          showModal={ showCategories }
          setShowModal={ () => setShowCategories(false) }
          onSelectCategory={ handleSelectCategory }
        />

        {/* Modal de Adicionar/Editar Atividade */}
        {showAddActivityModal && (
          <Modal
            visible={showAddActivityModal}
            transparent
            animationType="slide"
            onRequestClose={() => {
              setShowAddActivityModal(false);
              setShowMapPicker(false);
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <View flex={1} bgColor="rgba(0, 0, 0, 0.5)" justifyContent="flex-end">
                <View
                  bgColor="#FFF"
                  borderTopLeftRadius={25}
                  borderTopRightRadius={25}
                  maxHeight="90%"
                >
                  {/* Header */}
                  <View
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    p={20}
                    borderBottomWidth={1}
                    borderBottomColor="#F0F0F0"
                  >
                    <Text fontSize="$xl" fontWeight="$bold" color="#2752B7">
                      {addActivityPosition === 'before' 
                        ? 'Adicionar Atividade Antes' 
                        : addActivityPosition === 'after'
                        ? 'Adicionar Atividade Depois'
                        : 'Mover Atividade'}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      setShowAddActivityModal(false);
                      setShowMapPicker(false);
                    }}>
                      <X size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  {/* Body */}
                  <RNScrollView style={{ maxHeight: 500 }}>
                    <View p={20}>
                      {/* Horário */}
                      <View mb={20}>
                        <View flexDirection="row" alignItems="center" mb={8}>
                          <Clock size={18} color="#2752B7" />
                          <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                            Horário *
                          </Text>
                        </View>
                        <RNScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          style={{
                            backgroundColor: "#F8F8F8",
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: "#E5E5E5"
                          }}
                        >
                          <View flexDirection="row" p={4}>
                            {generateAvailableTimes(
                              editingTimelineIndex !== null && editingTimelineIndex > 0 && addActivityPosition !== 'move'
                                ? itineraryState[selectedDayIndex]?.timeline[editingTimelineIndex - 1]?.time 
                                : undefined,
                              editingTimelineIndex !== null && itineraryState[selectedDayIndex]?.timeline[editingTimelineIndex + 1] && addActivityPosition !== 'move'
                                ? itineraryState[selectedDayIndex]?.timeline[editingTimelineIndex + 1]?.time
                                : undefined
                            ).map((time) => (
                              <TouchableOpacity
                                key={time}
                                onPress={() => setNewActivityData({ ...newActivityData, time })}
                                style={{ marginRight: 8 }}
                              >
                                <View
                                  bgColor={newActivityData.time === time ? "#2752B7" : "#FFF"}
                                  px={16}
                                  py={10}
                                  borderRadius={20}
                                  borderWidth={1}
                                  borderColor={newActivityData.time === time ? "#2752B7" : "#E5E5E5"}
                                >
                                  <Text
                                    color={newActivityData.time === time ? "#FFF" : "#666"}
                                    fontSize="$sm"
                                    fontWeight="$semibold"
                                  >
                                    {time}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </RNScrollView>
                      </View>

                      {/* Título */}
                      <View mb={20}>
                        <View flexDirection="row" alignItems="center" mb={8}>
                          <FileText size={18} color="#2752B7" />
                          <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                            Título da Atividade *
                          </Text>
                        </View>
                        <RNTextInput
                          value={newActivityData.title}
                          onChangeText={(text: string) => setNewActivityData({ ...newActivityData, title: text })}
                          placeholder="Ex: Visita à Torre Eiffel"
                          placeholderTextColor="#999"
                          style={{
                            backgroundColor: "#F8F8F8",
                            borderRadius: 12,
                            padding: 14,
                            fontSize: 15,
                            color: "#000",
                            borderWidth: 1,
                            borderColor: "#E5E5E5"
                          }}
                        />
                      </View>

                      {/* Descrição */}
                      <View mb={20}>
                        <View flexDirection="row" alignItems="center" mb={8}>
                          <FileText size={18} color="#2752B7" />
                          <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                            Descrição (Opcional)
                          </Text>
                        </View>
                        <RNTextInput
                          value={newActivityData.description}
                          onChangeText={(text: string) => setNewActivityData({ ...newActivityData, description: text })}
                          placeholder="Detalhes adicionais sobre a atividade"
                          placeholderTextColor="#999"
                          multiline
                          numberOfLines={3}
                          style={{
                            backgroundColor: "#F8F8F8",
                            borderRadius: 12,
                            padding: 14,
                            fontSize: 15,
                            color: "#000",
                            borderWidth: 1,
                            borderColor: "#E5E5E5",
                            minHeight: 80,
                            textAlignVertical: "top"
                          }}
                        />
                      </View>

                      {/* Categoria */}
                      <View mb={20}>
                        <View flexDirection="row" alignItems="center" mb={8}>
                          <Tag size={18} color="#2752B7" />
                          <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                            Categoria
                          </Text>
                        </View>
                        <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {["Ponto Turístico", "Gastronomia", "Hospedagem", "Vida Noturna", "Parques", "Shopping", "Cultura", "Viagens"].map((cat) => (
                            <TouchableOpacity
                              key={cat}
                              onPress={() => setNewActivityData({ ...newActivityData, category: cat })}
                              style={{ marginRight: 8 }}
                            >
                              <View
                                bgColor={newActivityData.category === cat ? "#2752B7" : "#F8F8F8"}
                                px={16}
                                py={10}
                                borderRadius={20}
                                borderWidth={1}
                                borderColor={newActivityData.category === cat ? "#2752B7" : "#E5E5E5"}
                              >
                                <Text
                                  color={newActivityData.category === cat ? "#FFF" : "#666"}
                                  fontSize="$sm"
                                  fontWeight="$semibold"
                                >
                                  {cat}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </RNScrollView>
                      </View>

                      {/* Localização no Mapa */}
                      <View mb={10}>
                        <View flexDirection="row" alignItems="center" mb={8}>
                          <MapPin size={18} color="#2752B7" />
                          <Text fontSize="$sm" fontWeight="$semibold" color="#333" ml={8}>
                            Localização no Mapa (Opcional)
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowMapPicker(!showMapPicker)}>
                          <View
                            bgColor="#F8F8F8"
                            p={14}
                            borderRadius={12}
                            borderWidth={1}
                            borderColor="#E5E5E5"
                          >
                            <Text fontSize="$sm" color={selectedCoordinates ? "#000" : "#999"}>
                              {selectedCoordinates 
                                ? `${selectedCoordinates.latitude.toFixed(4)}; ${selectedCoordinates.longitude.toFixed(4)}`
                                : 'Toque para selecionar no mapa'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        {showMapPicker && (
                          <View mt={10}>
                            <View 
                              bgColor="#FFE5E5" 
                              p={10} 
                              borderRadius={8} 
                              borderWidth={1} 
                              borderColor="#FF0000"
                              mb={10}
                            >
                              <Text fontSize="$xs" color="#FF0000" textAlign="center" fontWeight="$semibold">
                                Clique duas vezes no mapa para selecionar a nova localização!
                              </Text>
                            </View>
                            <View borderRadius={12} overflow="hidden" height={250}>
                              <MapView
                                provider={PROVIDER_GOOGLE}
                                style={{ flex: 1 }}
                                initialRegion={{
                                  latitude: selectedCoordinates?.latitude || -23.5505,
                                  longitude: selectedCoordinates?.longitude || -46.6333,
                                  latitudeDelta: 0.0922,
                                  longitudeDelta: 0.0421,
                                }}
                                onPress={(e) => {
                                  setSelectedCoordinates(e.nativeEvent.coordinate);
                                }}
                              >
                                {selectedCoordinates && (
                                  <Marker
                                    coordinate={selectedCoordinates}
                                    title="Localização da atividade"
                                  />
                                )}
                              </MapView>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </RNScrollView>

                  {/* Footer */}
                  <View
                    p={20}
                    borderTopWidth={1}
                    borderTopColor="#F0F0F0"
                    flexDirection="row"
                    gap={10}
                  >
                    <Button
                      flex={1}
                      bgColor="#F0F0F0"
                      borderRadius={12}
                      onPress={() => {
                        setShowAddActivityModal(false);
                        setShowMapPicker(false);
                      }}
                    >
                      <ButtonText color="#666" fontWeight="$semibold">Cancelar</ButtonText>
                    </Button>
                    <Button
                      flex={1}
                      bgColor="#2752B7"
                      borderRadius={12}
                      onPress={handleSaveNewActivity}
                      disabled={!newActivityData.time || !newActivityData.title}
                      opacity={!newActivityData.time || !newActivityData.title ? 0.5 : 1}
                    >
                      <ButtonText color="#FFF" fontWeight="$semibold">
                        {addActivityPosition === 'move' ? 'Atualizar' : 'Salvar'}
                      </ButtonText>
                    </Button>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}

        <AddExpenseModal
          visible={showExpenseModal}
          onClose={() => {
            setShowExpenseModal(false);
            setCurrentExpenseContext(null);
          }}
          onAdd={handleAddExpense}
          defaultTitle={currentExpenseContext?.title || ""}
          defaultDescription={currentExpenseContext?.description || ""}
          defaultDate={currentExpenseContext?.date || ""}
          defaultLocation={currentExpenseContext?.location || ""}
          itineraryTitle={title}
        />

        <ExpenseAddedModal
          visible={showExpenseAddedModal}
          onClose={() => setShowExpenseAddedModal(false)}
          onViewExpenses={() => {
            setShowExpenseAddedModal(false);
            navigation.navigate("ExpenseControl");
          }}
          expenseTitle={lastAddedExpense?.title || ""}
          expenseAmount={lastAddedExpense?.amount || 0}
        />
      </Animated.View>
    </GestureDetector>
  );
}