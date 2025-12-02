import { useState, useEffect } from "react";
import { StatusBar, TouchableOpacity, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-drawer-layout";

import * as Location from 'expo-location';
import { GlassView, GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';

import { getAuth } from "firebase/auth";

import {
  Box,
  Text,
  Button,
  Input,
  InputField,
  Icon,
  Avatar,
  AvatarImage,
  Pressable,
  ScrollView,
  Image,
  View,
  ButtonText,
  ButtonIcon,
} from "@gluestack-ui/themed";

import { ConnectionErrorAlerter } from "@components/Errors/ConnectionErrorAlerter";
import { DestinationStories } from "@components/Stories/DestinationStories";

import destinationsData from "@data/destinations.json";

import { AuthNavigationProp } from "@routes/auth.routes";

import { Search, Plane, Menu, Building, TentTree, Crown, Bell, MessageCircle, Home as HomeIcon, BookMarked, User, Settings, WifiOff } from "lucide-react-native";

const destinations = destinationsData
  .filter((item: any) => item.id && item.title && item.image)
  .map((item: any) => ({
    id: item.id,
    name: item.title,
    img: { uri: item.image }
  }));

const recommended = destinations.slice(0, 5);
const popular = destinations.slice(5, 10);

export function Home() {
  const navigation = useNavigation<AuthNavigationProp>();
  const auth = getAuth();
  const user = auth.currentUser;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Home');
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [hasNearbyError, setHasNearbyError] = useState(false);
  const [storiesVisible, setStoriesVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);

  useEffect(() => {
    if (drawerOpen) {
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('light-content');
    }
  }, [drawerOpen]);

  useEffect(() => {
    fetchNearbyPlaces();
  }, []);

  const handleOpenStories = (destination: any) => {
    setSelectedDestination(destination);
    setStoriesVisible(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredDestinations([]);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
      const filtered = destinations.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  };

  const handleSelectDestination = (destinationId: number) => {
    setSearchQuery("");
    setShowSearchResults(false);
    navigation.navigate('DestinationDetail', { destinationId });
  };

  const fetchNearbyPlaces = async () => {
    try {
      setLoadingNearby(true);
      setHasNearbyError(false);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        setNearbyPlaces(popular);
        setLoadingNearby(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `http://SEU-IP-AQUI:3000/api/googlePlacesApi?latitude=${latitude}&longitude=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const formattedPlaces = data.results.map((place: any, index: number) => ({
            id: `nearby-${index}`,
            name: place.name,
            img: { uri: place.photo || 'https://via.placeholder.com/160x230' },
            rating: place.rating || 0,
          }));
          setNearbyPlaces(formattedPlaces);
        } else {
          setNearbyPlaces(popular);
        }
      } else {
        setNearbyPlaces(popular);
      }
    } catch (error: any) {
      console.error('Erro ao buscar lugares próximos:', error);
      if (error.message === 'Network request failed' && !showConnectionError) {
        setShowConnectionError(true);
        setHasNearbyError(true);
      }
      setNearbyPlaces([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  const navItems = [
    {
      key: 'Home',
      icon: HomeIcon,
      label: 'Início',
      action: () => {
        setCurrentRoute('Home');
        setDrawerOpen(false);
      }
    },
    {
      key: 'GenerateItinerary',
      icon: BookMarked,
      label: 'Roteiros',
      action: () => {
        setCurrentRoute('GenerateItinerary');
        navigation.navigate('GenerateItineraryFeaturesIntroduction');
        setDrawerOpen(false);
      }
    },
    {
      key: 'AIChat',
      icon: MessageCircle,
      label: 'Chat IA',
      action: () => {
        setCurrentRoute('AIChat');
        navigation.navigate('AIMascotIntroduction');
        setDrawerOpen(false);
      }
    },
    {
      key: 'Notifications',
      icon: Bell,
      label: 'Notificações',
      action: () => {
        setCurrentRoute('Notifications');
        navigation.navigate('Notifications');
        setDrawerOpen(false);
      }
    },
    {
      key: 'Premium',
      icon: Crown,
      label: 'Premium',
      action: () => {
        setCurrentRoute('Premium');
        navigation.navigate('PremiumPlans');
        setDrawerOpen(false);
      }
    },
    {
      key: 'Profile',
      icon: User,
      label: 'Perfil',
      action: () => {
        setCurrentRoute('Profile');
        navigation.navigate('Profile');
        setDrawerOpen(false);
      }
    },
    {
      key: 'Settings',
      icon: Settings,
      label: 'Configurações',
      action: () => {
        setCurrentRoute('Settings');
        navigation.navigate('UserPreferences', {} as any);
        setDrawerOpen(false);
      }
    }
  ];

  const renderDrawerContent = () => (
    <View flex={1} bg="#fff" pt={60} px={20}>
      <View flexDirection="row" alignItems="center" mb={30}>
        <Image
          source={require("@assets/icon.png")}
          style={{ width: 60, height: 60, marginRight: 12 }}
          alt="Logo EzTripAI"
        />
        <Text size="2xl" bold color="#2752B7">EzTripAI</Text>
      </View>

      <View flex={1}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentRoute === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={item.action}
              style={{ marginBottom: 8 }}
            >
              <View
                flexDirection="row"
                alignItems="center"
                gap={15}
                bg={isActive ? "rgba(39, 82, 183, 0.08)" : "transparent"}
                p={12}
                borderRadius={12}
              >
                <IconComponent size={24} color={isActive ? "#2752B7" : "#6B7280"} />
                <Text
                  size="lg"
                  fontWeight={isActive ? "$semibold" : "$medium"}
                  color={isActive ? "#2752B7" : "#6B7280"}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        borderTopWidth={1}
        borderTopColor="#E5E7EB"
        pt={16}
        pb={20}
      >
        <TouchableOpacity onPress={() => {
          navigation.navigate('Profile');
          setDrawerOpen(false);
        }}>
          <View flexDirection="row" alignItems="center" gap={12}>
            <Avatar size="md" borderWidth={2} borderColor="#2752B7">
              {
                user?.photoURL
                  ?
                  <AvatarImage
                    source={{
                      uri: user?.photoURL
                    }}
                  />
                  :
                  <AvatarImage
                    source={{
                      uri: "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"
                    }}
                  />
              }
            </Avatar>
            <View flex={1}>
              <Text size="md" fontWeight="$semibold" color="#1F2937">
                { user?.displayName }
              </Text>
              <Text size="sm" color="#6B7280">
                { user?.email }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerType="front"
    >
      <View style={{ flex: 1 }} >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <View>
          <Image
            source={require("@assets/santiago_farellones.jpg")}
            resizeMode="cover"
            alt=""
            position="absolute"
            top={0}
            left={0}
            right={0}
            w="100%"
            h={380}
            zIndex={-1}
          />
          <Image
            source={require("@assets/gradient.jpg")}
            resizeMode="cover"
            alt=""
            position="absolute"
            top={0}
            left={0}
            right={0}
            w="100%"
            h={380}
            opacity={0.5}
          />

          <View justifyContent="space-between" mt={60} mx={10}>
            <View justifyContent="space-between" alignItems="center" flexDirection="row" mb={20}>
              <Button bg="rgba(255, 255, 255, 0.2)" borderRadius="$full" w={45} h={45} onPress={() => setDrawerOpen(true)}>
                <ButtonIcon as={Menu} size="lg" color="#fff" />
              </Button>
              <View flexDirection="row" alignItems="center" gap={15}>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                  <Icon as={Bell} color="#fff" size="xl" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                  <Avatar size="md" borderWidth={2} borderColor="#2752B7">
                    {
                      user?.photoURL
                        ?
                        <AvatarImage
                          source={{
                            uri: user?.photoURL
                          }}
                        />
                        :
                        <AvatarImage
                          source={{
                            uri: "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"
                          }}
                        />
                    }
                  </Avatar>
                </TouchableOpacity>
              </View>
            </View>
            <View mt={-15}>
              <Text size="3xl" bold color="#fff">
                Olá, { user?.displayName }!
              </Text>
              <Text size="lg" fontWeight="$semibold" color="#fff">
                Aonde gostaria de ir hoje?
              </Text>
            </View>
            <View mt={20} px={20} flexDirection="row" justifyContent="center">
              <GlassContainer spacing={8} style={{ flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
                <GlassView style={{ width: 80, height: 100, borderRadius: 16 }} glassEffectStyle="clear">
                  {isLiquidGlassAvailable() ? (
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Plane size={28} color="#fff" />
                      <Text fontSize="$sm" fontWeight="$medium" color="#fff" textAlign="center" mt={8}>Vôos</Text>
                    </TouchableOpacity>
                  ) : (
                    <Button w={80} h={100} borderRadius="$2xl" bg="rgba(151, 151, 151, 0.4)" borderWidth={2} borderColor="$blue400" flexDirection="column" alignItems="center" justifyContent="center">
                      <ButtonIcon as={Plane} size="xl" />
                      <ButtonText w="180%" textAlign="center" fontWeight={"$medium"}>Vôos</ButtonText>
                    </Button>
                  )}
                </GlassView>

                <GlassView style={{ width: 80, height: 100, borderRadius: 16 }} glassEffectStyle="clear">
                  {isLiquidGlassAvailable() ? (
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Building size={28} color="#fff" />
                      <Text fontSize="$sm" fontWeight="$medium" color="#fff" textAlign="center" mt={8}>Hotel</Text>
                    </TouchableOpacity>
                  ) : (
                    <Button w={80} h={100} borderRadius="$2xl" bg="rgba(151, 151, 151, 0.4)" borderWidth={2} borderColor="$blue400" flexDirection="column" alignItems="center" justifyContent="center">
                      <ButtonIcon as={Building} size="xl" />
                      <ButtonText w="180%" textAlign="center" fontWeight={"$medium"}>Hotel</ButtonText>
                    </Button>
                  )}
                </GlassView>

                <GlassView style={{ width: 80, height: 100, borderRadius: 16 }} glassEffectStyle="clear">
                  {isLiquidGlassAvailable() ? (
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <TentTree size={28} color="#fff" />
                      <Text fontSize="$sm" fontWeight="$medium" color="#fff" textAlign="center" mt={8}>Férias</Text>
                    </TouchableOpacity>
                  ) : (
                    <Button w={80} h={100} borderRadius="$2xl" bg="rgba(151, 151, 151, 0.4)" borderWidth={2} borderColor="$blue400" flexDirection="column" alignItems="center" justifyContent="center">
                      <ButtonIcon as={TentTree} size="xl" />
                      <ButtonText w="200%" textAlign="center" fontWeight={"$medium"}>Holiday</ButtonText>
                    </Button>
                  )}
                </GlassView>

                <GlassView style={{ width: 80, height: 100, borderRadius: 16 }} glassEffectStyle="clear">
                  {isLiquidGlassAvailable() ? (
                    <TouchableOpacity
                      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => navigation.navigate('PremiumPlans')}
                    >
                      <Crown size={28} color="#fff" />
                      <Text fontSize="$sm" fontWeight="$medium" color="#fff" textAlign="center" mt={8}>Premium</Text>
                    </TouchableOpacity>
                  ) : (
                    <Button w={80} h={100} borderRadius="$2xl" bg="rgba(151, 151, 151, 0.4)" borderWidth={2} borderColor="$blue400" flexDirection="column" alignItems="center" justifyContent="center" onPress={() => navigation.navigate('PremiumPlans')}>
                      <ButtonIcon as={Crown} size="xl" />
                      <ButtonText w="200%" textAlign="center" fontWeight={"$medium"}>Premium</ButtonText>
                    </Button>
                  )}
                </GlassView>
              </GlassContainer>
            </View>
          </View>

          <View px="$4" bottom={-20} left={0} right={0} zIndex={10}>
            <View>
              <Input
                borderRadius="$full"
                bg="#fff"
                px="$4"
                py="$2"
                alignItems="center"
                shadowColor="#000"
                shadowOpacity={0.1}
                shadowRadius={10}
                elevation={5}
              >
                <Icon as={ Search } mr="$2" color="#999" />
                <InputField 
                  placeholder="Aonde ir?" 
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
              </Input>
              
              {showSearchResults && (
                <View
                  bg="#fff"
                  borderRadius="$2xl"
                  mt={6}
                  shadowColor="#000"
                  shadowOpacity={0.1}
                  shadowRadius={10}
                  elevation={5}
                  maxHeight={250}
                >
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((item, index) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleSelectDestination(item.id)}
                        >
                          <View
                            flexDirection="row"
                            alignItems="center"
                            p="$3"
                            borderBottomWidth={index < filteredDestinations.length - 1 ? 1 : 0}
                            borderBottomColor="#F3F4F6"
                          >
                            <Icon as={Search} size="sm" color="#6B7280" mr="$3" />
                            <Text fontSize="$md" color="#1F2937">
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View p="$4" alignItems="center">
                        <Text fontSize="$sm" color="#6B7280" textAlign="center" lineHeight="$md">
                          Este destino ainda não está disponível no EZ Trip AI. Aguarde as próximas atualizações de roteiros!
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          bg="#fff"
          borderTopLeftRadius={13}
          borderTopRightRadius={13}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 20 }}
        >
          <Box ml={15}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Box flexDirection="row">
                {destinations.map((item, index) => (
                  <TouchableOpacity key={item.id} onPress={() => handleOpenStories(destinationsData.find(d => d.id === item.id))}>
                    <View alignItems="center" ml={index === 0 ? 0 : 16}>
                      <Box
                        w={70}
                        h={70}
                        borderRadius="$full"
                        overflow="hidden"
                        borderWidth={2}
                        borderColor="#0A84FF"
                        bg="#fff"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Image
                          source={item.img}
                          style={{ width: 66, height: 66, borderRadius: 33 }}
                          alt=""
                        />
                      </Box>
                      <Text mt="$2" size="sm" bold>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </Box>
            </ScrollView>
          </Box>

          <Box mt={28} pl={15}>
            <View justifyContent="space-between" mb="$2" flexDirection="row" alignItems="center">
              <Text size="lg" bold fontWeight="$bold">
                Recomendados para você
              </Text>
              <Pressable mr={12} onPress={() => navigation.navigate('RecommendedDestinations')}>
                <Text size="sm" color="#0A84FF" fontWeight="$semibold">
                  Ver tudo
                </Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommended.map((item, index) => (
                <TouchableOpacity key={item.id} onPress={() => navigation.navigate('DestinationDetail', { destinationId: item.id })}>
                  <Box
                    w={160}
                    h={230}
                    borderRadius="$3xl"
                    overflow="hidden"
                    bg="#f0f0f0"
                    shadowColor="#000"
                    shadowOpacity={0.1}
                    shadowRadius={6}
                    mr="$3"
                  >
                  <Image
                    source={item.img}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                    alt={`Imagem de ${item.name}`}
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    w="100%"
                    py="$2"
                    bg="rgba(0,0,0,0.4)"
                    alignItems="center"
                  >
                    <Text color="#fff" bold>
                      {item.name}
                    </Text>
                  </Box>
                </Box>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Box>

          <Box mt={32} pl={15}>
            <View flexDirection="row" justifyContent="space-between" alignItems="center" mb="$2">
              <Text size="lg" bold fontWeight="$bold">
                Destinos próximos populares
              </Text>
              {loadingNearby ? (
                <Text size="sm" color="#6B7280">Carregando...</Text>
              ) : (
                <Pressable mr={12} onPress={() => navigation.navigate('MapsExpanded', { places: nearbyPlaces, loading: false })}>
                  <Text size="sm" color="#0A84FF" fontWeight="$semibold">
                    Ver mapa
                  </Text>
                </Pressable>
              )}
            </View>

            {hasNearbyError ? (
              <View
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={40}
                px={20}
              >
                <WifiOff size={48} color="#ff0000" strokeWidth={2} />
                <Text
                  size="md"
                  color="#EF4444"
                  textAlign="center"
                  mt={16}
                  fontWeight="$medium"
                >
                  Encontramos um erro ao buscar os locais próximos a você. Por favor, verifique sua conexão à internet.
                </Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {nearbyPlaces.map((item, index) => (
                  <Box
                    key={item.id}
                    w={160}
                    h={230}
                    borderRadius="$2xl"
                    overflow="hidden"
                    bg="#f0f0f0"
                    shadowColor="#000"
                    shadowOpacity={0.1}
                    shadowRadius={6}
                    mr="$3"
                  >
                    <Image
                      source={item.img}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                      alt={`Imagem de ${item.name}`}
                    />
                    <Box
                      position="absolute"
                      bottom={0}
                      w="100%"
                      py="$2"
                      bg="rgba(0,0,0,0.4)"
                      alignItems="center"
                    >
                      <Text color="#fff" bold>
                        {item.name}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </ScrollView>
            )}
          </Box>
        </ScrollView>
      </View>

      <ConnectionErrorAlerter
        showModal={showConnectionError}
        setShowModal={setShowConnectionError}
      />

      <DestinationStories
        visible={storiesVisible}
        onClose={() => setStoriesVisible(false)}
        destination={selectedDestination}
      />
    </Drawer>
  );
}