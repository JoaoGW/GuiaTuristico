import { SafeAreaView, TouchableOpacity } from "react-native";
import { Pressable, Text, View, VStack } from "@gluestack-ui/themed"

import { TitleAndBack } from '@components/TitleBack';
import { SettingsOption } from "@components/Settings/SettingsOption";

import 
  { User, Lock, Languages, CircleDollarSign, Moon, Bell, WifiOff, LogOut } 
from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

export function Settings(){

  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TitleAndBack pageTitle="Settings"/>

        <VStack mx={20}>
          <Text color="$blue500" fontSize="$xl" fontWeight="$bold" mb={20}>Account</Text>
          <Pressable onPress={() => navigation.navigate('Profile')} bg="$f0f0f0" p={10} borderRadius={5} mb={10} ml={10} flexDirection="row" alignItems="center" >
            <User size={30} color="#535353" style={{ marginRight: 10 }} /> 
            <Text color="$535353" fontSize="$lg">Edit Profile</Text>
          </Pressable>
          <SettingsOption optionText="Change Password" icon={Lock} />
        </VStack>

        <VStack mx={20} mt={25} mb={20}>
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