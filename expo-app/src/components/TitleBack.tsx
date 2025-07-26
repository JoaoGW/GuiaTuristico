import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import { View, Pressable, Text } from "@gluestack-ui/themed";

import { AuthNavigationProp } from '@routes/auth.routes';

type PropsTitles = {
  pageTitle: string;
};

export function TitleAndBack(props: PropsTitles) {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <SafeAreaView style={{ marginBottom: 15 }}>
      <View flexDirection='row' px={20} pt={3} pb={10} alignItems="center" justifyContent="space-between">
        <Pressable w={50} h={50} justifyContent="center" alignItems="center" onPress={ () => navigation.goBack() }>
          <MaterialIcons name="arrow-back" size={24} color="#535353" />
        </Pressable>
        <Text
          color="$black"
          fontSize="$xl"
          fontWeight="$bold"
          textAlign="center"
        >
          { props.pageTitle }
        </Text>
        <View mr={45}></View>
      </View>
    </SafeAreaView>
  );
}