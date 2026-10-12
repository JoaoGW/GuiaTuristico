import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritePlace } from '../../@types/FavoritePlacesTypes';

const FAVORITE_PLACES_STORAGE_KEY = '@eztripai_userFavoritePlaces';

// Leitura sem efeitos de estado: usada na carga inicial e nas recargas.
async function readStoredFavoritePlaces(): Promise<FavoritePlace[] | null> {
  const jsonValue = await AsyncStorage.getItem(FAVORITE_PLACES_STORAGE_KEY);
  return jsonValue ? JSON.parse(jsonValue) : null;
}

export function useFavoritePlaces() {
  const [favoritePlaces, setFavoritePlaces] = useState<FavoritePlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os favoritos do AsyncStorage
  const loadFavoritePlaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const places = await readStoredFavoritePlaces();
      if (places) {
        setFavoritePlaces(places);
      }
    } catch {
      // DEBUG: console.error('Erro ao carregar locais favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adiciona um novo local aos favoritos
  const addFavoritePlace = useCallback(async (place: FavoritePlace) => {
    try {
      const currentFavorites = [...favoritePlaces];
      
      // Verifica se o local já está nos favoritos
      const alreadyExists = currentFavorites.some(fav => fav.id === place.id);
      
      if (!alreadyExists) {
        const newFavorites = [...currentFavorites, place];
        setFavoritePlaces(newFavorites);
        await AsyncStorage.setItem(FAVORITE_PLACES_STORAGE_KEY, JSON.stringify(newFavorites));
      }
    } catch {
      // DEBUG: console.error('Erro ao adicionar local aos favoritos:', error);
    }
  }, [favoritePlaces]);

  // Remove um local dos favoritos
  const removeFavoritePlace = useCallback(async (placeId: string) => {
    try {
      const updatedFavorites = favoritePlaces.filter(place => place.id !== placeId);
      setFavoritePlaces(updatedFavorites);
      await AsyncStorage.setItem(FAVORITE_PLACES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    } catch {
      // DEBUG: console.error('Erro ao remover local dos favoritos:', error);
    }
  }, [favoritePlaces]);

  // Verifica se um local está nos favoritos
  const isFavorite = useCallback((placeId: string) => {
    return favoritePlaces.some(place => place.id === placeId);
  }, [favoritePlaces]);

  // Limpa todos os favoritos
  const clearAllFavorites = useCallback(async () => {
    try {
      setFavoritePlaces([]);
      await AsyncStorage.removeItem(FAVORITE_PLACES_STORAGE_KEY);
    } catch {
      // DEBUG: console.error('Erro ao limpar favoritos:', error);
    }
  }, []);

  // Carga inicial: `isLoading` já começa em true.
  useEffect(() => {
    readStoredFavoritePlaces()
      .then((places) => {
        if (places) {
          setFavoritePlaces(places);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return {
    favoritePlaces,
    isLoading,
    addFavoritePlace,
    removeFavoritePlace,
    isFavorite,
    clearAllFavorites,
    reloadFavorites: loadFavoritePlaces
  };
}