import { SafeAreaView, StatusBar } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { AvatarImage, Button, Image, Text, View } from "@gluestack-ui/themed";

import { AuthNavigationProp } from "@routes/auth.routes";

import { BookCheck, Heart } from "lucide-react-native";

export function Profile(){
  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <View>
      <Image source={ require('@assets/santiago_farellones.jpg') } w="100%" h={225} />
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <View bgColor="#FDFDFD">
          <View flexDirection="row" justifyContent="space-between" px={20}>
            <View justifyContent="center" mt={-35}>
              <View flexDirection="row">
                <BookCheck color="#2752B7" />
                <Text fontSize="$lg" color="#2752B7" fontWeight="$semibold" ml={5}>99</Text>
              </View>
              <Text fontSize="$sm">Roteiros</Text>
            </View>
            <View mt={-25}>
              <Button w={200} h={160} borderRadius={75} overflow="hidden" p={0} bgColor="transparent" onPress={ () => navigation.navigate("EditProfile") }>
                <AvatarImage source={'https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_1280.png'} alt="Avatar Padrão" style={{ width: '100%', height: '100%', borderRadius: 75 }} />
              </Button>
            </View>
            <View justifyContent="center" mt={-35}>
              <View flexDirection="row">
                <Heart color="#2752B7" />
                <Text fontSize="$lg" color="#2752B7" fontWeight="$semibold" ml={5}>99</Text>
              </View>
              <Text fontSize="$sm">Favoritos</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}