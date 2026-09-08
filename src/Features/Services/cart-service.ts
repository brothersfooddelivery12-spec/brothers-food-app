import { api } from "./http-client"

export type CartItemRequest = {
    menu_id: string
    quantity: number
}

export type CartPreviewRequest = {
    restaurant_id: string
    address_id?: string | null
    items: CartItemRequest[]
}

export const getCartPreview = (payload: CartPreviewRequest) => {
    return api.post("/cart/preview",payload)
}