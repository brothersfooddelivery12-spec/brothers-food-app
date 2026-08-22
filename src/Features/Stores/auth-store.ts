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
    isAuthenticated: boolean

    setUser: (user: User) => void
    setUserId: (id: string) => void
    updateUser: (data: Partial<User>) => void

    setAuthenticated: (value: boolean) => void
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

            setUserId: (id) => {
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            id
                        }
                        : {
                            id,
                            name: "",
                            email: "",
                            phone: ""
                        }
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
                user: state.user
            })
        }
    )
)