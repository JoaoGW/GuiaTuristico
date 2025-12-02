import { useState, useCallback } from "react";
import { StatusBar, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import {
  Box,
  Text,
  View,
  Image,
  Input,
  InputField,
  Icon,
  Button,
  ButtonIcon,
} from "@gluestack-ui/themed";

import { TitleAndBack } from "@components/TitleBack";
import { NavigationBar } from "@components/NavigationBar";

import destinationsData from "@data/destinations.json";

import { AuthNavigationProp } from "@routes/auth.routes";

import { Search, MapPin, Star, TrendingUp, Map, Globe, Compass, Sparkles, Navigation, ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const destinations = destinationsData
  .filter((item: any) => item.id && item.title && item.image)
  .map((item: any) => ({
    id: item.id,
    name: item.title,
    img: { uri: item.image },
    country: item.country || 'País',
    rating: item.rating || 0,
    tags: item.tags || []
  }));

export function RecommendedDestinations() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredDestinations(destinations);
    } else {
      const filtered = destinations.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.country.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, []);

  const renderDestinationCard = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DestinationDetail', { destinationId: item.id })}
      style={{
        marginBottom: 20,
        marginLeft: index % 2 === 0 ? 0 : 8,
        marginRight: index % 2 === 0 ? 8 : 0,
      }}
    >
      <Box
        w={CARD_WIDTH}
        borderRadius="$3xl"
        overflow="hidden"
        bg="#fff"
        shadowColor="#000"
        shadowOpacity={0.25}
        shadowOffset={{ width: 0, height: 8 }}
        shadowRadius={16}
        elevation={12}
        style={{
          transform: [{ translateY: -4 }],
        }}
      >
        <Box
          h={220}
          overflow="hidden"
          position="relative"
        >
          <Image
            source={item.img}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            alt={`Imagem de ${item.name}`}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
            }}
          />
          <View
            position="absolute"
            top={10}
            right={10}
            bg="rgba(255, 255, 255, 0.95)"
            borderRadius="$full"
            px={10}
            py={6}
            flexDirection="row"
            alignItems="center"
            gap={4}
            shadowColor="#000"
            shadowOpacity={0.2}
            shadowRadius={4}
            elevation={3}
          >
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text color="#1F2937" fontSize="$sm" fontWeight="$bold">
              {item.rating.toFixed(1)}
            </Text>
          </View>
          <View
            position="absolute"
            bottom={12}
            left={12}
            right={12}
          >
            <Text
              fontSize="$lg"
              fontWeight="$bold"
              color="#fff"
              numberOfLines={1}
              mb={4}
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              {item.name}
            </Text>
            <View flexDirection="row" alignItems="center" gap={4}>
              <MapPin size={14} color="#fff" />
              <Text fontSize="$sm" color="#fff" numberOfLines={1} fontWeight="$medium">
                {item.country}
              </Text>
            </View>
          </View>
        </Box>
      </Box>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View mb={24}>
      <View px={16}>
        <Input
          borderRadius="$2xl"
          bg="#fff"
          borderWidth={2}
          borderColor="#E5E7EB"
          px={16}
          py={4}
          alignItems="center"
          shadowColor="#000"
          shadowOpacity={0.05}
          shadowRadius={8}
          elevation={2}
          focusable={true}
          w="105%"
          alignSelf="center"
        >
          <Icon as={ Search } mr={8} color="#2752B7" size="lg" />
          <InputField
            placeholder="Buscar destinos ou países..."
            value={ searchQuery }
            onChangeText={ handleSearch }
            placeholderTextColor="#9CA3AF"
            fontSize="$md"
          />
        </Input>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      py={60}
      px={20}
    >
      <View
        bg="#F3F4F6"
        borderRadius="$full"
        p={24}
        mb={20}
      >
        <Search size={56} color="#9CA3AF" />
      </View>
      <Text
        fontSize="$xl"
        fontWeight="$bold"
        color="#1F2937"
        textAlign="center"
        mb={8}
      >
        Nenhum destino encontrado
      </Text>
      <Text
        fontSize="$md"
        color="#6B7280"
        textAlign="center"
      >
        Tente buscar por outro nome ou país
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View px={4} pb={100} pt={10}>
      <Box
        bg="#fff"
        borderRadius="$3xl"
        p={20}
        shadowColor="#000"
        shadowOpacity={0.08}
        shadowRadius={12}
        elevation={4}
        borderWidth={1}
        borderColor="#E5E7EB"
      >
        <View flexDirection="row" alignItems="center" gap={12} mb={16}>
          <View
            bg="#DBEAFE"
            borderRadius="$full"
            p={12}
          >
            <Navigation size={24} color="#2752B7" strokeWidth={2.5} />
          </View>
          <View flex={1}>
            <Text fontSize="$lg" fontWeight="$bold" color="#1F2937" mb={4}>
              Locais Próximos a Você
            </Text>
            <Text fontSize="$sm" color="#6B7280" lineHeight="$md">
              Descubra destinos incríveis na sua região
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MapsExpanded', { places: [], loading: false })}
        >
          <View
            bg="#2752B7"
            borderRadius="$2xl"
            px={20}
            py={14}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={8}
            shadowColor="#2752B7"
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={4}
          >
            <Text color="#fff" fontSize="$md" fontWeight="$bold">
              Explorar Locais Próximos
            </Text>
            <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </Box>
    </View>
  );

  return (
    <View flex={1} bg="#F9FAFB">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <TitleAndBack pageTitle="Explorar Destinos" />
      
      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 0,
        }}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <NavigationBar />
    </View>
  );
}
