import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type HomeLocation = {
    latitude: number
    longitude: number
    name: string
    source: "CURRENT" | "MANUAL"
}

interface LocationState {
    location: HomeLocation | null
    hasHydrated: boolean

    setLocation: (location: HomeLocation) => void

    clearLocation: () => void
    setHasHydrated: (value: boolean) => void
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            location: null,
            hasHydrated: false,

            setLocation: (location) => {
                set({ location })
            },

            clearLocation: () => {
                set({ location: null })
            },

            setHasHydrated: (value) => {
                set({
                    hasHydrated: value
                })
            }
        }),
        {
            name: "home-location",

            storage: createJSONStorage(
                () => AsyncStorage
            ),

            partialize: (state) => ({
                location: state.location
            }),

            onRehydrateStorage: () => {
                return (state) => {
                    state?.setHasHydrated(true)
                }
            }
        }
    )
)