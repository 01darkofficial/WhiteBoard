import { ApiResult } from "./types";
import { api, handleApiError } from "./authService";
import { User, Board } from "@/store/types";

export const createBoardApi = async (
    user: User | null,
    name: string,
): Promise<ApiResult<Board>> => {
    try {
        const response = await api.post<Board>("/api/boards/create", {
            user,
            name,
        });
        console.log(response);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export const getBoardApi = async (
    user: User | null
): Promise<ApiResult<Board[]>> => {
    try {
        const response = await api.get<Board[]>("/api/boards/", {
            params: { user: user?._id },
        });
        console.log(response);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};