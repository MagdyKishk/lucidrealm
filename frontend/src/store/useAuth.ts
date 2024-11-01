import { create } from 'zustand';
import api from '../lib/axios';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    authError: string | null;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState & AuthActions>((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    authError: null,
    login: async (email: string, password: string) => {
        set({ authError: null, isCheckingAuth: true });
        try {
            const response = await api.post('/auth/login', { email, password });
            document.cookie = `token=${response.data.token}; path=/`;
            set({ 
                user: response.data.user, 
                isAuthenticated: true,
                authError: null
            });
        } catch (error: unknown) {
            console.error('Login failed:', error);
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response: { data: { message: string } } };
                set({ authError: axiosError.response.data.message });
            } else {
                set({ authError: 'An unexpected error occurred' });
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (firstName: string, lastName: string, email: string, password: string) => {
        set({ isCheckingAuth: true, authError: null });
        try {
            const response = await api.post('/auth/signup', { firstName, lastName, email, password });
            document.cookie = `token=${response.data.token}; path=/`;
            set({ 
                user: response.data.user, 
                isAuthenticated: true,
                authError: null
            });
        } catch (error: unknown) {
            console.error('Signup failed:', error);
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response: { data: { message: string } } };
                set({ authError: axiosError.response.data.message });
            } else {
                set({ authError: 'An unexpected error occurred' });
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    logout: () => {
        window.localStorage.removeItem('token');
        set({ 
            user: null, 
            isAuthenticated: false,
            authError: null 
        });
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await api.get('/auth/check', {
                withCredentials: true
            });
            set({ 
                user: response.data.user,
                isAuthenticated: true,
                authError: null
            });
        } catch {
            document.cookie = `token=; path=/`;
            set({ 
                user: null,
                isAuthenticated: false 
            });
        } finally {
            set({ isCheckingAuth: false });
        }
    }
}))