import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { View, Text, Pressable } from "@gluestack-ui/themed";

import { NotificationCard } from "@components/Cards/NotificationCard";
import { ChooseDialog } from "@components/ChooseDialog";
import { NotificationError } from "@components/Errors/NotificationsError";

import { useNotificationStore } from '@utils/notificationStore';

import { Earth, Trash } from "lucide-react-native";
import { TitleAndBack } from "@components/TitleBack";

export function Notifications() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

  const { notifications, removeNotification } = useNotificationStore();

  const drag = useSharedValue(0);
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  const RightAction = (notificationId: number) => {
    return (
      <Pressable 
        style={[styles.rightAction, styleAnimation]} 
        onPress={() => {
          setSelectedNotificationId(notificationId);
          setShowAlertDialog(true);
        }}
      >
        <Trash color="#FFF" size={30}/>
      </Pressable>
    );
  };

  const handleDeleteNotification = () => {
    if (selectedNotificationId !== null) {
      removeNotification(selectedNotificationId);
      setShowAlertDialog(false);
      setSelectedNotificationId(null);
    }
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
    <SafeAreaView style={{ flex: 1 }}>
      <TitleAndBack pageTitle="Notificações" />
      <Reanimated.ScrollView>
        {
          notifications.length > 0
            ?
              notifications.map((data) => (
                <ReanimatedSwipeable 
                  key={ data.id } 
                  containerStyle={ styles.container } 
                  friction={2} 
                  rightThreshold={40} 
                  renderRightActions={ () => RightAction(data.id) }
                >
                  <NotificationCard
                    id={ data.id }
                    title={ data.title }
                    description={ data.description }
                    routeIcon={Earth}
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
            isOpen={showAlertDialog}
            setShowAlertDialog={ setShowAlertDialog }
            performAction={ handleDeleteNotification }
          />
      }
    </SafeAreaView>
  );
}