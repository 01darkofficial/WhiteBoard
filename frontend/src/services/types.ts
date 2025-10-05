

// Unified response type
export interface AuthResponse {
    id: string;
    name: string;
    email: string;
}

export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
