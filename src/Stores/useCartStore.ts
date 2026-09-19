import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type CartItem = {
    id: string
    imageUrl?: string | null
    name: string
    description?: string
    quantity: number
    price: number
    isAvailable: boolean
}

export type RestaurantCart = {
    id: string
    restaurantName: string
    restaurantLogoUrl?: string | null
    deliveryFee?: number
    deliveryTime?: number
    isOpen: boolean
    items: CartItem[]
}

export type AddToCartPayload = {
    restaurant: {
        id: string
        restaurantName: string
        restaurantLogoUrl?: string | null
        deliveryFee?: number
        deliveryTime?: number
        isOpen: boolean
    }

    item: {
        id: string
        imageUrl?: string | null
        name: string
        description?: string
        price: number
        quantity?: number
        isAvailable: boolean
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
                    if (!restaurant.isOpen) {
                        return state
                    }

                    if (!item.isAvailable) {
                        return state
                    }

                    const quantityToAdd = Math.max(1, item.quantity ?? 1)

                    const existingRestaurant = state.carts.find(cart => cart.id === restaurant.id)

                    if (existingRestaurant) {
                        const existingItem = existingRestaurant.items.find(cartItem => cartItem.id === item.id)

                        const updatedCarts =
                            state.carts.map(
                                cart => {
                                    if (cart.id !== restaurant.id) {
                                        return cart
                                    }

                                    return {
                                        ...cart,

                                        restaurantName: restaurant.restaurantName,
                                        restaurantLogoUrl: restaurant.restaurantLogoUrl,
                                        deliveryFee: restaurant.deliveryFee,
                                        deliveryTime: restaurant.deliveryTime,
                                        isOpen: restaurant.isOpen,
                                        items: existingItem
                                            ? cart.items.map(
                                                currentItem =>
                                                    currentItem.id ===
                                                    item.id
                                                        ? {
                                                                ...currentItem,
                                                                ...item,

                                                                quantity: currentItem.quantity + quantityToAdd
                                                            }
                                                        : currentItem
                                            )
                                            : [
                                                ...cart.items,
                                                {
                                                    ...item,
                                                    quantity: quantityToAdd
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

                    const newRestaurantCart:
                        RestaurantCart = {
                            ...restaurant,

                            items: [
                                {
                                    ...item,
                                    quantity: quantityToAdd
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

                                if (!restaurant.isOpen) {
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
                                                if (!item.isAvailable) {
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
                                restaurant.id === restaurantId ? {...restaurant, isOpen: isActive} : restaurant
                        )
                }))
            },

            updateItemAvailability: (
                restaurantId,
                itemId,
                isAvailable
            ) => {
                set((state) => ({
                    carts: state.carts.map(
                        restaurant => {
                            if (restaurant.id !== restaurantId) {
                                return restaurant
                            }

                            return {
                                ...restaurant,

                                items:
                                    restaurant.items.map(
                                        item =>
                                            item.id === itemId
                                            ? {
                                                ...item,
                                                isAvailable
                                            }
                                            : item
                                    )
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