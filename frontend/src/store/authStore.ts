import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    username: string;
    email: string;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setTokens: (tokens: { access: string; refresh: string }) => void;
    setUser: (user: User | null) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setTokens: (tokens) => set((state) => {
                const shouldUpdateLocalStorage = get().refreshToken !== tokens.refresh;
                const newState = {
                    ...state,
                    accessToken: tokens.access,
                    refreshToken: tokens.refresh,
                    isAuthenticated: !!tokens.access && !!tokens.refresh,
                    error: null,
                    isLoading: false,
                };
                if (shouldUpdateLocalStorage) {
                    
                } else {
                    state.accessToken = tokens.access;
                    state.isAuthenticated = !!tokens.access && !!tokens.refresh;
                    state.error = null;
                    state.isLoading = false;
                }
                 if (newState.accessToken && newState.refreshToken) {
                    newState.isAuthenticated = true;
                 }
                 return {
                     accessToken: newState.accessToken,
                     refreshToken: tokens.refresh,
                     isAuthenticated: newState.isAuthenticated,
                     error: newState.error,
                     isLoading: newState.isLoading,
                 };

            }),

            setUser: (user) => set({ user }),

            clearAuth: () => set({
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            }),
            setLoading: (loading) => set({ isLoading: loading }),

            setError: (error) => set({ error, isLoading: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ refreshToken: state.refreshToken, user: state.user }),
            onRehydrateStorage: (state) => {
                console.log("Hydration finished");
                return (currentState, error) => {
                  if (error) {
                    console.error("Failed to rehydrate auth state:", error);
                  } else if (currentState) {
                     currentState.isAuthenticated = !!currentState.refreshToken;
                     currentState.accessToken = null;
                  }
                }
            }
        }
    )
);