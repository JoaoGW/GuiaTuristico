import { useState } from "react";

import { View, Text, ScrollView } from "@gluestack-ui/themed";

import { NotificationCard } from "@components/Cards/NotificationCard";

import { Earth } from "lucide-react-native";

export function Notifications(){
  const [notificacoes, setNotificacoes] = useState();

  return(
    <View>
      <View flexDirection="row" justifyContent="center" my={20}>
        <Text size="xl" color="$black" fontWeight="$bold">Notificações</Text>
      </View>
      <ScrollView flexDirection="column">
        <NotificationCard title="Exemplo de título" description="Exemplo de coisa de descrição, lembrando que este aqui pode ser maior como fazer?" routeIcon={ Earth } />
        <NotificationCard title="Exemplo de título" description="Exemplo de coisa de descrição, lembrando que este aqui pode ser maior como fazer?" routeIcon={ Earth } />
        <NotificationCard title="Exemplo de título" description="Exemplo de coisa de descrição, lembrando que este aqui pode ser maior como fazer?" routeIcon={ Earth } />
      </ScrollView>
    </View>
  )
}