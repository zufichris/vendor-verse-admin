import { getAuthToken } from "@/lib/actions/auth.actions";

export interface QueryResponse<T> {
    data: T[];
    totalCount: number;
    filterCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
interface BaseRes {
    message: string;
    status: number;
}
export type ApiResponse<T> =
    | (BaseRes & { success: true; data: T })
    | (BaseRes & { success: false; data: T | null });

export interface ApiErrorResponse extends BaseRes {
    errors?: Record<string, string[]>;
}

export class Api {
    static baseUrl: string = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`;
    private static async getHeaders(
        customHeaders?: HeadersInit,
    ): Promise<HeadersInit> {
        const headers: HeadersInit & { authorization?: string } = {
            "Content-Type": "application/json",
            ...customHeaders,
        };

        const token = await Api.getAuthToken();
        if (token) {
            headers["authorization"] = `Bearer ${token}`;
        }
        return headers;
    }

    private static async handleResponse<T>(
        response: Response,
    ): Promise<ApiResponse<T>> {
        try {
            const data = await response.json();
            return data;
        } catch (error) {
            return {
                data: null,
                message: "an unexpected error occurred",
                success: false,
                status: 500,
            };
        }
    }
    private static async getAuthToken(): Promise<string | null> {
        const token = await getAuthToken();
        return token;
    }
    static async get<T = unknown>(
        path: string,
        options?: RequestInit,
    ): Promise<ApiResponse<T>> {
        const url = `${Api.baseUrl}${path}`;
        try {
            const headers = await this.getHeaders();
            const res = await fetch(url, {
                method: "GET",
                headers,
                ...options,
            });
            const data = await Api.handleResponse<T>(res);
            return data;
        } catch (error: any) {
            return {
                data: null,
                success: false,
                message: error.message || "Network error.",
                status: 500,
            };
        }
    }
    static async post<T = unknown, B = object>(
        path: string,
        body: B,
        options?: RequestInit,
    ): Promise<ApiResponse<T>> {
        const url = `${Api.baseUrl}${path}`;
        try {
            const headers = await this.getHeaders();
            const res = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
                ...options,
            });
            const data = Api.handleResponse<T>(res);
            return data;
        } catch (error: any) {
            return {
                data: null,
                success: false,
                message: error.message || "Network error.",
                status: 500,
            };
        }
    }

    static async patch<T = unknown, B = object>(
        path: string,
        body: B,
        options?: RequestInit,
    ): Promise<ApiResponse<T>> {
        const url = `${Api.baseUrl}${path}`;
        try {
            const headers = await this.getHeaders();
            const res = await fetch(url, {
                method: "PATCH",
                headers,
                body: JSON.stringify(body),
                ...options,
            });
            const data = Api.handleResponse<T>(res);
            return data;
        } catch (error: any) {
            return {
                data: null,
                success: false,
                message: error.message || "Network error.",
                status: 500,
            };
        }
    }

    static async put<T = unknown, B = object>(
        path: string,
        body: B,
        options?: RequestInit,
    ): Promise<ApiResponse<T>> {
        const url = `${Api.baseUrl}${path}`;
        try {
            const headers = await this.getHeaders();
            const res = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(body),
                ...options,
            });
            const data = Api.handleResponse<T>(res);
            return data;
        } catch (error: any) {
            return {
                data: null,
                success: false,
                message: error.message || "Network error.",
                status: 500,
            };
        }
    }

    static async delete<T = unknown>(
        path: string,
        options?: RequestInit,
    ): Promise<ApiResponse<T>> {
        const url = `${Api.baseUrl}${path}`;
        try {
            const headers = await this.getHeaders();
            const res = await fetch(url, {
                method: "DELETE",
                headers,
                ...options,
            });
            const data = Api.handleResponse<T>(res);
            return data;
        } catch (error: any) {
            return {
                data: null,
                success: false,
                message: error.message || "Network error.",
                status: 500,
            };
        }
    }
}
