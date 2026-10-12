import { useContext, useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Linking from 'expo-linking';

import { API_URL } from '../../config';

import { View, Text } from "@gluestack-ui/themed";

import { Loading } from "@components/Loading/Loading";

import { LocationContext } from "@contexts/requestDeviceLocation";

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

interface PointsPlaces {
  title: string,
  description: string,
  coordinate: {
    latitude: number,
    longitude: number
  }
}

interface MapsProps {
  initialLatitude?: string,
  initialLongitude?: string,
  itineraryPlaces?: PointsPlaces[],
  externalPlaces?: Place[]
}

export const Maps = forwardRef<MapView, MapsProps>(function Maps(props, ref) {
  const { location } = useContext(LocationContext);
  const [places, setPlaces] = useState<Place[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useImperativeHandle(ref, () => mapUserPositionRef.current as MapView);
  
  const { initialLatitude, initialLongitude, itineraryPlaces, externalPlaces } = props;
  const mapUserPositionRef = useRef<MapView | null>(null);

  useEffect(() => {
    // Se recebeu lugares externos, usar eles ao invés de buscar
    if (externalPlaces && externalPlaces.length > 0) {
      setPlaces(externalPlaces);
      return;
    }

    const fetchNearbyPlaces = async () => {
      if (!location) return;

      try {
        const response = await fetch(
          `${API_URL}/googlePlacesApi?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch nearby places");
        }

        const data = await response.json();
        setPlaces(data.results || []);
      } catch {
        // Falha na busca mantém o mapa sem marcadores de lugares próximos.
      }
    };

    fetchNearbyPlaces();
  }, [location, externalPlaces]);

  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      let latitudeTransformed = Number(initialLatitude); 
      let longitudeTransformed = Number(initialLongitude); 

      setLatitude(latitudeTransformed);
      setLongitude(longitudeTransformed);

      if (mapUserPositionRef.current && latitudeTransformed && longitudeTransformed) {
        mapUserPositionRef.current.animateToRegion({
          latitude: latitudeTransformed,
          longitude: longitudeTransformed,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }
    }
  }, [initialLatitude, initialLongitude]);

  // Anima para a primeira coordenada quando o dia selecionado mudar
  useEffect(() => {
    if (itineraryPlaces && itineraryPlaces.length > 0 && mapUserPositionRef.current) {
      const firstPlace = itineraryPlaces[0];
      mapUserPositionRef.current.animateToRegion({
        latitude: firstPlace.coordinate.latitude,
        longitude: firstPlace.coordinate.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [itineraryPlaces]);

  if (!location) {
    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Não foi possível determinar sua localização. Verifique as permissões do aplicativo nas configurações.</Text>
        <Loading />
      </View>
    );
  }

  return (
    <View flex={1}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        ref={ mapUserPositionRef }
        initialRegion={{
          latitude: latitude ?? location.coords.latitude,
          longitude: longitude ?? location.coords.longitude,
          latitudeDelta: 0.01173,
          longitudeDelta: 0.002415,
        }}
        showsUserLocation
      >
        {
          itineraryPlaces && itineraryPlaces.length > 0
            ?
            <>
              { itineraryPlaces.map((points, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: points.coordinate.latitude,
                    longitude: points.coordinate.longitude,
                  }}
                  title={points.title}
                  description={points.description}
                  onPress={() => {
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${points.coordinate.latitude},${points.coordinate.longitude}`)
                  }}
                />
              ))}
              { itineraryPlaces.length > 1 && (
                <Polyline
                  coordinates={itineraryPlaces.map(place => ({
                    latitude: place.coordinate.latitude,
                    longitude: place.coordinate.longitude,
                  }))}
                  strokeColor="#FF0000"
                  strokeWidth={3}
                />
              )}
            </>
            :
            places.map((place, index) => (
              <Marker
                key={ index }
                coordinate={{
                  latitude: place.geometry.location.lat,
                  longitude: place.geometry.location.lng,
                }}
                title={ place.name }
                description={`${ place.opening_hours?.open_now ? "Open Now" : "Closed" } - ${ place.vicinity }`}
              />
            ))
        }
      </MapView>
    </View>
  );
});