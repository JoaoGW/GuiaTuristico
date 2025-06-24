import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

import { VStack, Image, Center, Text, ScrollView, Box } from "@gluestack-ui/themed"
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useAuth } from '@contexts/AuthContext';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation<AuthNavigationProp>();
  const { login } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <VStack flex={1} px="$8">
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Image
            h="$full"
            w="$full"
            resizeMode="cover"
            source={require('@assets/background.webp')}
            defaultSource={require('@assets/background.webp')}
            alt=""/>
          <Box
            h="$full"
            w="$full"
            bg="rgba(0, 0, 0, 0.4)" // Semi-transparent black
            position="absolute"
          />
        </Box>

        <Center my="$24">
          <Text color="$trueGray50" fontSize="$3xl" mt="$40">Bem Vindo ao </Text>
          <Text color="$info600" fontSize="$4xl" mt="$3" mb="$5">EZ TRIP AI</Text>
          <Input placeholder="Email" keyboardType='email-address' autoCapitalize='none'/>
          <Input placeholder="Senha" secureTextEntry/>
          <Button
           title="LOGIN"
           onPress={ login }/>
          <Text color="$trueGray50" fontSize="$md" mt="$10">Ainda não criou uma conta?</Text>
          <Button
            title="Criar uma conta"
            variant="outline"
            onPress={ login }
            ></Button>
        </Center>
        
      </VStack>
    </ScrollView>
    
  );
}