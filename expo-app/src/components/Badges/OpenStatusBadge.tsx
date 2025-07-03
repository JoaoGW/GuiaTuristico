import { Text, View } from "@gluestack-ui/themed";

import { DoorOpen, DoorClosed } from "lucide-react-native";

type BadgeProps = {
  openStatus: boolean | undefined
}

export function OpenStatusBadge({ openStatus }: BadgeProps){
  return(
    <View 
      bgColor={ openStatus === true ? "$green600" : "$red600" } 
      alignItems="center"
      gap={5}
      borderRadius={7}
      p={5}
      flexDirection="row"
    >
      { openStatus === true ? <DoorOpen color="#FFF" /> : <DoorClosed color="#FFF" /> }
      <Text color="$white" size="md">
        { openStatus === true ? "Aberto" : "Fechado" }
      </Text>
    </View>
  )
}