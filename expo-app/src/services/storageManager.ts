import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { MessageSquareMore } from 'lucide-react-native';

import { ChatHistoryTypes } from '../../@types/ChatHistoryTypes';
import { MessageTypes } from '../../@types/MessagesTypes';

// Para todo histórico de mensagens e não o conteúdo de cada uma em específico (TODAS AS FUNÇÕES ABAIXO)
export const loadAllChatsHistory = async (): Promise<ChatHistoryTypes[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const allChats = keys.filter(key => key.startsWith("@eztripai_chatHistory_"));

    const items = await AsyncStorage.multiGet(allChats);

    return items.map(([key, value], index) => {
      const chatId = key.replace('@eztripai_chatHistory_', '');
      const parsedData = value ? JSON.parse(value) : null;
      
      return {
        id: index + 1,
        title: parsedData?.messages?.length > 0 ? parsedData.messages[0]?.text?.slice(0, 30) + "..." : "Conversa vazia",
        date: parsedData?.lastModified || "Data indisponível",
        icon: MessageSquareMore,
        chatId: chatId,
        route: "AIChat" as const,
        navigate: () => {}
      };
    });
  } catch (e) {
    console.log("Não foi possível resgatar todas as informações: ", e);
    return [];
  }
};

export const storeAtAllChatsHistory = async (chats: ChatHistoryTypes) => {
  try {
    const jsonValue = JSON.stringify(chats);
    await AsyncStorage.setItem('@eztripai_allChatsHistory', jsonValue);
  } catch (e) {
    console.log("Erro ao salvar: ", e);
  }
};

export const clearAllChatsHistory = async () => {
  try {
    const historyKeys = await AsyncStorage.getAllKeys();
    const allChatHistoryKeys = historyKeys.filter(key => key.startsWith("@eztripai_chatHistory_"))

    await AsyncStorage.multiRemove(allChatHistoryKeys); 
  } catch (e) {
    console.log("Erro ao apagar todos os itens armazenados: ", e);
  }
};

// Para cada mensagem em específico (TODAS AS FUNÇÕES ABAIXO)
export const loadChatHistory = async (chatId: string, setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>, setLastModified: React.Dispatch<React.SetStateAction<string>>) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@eztripai_chatHistory_${chatId}`);

    if (jsonValue != null) {
      const { messages, lastModified } = JSON.parse(jsonValue);
      setMessages(messages);
      setLastModified(lastModified || "Data indisponível");
    }
  } catch (error) {
    Alert.alert("Erro ao carregar histórico de mensagens");
    console.error('Erro ao carregar histórico de mensagens: ', error);
  }
};

export const storeChatHistory = async (data: { messages: MessageTypes[]; lastModified: string }, chatId: string) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`@eztripai_chatHistory_${chatId}`, jsonValue);
  } catch (e) {
    Alert.alert('Erro', 'Não foi possível salvar as informações de sua última conversa com seu Guia Turístico!');
  }
};

export const clearChatHistory = async (chatId: string) => {
  try {
    await AsyncStorage.removeItem(`@eztripai_chatHistory_${chatId}`);
  } catch (e) {
    console.log("Erro ao apagar todos as mensagens armazenadas desta conversa: ", e);
  }
};