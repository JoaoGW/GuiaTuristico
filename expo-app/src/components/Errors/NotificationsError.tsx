import { Box, Text } from "@gluestack-ui/themed";

import { BellOff } from "lucide-react-native";

export function NotificationError(){
  return (
    <Box flex={1} px={4} py={20} alignItems="center" justifyContent="center">
      <BellOff color="red" size={50} />
      <Text textAlign="center" mt={10} size="lg">
        Não há novas notificações no momento!
      </Text>
    </Box>
  )
}