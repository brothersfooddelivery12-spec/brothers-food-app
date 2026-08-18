import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface User {
    id: string
    name: string
    email: string
    phone: string
    profileImage?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
}

interface AuthState {
    user: User | null

    accessToken: string | null
    refreshToken: string | null

    isAuthenticated: boolean

    setUser: (user: User) => void
    updateUser: (data: Partial<User>) => void

    setAccessToken: (token: string | null) => void
    setRefreshToken: (token: string | null) => void

    setAuthenticated: (value: boolean) => void

    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: true,
                })
            },

            updateUser: (data) => {
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            ...data,
                        }
                        : null,
                }))
            },

            setAccessToken: (token) => {
                set({
                    accessToken: token,
                    isAuthenticated: !!token,
                })
            },

            setRefreshToken: (token) => {
                set({
                    refreshToken: token,
                })
            },

            setAuthenticated: (value) => {
                set({
                    isAuthenticated: value,
                })
            },

            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                })
            },
        }),

        {
            name: "auth-store",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ user: state.user }),
        },
    ),
)