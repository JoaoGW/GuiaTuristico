import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';
import { UserInfo } from '@components/UserInfo';

import { VStack, Image, Center, Text, ScrollView, Box, View, Heading} from "@gluestack-ui/themed"
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPreferencesTags } from "@components/Register/Tags"

import { loadTags } from '@utils/tagsLoader';

interface Tags {
    id: number;
    name: string;
    image: any;
}

export function UserPreferences(){
    const [tags, setTags] = useState<Tags[]>([])
    const navigation = useNavigation<AuthNavigationProp>();

    useEffect(() => {
        loadTags().then(setTags);
    }, []);

    return(
        <Box px="$4" py="$4">
            <Center mt="$8" mb="$4">
                <Heading fontSize='$2xl'> Quais tópicos está interessado?</Heading>
            </Center>
            <ScrollView bg="rgba(0, 0, 0, 0.0)" height="$5/6">
                <FlatList
                    data={tags}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    showsVerticalScrollIndicator={true}
                    ListHeaderComponent={
                        <VStack space="md" px={6} mt={4} mb={4}>
                            <View flexDirection='row'>
                            <Text fontSize="$lg" fontWeight="$bold" color="$black" mt={6} ml={5}>
                                Destinos Populares
                            </Text>
                            </View>
                        </VStack>
                    }
                    renderItem={({ item }) => (
                        <Box flex={1} px={4} py={4}>
                            <UserPreferencesTags item={item}/>
                        </Box>)}
                    ListFooterComponent={<Box />}
                    contentContainerStyle={{ paddingBottom: 0}}
                />
            </ScrollView>
            <Button
                bottom={0}
                title="Continuar"
                onPress={() => navigation.navigate('Login')}
            ></Button>
        </Box>
    )


}