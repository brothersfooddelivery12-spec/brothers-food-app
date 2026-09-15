import { api } from "./http-client"

export const getFavoriteRestaurants = () => {
    return api.get("/favorites/favorites/restaurants")
}

export const addRestaurantToFavorites = (restaurantId: string) => {
    return api.post(
        `/favorites/favorites/restaurants/${restaurantId}`
    )
}

export const removeRestaurantFromFavorites = (restaurantId: string) => {
    return api.delete(
        `/favorites/favorites/restaurants/${restaurantId}`
    )
}

export const getFavoriteMenuItems = () => {
    return api.get("/favorites/favorites/menu-items")
}

export const addMenuItemToFavorites = (menuItemId: string) => {
    return api.post(
        `/favorites/favorites/menu-items/${menuItemId}`
    )
}

export const removeMenuItemFromFavorites = (menuItemId: string) => {
    return api.delete(
        `/favorites/favorites/menu-items/${menuItemId}`
    )
}