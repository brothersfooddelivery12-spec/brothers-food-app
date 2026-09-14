import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type FavouriteState = {
    restaurantIds: string[]

    setRestaurantIds: (ids: string[]) => void

    addRestaurant: (id: string) => void

    removeRestaurant: (id: string) => void

    isRestaurantFavourite: (id: string) => boolean

    clearFavourites: () => void
}

export const useFavouriteStore = create<FavouriteState>()(
    persist(
        (set, get) => ({
            restaurantIds: [],

            setRestaurantIds: (ids) => {
                set({
                    restaurantIds: ids
                })
            },

            addRestaurant: (id) => {
                set((state) => {
                    if (state.restaurantIds.includes(id)) {
                        return state
                    }

                    return {
                        restaurantIds: [
                            ...state.restaurantIds,
                            id
                        ]
                    }
                })
            },

            removeRestaurant: (id) => {
                set((state) => ({
                    restaurantIds:
                        state.restaurantIds.filter(
                            (restaurantId) => restaurantId !== id
                        )
                }))
            },

            isRestaurantFavourite: (id) => {
                return get().restaurantIds.includes(id)
            },

            clearFavourites: () => {
                set({
                    restaurantIds: []
                })
            }
        }),
        {
            name: "favourite-storage",

            storage: createJSONStorage(
                () => AsyncStorage
            )
        }
    )
)