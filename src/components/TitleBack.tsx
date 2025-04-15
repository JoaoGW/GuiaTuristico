import { MaterialIcons } from '@expo/vector-icons';

import { HStack, Pressable, Text } from "@gluestack-ui/themed";

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

type PropsTitles = {
  pageTitle: string
}

export function TitleAndBack(props: PropsTitles){
  const navigation = useNavigation<AuthNavigationProp>();

  return(
    <HStack px={30} mb={30} style={{ justifyContent: "space-between" }}>
      <Pressable onPress={() => navigation.goBack()}>
        <MaterialIcons name='arrow-back' size={24} color="$gray600"/>
      </Pressable>
      <Text
        color='$black' 
        position="absolute"
        left="47.5%"
        fontSize='$xl'
        fontWeight='$bold'
      >{props.pageTitle}</Text>
    </HStack>
  )
}