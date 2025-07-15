import { Text, View } from "@gluestack-ui/themed";

import { MapPinCheckInside } from "lucide-react-native";

type CategoryBadgesProps = {
  iconSize: string | number,
  text: string
}

export function CategoryBadges({ iconSize, text }: CategoryBadgesProps){
  return (
    <View 
      flexDirection="row" 
      alignItems="center"
      bgColor="$blue800" 
      borderRadius={20} 
      p={10}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={.25}
      shadowRadius={3.84}
      elevation={5}
      minWidth="35%"
      justifyContent="center"
    >
      <MapPinCheckInside size={ iconSize } color="white" style={{ marginRight: 8 }} />
      <Text color="$white" fontWeight="bold" fontSize="$md">{ text }</Text>
    </View>
  )
}