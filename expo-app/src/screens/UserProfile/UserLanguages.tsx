import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

import { VStack, Center, Text, Box, View, Heading } from "@gluestack-ui/themed";
import { Button } from "@components/Buttons/Button";
import { UserLanguagesLangs } from "@components/Register/Languages";

import { loadLanguages } from '@utils/languagesLoader';
import { utilsSetSelectedLanguages, utilsGetSelectedLanguages } from '@utils/selectedLanguagesStore';

interface Languages {
  id: number;
  name: string;
  image: any;
}

export function UserLanguages() {
  const [languages, setLanguages] = useState<Languages[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const navigation = useNavigation<AuthNavigationProp>();

  useEffect(() => {
    const fetchData = async () => {
      const loadedLanguages = await loadLanguages();
      setLanguages(loadedLanguages);

      const previouslySelected = utilsGetSelectedLanguages();
      setSelectedLanguages(previouslySelected || []);
    };

    fetchData();
  }, []);

  const toggleLanguagesSelection = (langName: string) => {
    setSelectedLanguages(prev =>
      prev.includes(langName)
        ? prev.filter(name => name !== langName)
        : [...prev, langName]
    );
  };

  return (
    <Box flex={1} px="$4" py="$4">
      <Center mt="$12" mb="$4">
        <Heading fontSize='$2xl'>Quais línguas você fala?</Heading>
      </Center>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <VStack space="md" px={6} mt={4} mb={4}>
            <View flexDirection='row'>
            </View>
          </VStack>
        }
        renderItem={({ item }) => (
          <Box flex={1} px={4} py={4}>
            <UserLanguagesLangs
              item={item}
              isSelected={selectedLanguages.includes(item.name)}
              onToggle={() => toggleLanguagesSelection(item.name)}
            />
          </Box>
        )}
        ListFooterComponent={
          <Box mt={4}>
            <Button
              title="Continuar"
              onPress={() => {
                utilsSetSelectedLanguages(selectedLanguages);
                navigation.goBack();
              }}
            />
          </Box>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Box>
  );
}
