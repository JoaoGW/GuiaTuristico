import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChatHistoryTypes } from '../../@types/ChatHistoryTypes';
import { MessageTypes } from '../../@types/MessagesTypes';

// Para todo histórico de mensagens e não o conteúdo de cada uma em específico (TODAS AS FUNÇÕES ABAIXO)
export const loadAllChatsHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@eztripai_allChatsHistory');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("Não foi possível resgatar todas as informações: ", e);
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
    const jsonValue = JSON.stringify("");
    await AsyncStorage.setItem('@eztripai_allChatsHistory', jsonValue);
  } catch (e) {
    console.log("Erro ao apagar todos os itens armazenados: ", e);
  }
};

// Para cada mensagem em específico (TODAS AS FUNÇÕES ABAIXO)
export const loadChatHistory = async (setMessages: React.Dispatch<React.SetStateAction<MessageTypes[]>>) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@eztripai_chatHistory');
    if (jsonValue != null) {
      setMessages(JSON.parse(jsonValue));
    }
  } catch (error) {
    console.error('Erro ao carregar histórico de mensagens:', error);
  }
};

export const storeChatHistory = async (messages: MessageTypes[]) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem('@eztripai_chatHistory', jsonValue);
  } catch (e) {
    Alert.alert('Erro', 'Não foi possível salvar as informações de sua última conversa com seu Guia Turístico!');
  }
}

export const clearChatHistory = async () => {
  try {
    const jsonValue = JSON.stringify("");
    await AsyncStorage.setItem('@eztripai_chatHistory', jsonValue);
  } catch (e) {
    console.log("Erro ao apagar todos as mensagens armazenadas: ", e);
  }
};