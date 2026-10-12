import { useState, useCallback } from "react";
import { SafeAreaView, StatusBar, Image as RNImage, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { ScrollView, Text, View, Spinner } from "@gluestack-ui/themed";

import { IconButton } from "@components/Buttons/IconButton";

import { AuthNavigationProp } from "@routes/auth.routes";

import { useFavoritePlaces } from "../../hooks/useFavoritePlaces";

import DefaultImage from '@assets/adaptive-icon.png';

import { ArrowLeft, Trash2, MapPin, Calendar, Heart } from "lucide-react-native";

export function FavoritePlaces() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { favoritePlaces, isLoading, removeFavoritePlace, clearAllFavorites, reloadFavorites } = useFavoritePlaces();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      reloadFavorites();
    }, [reloadFavorites])
  );

  const handleRemoveFavorite = async (placeId: string, placeTitle: string) => {
    Alert.alert(
      "Remover Favorito",
      `Deseja remover "${placeTitle}" dos favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(placeId);
            await removeFavoritePlace(placeId);
            setIsDeleting(null);
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Limpar Todos os Favoritos",
      "Deseja realmente remover todos os locais favoritos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: clearAllFavorites
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View px={15} mt={5} flexDirection="row" justifyContent="space-between" alignItems="center">
        <IconButton 
          icon={ArrowLeft}
          iconSize="xl"
          iconColor="#000"
          buttonBgColor="transparent"
          buttonFunctionality={() => navigation.goBack()}
          styles={{ marginLeft: -15 }}
        />
        {favoritePlaces.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <View flexDirection="row" alignItems="center" px={15} py={8} bgColor="#FF3B30" borderRadius={20}>
              <Trash2 size={18} color="#FFF" style={{ marginRight: 5 }} />
              <Text color="#FFF" fontSize="$sm" fontWeight="$semibold">Limpar Tudo</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Text color='#2752B7' ml={25} mt={20} fontSize="$3xl" fontWeight="$bold">Locais Favoritados</Text>
      
      <Text color='#666' ml={25} mt={5} fontSize="$sm">
        {favoritePlaces.length === 0 
          ? "Nenhum local favoritado ainda" 
          : `${favoritePlaces.length} ${favoritePlaces.length === 1 ? 'local favorito' : 'locais favoritos'}`
        }
      </Text>

      {/* Lista de Favoritos */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
        {isLoading ? (
          <View flex={1} justifyContent="center" alignItems="center" py={50}>
            <Spinner size="large" color="#2752B7" />
            <Text mt={15} color="#666">Carregando favoritos...</Text>
          </View>
        ) : favoritePlaces.length === 0 ? (
          <View 
            bgColor="#FFF"
            borderRadius={15}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={5}
            elevation={5}
            mx={15}
            p={30}
            alignItems="center"
          >
            <Heart size={60} color="#CCC" />
            <Text fontSize="$xl" fontWeight="$semibold" color="#666" mt={15} textAlign="center">
              Nenhum local favoritado
            </Text>
            <Text fontSize="$sm" color="#999" mt={10} textAlign="center">
              Adicione locais aos seus favoritos durante a visualização dos seus roteiros
            </Text>
          </View>
        ) : (
          favoritePlaces.map((place, index) => (
            <View
              key={place.id}
              bgColor="#FFF"
              borderRadius={15}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.1}
              shadowRadius={5}
              elevation={5}
              mx={15}
              mb={15}
              overflow="hidden"
            >
              {/* Imagem do Local */}
              {place.images && place.images.length > 0 ? (
                <RNImage
                  source={{ uri: place.images[0] }}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="cover"
                />
              ) : (
                <RNImage
                  source={DefaultImage}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="cover"
                />
              )}

              {/* Informações do Local */}
              <View p={15}>
                {/* Título e Botão de Remover */}
                <View flexDirection="row" justifyContent="space-between" alignItems="flex-start" mb={10}>
                  <View flex={1} mr={10}>
                    <Text fontSize="$xl" fontWeight="$bold" color="#000" mb={5}>
                      {place.title}
                    </Text>
                    {place.category && (
                      <View 
                        bgColor="#2752B7" 
                        alignSelf="flex-start" 
                        px={10} 
                        py={4} 
                        borderRadius={12}
                        mb={8}
                      >
                        <Text fontSize="$xs" color="#FFF" fontWeight="$semibold">
                          {place.category}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleRemoveFavorite(place.id, place.title)}
                    disabled={isDeleting === place.id}
                  >
                    <View 
                      bgColor="#FF3B30" 
                      p={10} 
                      borderRadius={100}
                      opacity={isDeleting === place.id ? 0.5 : 1}
                    >
                      {isDeleting === place.id ? (
                        <Spinner size="small" color="#FFF" />
                      ) : (
                        <Trash2 size={20} color="#FFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Descrição */}
                <Text fontSize="$sm" color="#666" mb={15} lineHeight={20}>
                  {place.description}
                </Text>

                {/* Informações Adicionais */}
                <View gap={10}>
                  {/* Roteiro de Origem */}
                  <View flexDirection="row" alignItems="center">
                    <View bgColor="#F0F0F0" p={8} borderRadius={8} mr={10}>
                      <Heart size={18} color="#2752B7" fill="#2752B7" />
                    </View>
                    <View flex={1}>
                      <Text fontSize="$xs" color="#999" fontWeight="$medium">Roteiro</Text>
                      <Text fontSize="$sm" color="#000" fontWeight="$semibold">{place.itineraryTitle}</Text>
                    </View>
                  </View>

                  {/* Localização */}
                  <View flexDirection="row" alignItems="center">
                    <View bgColor="#F0F0F0" p={8} borderRadius={8} mr={10}>
                      <MapPin size={18} color="#2752B7" />
                    </View>
                    <View flex={1}>
                      <Text fontSize="$xs" color="#999" fontWeight="$medium">Localização</Text>
                      <Text fontSize="$sm" color="#000" fontWeight="$semibold">{place.location}</Text>
                    </View>
                  </View>

                  {/* Data */}
                  <View flexDirection="row" alignItems="center">
                    <View bgColor="#F0F0F0" p={8} borderRadius={8} mr={10}>
                      <Calendar size={18} color="#2752B7" />
                    </View>
                    <View flex={1}>
                      <Text fontSize="$xs" color="#999" fontWeight="$medium">Data da Visita</Text>
                      <Text fontSize="$sm" color="#000" fontWeight="$semibold">{formatDate(place.date)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

        <View mb={30} />
      </ScrollView>
    </SafeAreaView>
  );
}
