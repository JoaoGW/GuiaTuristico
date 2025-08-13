# Notification Store (Zustand)

Loja global (com persistência) de notificações.

- Arquivo: `src/utils/notificationStore.ts`
- Tecnologias: `zustand`, `zustand/middleware`, `@react-native-async-storage/async-storage`

## Shape

```ts
interface NotificationsTypes {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string; // ISO
}
```

## API

- `useNotificationStore()`
  - `notifications: NotificationsTypes[]`
  - `addNotification(notification: Omit<NotificationsTypes, 'id'>)` — id gerado com `Date.now()`
  - `removeNotification(id: number)`
  - `clearNotifications()`

## Exemplo

```ts
import { useNotificationStore } from "@utils/notificationStore";

const add = useNotificationStore(s => s.addNotification);
add({ title: 'Bem-vindo', message: 'Olá!', type: 'success', date: new Date().toISOString() });
```

## Persistência

- Nome do storage: `notification-storage`.
- Backend: AsyncStorage via `createJSONStorage`.
