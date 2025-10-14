// store/boardStore.ts
import { create } from "zustand";
import {
    getNotificationsApi,
    respondToNotificationApi,
    markReadApi,
    markAllReadApi,
} from "@/services/notificationService";
import { NotificationsState } from "@/store/types";

export const useNotificationStore = create<NotificationsState>((set, get) => ({
    notifications: [],
    loading: false,
    error: null,

    fetchNotifications: async (unreadOnly: boolean, limit?: number) => {
        try {
            set({ loading: true, error: null });
            const result = await getNotificationsApi(unreadOnly, limit);
            set({ notifications: result.data || [], loading: false });
        } catch (err: any) {
            console.error("Error fetching notifications:", err);
            set({ error: err.message, loading: false });
        }
    },

    respondToNotification: async (notificationId: string, response: string, userEmail: string) => {
        const res = await respondToNotificationApi(notificationId, response, userEmail);
        if (res.data) {
            set({
                notifications: get().notifications.map((notification) =>
                    notification.id === res.data?.id ? { ...notification, ...res.data } : notification
                ),
            });
        } else {
            throw new Error("Failed to update notification");
        }
    },

    markRead: async (notificationID: string) => {
        const res = await markReadApi(notificationID);
        // optionally update store
    },

    markAllRead: async () => {
        const result = await markAllReadApi();
        // optionally update store
    },
}));
