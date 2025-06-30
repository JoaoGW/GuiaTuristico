import { useContext, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

import { View, Text } from '@gluestack-ui/themed';

import { LocationContext } from '@contexts/requestDeviceLocation';
import { Loading } from '@components/Loading';

interface Place {
  name: string;
  vicinity: string;
  opening_hours?: {
    open_now: boolean;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export function Maps() {
  const { location } = useContext(LocationContext);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3000/api/googlePlacesApi?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch nearby places');
        }

        const data = await response.json();
        console.log('Nearby Restaurants:', data.places); // Log all restaurants to the console
        setPlaces(data.places || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [location]);

  if (!location) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Obtendo localização...</Text>
        <Loading />
      </View>
    );
  }

  return (
    <View flex={1}>
      <MapView
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0102,
          longitudeDelta: 0.0021,
        }}
        zoomEnabled
        showsUserLocation
      >
        {/* Render markers for nearby restaurants */}
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            description={`${
              place.opening_hours?.open_now ? 'Open Now' : 'Closed'
            } - ${place.vicinity}`}
          />
        ))}
      </MapView>
    </View>
  );
}