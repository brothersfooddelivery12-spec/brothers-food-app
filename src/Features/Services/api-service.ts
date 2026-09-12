import api from "./api-client"

export type OTPPurpose = "LOGIN" | "VERIFY"

export type SendOtpRequest = {
    phone: string
    purpose: OTPPurpose
}

export type VerifyOtpRequest = {
    phone: string
    otp: string
    role: "USER"
    purpose: OTPPurpose
}

type GoogleSignInRequest = {
    id_token: string,
    role: "USER"
}

export type UserProfile = {
    id: string
    name: string
    email: string
    phone: string | null
    image_url?: string | null
    role?: "USER"
    is_active?: boolean
}

export type EditUserRequest = {
    name?: string
    email?: string
    phone?: string
    image_url?: string
}

export const sendOtp = (req: SendOtpRequest) => {
    return api.post("/auth/send-otp", req)
}

export const verifyOtp = (req: VerifyOtpRequest) => {
    return api.post("/auth/verify-otp", req)
}

export const googleSignIn = (req: GoogleSignInRequest) => {
    return api.post('auth/google', req)
}

export const getUserProfile = () => {
    return api.get("/user/me")
}

export const editUserProfile = (req: EditUserRequest) => {
    return api.patch("/user/edit-user", req)
}

export interface Category {
    id: string
    name: string
    restaurant_id: string
    description: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export const getCategories = (latitude: number, longitude: number) => {
    return api.get("/categories",
        {
            params: {
                latitude,
                longitude
            }
        }
    )
}

export interface Advertisement {
    id: string
    image_url: string[]
    navigate_url?: string | null
}

export const getAdvertisements = () => {
    return api.get("/admin/advertisement")
}

export interface PopularRestaurant {
    id: string

    name: string
    description: string

    logo_url: string | null
    cover_image_url: string | null

    is_open: boolean

    rating?: string | null
    distance?: number | null
    discount?: string | null
    price_for_two?: number | null

    latitude: number
    longitude: number

    opening_time: string
    closing_time: string

    estimated_time_minutes: number | null
    delivery_fee: string | null
}

export const getPopularRestaurants = (latitude: number, longitude: number) => {
    return api.get("/restaurants/popular",
        {
            params: {
                latitude,
                longitude
            }
        }
    )
}

export interface PopularMenu {
    id: string
    restaurant_id: string

    name: string
    description: string
    image_url: string | null

    category_name: string

    is_available: boolean
    is_veg: boolean

    price: string

    estimated_time_minutes: number

    latitude: number
    longitude: number

    delivery_fee: string
}

export const getPopularMenu = (latitude: number, longitude: number) => {
    return api.get("/menu/popular",
        {
            params: {
                latitude,
                longitude
            }
        }
    )
}

export interface NearbyRestaurant {
    id: string

    name: string
    description: string

    latitude: number
    longitude: number

    opening_time: string
    closing_time: string

    logo_url: string
    cover_image_url: string

    is_open: boolean

    rating?: string | null
    distance?: number | null
    discount?: string | null
    price_for_two?: number | null
}

export const getNearbyRestaurants = (latitude: number, longitude: number) => {
    return api.get(
        "/restaurants/nearby",
        {
            params: {
                latitude,
                longitude
            }
        }
    )
}

export type OrderPaymentMethod = "COD" | "ONLINE" | "WALLET"

export type CreateOrderItem = {
    menu_id: string
    quantity: number
}

export type CreateOrderRequest = {
    restaurant_id: string
    address_id: string
    items: CreateOrderItem[]
    payment_method: OrderPaymentMethod
    note?: string
}

export const createOrder = (payload: CreateOrderRequest) => {
    return api.post("/order/create", payload)
}

export const getRestaurantById = (restaurantId: string) => {
    return api.get(`/restaurant/${restaurantId}`)
}

export const getMenuById = (menuId: string) => {
    return api.get(`/menu/${menuId}`)
}