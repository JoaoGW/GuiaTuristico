import { View } from "@gluestack-ui/themed";
import MapView from "react-native-maps";

export function MapsExpanded(){
  return(
    <View flex={1}>
      <MapView />
    </View>
  )
}