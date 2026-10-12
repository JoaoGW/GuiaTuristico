import { useState } from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Pressable } from "@gluestack-ui/themed";

import { NotificationCard } from "@components/Cards/NotificationCard";
import { ChooseDialog } from "@components/Dialogs/ChooseDialog";
import { NotificationError } from "@components/Errors/NotificationsError";

import { useNotificationStore } from '@utils/notificationStore';

import { Earth, Trash } from "lucide-react-native";
import { TitleAndBack } from "@components/TitleBack";

type RightActionProps = {
  drag: SharedValue<number>;
  onPress: () => void;
};

function RightAction({ drag, onPress }: RightActionProps) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  return (
    <Reanimated.View style={[styles.rightAction, styleAnimation]}>
      <Pressable
        style={styles.rightActionButton}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Excluir notificação"
      >
        <Trash color="#FFF" size={30}/>
      </Pressable>
    </Reanimated.View>
  );
}

export function Notifications() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

  const { notifications, removeNotification } = useNotificationStore();

  const handleDeleteNotification = () => {
    if (selectedNotificationId !== null) {
      removeNotification(selectedNotificationId);
      setShowAlertDialog(false);
      setSelectedNotificationId(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
                  renderRightActions={ (_progress, drag) => (
                    <RightAction
                      drag={ drag }
                      onPress={() => {
                        setSelectedNotificationId(data.id);
                        setShowAlertDialog(true);
                      }}
                    />
                  ) }
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
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  rightAction: {
    backgroundColor: "red",
    width: 100,
    height: "95%",
    marginLeft: -25,
  },
  rightActionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});
