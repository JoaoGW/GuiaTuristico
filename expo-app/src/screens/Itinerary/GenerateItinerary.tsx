import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import * as FileSystem from "expo-file-system"
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

import {
  HStack, View, Text, Button, ButtonText, ButtonSpinner, ScrollView, Image,
  AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter
} from '@gluestack-ui/themed';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthNavigationProp } from '@routes/auth.routes';

import { generateItinerary } from '@utils/gptRequests';
import { utilsGetSelectedTags } from '@utils/selectedTagsStore';

import { useNotificationStore } from '@utils/notificationStore';

import { Globe } from 'lucide-react-native';

import OpenAILogo from '@assets/Enterprises/OpenAI/OpenAI-black-wordmark.svg';

import { useFocusEffect } from '@react-navigation/native';

const ITINERARY_STORAGE_KEY = '@screens/GenerateItinerary/itineraryPersisted';

export function GenerateItinerary() {
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [budget, setBudget] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false);
  const [tags, setTags] = useState('');

  const navigation = useNavigation<AuthNavigationProp>();
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() =>{
    const loadSavedItinerary = async () => {
      try{
        const savedItinerary = await AsyncStorage.getItem(ITINERARY_STORAGE_KEY);
        if(savedItinerary != null){
          setItinerary(savedItinerary);
        }
      } catch (error) {
        console.error('Erro ao carregar o roteiro salvo:', error);
      }
    };
    loadSavedItinerary();
  }, []);


  const generate = async () => {
    setLoading(true);
    setItinerary('');

    const prompt = `Gere recomendações de um roteiro turístico, considere os seguintes 
                    interesses do usuário: ${tags}. 
                    Além disso, o usuário está localizado em: Paris, França e seu orçamento é de 3750 reais para 5 dias.
                    Dispense colocar "Com base nos interesses" e coisas similares. 
                    Fale sobre o que fazer em cada dia e não escreva nada além disso.
                    Formate os dias em formato de lista.`;

    try {
      const result = await generateItinerary(prompt);
      
      setItinerary(result);

      addNotification({
        title: "Novo Roteiro",
        description: "Um novo roteiro para a sua incrível próxima viagem foi gerado pela Inteligência Artificial. Confira já!",
        routeIcon: Globe
      });

      await AsyncStorage.setItem(ITINERARY_STORAGE_KEY, result);

    } catch (error) {
      setItinerary('Erro ao gerar roteiro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const tagsArray = utilsGetSelectedTags();
      const newTags = tagsArray.join(', ');
      setTags(newTags);
    }, [])
  );

  const handleGenerate = () => {
    const trimmedTags = (tags || '').trim();

    if (!trimmedTags) {
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

  async function handleExportPDF() {
    if(isExporting || !itinerary) {
      return;
    }

    try {
      setIsExporting(true);

        const createHtmlFromItinerary = (itineraryText: string) => {
          const days = itineraryText.split(/(Dia \d+:)/).slice(1);
          let htmlDays = '';

          for (let i = 0; i < days.length; i += 2) {
            const dayTitle = days[i];
            const activitiesText = days[i + 1];
            
            const activityItems = activitiesText
              .split('\n') 
              .map(line => line.trim()) 
              .map(line => line.startsWith('-') ? line.substring(1).trim() : line) 
              .filter(line => line.length > 0) 
              .map(activity => `<li>${activity}</li>`) 
              .join(''); 

            if (activityItems.length > 0) {
              htmlDays += `<h2>${dayTitle}</h2><ul>${activityItems}</ul>`;
            }
          }
          return htmlDays;
      };

      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Roteiro de Viagem</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
              
              body { 
                font-family: 'Poppins', sans-serif; 
                font-size: 11pt; 
                line-height: 1.6; 
                padding: 35px;
                color: #333;
              }
              h1 { 
                text-align: center; 
                color: #2752b7; 
                font-size: 24pt;
                margin-bottom: 5px;
              }
              h2 {
                font-size: 16pt;
                color: #333;
                border-bottom: 2px solid #eeeeee;
                padding-bottom: 5px;
                margin-top: 25px;
              }
              ul {
                list-style-type: none;
                padding-left: 0;
              }
              li {
                padding: 8px 0px 8px 15px;
                margin-bottom: 5px;
                position: relative;
              }
              li::before {
                content: '•';
                color: #2752b7;
                font-size: 18pt;
                position: absolute;
                left: -5px;
                top: 1px;
              }
              .subtitle {
                text-align: center;
                font-size: 12pt;
                color: #777;
                margin-top: 0;
              }
            </style>
          </head>
          <body>
            <h1>Roteiro de Viagem</h1>
            <p class="subtitle">O seu roteiro de viagem personalizado com muito carinho</p>
            ${createHtmlFromItinerary(itinerary)}
          </body>
        </html>
      `;

      const { uri: tempUri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const fileName = `Roteiro_de_Viagem_${new Date().toISOString().slice(0, 10)}.pdf`;
      const newUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: tempUri,
        to: newUri,
      });

      if (!await Sharing.isAvailableAsync()) {
        Alert.alert("Exportar PDF", "Compartilhamento não está disponível neste dispositivo.");
        return;
      }

      await Sharing.shareAsync(newUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Salve ou compartilhe seu roteiro',
        UTI: '.pdf'
      });
      
    } catch (error) {
      Alert.alert("Exportar", "Não foi possível exportar o roteiro.");
    }finally{
      setIsExporting(false);
    }
  };

  return (
    <View flex={1}>
      <View pt={50}>
        <View pt={35} px={20}>
          <Text fontWeight="$bold" fontSize="$2xl" textAlign='center'>
            Gere o seu próximo roteiro de viagem utilizando IA!
          </Text>
          <View flexDirection='row' justifyContent='center'>
            <Text pt="4%">Powered by</Text>
            <OpenAILogo width={100} height={50} />
          </View>
        </View>

        <View py={16} px={32}>
          <Button onPress={ handleGenerate } disabled={loading} borderRadius={50} bgColor='#2752B7'>
            { loading ? <ButtonSpinner color="$white" mr={10} /> : '' }
            <ButtonText>{ loading ? 'Gerando...' : 'Gerar Roteiro com IA' }</ButtonText>
          </Button>

          {
            itinerary !== ''
              ?
              <View py={16} style={{ marginTop: 0, marginBottom: 0, maxHeight: 400 }}>
                <Button
                  onPress={handleExportPDF}
                  variant="solid" action='primary' disabled={loading}
                  bgColor='#2752b790' mb={10} borderRadius={50}>
                  { loading ? <ButtonSpinner color="$white" alignItems='center' /> : ''}
                  <ButtonText>{isExporting ? 'Exportando Roteiro...' : 'Exportar Roteiro'}</ButtonText>
                </Button>

                <Text fontSize="$xl" mb={10} textAlign='center' style={{ fontWeight: 'bold' }}>Roteiro sugerido</Text>
                <ScrollView showsVerticalScrollIndicator={false} borderRadius={5} bgColor='#cacaca49'>
                  <Text style={{ lineHeight: 24 }} >{itinerary}</Text>
                </ScrollView>
              </View>
              :
              <View alignItems='center' justifyContent='center' style={{ marginTop: 150 }}>
                <Image
                  source={require('@assets/Illustrations/generateitineraryIllustration.png')}
                  h={230}
                  w={350}
                  alt=''
                />
              </View>
          }
        </View>
      </View>

    <AlertDialog isOpen={showConfirmation} onClose={handleConfirmNo}>
        <AlertDialogBackdrop />
        <AlertDialogContent p="$4" borderRadius="$lg">

          <AlertDialogHeader borderBottomWidth="$0" justifyContent="center">
            <Text size="2xl" mb={-10} fontWeight="$bold">Atenção</Text>
          </AlertDialogHeader>

          <AlertDialogBody pt="$1" pb="$2">
            <Text lineHeight="$md" textAlign="center">
              Recomendamos que você defina suas preferências de viagem primeiro. Deseja continuar mesmo assim?
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter borderTopWidth="$0" flexDirection="column" gap="$3" >
            <Button backgroundColor='#16b416e8' action="primary" onPress={handleConfirmNo} w="$full">
              <ButtonText>Ir para Preferências</ButtonText>
            </Button>

            <Button variant="solid" backgroundColor='#e0064fdd' action="secondary" onPress={handleConfirmYes} w="$full">
              <ButtonText>Continuar mesmo assim</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
