import { useState } from 'react';
import {
  HStack, View, Text, Button, ButtonText, ButtonSpinner, ScrollView, Image,
  AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter
} from '@gluestack-ui/themed';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

import { NavigationBar } from '@components/NavigationBar';

import { generateItinerary } from '@utils/gptRequests';
import { utilsGetSelectedTags } from '@utils/selectedTagsStore';

import OpenAILogo from '@assets/OpenAI/OpenAI-black-wordmark.svg';

export function GenerateItinerary() {
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [budget, setBudget] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false);
  const navigation = useNavigation<AuthNavigationProp>();

  const tagsArray = utilsGetSelectedTags();
  const tags = tagsArray.join(', ');

  const generate = async () => {
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

  const handleGenerate = () => {
    if (!tags) {
      setShowConfirmation(true);
    } else {
      generate();
    }
  };

  const handleConfirmYes = () => {
    setShowConfirmation(false);
    
    generate();
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
    navigation.navigate('UserPreferences');
  };

  return (
    <View flex={1}>
      <View pt={35} px={20}>
        <Text fontWeight="$bold" fontSize="$2xl" textAlign='center' mb={15}>
          Gere o seu próximo roteiro de viagem utilizando IA!
        </Text>
        <HStack justifyContent='center'>
          <Text pt="4%">Powered by</Text>
          <OpenAILogo width={100} height={50} />
        </HStack>
      </View>

      <View py={16} px={32}>
        <Button onPress={ handleGenerate } disabled={loading} bgColor='#cd9418'>
          { loading ? <ButtonSpinner color="$white" mr={10} /> : '' }
          <ButtonText>{ loading ? 'Gerando...' : 'Gerar Roteiro com IA' }</ButtonText>
        </Button>

        {
          itinerary !== ''
          ?
            <View style={{ marginTop: 20 }}>
              <Text fontSize="$xl" mb={10} style={{ fontWeight: 'bold' }}>Roteiro sugerido:</Text>
              <ScrollView showsVerticalScrollIndicator={ false } style={{ maxHeight: 5000, marginBottom: 400 }}>
                <Text>{itinerary}</Text>
              </ScrollView>
            </View>
          :
            <View alignItems='center' justifyContent='center' style={{ marginTop: 150 }}>
              <Image 
                source={ require('@assets/Illustrations/generateitineraryIllustration.png') }
                h={230}
                w={350}
                alt=''
              />
            </View>
        }
      </View>

      <AlertDialog isOpen={showConfirmation} onClose={handleConfirmNo}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text fontSize="$lg" fontWeight="$bold">Nenhuma preferência selecionada</Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              Tem certeza que deseja continuar? Isso pode gerar roteiros imprecisos para sua viagem.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="space-between">
            <Button bg="$red600" onPress={handleConfirmYes} sx={{ px: 10, py: 6, borderRadius: 6 }}>
              <ButtonText fontSize="$sm">Continuar mesmo assim</ButtonText>
            </Button>
            <Button bg="$green600" onPress={handleConfirmNo} sx={{ px: 10, py: 6, borderRadius: 6 }}>
              <ButtonText fontSize="$sm">Configurações</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </View>
  );
}