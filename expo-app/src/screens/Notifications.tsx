import { View, Text } from "@gluestack-ui/themed";

export function Notifications(){
  return(
    <View>
      <View flexDirection="row" justifyContent="center" mt={20}>
        <Text size="xl" color="$black" fontWeight="$bold">Notificações</Text>
      </View>
    </View>
  )
}