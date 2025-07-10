import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { View, Text, Pressable } from "@gluestack-ui/themed";

import { NotificationCard } from "@components/Cards/NotificationCard";
import { ChooseDialog } from "@components/ChooseDialog";
import { NotificationError } from "@components/Errors/NotificationsError";

import NotificationsData from '@data/notifications.json';

import { NotificationsTypes } from "../../@types/NotificationsTypes";

import { Earth, Trash, CircleX } from "lucide-react-native";

export function Notifications() {
  const [notificacoes, setNotificacoes] = useState<NotificationsTypes[]>([]);
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

  useEffect(() => {
    setNotificacoes(NotificationsData.map(data => ({
      ...data,
      routeIcon: CircleX,
    })));
  }, []);

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
        {
          notificacoes.length > 0
            ?
              notificacoes.map((data, index) => (
                <ReanimatedSwipeable key={index} containerStyle={ styles.container } friction={2} rightThreshold={40} renderRightActions={ RightAction }>
                  <NotificationCard
                    id={ index }
                    title={ data.title }
                    description={ data.description }
                    routeIcon={ Earth }
                  />
                </ReanimatedSwipeable>
              ))
            :
            <NotificationError />
        }
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