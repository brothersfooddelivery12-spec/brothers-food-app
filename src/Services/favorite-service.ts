import { api } from "./http-client"

export interface FavoriteRestaurantResponse {
    id: string
    name: string
    description: string

    logo_url: string | null
    cover_image_url: string | null

    is_open: boolean

    rating: string | number | null

    latitude: number
    longitude: number

    opening_time: string | null
    closing_time: string | null

    estimated_time_minutes: number | null
    delivery_fee: string | number | null
}

export const getFavoriteRestaurants = (latitude: number, longitude: number) => {
    return api.get("/favorites/restaurants",
        {
            params: {
                latitude,
                longitude
            }
        }
    )
}

export const addRestaurantToFavorites = (restaurantId: string) => {
    return api.post(`/favorites/restaurants/${restaurantId}`)
}

export const removeRestaurantFromFavorites = (restaurantId: string) => {
    return api.delete(`/favorites/restaurants/${restaurantId}`)
}

export interface FavoriteMenuItemResponse {
    id: string

    restaurant: {
        id: string
        name: string
        logo_url: string | null
        is_open: boolean
    }

    name: string
    description: string

    image_url: string | null
    category_name: string | null

    is_available: boolean
    is_veg: boolean

    price: string | number

    estimated_time_minutes: number | null

    latitude: number
    longitude: number

    delivery_fee: string | number | null
}

export const getFavoriteMenuItems = (latitude: number, longitude: number) => {
    return api.get("/favorites/menu-items",
        {
            params: {
                latitude,
                longitude
            }
        }
    )
}

export const addMenuItemToFavorites = (menuItemId: string) => {
    return api.post(`/favorites/menu-items/${menuItemId}`)
}

export const removeMenuItemFromFavorites = (menuItemId: string) => {
    return api.delete(`favorites/menu-items/${menuItemId}`)
}