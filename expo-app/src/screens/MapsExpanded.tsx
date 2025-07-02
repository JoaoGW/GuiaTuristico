import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { View } from "@gluestack-ui/themed";

import { ButtonIconRight } from "@components/Buttons/ButtonIconRight";
import { Maps } from "@components/Maps/Maps";

import { AuthNavigationProp } from "@routes/auth.routes";
import { SlideUp } from "@components/Sliders/SlideUpPlaces";

import { Place } from "../../@types/PlacesTypes";

type SlideUpPlacesRouteProp = RouteProp<{ params: { places: Place[], isLoading: boolean } }, 'params'>;

export function MapsExpanded() {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<SlideUpPlacesRouteProp>();
  const { places, isLoading } = route.params;
  
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ButtonIconRight 
        textContent="Voltar" 
        action={ () => navigation.goBack() } 
        styles={{ 
          position: 'absolute', 
          backgroundColor: "#FDFDFD", 
          borderRadius: 15,
          paddingVertical: 5,
          paddingHorizontal: 10,
          top: 10,
          left: 10,
          zIndex: 1
        }}
      />
      <View style={{ flex: 1 }}>
        <Maps />
        <SlideUp places={ places } isLoading={ isLoading }/>
      </View>
    </View>
  )
}