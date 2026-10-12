import { useEffect, useEffectEvent, useState, useRef, useCallback } from "react";

import { Platform, SafeAreaView, StatusBar, Image as RNImage, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from 'expo-constants';

import { Button, ButtonText, ScrollView, Text, View } from "@gluestack-ui/themed";

import { ButtonIconLeft } from "@components/Buttons/ButtonIconLeft";
import { ItineraryCreateDialog } from "@components/Itinerary/ItineraryCreateDialog";
import { UnlockProgressModal } from "@components/Itinerary/UnlockProgressModal";
import { ItinerariesError } from "@components/Errors/ItinerariesError";
import { PastItinerariesError } from "@components/Errors/PastItinerariesError";
import { IconButton } from "@components/Buttons/IconButton";
import { ChooseGenerateStyle } from "@components/Itinerary/ChooseGenerateStyle";
import { ItineraryPreferencesModal } from "@components/Itinerary/ItineraryPreferencesModal";
import { ItineraryCard } from "@components/Cards/ItineraryCard";
import { ItineraryActionsDialog } from "@components/Dialogs/ItineraryActionsDialog";
// REIMPORT CASO SEJA NECESSÁRIO PARA TESTES: import { SimulatedAd } from "@components/SimulatedAd";

import { userTrips } from "@data/itineraries";

import { AuthNavigationProp } from "@routes/auth.routes";

import { CreatingItinerary } from "../../../@types/CreatingItinerary";

import DefaultImage from '@assets/adaptive-icon.png';

import { utilsGetSelectedTags } from "@utils/selectedTagsStore";

import { ArrowLeft, ChevronRight, Coins, Crown, Heart, Plus } from "lucide-react-native";

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

type MenuItineraryTypes = {
  dialog: boolean,
  filters: "Planejados" | "Rascunhos" | "Passados"
}

export function GenerateItineraryMenu(){
  const [showAlertDialog, setShowAlertDialog] = useState<MenuItineraryTypes["dialog"]>(false);
  const [showRandomItineraryModal, setShowRandomItineraryModal] = useState<MenuItineraryTypes["dialog"]>(false);
  const [showChooseGenerateModal, setShowChooseGenerateModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<MenuItineraryTypes["filters"]>("Planejados");
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [disableAdIsLoading, setDisableAdIsLoading] = useState<boolean>(false);
  const [showAdProgressModal, setShowAdProgressModal] = useState<boolean>(false);
  const [watchedAdsCount, setWatchedAdsCount] = useState<number>(0);
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [allUserItineraries, setAllUserItineraries] = useState<CreatingItinerary[]>([]);
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState<number | null>(null);
  const [showActionsDialog, setShowActionsDialog] = useState<boolean>(false);

  const totalAdsRequired = 3;
  // O bloqueio só vale enquanto há modal aberto ou anúncio em exibição.
  const isAdActionDisabled = disableAdIsLoading && (showAdProgressModal || !!showAlertDialog || isAdPlaying);
  
  const navigation = useNavigation<AuthNavigationProp>();
  const rewardedRef = useRef<any>(null);


  // Configuração do AdMob
  const getCorrectIdForPlatform = () => {
    if(Platform.OS === "android"){
      return process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID;
    }
    return process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID;
  }

  // Sem módulo de anúncios, `rewardedRef` fica vazio e a visualização é simulada.
  const loadNewAd = () => {
    if (isExpoGo || !RewardedAd || !RewardedAdEventType || !TestIds) {
      return;
    }

    try {
      const adUnitId = __DEV__ ? TestIds.REWARDED : getCorrectIdForPlatform();
      const newRewarded = RewardedAd.createForAdRequest(adUnitId, {
        keywords: [
          "adventure travel",
          "airbnb",
          "bleisure travel",
          "booking",
          "car rental",
          "cheap flights",
          "destination dupes",
          "eco tourism",
          "family vacation",
          "fashion",
          "glamping",
          "hotels",
          "honeymoon packages",
          "luxury resorts",
          "solo travel",
          "sustainable travel",
          "tourism",
          "tourist attractions",
          "travel",
          "travel insurance",
          "wellness retreat",
          "wine tours"
        ],
      });

      rewardedRef.current = newRewarded;

      const unsubscribeLoaded = newRewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setAdLoaded(true);
        },
      );
      
      const unsubscribeEarned = newRewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward: any) => {
          setWatchedAdsCount(prev => prev + 1);
          setDisableAdIsLoading(false);
          setTimeout(() => {
            loadNewAd();
          }, 3000);
        },
      );

      const unsubscribeClosed = newRewarded.addAdEventListener(
        'onAdClosed',
        () => {
          setIsAdPlaying(false);
          setDisableAdIsLoading(false);
        },
      );

      newRewarded.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
      };
    } catch (error) {
      console.log('Error loading ad:', error);
      rewardedRef.current = null;
    }
  };

  const handleNewItinerary = () => {
    if (watchedAdsCount === totalAdsRequired) {
      setDisableAdIsLoading(false);
      setWatchedAdsCount(0);
      setShowChooseGenerateModal(true);
    } else {
      setShowAdProgressModal(true);
    }
  };

  const handleCloseAdProgressModal = () => {
    setShowAdProgressModal(false);
    setDisableAdIsLoading(false);
  };

  const handleContinueAfterAd = () => {
    if (watchedAdsCount < totalAdsRequired) {
      if (adLoaded && rewardedRef.current && !isExpoGo) {
        // Tentar mostrar anúncio real
        setDisableAdIsLoading(true);
        try {
          setIsAdPlaying(true);
          setShowAdProgressModal(false);
          rewardedRef.current.show();
        } catch (error) {
          console.log('Error showing ad:', error);
          setAdLoaded(false);
          setDisableAdIsLoading(false);
          setIsAdPlaying(false);
          setShowAdProgressModal(true);
        }
      } else {
        // Fallback: simular visualização de anúncio (para desenvolvimento ou quando anúncio não carrega)
        // DEBUG: console.log('Ad not available, simulating ad view');
        setWatchedAdsCount(prev => prev + 1);
        setDisableAdIsLoading(false);
      }
    } else {
      setShowAdProgressModal(false);
      setDisableAdIsLoading(false);
      setShowChooseGenerateModal(true);
    }
  };

  const handleUpgradeToPremium = () => {
    setShowAdProgressModal(false);
    setDisableAdIsLoading(false);
    navigation.navigate("PremiumPlans");
  };

  const handleCloseChooseGenerateModal = () => {
    setShowChooseGenerateModal(false);
  };

  const handleOnFinishAdProgress = () => {
    setShowAdProgressModal(false);
    setShowChooseGenerateModal(true);
  }

  const daysUntilTravel = (targetDate: Date | string | number): number => {
    const today = new Date();

    // Verificar se targetDate é válido e converter se necessário
    let dateObj: Date;

    if (targetDate instanceof Date) {
      dateObj = new Date(targetDate);
    } else if (typeof targetDate === 'string' || typeof targetDate === 'number') {
      dateObj = new Date(targetDate);
    } else {
      console.warn('targetDate inválido:', targetDate);
      return 0;
    }

    if (isNaN(dateObj.getTime())) {
      return 0;
    }

    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    const timeDifference = dateObj.getTime() - today.getTime();
    const millisecondsInDay = 1000 * 60 * 60 * 24;

    const daysDifference = Math.floor(timeDifference / millisecondsInDay);

    return daysDifference;
  }

  // Função para obter o último itinerário válido (não passado)
  const getLatestValidItinerary = (): CreatingItinerary | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filtra itinerários que não passaram ainda
    const validItineraries = allUserItineraries.filter(itinerary => {
      const endDate = new Date(itinerary.dateEnd);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    });

    // Retorna o último itinerário adicionado (último do array)
    return validItineraries.length > 0 ? validItineraries[validItineraries.length - 1] : null;
  };

  // Função para filtrar itinerários com base no filtro selecionado
  const getFilteredItineraries = (): CreatingItinerary[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allUserItineraries.filter(itinerary => {
      const endDate = new Date(itinerary.dateEnd);
      endDate.setHours(0, 0, 0, 0);
      
      // Se não tiver status definido, considera como Rascunho
      const status = itinerary.status || "Rascunho";

      if (selectedFilter === "Planejados") {
        return status === "Planejado" && endDate >= today;
      } else if (selectedFilter === "Rascunhos") {
        return status === "Rascunho";
      } else if (selectedFilter === "Passados") {
        return endDate < today || status === "Passado";
      }
      return false;
    });
  };

  // Função para editar itinerário
  const handleEditItinerary = (itinerary: CreatingItinerary) => {
    navigation.navigate("ItineraryMapMenu", { 
      itineraryData: itinerary, 
      userPreferences: itinerary.visitPreferences || utilsGetSelectedTags(), 
      visaIssue: itinerary.visa === true ? "Positive" : itinerary.visa === false ? "Negative" : itinerary.visa 
    });
  };

  // Função para excluir itinerário
  const handleDeleteItinerary = async (index: number) => {
    try {
      const updatedItineraries = [...allUserItineraries];
      updatedItineraries.splice(index, 1);
      
      await AsyncStorage.setItem('@eztripai_allUserTripItineraries', JSON.stringify(updatedItineraries));
      setAllUserItineraries(updatedItineraries);
    } catch (error) {
      console.error('Erro ao excluir itinerário:', error);
    }
  };

  // Função para mover itinerário entre status
  const handleMoveItinerary = async (index: number) => {
    try {
      const updatedItineraries = [...allUserItineraries];
      const currentStatus = updatedItineraries[index].status || "Rascunho";
      
      // Alternar entre Planejado e Rascunho
      updatedItineraries[index].status = currentStatus === "Planejado" ? "Rascunho" : "Planejado";
      
      await AsyncStorage.setItem('@eztripai_allUserTripItineraries', JSON.stringify(updatedItineraries));
      setAllUserItineraries(updatedItineraries);
    } catch (error) {
      console.error('Erro ao mover itinerário:', error);
    }
  };

  const onMount = useEffectEvent(() => {
    loadNewAd();
  });

  useEffect(() => {
    onMount();
  }, []);

  useEffect(() => {
    const ifEmptyRestoreDefaultUserTripData = async (value: object) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@eztripai_allUserTripItineraries', jsonValue);
        return value;
      } catch (e) {
        console.log("Erro ao salvar os itinerários do usuário: ", e);
        return value;
      }
    };
    
    const getUserTripsData = async () => {
      try {
        // PARA HARD RESET DOS ITINERÁRIOS PADRÕES: await AsyncStorage.clear();
        const jsonValue = await AsyncStorage.getItem('@eztripai_allUserTripItineraries');
        if (jsonValue) {
          setAllUserItineraries(JSON.parse(jsonValue));
        } else {
          await ifEmptyRestoreDefaultUserTripData(userTrips);
          setAllUserItineraries(userTrips);
        }
      } catch (e) {
        console.log("Erro ao capturar os itinerários do usuário: ", e);
      }
    };

    getUserTripsData();
  }, []);

  // Recarregar itinerários quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      const reloadItineraries = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@eztripai_allUserTripItineraries');
          if (jsonValue) {
            setAllUserItineraries(JSON.parse(jsonValue));
          }
        } catch (e) {
          console.log("Erro ao recarregar itinerários: ", e);
        }
      };

      reloadItineraries();
    }, [])
  );
  
  return(
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View px={15} mt={5} flexDirection="row" justifyContent="space-between" alignItems="center">
          <IconButton 
            icon={ ArrowLeft }
            iconSize="xl"
            iconColor="#000"
            buttonBgColor="transparent"
            buttonFunctionality={ () => navigation.goBack() }
            styles={{ marginLeft: -15 }}
          />
          <ButtonIconLeft 
            textContent="Novo Itinerário" 
            icon={ Plus } 
            action={ handleNewItinerary }
            iconDimension={24}
            textColor="#FFF"
            disabled={ isAdActionDisabled }
            loading={ !adLoaded }
            iconStyles={{ marginRight: 5, color: '#FFF' }}
            buttonStyles={{ backgroundColor: '#2752B7', borderRadius: 20 }}
          />
        </View>

        <Text color='#2752B7' ml={25} mt={20} fontSize="$3xl" fontWeight="$bold">Itinerários de Viagem</Text>

        {(() => {
          const latestItinerary = getLatestValidItinerary();
          
          if (!latestItinerary) {
            return (
              <View
                bgColor="#ffffff"
                borderRadius={15}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.2}
                shadowRadius={5}
                elevation={5}
                maxHeight={250}
                justifyContent="center"
                alignItems="center"
                alignSelf="center"
                w="95%"
                py={15}
                mt={15}
              >
                <View>
                  <ItinerariesError />
                  <ButtonIconLeft
                    textContent="Novo Itinerário"
                    icon={Plus}
                    action={ handleNewItinerary }
                    iconDimension={24}
                    textColor="#FFF"
                    disabled={ isAdActionDisabled }
                    loading={ !adLoaded }
                    iconStyles={{ marginRight: 5, color: '#FFF' }}
                    buttonStyles={{ backgroundColor: '#2752B7', borderRadius: 20 }}
                    styles={{ alignSelf: "center" }}
                  />
                </View>
              </View>
            );
          }

          const firstImage = (latestItinerary.itinerary as any)?.[0]?.images?.[0];
          const imageUri = latestItinerary.coverImage || firstImage;

          return (
            <TouchableOpacity
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                width: "95%",
                minHeight: 260,
                marginTop: 15
              }}
              onPress={ () => { 
                navigation.navigate("ItineraryMapMenu", { 
                  itineraryData: latestItinerary, 
                  userPreferences: latestItinerary.visitPreferences || utilsGetSelectedTags(), 
                  visaIssue: latestItinerary.visa === true ? "Positive" : latestItinerary.visa === false ? "Negative" : latestItinerary.visa 
                });
              }}
              activeOpacity={0.8}
            >
              <View>
                {imageUri ? (
                  <RNImage
                    source={{ uri: imageUri }}
                    style={{
                      width: 350,
                      height: 210,
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginTop: 13
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <RNImage
                    source={DefaultImage}
                    style={{
                      width: 350,
                      height: 210,
                      borderRadius: 10,
                      alignSelf: 'center',
                      marginTop: 13
                    }}
                    resizeMode="cover"
                  />
                )}
                <View px={15}>
                  <View flexDirection="row" alignItems="center" justifyContent="space-between" my={10}>
                    <Text fontSize="$2xl" fontWeight="$bold" color="$black" flex={1} numberOfLines={1}>
                      {latestItinerary.title}
                    </Text>
                    <Text fontSize="$md" fontWeight="$semibold" color="$gray600" ml={10}>
                      Em {daysUntilTravel(latestItinerary.dateBegin)} dias
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })()}

        <Button
          bgColor="#FFF"
          borderRadius={15}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={5}
          elevation={5}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          alignSelf="center"
          w="95%"
          minHeight={50}
          onPress={ () => navigation.navigate("FavoritePlaces") }
          mt={20}
        >
          <View flexDirection="row" alignItems="center">
            <Heart size={25} color="#2752B7" style={{ marginRight: 8 }} />
            <View>
              <Text fontSize="$sm" fontWeight="$bold">Locais Favoritados</Text>
            </View>
          </View>
          <ChevronRight style={{ marginRight: 10 }} />
        </Button>
        <Button
          bgColor="#ffffff"
          borderRadius={15}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={5}
          elevation={5}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          alignSelf="center"
          w="95%"
          minHeight={50}
          onPress={ () => navigation.navigate("ExpenseControl") }
          mt={10}
        >
          <View flexDirection="row" alignItems="center">
            <Coins size={25} color="#2752B7" style={{ marginRight: 8 }} />
            <View>
              <Text fontSize="$sm" fontWeight="$bold">Controle de Gastos</Text>
            </View>
          </View>
          <ChevronRight style={{ marginRight: 10 }} />
        </Button>
        <Button
          bgColor="#ffffff"
          borderRadius={15}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={5}
          elevation={5}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          alignSelf="center"
          w="95%"
          minHeight={50}
          onPress={ () => navigation.navigate("PremiumPlans") }
          mt={10}
        >
          <View flexDirection="row" alignItems="center">
            <Crown size={25} color="#2752B7" style={{ marginRight: 8 }} />
            <View>
              <Text fontSize="$sm" fontWeight="$bold">Upgrade para o Premium</Text>
            </View>
          </View>
          <ChevronRight style={{ marginRight: 10 }} />
        </Button>

        <View flexDirection="row" justifyContent="center" mt={30} mx={15}>
          <Button 
            borderTopLeftRadius={15} 
            borderBottomLeftRadius={15} 
            borderTopRightRadius={0} 
            borderBottomRightRadius={0} 
            w="33%" 
            bgColor={ selectedFilter === "Planejados" ? "#2752B7" : "lightgray" }
            onPress={ () => { setSelectedFilter("Planejados") }}
          >
            <ButtonText 
              color={ selectedFilter === "Planejados" ? "$white" : "$black" } 
              textAlign="center" 
              fontSize="$sm"
            >Planejados</ButtonText>
          </Button>
          <Button 
            borderTopLeftRadius={0} 
            borderBottomLeftRadius={0} 
            borderTopRightRadius={0} 
            borderBottomRightRadius={0} 
            w="33%" 
            bgColor={ selectedFilter === "Rascunhos" ? "#2752B7" : "lightgray" }
            onPress={ () => { setSelectedFilter("Rascunhos") }}
          >
            <ButtonText 
              color={ selectedFilter === "Rascunhos" ? "$white" : "$black" } 
              textAlign="center" 
              fontSize="$sm"
            >Rascunhos</ButtonText>
          </Button>
          <Button 
            borderTopLeftRadius={0} 
            borderBottomLeftRadius={0} 
            borderTopRightRadius={15} 
            borderBottomRightRadius={15} 
            w="33%" 
            bgColor={ selectedFilter === "Passados" ? "#2752B7" : "lightgray" }
            onPress={ () => { setSelectedFilter("Passados") }}
          >
            <ButtonText 
              color={ selectedFilter === "Passados" ? "$white" : "$black" } 
              textAlign="center" 
              fontSize="$sm"
            >Passados</ButtonText>
          </Button>
        </View>

        {
          getFilteredItineraries().length > 0 ? (
            <View
              bgColor="#ffffff"
              borderRadius={15}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={5}
              elevation={5}
              alignSelf="center"
              w="95%"
              py={15}
              mt={15}
              mb={95}
            >
              <View width="100%" px={15}>
                {
                  getFilteredItineraries().map((itinerary, index) => {
                    const firstImage = (itinerary.itinerary as any)?.[0]?.images?.[0];
                    const imageUri = itinerary.coverImage || firstImage;
                    
                    // Encontrar o índice real no array original
                    const originalIndex = allUserItineraries.findIndex(item => 
                      item.title === itinerary.title && 
                      new Date(item.dateBegin).getTime() === new Date(itinerary.dateBegin).getTime()
                    );
                    
                    return (
                      <ItineraryCard
                        key={index}
                        title={itinerary.title}
                        dateBegin={new Date(itinerary.dateBegin).toLocaleDateString('pt-BR')}
                        dateEnd={new Date(itinerary.dateEnd).toLocaleDateString('pt-BR')}
                        imageUri={imageUri}
                        daysUntil={daysUntilTravel(itinerary.dateBegin)}
                        onPress={() => handleEditItinerary(itinerary)}
                        onOptionsPress={() => {
                          setSelectedItineraryIndex(originalIndex);
                          setShowActionsDialog(true);
                        }}
                      />
                    );
                  })
                }
              </View>
            </View>
          ) : (
            <View
              bgColor="#ffffff"
              borderRadius={15}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={5}
              elevation={5}
              minHeight={200}
              justifyContent="center"
              alignItems="center"
              alignSelf="center"
              w="95%"
              py={15}
              mt={15}
              mb={95}
            >
              {
                selectedFilter === "Passados" ? (
                  <PastItinerariesError />
                ) : (
                  <>
                    <ItinerariesError />
                    <ButtonIconLeft
                      textContent="Novo Itinerário"
                      icon={Plus}
                      action={ handleNewItinerary }
                      iconDimension={24}
                      textColor="#FFF"
                      disabled={ isAdActionDisabled }
                      loading={ !adLoaded }
                      iconStyles={{ marginRight: 5, color: '#FFF' }}
                      buttonStyles={{ backgroundColor: '#2752B7', borderRadius: 20 }}
                      styles={{ alignSelf: "center" }}
                    />
                  </>
                )
              }
            </View>
          )
        }
      </ScrollView>

      <ChooseGenerateStyle 
        showModal={ showChooseGenerateModal }
        setShowModal={ handleCloseChooseGenerateModal }
        onDefinedItinerary={ () => {
          setShowChooseGenerateModal(false);
          setShowAlertDialog(true);
        }}
        onRandomItinerary={ () => {
          setShowChooseGenerateModal(false);
          setShowRandomItineraryModal(true);
        }}
      />

      {
        showRandomItineraryModal
          ? <ItineraryPreferencesModal showAlertDialog={ showRandomItineraryModal } setShowAlertDialog={ setShowRandomItineraryModal } />
          : null
      }
      {
        showAlertDialog
          ? <ItineraryCreateDialog showAlertDialog={ showAlertDialog } setShowAlertDialog={ setShowAlertDialog } />
          : null
      }

      <UnlockProgressModal
        visible={ showAdProgressModal }
        onClose={ handleCloseAdProgressModal }
        onContinue={ handleContinueAfterAd }
        showItineraryCreate={ handleOnFinishAdProgress }
        onUpgradeToPremium={ handleUpgradeToPremium }
        watchedAds={ watchedAdsCount }
        totalAds={ totalAdsRequired }
      />

      {selectedItineraryIndex !== null && (
        <ItineraryActionsDialog
          showAlertDialog={showActionsDialog}
          currentStatus={allUserItineraries[selectedItineraryIndex]?.status || "Rascunho"}
          handleClose={() => {
            setShowActionsDialog(false);
            setSelectedItineraryIndex(null);
          }}
          onEdit={() => {
            if (selectedItineraryIndex !== null) {
              handleEditItinerary(allUserItineraries[selectedItineraryIndex]);
            }
          }}
          onDelete={() => {
            if (selectedItineraryIndex !== null) {
              handleDeleteItinerary(selectedItineraryIndex);
            }
          }}
          onMove={() => {
            if (selectedItineraryIndex !== null) {
              handleMoveItinerary(selectedItineraryIndex);
            }
          }}
        />
      )}
    </SafeAreaView>
  )
}