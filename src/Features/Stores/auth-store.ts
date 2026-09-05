import AsyncStorage from "@react-native-async-storage/async-storage"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { tokenStorage } from "./token-storage"

export interface User {
    id: string
    name: string
    email: string
    phone: string | null
    role: "USER"
    isActive: boolean
    vegMode: boolean
    profileImage?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean

    setUser: (user: User) => void

    setAuthUser: (
        id: string,
        phone: string
    ) => void

    updateUser: (data: Partial<User>) => void

    setAuthenticated: (value: boolean) => void
    logout: () => Promise<void>
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: true
                })
            },

            setAuthUser: (id, phone) => {
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            id,
                            phone
                        }
                        : {
                            id,
                            name: "",
                            email: "",
                            phone,
                            role: "USER",
                            isActive: false,
                            vegMode: true
                        },

                    isAuthenticated: true
                }))
            },

            updateUser: (data) => {
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            ...data
                        }
                        : null
                }))
            },

            setAuthenticated: (value) => {
                set({
                    isAuthenticated: value
                })
            },

            logout: async () => {
                try {
                    if (GoogleSignin.hasPreviousSignIn()) {
                        await GoogleSignin.signOut()
                    }
                } catch (error) {
                    console.log(
                        "Google sign out failed:",
                        error
                    )
                } finally {
                    await tokenStorage.clearTokens()

                    set({
                        user: null,
                        isAuthenticated: false
                    })
                }
            },

            clearAuth: () => {
                set({
                    user: null,
                    isAuthenticated: false
                })
            }
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => AsyncStorage),

            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)