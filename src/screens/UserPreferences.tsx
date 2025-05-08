import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';
import { UserInfo } from '@components/UserInfo';

import { VStack, Image, Center, Text, ScrollView, Box, View } from "@gluestack-ui/themed"
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPreferencesTags } from "@components/Register/Tags"

import { loadTags } from '@utils/tagsLoader';

interface Tags {
    id: number;
    name: string;
}

export function UserPreferences(){
    const [tags, setTags] = useState<Tags[]>([])

    useEffect(() => {
        loadTags().then(setTags);
    }, []);

    return(
        <Box position="absolute"
         top={0} left={0} right={0} bottom={0}
         backgroundColor='$light200'
         px="$4" py="$4">
            <Center my="$8">
                <Text fontSize='$xl'> Quais tópicos está interessado?</Text>
            </Center>
            <ScrollView backgroundColor='$darkBlue800' borderWidth="$0" borderRadius="$3xl">
            <FlatList
                data={tags}
                numColumns={1}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <VStack space="md" px={6} mt={4} mb={4}>
                        <View flexDirection='row' alignItems='center'>
                        <Text fontSize="$2xl" fontWeight="$bold" color="$light200" mt={6} ml={5}>
                            Destinos Populares
                        </Text>
                        </View>
                    </VStack>
                }
                renderItem={({ item }) => (
                    <Box flex={1} px={10} py={2}>
                        <UserPreferencesTags item={item}/>
                    </Box>)}
                ListFooterComponent={<Box />}
                contentContainerStyle={{ paddingBottom: 35 }}
            />
            </ScrollView>
        </Box>
    )


}