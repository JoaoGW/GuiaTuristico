import { useContext, useEffect, useState, useImperativeHandle, forwardRef, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Linking from 'expo-linking';

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
  itineraryPlaces?: Array<PointsPlaces>
}

export const Maps = forwardRef<MapView, MapsProps>((props, ref) => {
  const { location } = useContext(LocationContext);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useImperativeHandle(ref, () => mapUserPositionRef.current as MapView);
  
  const { initialLatitude, initialLongitude, itineraryPlaces } = props;
  const mapUserPositionRef = useRef<MapView | null>(null);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!location) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://SEU-IP-AQUI:3000/api/googlePlacesApi?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch nearby places");
        }

        const data = await response.json();
        setPlaces(data.places || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [location]);

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
          latitudeDelta: 0.0102,
          longitudeDelta: 0.0021,
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