import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type FavouriteState = {
    restaurantIds: string[]
    menuItemIds: string[]

    setRestaurantIds: (ids: string[]) => void
    setMenuItemIds: (ids: string[]) => void

    addRestaurant: (id: string) => void
    removeRestaurant: (id: string) => void

    addMenuItem: (id: string) => void
    removeMenuItem: (id: string) => void

    isRestaurantFavourite: (id: string) => boolean
    isMenuItemFavourite: (id: string) => boolean

    clearFavourites: () => void
}

export const useFavouriteStore = create<FavouriteState>()(
    persist(
        (set, get) => ({
            restaurantIds: [],
            menuItemIds: [],

            setRestaurantIds: (ids) => {
                set({
                    restaurantIds: ids
                })
            },

            setMenuItemIds: (ids) => {
                set({
                    menuItemIds: ids
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
                    restaurantIds: state.restaurantIds.filter(
                        (restaurantId) => restaurantId !== id
                    )
                }))
            },

            addMenuItem: (id) => {
                set((state) => {
                    if (state.menuItemIds.includes(id)) {
                        return state
                    }

                    return {
                        menuItemIds: [
                            ...state.menuItemIds,
                            id
                        ]
                    }
                })
            },

            removeMenuItem: (id) => {
                set((state) => ({
                    menuItemIds: state.menuItemIds.filter(
                        (menuItemId) => menuItemId !== id
                    )
                }))
            },

            isRestaurantFavourite: (id) => {
                return get().restaurantIds.includes(id)
            },

            isMenuItemFavourite: (id) => {
                return get().menuItemIds.includes(id)
            },

            clearFavourites: () => {
                set({
                    restaurantIds: [],
                    menuItemIds: []
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