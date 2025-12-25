import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dev.encodrix.com/api';

// Create a separate API instance for auth operations (no token injection)
const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface LoginCredentials {
    email?: string;
    username?: string;
    password: string;
    rememberMe?: boolean;
    organizationCode?: string;
}

export interface RegisterCredentials {
    first_name: string;
    last_name: string;
    email: string;
    organization_name: string;
    abn_number: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user_id: string;
}

export interface RegisterResponse {
    message: string;
    scannyta_email: string;
    password: string;
    user_id: string;
    personal_email: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        let loginRoute = '/login/';

        // Priority 1: If organization code is provided, use organization-specific login
        if (credentials.organizationCode) {
            loginRoute = `/login/${credentials.organizationCode}/`;
        }
        // Priority 2: Admin email check
        else if (credentials.email && credentials.email.includes('admin')) {
            loginRoute = '/admin/login/';
        }
        // Priority 3: Username-based login (typically requires organization code)
        else if (!credentials.email && credentials.username) {
            loginRoute = credentials.organizationCode
                ? `/login/${credentials.organizationCode}/`
                : '/login/';
        }
        // Default: Normal email login

        const response = await authApi.post<AuthResponse>(loginRoute, credentials);

        if (response.data.access) {
            await SecureStore.setItemAsync('token', response.data.access);
            await SecureStore.setItemAsync('user_id', response.data.user_id);

            // Store refresh token and rememberMe flag
            if (response.data.refresh) {
                await SecureStore.setItemAsync('refreshToken', response.data.refresh);
            }

            if (credentials.rememberMe) {
                await SecureStore.setItemAsync('rememberMe', 'true');
            } else {
                await SecureStore.deleteItemAsync('rememberMe');
            }
        }

        return response.data;
    }

    async signup(credentials: RegisterCredentials): Promise<RegisterResponse> {
        const response = await authApi.post<RegisterResponse>('/register/', credentials);
        return response.data;
    }

    async logout(callAPI?: boolean): Promise<void> {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('rememberMe');
        if (callAPI) {
            // You can add API logout call here if needed
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<any> {
        const response = await fetch(`${API_URL}/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();

        if (data.access) {
            await SecureStore.setItemAsync('token', data.access);
        }
        if (data.refresh) {
            await SecureStore.setItemAsync('refreshToken', data.refresh);
        }

        return data;
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await SecureStore.getItemAsync('token');
        return !!token;
    }

    async hasRememberMe(): Promise<boolean> {
        const rememberMe = await SecureStore.getItemAsync('rememberMe');
        return rememberMe === 'true';
    }

    async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('refreshToken');
    }

    async clearTokens(): Promise<void> {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('rememberMe');
    }
}

export default new AuthService();

