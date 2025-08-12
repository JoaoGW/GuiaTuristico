import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { MessageSquareMore } from 'lucide-react-native';

import { ChatHistoryTypes } from '../../@types/ChatHistoryTypes';
import { MessageTypes } from '../../@types/MessagesTypes';

// Para todo histórico de mensagens e não o conteúdo de cada uma em específico (TODAS AS FUNÇÕES ABAIXO)
/**
 * Loads the chat history for all stored chats from AsyncStorage.
 *
 * This function retrieves all keys from AsyncStorage, filters them to find
 * those related to chat history, and then fetches the corresponding data.
 * It parses the data and maps it into a structured format for use in the application.
 *
 * @returns {Promise<ChatHistoryTypes[]>} A promise that resolves to an array of chat history objects.
 * Each object contains:
 * - `id`: A unique identifier for the chat.
 * - `title`: A preview of the first message in the chat or a placeholder if the chat is empty.
 * - `date`: The last modified date of the chat or a placeholder if unavailable.
 * - `icon`: A reference to the `MessageSquareMore` icon.
 * - `chatId`: The unique identifier of the chat.
 * - `route`: A constant string `"AIChat"` representing the navigation route.
 * - `navigate`: A placeholder function for navigation.
 *
 * @throws Will log an error message and return an empty array if there is an issue
 * retrieving or parsing the data from AsyncStorage.
 */
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

/**
 * Stores the provided chat history in AsyncStorage under the key '@eztripai_allChatsHistory'.
 *
 * @param chats - The chat history object to be stored. It should conform to the `ChatHistoryTypes` type.
 * @returns A promise that resolves when the data is successfully stored, or rejects with an error if the operation fails.
 * @throws Logs an error message to the console if there is an issue during the storage process.
 */
export const storeAtAllChatsHistory = async (chats: ChatHistoryTypes) => {
  try {
    const jsonValue = JSON.stringify(chats);
    await AsyncStorage.setItem('@eztripai_allChatsHistory', jsonValue);
  } catch (e) {
    console.log("Erro ao salvar: ", e);
  }
};

/**
 * Clears all chat history stored in AsyncStorage.
 *
 * This function retrieves all keys from AsyncStorage, filters the keys
 * that start with the prefix "@eztripai_chatHistory_", and removes
 * all matching keys from storage.
 *
 * @async
 * @function
 * @throws Will log an error message to the console if an error occurs during the process.
 */
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
/**
 * Loads the chat history for a given chat ID from AsyncStorage and updates the provided state setters.
 *
 * @param chatId - The unique identifier of the chat whose history is to be loaded.
 * @param setMessages - A state setter function to update the list of messages.
 * @param setLastModified - A state setter function to update the last modified timestamp.
 *
 * @remarks
 * This function retrieves the chat history stored in AsyncStorage under a key specific to the chat ID.
 * If the data exists, it parses the JSON and updates the provided state setters with the messages and
 * last modified timestamp. If the last modified timestamp is unavailable, it defaults to "Data indisponível".
 *
 * @throws Will display an alert and log an error to the console if there is an issue retrieving or parsing the data.
 */
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

/**
 * Stores the chat history for a specific chat ID in AsyncStorage.
 *
 * @param data - An object containing the chat messages and the last modified timestamp.
 * @param data.messages - An array of messages of type `MessageTypes`.
 * @param data.lastModified - A string representing the last modification timestamp.
 * @param chatId - The unique identifier for the chat whose history is being stored.
 * @returns A promise that resolves when the data is successfully stored.
 * @throws Displays an alert if there is an error saving the chat history.
 */
export const storeChatHistory = async (data: { messages: MessageTypes[]; lastModified: string }, chatId: string) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`@eztripai_chatHistory_${chatId}`, jsonValue);
  } catch (e) {
    Alert.alert('Erro', 'Não foi possível salvar as informações de sua última conversa com seu Guia Turístico!');
  }
};

/**
 * Clears the chat history for a specific chat by removing the associated data from AsyncStorage.
 *
 * @param chatId - The unique identifier of the chat whose history should be cleared.
 * @returns A promise that resolves when the chat history has been successfully removed.
 * @throws Logs an error message to the console if the operation fails.
 */
export const clearChatHistory = async (chatId: string) => {
  try {
    await AsyncStorage.removeItem(`@eztripai_chatHistory_${chatId}`);
  } catch (e) {
    console.log("Erro ao apagar todos as mensagens armazenadas desta conversa: ", e);
  }
};