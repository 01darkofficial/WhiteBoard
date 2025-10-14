import { api, handleApiError } from "./authService";
import { ApiResult } from "./types";
import { Notification } from "@/store/types";

const notificationApi = '/api/notifications'

export const getNotificationsApi = async (unreadOnly: boolean, limit?: number): Promise<ApiResult<Notification[]>> => {
    try {
        const response = await api.get(`${notificationApi}`, {
            params: {
                unreadOnly,
                limit,
            }
        });

        // console.log("noti : ", response);
        return { success: true, data: response.data };
    }
    catch (error: unknown) {
        return { success: false, error: handleApiError(error) };
    }
}

export const respondToNotificationApi = async (notificationId: string, response: string, userEmail: string): Promise<ApiResult<Notification>> => {
    try {
        console.log(notificationId);
        const res = await api.patch(`${notificationApi}/respond/${notificationId}`, {
            response,
            userEmail
        })
        console.log(res);
        return { success: true, data: res.data };
    }
    catch (error: unknown) {
        return { success: false, error: handleApiError(error) };
    }
}

export const markReadApi = async (notificationId: string): Promise<ApiResult<Notification>> => {
    try {
        const response = await api.patch(`${notificationApi}/markRead/${notificationId}`);
        console.log(response);
        return { success: true, data: response.data }
    }
    catch (error: unknown) {
        return { success: false, error: handleApiError(error) };
    }
}
export const markAllReadApi = async (): Promise<ApiResult<Notification>> => {
    try {
        const response = await api.patch(`${notificationApi}/markAllRead`);
        console.log(response);
        return { success: true, data: response.data }
    }
    catch (error: unknown) {
        return { success: false, error: handleApiError(error) };
    }
}