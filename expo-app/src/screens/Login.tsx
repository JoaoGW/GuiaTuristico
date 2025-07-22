import { useState } from 'react';
import { StatusBar } from 'react-native';

import { VStack, Image, Center, Text, ScrollView, Box, View } from "@gluestack-ui/themed";
import { Input } from "@components/InputItems/Input";
import { Button } from "@components/Buttons/Button";

import { useAuth } from '@contexts/AuthContext';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

  return (
    <View flex={1}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
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
              alt=""
            />
            <Box
              h="$full"
              w="$full"
              bg="rgba(0, 0, 0, 0.4)"
              position="absolute"
            />
          </Box>

          <Center flex={1} mt={-100}>
            <Text color="$trueGray50" fontSize="$3xl" mt="$40">Bem-Vindo ao </Text>
            <Image
              source={require('@assets/icon.png')}
              alt="EZ TRIP AI Logo"
              width={300}
              height={300}
              resizeMode="contain"
            />
            <Input placeholder="Email" keyboardType='email-address' autoCapitalize='none' />
            <Input placeholder="Senha" secureTextEntry />
            <Button
              title="LOGIN"
              onPress={login}
            />
            <Text color="$trueGray50" fontSize="$lg" mt="$10">Ainda não criou uma conta?</Text>
            <Button
              title="Criar uma conta"
              variant="outline"
              onPress={login}
              size='xl'
            />
          </Center>
        </VStack>
      </ScrollView>
    </View>
  );
}