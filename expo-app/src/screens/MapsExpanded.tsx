import { useNavigation } from "@react-navigation/native";

import { View } from "@gluestack-ui/themed";

import { ButtonIconRight } from "@components/Buttons/ButtonIconRight";
import { Maps } from "@components/Maps/Maps";

import { AuthNavigationProp } from "@routes/auth.routes";
import { SlideUp } from "@components/Sliders/SlideUp";

export function MapsExpanded() {
  const navigation = useNavigation<AuthNavigationProp>();
  
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
        <SlideUp />
      </View>
    </View>
  )
}