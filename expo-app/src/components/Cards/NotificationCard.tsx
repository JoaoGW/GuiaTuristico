import { useNavigation } from "@react-navigation/native";

import { Pressable, Text, View } from "@gluestack-ui/themed";

import { AuthNavigationProp } from "@routes/auth.routes";

import { LucideIcon, ArrowRightToLine } from "lucide-react-native";

type NotificationProps = {
  routeIcon: LucideIcon,
  title: string,
  description: string
}

export function NotificationCard({ routeIcon: RouteIcon, title, description }: NotificationProps){
  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <Pressable
      p={16}
      borderRadius={8}
      flexDirection="row"
      alignItems="center"
      shadowOffset={{ width: 0, height: 2 }}
      shadowColor="#000"
      shadowOpacity={.1}
      shadowRadius={4}
      elevation={3}
      bgColor="#FFF"
      w="97%"
      justifyContent="space-between"
      mb={5}
      alignSelf="center"
    >
      <View flexDirection="row" alignItems="center" flex={1} maxWidth="90%">
        <View bgColor="$light100" p={5} borderRadius={15} mr={10}>
          <RouteIcon size={32} color="#e9ad2d" />
        </View>
        <View flex={1}>
          <Text fontSize={18} fontWeight="$bold" color="#000" textAlign="left">{ title }</Text>
          <Text fontSize={14} color="#000" textAlign="left">{ description }</Text>
        </View>
      </View>
      <ArrowRightToLine size={20} color="#000" />
    </Pressable>
  )
}