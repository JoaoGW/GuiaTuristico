import { useState } from 'react';
import { Alert, SafeAreaView, StatusBar } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  Box,
  VStack,
  Heading,
  Input,
  InputField,
  Textarea,
  Button,
  Text,
  ScrollView,
  AvatarImage,
  TextareaInput,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  ChevronDownIcon,
  View
} from '@gluestack-ui/themed';

import { Edit } from 'lucide-react-native';

export function Profile() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [otherGender, setOtherGender] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize || 0;
      if (fileSize > 2 * 1024 * 1024) {
        Alert.alert('Erro', 'A imagem deve ter no máximo 2MB.');
        return;
      }
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const finalGender = gender === 'outro' ? otherGender : gender;
    const userData = { name, age, gender: finalGender, bio, email, city, country, phone, occupation };
    console.log('Dados do usuário:', userData);
    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  };

  return (
    <View flex={1} style={{ backgroundColor: '#f9f9f9' }}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View flex={1} px="$10" py="$5" w="100%" maxWidth="90%" alignSelf="center">
            <VStack space="lg" alignItems="center">
              <Heading p="$2" color="#2752B7" size='xl'>Perfil do Usuário</Heading>
              <Box position="relative">
                <Button onPress={pickImage} style={{ width: 200, height: 160, borderRadius: 75, overflow: 'hidden', padding: 0, backgroundColor: 'transparent' }}>
                  {avatar ? (
                    <AvatarImage source={{ uri: avatar }} alt="Avatar do Usuário" style={{ width: '100%', height: '100%', borderRadius: 75 }} />
                  ) : (
                    <AvatarImage source={'https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_1280.png'} alt="Avatar Padrão" style={{ width: '100%', height: '100%', borderRadius: 75 }} />
                  )}
                </Button>
                <Box position="absolute" bottom={5} right={5}>
                  <Edit size={24} color="#2752B7" />
                </Box>
              </Box>
              <VStack w="100%" space="3xl">
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Nome do Usuário" value={name} onChangeText={setName} />
                </Input>
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Idade" value={age} onChangeText={setAge} />
                </Input>
                <Select selectedValue={gender} onValueChange={setGender} width="100%">
                  <SelectTrigger>
                    <SelectInput placeholder="Gênero" />
                    <SelectIcon>
                      <ChevronDownIcon />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="Masculino" value="masculino" />
                      <SelectItem label="Feminino" value="feminino" />
                      <SelectItem label="Outro" value="outro" />
                      <SelectItem label="Prefiro não informar" value="nao_informar" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {gender === 'outro' && (
                  <Input variant="underlined" size="lg" py="$3">
                    <InputField placeholder="Especifique seu gênero" value={otherGender} onChangeText={setOtherGender} />
                  </Input>
                )}
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Email" value={email} onChangeText={setEmail} />
                </Input>
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Telefone" value={phone} onChangeText={setPhone} />
                </Input>
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Cidade" value={city} onChangeText={setCity} />
                </Input>
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Estado" value={country} onChangeText={setCountry} />
                </Input>
                <Input variant="underlined" size="lg" py="$3">
                  <InputField placeholder="Ocupação" value={occupation} onChangeText={setOccupation} />
                </Input>
                <Textarea size="lg" variant="default" py="$3">
                  <TextareaInput placeholder="Sua biografia como viajante" value={bio} onChangeText={setBio} multiline numberOfLines={3} />
                </Textarea>
                <Button size="lg" mt="$2" bgColor="#2752B7" onPress={handleSave}>
                  <Text color="$white">Salvar Informações</Text>
                </Button>
              </VStack>
            </VStack>
            <Box h="$10" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}