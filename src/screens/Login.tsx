import { useState } from 'react';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

import { VStack, Image, Center, Text, Heading, ScrollView, Box } from "@gluestack-ui/themed"
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  // const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <VStack flex={1} px="$8">
        <Image
          h="$full"
          w="100%"
          resizeMode="cover"
          source={require('@assets/background.webp')}
          defaultSource={require('@assets/background.webp')}
          alt=""
          position="absolute"/>
        <Box
          h="$full"
          w="100%"
          bg="rgba(0, 0, 0, 0.4)" // Semi-transparent black
          position="absolute"
        />

        <Center my="$24">
          <Text color="$trueGray50" fontSize="$3xl" mt="$40">Welcome to</Text>
          <Text color="$info600" fontSize="$4xl" mt="$3" mb="$5">EZ TRIP AI</Text>
          <Input placeholder="Email" keyboardType='email-address' autoCapitalize='none'/>
          <Input placeholder="Senha" secureTextEntry/>
          <Button title="LOGIN"/> {/* Adicione isLoading pra mostrar q ta carregando*/}
          <Text color="$trueGray50" fontSize="$md" mt="$10">Don't have an account?</Text>
          <Button
            title="Create an account"
            variant="outline"
            onPress={() => navigation.navigate('Home')}
            ></Button>
        </Center>
        
      </VStack>
    </ScrollView>
    
  );
}
