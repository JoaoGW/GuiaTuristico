# StorageManager (Chat History)

Conjunto de helpers para gerenciar o histórico de conversas usando `@react-native-async-storage/async-storage`.

- Arquivo: `src/services/storageManager.ts`

## Chaves e convenções

- Conversas individuais: `@eztripai_chatHistory_${chatId}` contendo `{ messages: MessageTypes[]; lastModified: string }`.
- Coleção completa (não utilizada para leitura no momento): `@eztripai_allChatsHistory`.

## API

- `loadAllChatsHistory(): Promise<ChatHistoryTypes[]>`
  - Varre todas as chaves que começam com `@eztripai_chatHistory_` e retorna cartões-resumo para listagem (id, title, date, icon, chatId, route, navigate).
- `storeAtAllChatsHistory(chats: ChatHistoryTypes): Promise<void>`
  - Salva um JSON em `@eztripai_allChatsHistory` (não interfere nas chaves por conversa).
- `clearAllChatsHistory(): Promise<void>`
  - Remove todas as chaves com prefixo `@eztripai_chatHistory_`.
- `loadChatHistory(chatId, setMessages, setLastModified): Promise<void>`
  - Lê a conversa específica e injeta estados React com mensagens e `lastModified`.
- `storeChatHistory(data, chatId): Promise<void>`
  - Persiste `{ messages, lastModified }` para um `chatId` específico.
- `clearChatHistory(chatId): Promise<void>`
  - Remove somente a conversa daquele `chatId`.

## Exemplos

```ts
import { loadAllChatsHistory, loadChatHistory, storeChatHistory } from "@services/storageManager";

const items = await loadAllChatsHistory();
await storeChatHistory({ messages, lastModified: new Date().toISOString() }, currentChatId);
await loadChatHistory(currentChatId, setMessages, setLastModified);
```

## Erros comuns

- Estrutura inválida: sempre salve `{ messages, lastModified }`.
- Dados grandes: AsyncStorage é chave-valor; evite payloads muito extensos.
- Conflitos de `chatId`: padronize a criação de IDs (UUID ou timestamp).
