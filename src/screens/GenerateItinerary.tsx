import { useState } from 'react';

import { HStack, View, Text, Button, ButtonText, ButtonSpinner, ScrollView } from '@gluestack-ui/themed';

import { NavigationBar } from '@components/NavigationBar';

import { generateItinerary } from '@utils/gptRequests';
import { utilsGetSelectedTags } from '@utils/selectedTagsStore'

import OpenAILogo from '@assets/OpenAI/OpenAI-black-wordmark.svg';

export function GenerateItinerary() {
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [budget, setBudget] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  const tags = utilsGetSelectedTags();
  const cleaned = tags.join(', ')
  // console.log('Interesses do usuario:', cleaned);

  const handleGenerate = async () => {
    setLoading(true);
    setItinerary('');

    const prompt = `Gere recomendações de um roteiro turístico, leve em consideração os seguintes 
                    interesses do usuário: ${tags}. 
                    Além disso, o usuário está localizado em: Paris, França e seu orçamento é de 1750 reais para 2 dias.
                    Dispense colocar "Com base nos interesses" e coisas similares. 
                    Fale sobre o que fazer em cada dia e não escreva nada além disso.
                    Formate os dias em formato de lista por dia.`;

    try {
      const result = await generateItinerary(prompt);
      setItinerary(result);
    } catch (error) {
      setItinerary('Erro ao gerar roteiro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View flex={1}>
      <View pt={35} px={20}>
        <Text fontWeight="$bold" fontSize="$2xl" textAlign='center' mb={15}>Gere o seu próximo roteiro de viagem utilizando IA!</Text>
        <HStack justifyContent='center'>
          <Text pt="4%">Powered by</Text>
          <OpenAILogo
            width={100}
            height={50}
          />
        </HStack>
      </View>

      <View py={16} px={32}>
        <Button onPress={ handleGenerate } disabled={loading} bgColor='#cd9418'>
          { loading ?  <ButtonSpinner color="$white" mr={10}/> : '' }
          <ButtonText>{ loading ? 'Gerando...' : 'Gerar Roteiro com IA' }</ButtonText>
        </Button>

        { itinerary !== '' && (
          <View style={{ marginTop: 20 }}>
            <Text fontSize="$xl" mb={10} style={{ fontWeight: 'bold' }}>Roteiro sugerido:</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 5000, marginBottom: 400 }}>
              <Text>{ itinerary }</Text>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}