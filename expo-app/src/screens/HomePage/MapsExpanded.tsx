import { useRef } from "react";
import { SafeAreaView, StatusBar } from "react-native";

import MapView from "react-native-maps";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { View } from "@gluestack-ui/themed";

import { ButtonIconRight } from "@components/Buttons/ButtonIconRight";
import { Maps } from "@components/Maps/Maps";
import { SlideUp } from "@components/Sliders/SlideUpPlaces";
import { RecenterButton } from "@components/Maps/RecenterButton";

import { AuthNavigationProp } from "@routes/auth.routes";

import { Place } from "../../../@types/PlacesTypes";

type SlideUpPlacesRouteProp = RouteProp<{ params: { places: Place[], isLoading: boolean } }, 'params'>;

export function MapsExpanded() {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<SlideUpPlacesRouteProp>();
  const { places, isLoading } = route.params;

  const mapUserPositionRef = useRef<MapView | null>(null);

  const recenterMap = () => {
    if (mapUserPositionRef.current) {
      mapUserPositionRef.current.animateToRegion(
        {
          latitude: places[0]?.geometry.location.lat || 0,
          longitude: places[0]?.geometry.location.lng || 0,
          latitudeDelta: 0.0102,
          longitudeDelta: 0.0021
        }, 1000
      );
    }
  };

  return (
    <View flex={1} position="relative">
      <View flexDirection="row" alignItems="center">
        <ButtonIconRight
          textContent="Voltar"
          action={() => navigation.goBack()}
          styles={{
            position: 'absolute',
            backgroundColor: "#FDFDFD",
            borderRadius: 15,
            paddingVertical: 5,
            paddingHorizontal: 10,
            top: 10,
            left: 10,
            zIndex: 1,
            marginTop: 50
          }}
        />
        <RecenterButton
          onPress={ recenterMap }
          styles={{
            position: 'absolute',
            paddingVertical: 10,
            paddingHorizontal: 10,
            top: 10,
            right: 10,
            zIndex: 1,
            marginTop: 50
          }}
        />
      </View>
        <StatusBar barStyle="dark-content"/>
        <View style={{ flex: 1 }}>
          <Maps ref={mapUserPositionRef} />
          <SafeAreaView>
            <SlideUp places={places} isLoading={isLoading} />
          </SafeAreaView>
        </View>
    </View>
  )
}