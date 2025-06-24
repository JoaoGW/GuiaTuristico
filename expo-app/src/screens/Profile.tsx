import React, {useState} from 'react';
import { Box, VStack, Heading, Avatar, Input, InputField, Textarea, Button, Text, ScrollView, AvatarFallbackText, AvatarBadge, AvatarImage, TextareaInput } from '@gluestack-ui/themed';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectItem, SelectDragIndicator, SelectDragIndicatorWrapper, ChevronDownIcon } from '@gluestack-ui/themed';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

export function Profile(){

        const [avatar, setAvatar] = useState(null);
        const [name, setName] = useState('');
        const [age, setAge] = useState('');
        const [gender, setGender] = useState('');
        const [otherGender, setOtherGender] = useState('');
        const [email, setEmail] = useState('');
        const [city, setCity] = useState('');
        const [country, setCountry] = useState('');
        const [bio, setBio] = useState('');
        

    const handSlave = () => {
        const finalGender = gender === 'outro' ? otherGender : gender;
        console.log({name, age, gender, bio, email, city, country});

    };

    

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <Box flex={1} px="$20" py="$5" w="100%" maxWidth="100%" bg="$coolGray100">
                <VStack space="lg" alignItems='center'>
                    <Heading p="$2" color="$blue600"> Perfil do Usuário </Heading>

                    <Avatar size="2xl" bgColor="$blue500" borderColor="$white" borderWidth={2}>
                        <AvatarFallbackText>User</AvatarFallbackText>
                        <AvatarImage source={{uri:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" }} alt="Avatar Padrão"/>
                        <AvatarBadge/>

                    </Avatar>

                    <VStack w="100%" space="3xl">
                        <Input variant="underlined" size="md">
                            <InputField placeholder="Nome do Usuário" value={name} onChangeText={setName}/>
                        </Input>

                        <Input variant="underlined" size="md">
                            <InputField placeholder='Idade' value={age} onChangeText={setAge}/>
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
                                <SelectItem label="Outro" value="outro"/>
                                <SelectItem label="Prefiro não informar" value="nao_informar" />
                            </SelectContent>
                            </SelectPortal>
                        </Select>

                        {gender === 'outro' && (
                            <Input variant="underlined" size="md">
                                <InputField placeholder="Especifique seu gênero" value={otherGender} onChangeText={setOtherGender} />
                            </Input>
                        )}

                        <Input variant="underlined" size="md">
                            <InputField placeholder='Email' value={email} onChangeText={setEmail}/>
                        </Input>

                        <Input variant="underlined" size="md">
                            <InputField placeholder='Cidade' value={city} onChangeText={setCity}/>
                        </Input>

                        <Input variant="underlined" size="md">
                            <InputField placeholder='Estado' value={country} onChangeText={setCountry}/>
                        </Input>

                        <Textarea size="md" variant="default">
                            <TextareaInput placeholder="Biografia" value={bio} onChangeText={setBio} multiline numberOfLines={2}/>
                        </Textarea>
                        
                        <Button size="md" mt="$2" onPress={handSlave}>
                            <Text color="$white"> Salvar Informações</Text>

                        </Button>

                    </VStack>


                </VStack>

            </Box>

        </ScrollView>
    )
}
