
import { ApiResult } from "./types";
import { api, handleApiError } from "./authService";
import { Board, Invitation, AddMemberResponse } from "@/store/types";

const ADD_MEMEBER_APi = '/api/membership'

export const addMemberApi = async (
    boardId: string,
    userEmail: string,
    inviteeEmail: string,
    role: string,
    permissions: string[]
): Promise<ApiResult<AddMemberResponse>> => {
    try {
        const response = await api.post(`${ADD_MEMEBER_APi}/${boardId}/addMember`, {
            userEmail,
            inviteeEmail,
            role,
            permissions
        })
        console.log(response);
        return { success: true, data: response.data };
    } catch (err) {
        return { success: false, error: handleApiError(err) };
    }
}