import axios, { AxiosError } from "axios";
import { AuthResponse, ApiResult } from "./types";
import { User } from "@/store/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Centralized error handler
export const handleApiError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
        if (err.response) return err.response.data?.message || "Server error";
        if (err.request) return "No response from server";
        return err.message;
    }
    return "Unexpected error";
};

// Auth APIs
export const signupApi = async (name: string, email: string, password: string): Promise<ApiResult<AuthResponse>> => {
    try {
        const response = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export const loginApi = async (email: string, password: string): Promise<ApiResult<AuthResponse>> => {
    try {
        const response = await api.post<AuthResponse>("/api/auth/login", { email, password });
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export const logoutApi = async (): Promise<ApiResult<null>> => {
    try {
        await api.post("/api/auth/logout");
        return { success: true, data: null };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export const getUserApi = async (): Promise<ApiResult<User>> => {
    try {
        const response = await api.get<User>("/api/auth/user");
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export const updateUserApi = async (data: { name?: string; password?: string; avatar?: string }): Promise<ApiResult<User>> => {
    try {
        const response = await api.put<User>("/api/auth/user", data);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export const deleteUserApi = async (): Promise<ApiResult<null>> => {
    try {
        await api.delete("/api/auth/user");
        return { success: true, data: null };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

export { api };
