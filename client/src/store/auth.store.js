import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth.api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthed: false,
            isLoading: false,

            setToken: (token) => set({ token, isAuthed: !!token }),
            setUser: (user) => set({ user }),

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const res = await authApi.login(credentials);
                    const { accessToken, user } = res.data; // res = { success, data: { accessToken, user } }
                    set({ token: accessToken, user, isAuthed: true, isLoading: false });
                    return res;
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true });
                try {
                    const res = await authApi.register(data);
                    const { accessToken, user } = res.data; // res = { success, data: { accessToken, user } }
                    set({ token: accessToken, user, isAuthed: true, isLoading: false });
                    return res;
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await authApi.logout();
                } catch (e) {
                    console.error('Logout failed:', e);
                } finally {
                    set({ user: null, token: null, isAuthed: false });
                    // Optional: window.location.href = '/login';
                }
            },

            getMe: async () => {
                const token = get().token;
                if (!token) return;

                try {
                    const res = await authApi.getMe();
                    set({ user: res.data.user, isAuthed: true });
                } catch (error) {
                    // If error is 401, clear store
                    if (error.response && error.response.status === 401) {
                        set({ user: null, token: null, isAuthed: false });
                    }
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthed: state.isAuthed
            }),
        }
    )
);
