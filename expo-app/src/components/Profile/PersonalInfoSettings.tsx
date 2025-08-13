import { View, Text, Button } from "@gluestack-ui/themed";

import { ChevronRight, LucideIcon } from "lucide-react-native";

type PersonalInfoPreferencesTypes = {
  icon: LucideIcon,
  settingsTitle: string,
  functionality: () => void,
  style?: Object
}

export function PersonalInfoSettings({ icon: Icon, settingsTitle, functionality, style }: PersonalInfoPreferencesTypes){
  return(
    <Button
      bgColor="#ffffff"
      borderRadius={15}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.2}
      shadowRadius={5}
      elevation={5}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      alignSelf="center"
      w="95%"
      minHeight={50}
      onPress={ functionality }
      style={ style }
      mb={10}
    >
      <View flexDirection="row" alignItems="center">
        <Icon size={25} color="#2752B7" style={{ marginRight: 8 }} />
        <View flexDirection="column">
          <Text fontSize="$sm" fontWeight="$bold">{ settingsTitle }</Text>
        </View>
      </View>
      <ChevronRight style={{ marginRight: 10 }} />
    </Button>
  )
}