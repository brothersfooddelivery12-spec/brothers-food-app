import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type CartItem = {
    id: string
    name: string
    image: string
    quantity: number
    price: number
    description?: string
    isActive: boolean
}

export type RestaurantCart = {
    id: string
    restaurantName: string
    restaurantImage: string
    deliveryTime: string
    deliveryFee: number
    isActive: boolean
    items: CartItem[]
}

export type AddToCartPayload = {
    restaurant: {
        id: string
        restaurantName: string
        restaurantImage: string
        deliveryTime: string
        deliveryFee: number
        isActive: boolean
    }

    item: {
        id: string
        name: string
        image: string
        price: number
        description?: string
        isActive: boolean
    }
}

type CartStore = {
    carts: RestaurantCart[]
    activeRestaurantId: string | null
    hasHydrated: boolean

    setHasHydrated: (value: boolean) => void
    addToCart: (payload: AddToCartPayload) => void
    selectRestaurant: (restaurantId: string) => void
    increaseQuantity: (restaurantId: string, itemId: string) => void
    decreaseQuantity: (restaurantId: string, itemId: string) => void
    removeItem: (restaurantId: string, itemId: string) => void
    removeRestaurantCart: (restaurantId: string) => void

    clearActiveCart: () => void
    clearCart: () => void

    updateRestaurantAvailability: (restaurantId: string, isActive: boolean) => void
    updateItemAvailability: (restaurantId: string, itemId: string, isActive: boolean) => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            carts: [],
            activeRestaurantId: null,
            hasHydrated: false,
            setHasHydrated: (value) => {
                set({ hasHydrated: value })
            },

            addToCart: ({ restaurant, item }) => {
                set((state) => {
                    const existingRestaurant = state.carts.find((cart) => cart.id === restaurant.id)

                    if (existingRestaurant) {
                        if (!existingRestaurant.isActive) {
                            return state
                        }

                        const existingItem = existingRestaurant.items.find((cartItem) => cartItem.id === item.id)

                        if (existingItem && !existingItem.isActive) {
                            return state
                        }

                        if (!item.isActive) {
                            return state
                        }

                        const updatedCarts =
                            state.carts.map(
                                (cart) => {
                                    if (cart.id !== restaurant.id) {
                                        return cart
                                    }

                                    const cartItem = cart.items.find((currentItem) => currentItem.id === item.id)

                                    if (cartItem) {
                                        return {
                                            ...cart,
                                            items:
                                                cart.items.map(
                                                    (
                                                        currentItem
                                                    ) =>
                                                        currentItem.id ===
                                                        item.id
                                                            ? {
                                                                ...currentItem,
                                                                quantity: currentItem.quantity + 1
                                                            }
                                                            : currentItem
                                                )
                                        }
                                    }

                                    return {
                                        ...cart,
                                        items: [
                                            ...cart.items,

                                            {
                                                ...item,
                                                quantity: 1
                                            }
                                        ]
                                    }
                                }
                            )

                        return {
                            carts: updatedCarts,
                            activeRestaurantId: restaurant.id
                        }
                    }

                    if (!restaurant.isActive || !item.isActive) {
                        return state
                    }

                    const newRestaurantCart:
                        RestaurantCart = {
                            ...restaurant,

                            items: [
                                {
                                    ...item,
                                    quantity: 1
                                }
                            ]
                        }

                    return {
                        carts: [
                            ...state.carts,
                            newRestaurantCart
                        ],
                        activeRestaurantId: restaurant.id
                    }
                })
            },

            selectRestaurant: (restaurantId) => {
                set({ activeRestaurantId: restaurantId })
            },

            increaseQuantity: (restaurantId, itemId) => {
                set((state) => ({
                    carts:
                        state.carts.map(
                            (restaurant) => {
                                if (restaurant.id !== restaurantId) {
                                    return restaurant
                                }

                                if (!restaurant.isActive) {
                                    return restaurant
                                }

                                return {
                                    ...restaurant,
                                    items:
                                        restaurant.items.map(
                                            (item) => {
                                                if (item.id !== itemId) {
                                                    return item
                                                }
                                                if (!item.isActive) {
                                                    return item
                                                }

                                                return {
                                                    ...item,
                                                    quantity: item.quantity + 1
                                                }
                                            }
                                        )
                                }
                            }
                        )
                }))
            },

            decreaseQuantity: (restaurantId, itemId) => {
                set((state) => ({
                    carts: state.carts.map(
                        (restaurant) => {
                            if (restaurant.id !== restaurantId) {
                                return restaurant
                            }

                            return {
                                ...restaurant,
                                items:
                                    restaurant.items.map(
                                        (item) => {
                                            if (item.id !== itemId) {
                                                return item
                                            }

                                            if (item.quantity <= 1) {
                                                return item
                                            }

                                            return {
                                                ...item,
                                                quantity: item.quantity - 1
                                            }
                                        }
                                    )
                            }
                        }
                    )
                }))
            },

            removeItem: (restaurantId, itemId) => {
                set((state) => {
                    const updatedCarts =
                        state.carts
                            .map(
                                (
                                    restaurant
                                ) => {
                                    if (restaurant.id !== restaurantId) {
                                        return restaurant
                                    }

                                    return {
                                        ...restaurant,
                                        items: restaurant.items.filter((item) => item.id !== itemId)
                                    }
                                }
                            )
                            .filter((restaurant) => restaurant.items.length > 0)

                    const activeCartExists = updatedCarts.some((restaurant) => restaurant.id === state.activeRestaurantId)

                    return {
                        carts: updatedCarts,
                        activeRestaurantId:
                            activeCartExists
                                ? state.activeRestaurantId
                                : updatedCarts[0] ?.id ?? null 
                    }
                })
            },

            removeRestaurantCart: (restaurantId) => {
                set((state) => {
                    const updatedCarts = state.carts.filter((restaurant) => restaurant.id !== restaurantId)

                    return {
                        carts: updatedCarts,

                        activeRestaurantId:
                            state.activeRestaurantId === restaurantId ? updatedCarts[0] ?.id ?? null : state.activeRestaurantId
                    }
                })
            },

            clearActiveCart: () => {
                const { carts, activeRestaurantId } = get()

                if (!activeRestaurantId) {
                    return
                }

                const updatedCarts = carts.filter((restaurant) => restaurant.id !== activeRestaurantId)

                set({
                    carts: updatedCarts,
                    activeRestaurantId: updatedCarts[0] ?.id ?? null
                })
            },

            clearCart: () => {
                set({
                    carts: [],
                    activeRestaurantId: null
                })
            },

            updateRestaurantAvailability: (restaurantId, isActive) => {
                set((state) => ({
                    carts:
                        state.carts.map(
                            (restaurant) =>
                                restaurant.id === restaurantId ? {...restaurant, isActive} : restaurant
                        )
                }))
            },

            updateItemAvailability: (
                restaurantId,
                itemId,
                isActive
            ) => {
                set((state) => ({
                    carts:
                        state.carts.map(
                            (restaurant) => {
                                if (restaurant.id !== restaurantId) {
                                    return restaurant
                                }

                                return {
                                    ...restaurant,
                                    items: restaurant.items.map((item) => item.id === itemId ? {...item, isActive} : item)
                                }
                            }
                        )
                }))
            }
        }),

        {
            name: "brothers-food-cart",
            storage: createJSONStorage(() => AsyncStorage),

            partialize: (state) => ({
                carts: state.carts,
                activeRestaurantId: state.activeRestaurantId
            }),

            onRehydrateStorage:
                () => {
                    return (state, error) => {
                        if (error) {
                            console.log("Cart hydration error:", error)
                        }

                        state?.setHasHydrated(true)
                    }
                }
        }
    )
)