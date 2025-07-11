import { SafeAreaView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { Pressable, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"

import { TitleAndBack } from '@components/TitleBack';
import { SettingsOption } from "@components/Settings/SettingsOption";

import { User, Lock, Languages, CircleDollarSign, Moon, Bell, WifiOff, LogOut, University, ChevronRight} from 'lucide-react-native';

import { AuthNavigationProp } from '@routes/auth.routes';

export function Settings(){
  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <SafeAreaView style={{ flex: 1, paddingTop: 60 }}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <TitleAndBack pageTitle="Settings" />

          <VStack mx={20}>
            <Text color="$blue500" fontSize="$xl" fontWeight="$bold" mb={20}>Account</Text>
            <Pressable onPress={ () => navigation.navigate('Profile') } bg="$f0f0f0" p={10} borderRadius={5} mb={10} ml={10} flexDirection="row" alignItems="center" justifyContent="space-between" >
              <View flexDirection="row" alignItems="center">
                <User size={30} color="#535353" style={{ marginRight: 7 }} />
                <Text color="$black" fontSize="$lg" pl={14}>Edit Profile</Text>
              </View>
              <ChevronRight style={{ marginRight: 10 }}/>
            </Pressable>
            <SettingsOption optionText="Change Password" icon={Lock} />
            <Pressable onPress={() => navigation.navigate('UserPreferences')} bg="$f0f0f0" p={10} borderRadius={5} mb={10} ml={10} flexDirection="row" alignItems="center" justifyContent="space-between" >
              <View flexDirection="row" alignItems="center">
                <University size={30} color="#535353" style={{ marginRight: 10 }} />
                <Text color="$black" fontSize="$lg" pl={14}>Interests</Text>
              </View>
              <ChevronRight style={{ marginRight: 10 }}/>
            </Pressable>
          </VStack>

          <VStack mx={20} mt={25} mb={20}>
            <Text color="$blue500" fontSize="$xl" fontWeight="$bold" my={20}>General Settings</Text>
            <SettingsOption optionText="Change Language" icon={Languages} />
            <SettingsOption optionText="Change Currency" icon={CircleDollarSign} />
            <SettingsOption optionText="Dark/Light Mode" icon={Moon} />
            <SettingsOption optionText="Notifications" icon={Bell} />
            <SettingsOption optionText="Offline Mode" icon={WifiOff} />
          </VStack>

          <VStack mt={10} style={{ marginBottom: 60 }}>
            <Text textAlign="center" fontSize={"$lg"} color="$blue500">Contact Support</Text>
            <Pressable bgColor="$red500" w={200} h={50} mt={20} mx="auto" flexDirection="row" alignItems="center" justifyContent="center" borderRadius={10}>
              <LogOut color="#FFF" style={{ marginRight: 15 }} />
              <Text color="$white" textAlign="center" fontSize="$lg" fontWeight="$bold">Sign Out</Text>
            </Pressable>
          </VStack>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}