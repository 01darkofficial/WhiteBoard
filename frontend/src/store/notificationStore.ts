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
        set({ loading: true, error: null });
        const res = await getNotificationsApi(unreadOnly, limit);
        if (res.success && res.data) {
            set({ notifications: res.data });
        } else {
            console.error("Error fetching notifications:", res.error);
            set({ error: res.error });
        }
        set({ loading: false });
    },

    respondToNotification: async (notificationId: string, response: string, userEmail: string) => {
        const res = await respondToNotificationApi(notificationId, response, userEmail);
        if (res.success && res.data) {
            set({
                notifications: get().notifications.map((n) =>
                    n.id === res.data!.id ? { ...n, ...res.data! } : n
                ),
            });
        } else {
            console.error("Failed to update notification:", res.error);
        }
    },

    markRead: async (notificationId: string) => {
        const res = await markReadApi(notificationId);
        if (!res.success) console.error("Failed to mark notification as read:", res.error);
    },

    markAllRead: async () => {
        const res = await markAllReadApi();
        if (!res.success) console.error("Failed to mark all notifications as read:", res.error);
    },
}));
