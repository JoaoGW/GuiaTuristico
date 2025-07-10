import { useState } from "react";
import { StyleSheet } from "react-native";

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { View, Text, Pressable } from "@gluestack-ui/themed";

import { NotificationCard } from "@components/Cards/NotificationCard";
import { ChooseDialog } from "@components/ChooseDialog";

import { Earth, Trash } from "lucide-react-native";

export function Notifications() {
  const [notificacoes, setNotificacoes] = useState();
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const drag = useSharedValue(0);
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  const RightAction = () => {
    return (
      <Pressable style={[styles.rightAction, styleAnimation]} onPress={ () => setShowAlertDialog(true) }>
        <Trash color="#FFF" size={30}/>
      </Pressable>
    )
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
    },
    rightAction: {
      backgroundColor: "red",
      width: 100,
      height: "95%",
      marginLeft: -25,
      justifyContent: "center",
      alignItems: "center"
    },
  });

  return (
    <>
      <View flexDirection="row" justifyContent="center" my={20}>
        <Text size="xl" color="$black" fontWeight="$bold">
          Notificações
        </Text>
      </View>
      <Reanimated.ScrollView>
        <ReanimatedSwipeable containerStyle={ styles.container } friction={2} rightThreshold={40} renderRightActions={ RightAction }>
          <NotificationCard
            title="Exemplo de título"
            description="Exemplo de coisa de descrição, lembrando que este aqui pode ser maior como fazer?"
            routeIcon={Earth}
          />
        </ReanimatedSwipeable>
      </Reanimated.ScrollView>
      {
        showAlertDialog && 
          <ChooseDialog 
            title="Excluir Notificação"
            message="Você tem certeza que deseja excluir esta notificação?"
            isOpen={ showAlertDialog }
            setShowAlertDialog={ setShowAlertDialog }
          />
      }
    </>
  );
}