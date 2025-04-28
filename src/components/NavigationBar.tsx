import { TouchableOpacity } from 'react-native';

import { HStack, Box, Text } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from "@routes/auth.routes";

export function NavigationBar() {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <HStack flex={1} justifyContent="space-between" alignItems="center" bg="$blue500" borderRadius={20} p={4} position="absolute" bottom={10} left={0} right={0}>
      <HStack alignItems="center">
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "$blue700",
          }}
        >
          <MaterialIcons name="public" size={30} color="white" />
        </TouchableOpacity>
        <Text color="#fff" fontSize="$md" fontWeight="$bold" ml={10}>
          Discover
        </Text>
      </HStack>

      <Box width={1} height={"80%"} bg="#fff" mx={3} />
      <HStack space="md" alignItems="center">
        <TouchableOpacity
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "$blue700",
          }}
        >
          <MaterialIcons name="home" size={27} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "$blue700",
          }}
        >
          <MaterialIcons name="search" size={27} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 55,
            height: 55,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "$blue700",
          }}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialIcons name="settings" size={27} color="white" />
        </TouchableOpacity>
      </HStack>
    </HStack>
  );
}