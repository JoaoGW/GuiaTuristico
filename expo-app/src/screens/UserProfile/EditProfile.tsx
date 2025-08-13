import { useState } from 'react';
import { Alert, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import {
  Box,
  Input,
  InputField,
  Textarea,
  Button,
  Text,
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
  FormControlLabelText,
  ScrollView,
  View
} from '@gluestack-ui/themed';

import { TitleAndBack } from '@components/TitleBack';

import { AuthNavigationProp } from '@routes/auth.routes';

import { Edit } from 'lucide-react-native';

export function EditProfile() {
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
    const navigation = useNavigation<AuthNavigationProp>();
    const finalGender = gender === 'outro' ? otherGender : gender;
    const userData = { name, age, gender: finalGender, bio, email, city, country, phone, occupation };

    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <TitleAndBack pageTitle='Perfil do Usuário' />
      <ScrollView p={20} mb={85}>
        <Box position="relative" mt={-20} mb={20} alignSelf='center'>
          <Button w={200} h={160} borderRadius={75} overflow='hidden' bgColor='transparent' onPress={ pickImage }>
            { avatar ? (
              <AvatarImage source={{ uri: avatar }} alt="Avatar do Usuário" style={{ width: '100%', height: '100%', borderRadius: 75 }} />
            ) : (
              <AvatarImage source={'https://cdn.pixabay.com/photo/2020/06/30/10/23/icon-5355896_1280.png'} alt="Avatar Padrão" style={{ width: '100%', height: '100%', borderRadius: 75 }} />
            )}
          </Button>
          <Box position="absolute" bottom={5} right={5}>
            <Edit size={24} color="#2752B7" />
          </Box>
        </Box>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Nome Completo</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Insira seu nome completo" value={ name } onChangeText={ setName } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Idade</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Insira sua Idade" value={ age } onChangeText={ setAge } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Gênero</FormControlLabelText>
        <Select selectedValue={gender} onValueChange={ setGender } mb={12} w="100%">
          <SelectTrigger variant="rounded">
            <SelectInput placeholder="Informe seu Gênero" />
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
              <SelectItem label="Masculino" value="Masculino" />
              <SelectItem label="Feminino" value="Feminino" />
              <SelectItem label="Outro" value="Outro" />
              <SelectItem label="Prefiro não informar" value="Não Informar" />
            </SelectContent>
          </SelectPortal>
        </Select>
        { gender === 'Outro' && (
          <View>
            <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Especifique seu Gênero</FormControlLabelText>
            <Input variant="rounded" size="lg" py="$3" mb={12}>
              <InputField placeholder="Especifique seu gênero" value={ otherGender } onChangeText={setOtherGender} />
            </Input>
          </View>
        )}

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>E-mail</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Insira seu melhor e-mail" value={ email } onChangeText={ setEmail } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Telefone</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Insira seu melhor Telefone" value={ phone } onChangeText={ setPhone } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Cidade</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Diga-nos de qual cidade você é" value={ city } onChangeText={ setCity } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>País</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Diga-nos de qual país você é" value={ country } onChangeText={ setCountry } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Profissão</FormControlLabelText>
        <Input variant="rounded" size="lg" py="$3" mb={12}>
          <InputField placeholder="Informe sua Profissão" value={ occupation } onChangeText={ setOccupation } />
        </Input>

        <FormControlLabelText color='#696969' ml={10} mb={5} size='lg'>Sua Biografia</FormControlLabelText>
        <Textarea size="lg" variant="default" py="$3" mb={12}>
          <TextareaInput placeholder="Conte-nos um pouco sobre sua trajetória como viajante" value={bio} onChangeText={ setBio } multiline numberOfLines={3} />
        </Textarea>

        <Button size="lg" mt="$2" bgColor="#2752B7" borderRadius={25} onPress={ handleSave }>
          <Text color="$white">Salvar Informações</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}