import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationsTypes } from '../../@types/NotificationsTypes';

interface NotificationStore {
  notifications: NotificationsTypes[];
  addNotification: (notification: Omit<NotificationsTypes, 'id'>) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

/**
 * A Zustand store for managing notifications with persistence.
 *
 * This store provides functionality to add, remove, and clear notifications.
 * Notifications are persisted using AsyncStorage under the key `notification-storage`.
 *
 * @function useNotificationStore
 * @returns {NotificationStore} The Zustand store for managing notifications.
 *
 * @property {Array} notifications - The list of notifications currently in the store.
 * @property {Function} addNotification - Adds a new notification to the store.
 *   - @param {Object} notification - The notification object to add.
 *   - @param {string} notification.title - The title of the notification.
 *   - @param {string} [notification.message] - The optional message of the notification.
 *   - @returns {void}
 * @property {Function} removeNotification - Removes a notification from the store by its ID.
 *   - @param {number} id - The ID of the notification to remove.
 *   - @returns {void}
 * @property {Function} clearNotifications - Clears all notifications from the store.
 *   - @returns {void}
 */
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          ...notification,
          id: Date.now(),
        }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);