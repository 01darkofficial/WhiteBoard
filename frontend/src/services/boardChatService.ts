import { ApiResult } from "./types";
import { api, handleApiError } from "./authService";
import { ChatMessage } from "@/store/types";

export const getBoardChatApi = async (boardId: string): Promise<ApiResult<ChatMessage[]>> => {
    try {
        const response = await api.get<ChatMessage[]>(`/api/chats/${boardId}/getChats`);
        return { success: true, data: response.data };

    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };

    }
}
export const updateBoardChatApi = async (boardId: string, username: string, msg: string): Promise<ApiResult<ChatMessage[]>> => {
    try {
        const response = await api.patch<ChatMessage[]>(`/api/chats/${boardId}/updateChats`, {
            username,
            msg,
        });
        return { success: true, data: response.data };

    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };

    }
}