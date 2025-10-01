import axios, { AxiosError } from "axios";
import { AuthResponse, ApiResult } from "./types";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

// Create axios instance with default headers
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Global auth state clearer (set by AuthContext)
let clearAuthState: (() => void) | null = null;
export const setAuthStateClearer = (clearFn: () => void) => {
    clearAuthState = clearFn;
};

// Interceptor: clear auth on 401
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401 && clearAuthState) {
            clearAuthState();
        }
        return Promise.reject(error);
    }
);

// Centralized error handler
export const handleApiError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
        if (err.response) {
            console.error(
                "Server responded with:",
                err.response.data,
                "Status:",
                err.response.status
            );
            return err.response.data?.message || "Server error";
        } else if (err.request) {
            console.error("No response received:", err.request);
            return "No response from server";
        } else {
            console.error("Request error:", err.message);
            return err.message;
        }
    } else {
        console.error("Unexpected error:", err);
        return "Unexpected error";
    }
};


// Signup
export const signupApi = async (
    name: string,
    email: string,
    password: string
): Promise<ApiResult<AuthResponse>> => {
    try {
        const response = await api.post<AuthResponse>("/api/auth/register", {
            name,
            email,
            password,
        });
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

// Login
export const loginApi = async (
    email: string,
    password: string
): Promise<ApiResult<AuthResponse>> => {
    try {
        const response = await api.post<AuthResponse>("/api/auth/login", {
            email,
            password,
        });
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

// Logout
export const logoutApi = async (): Promise<ApiResult<null>> => {
    try {
        await api.post("/api/auth/logout");
        if (clearAuthState) clearAuthState();
        return { success: true, data: null };
    } catch (err: unknown) {
        if (clearAuthState) clearAuthState();
        return { success: false, error: handleApiError(err) };
    }
};

export const getUser = async (): Promise<ApiResult<AuthResponse>> => {
    try {
        const response = await api.get<AuthResponse>("/api/auth/user");
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, error: handleApiError(err) };
    }
};

// Export the Axios instance for raw requests if needed
export { api };
