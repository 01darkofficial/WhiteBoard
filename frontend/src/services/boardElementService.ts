import { ApiResult } from "./types";
import { api, handleApiError } from "./authService";
import { User, BoardElement } from "@/store/types";

export const addBoardElementApi = async (
    user: User | null,
    type: string,
    data: any,
    boardId: string,
): Promise<ApiResult<BoardElement>> => {
    try {
        const response = await api.post<BoardElement>(`/api/board/${boardId}/createElement`, {
            user, type, ...data
        });
        console.log(response);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
}

export const getBoardElementsApi = async (
    user: User | null,
    boardId: string,
): Promise<ApiResult<BoardElement[]>> => {
    try {
        const response = await api.get<BoardElement[]>(`/api/board/${boardId}/getElements`, {
            params: { user }
        });
        console.log(response);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
}

export const removeBoardElementApi = async (
    user: User | null,
    elementId: string,
    boardId: string,
): Promise<ApiResult<BoardElement>> => {
    try {
        const response = await api.delete<BoardElement>(`/api/boards/${boardId}/deleteElement/${elementId}`, {
            params: { user }
        });
        console.log(response);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
}