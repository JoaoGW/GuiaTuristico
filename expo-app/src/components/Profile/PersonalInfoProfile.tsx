import { View, Text } from "@gluestack-ui/themed";

import { LucideIcon } from "lucide-react-native";

type PersonalInfoTypes = {
  icon: LucideIcon,
  topic: string,
  information: string
  style?: Object
}

export function PersonalInfoProfile({ icon: Icon, topic, information, style }: PersonalInfoTypes){
  return(
    <View flexDirection="row" alignItems="center" style={ style } w="50%" mb={10}>
      <Icon size={25} color="#2752B7" style={{ marginRight: 8 }} />
      <View>
        <Text fontSize="$sm">{ topic }</Text>
        <Text fontSize="$xs" fontWeight="$bold">{ information }</Text>
      </View>
    </View>
  )
}