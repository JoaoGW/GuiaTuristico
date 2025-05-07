import { MaterialIcons } from '@expo/vector-icons';
import { HStack, Pressable, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

type PropsTitles = {
  pageTitle: string;
};

export function TitleAndBack(props: PropsTitles) {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <SafeAreaView style={{ marginBottom: 15 }}>
      <HStack px={20} py={10} alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#535353" />
        </Pressable>
        <Text
          color="$black"
          fontSize="$xl"
          fontWeight="$bold"
          textAlign="center"
          flex={1}
        >
          {props.pageTitle}
        </Text>
      </HStack>
    </SafeAreaView>
  );
}