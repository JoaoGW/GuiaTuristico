import { SafeAreaView } from "react-native";
import { Pressable, Text, View, VStack } from "@gluestack-ui/themed"

import { TitleAndBack } from '@components/TitleBack';
import { SettingsOption } from "@components/Settings/SettingsOption";

import 
  { User, Lock, Languages, CircleDollarSign, Moon, Bell, WifiOff, LogOut } 
from 'lucide-react-native';

export function Settings(){
  return(
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TitleAndBack pageTitle="Settings"/>

        <VStack mx={20}>
          <Text color="$blue500" fontSize="$xl" fontWeight="$bold" mb={20}>Account</Text>
          <SettingsOption optionText="Edit Profile" icon={User} />
          <SettingsOption optionText="Change Password" icon={Lock} />
        </VStack>

        <VStack mx={20}>
          <Text color="$blue500" fontSize="$xl" fontWeight="$bold" my={20}>General Settings</Text>
          <SettingsOption optionText="Change Language" icon={Languages} />
          <SettingsOption optionText="Change Currency" icon={CircleDollarSign } />
          <SettingsOption optionText="Dark/Light Mode" icon={Moon} />
          <SettingsOption optionText="Notifications" icon={Bell} />
          <SettingsOption optionText="Offline Mode" icon={WifiOff} />
        </VStack>

        <VStack mt={30} style={{ position: 'absolute', bottom: 30, left: 0, right: 0 }}>
          <Text textAlign="center" fontSize={"$lg"} color="$blue500">Contact Support</Text>
          <Pressable bgColor="$red500" w={200} h={50} mt={30} mx="auto" flexDirection="row" alignItems ="center" justifyContent="center" borderRadius={10}>
            <LogOut color="#FFF" style={{ marginRight: 15 }}/>
            <Text color="$white" textAlign="center" fontSize="$lg" fontWeight="$bold">Sign Out</Text>
          </Pressable>
        </VStack>
      </View>
    </SafeAreaView>
  )
}