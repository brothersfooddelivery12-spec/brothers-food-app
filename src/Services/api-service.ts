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

export interface PopularMenuRestaurant {
    id: string
    name: string
    logo_url: string | null
    is_open: boolean
}

export interface PopularMenu {
    id: string

    restaurant: PopularMenuRestaurant

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

export const createCheckoutOrder = (payload: CreateOrderRequest) => {
    return api.post("/order/create", payload)
}

export type VerifyPaymentRequest = {
    order_id: string
}

export const verifyCashfreePayment = (payload: VerifyPaymentRequest) => {
    return api.post("/payments/verify", payload)
}

export interface RestaurantDetails {
    id: string
    owner_id: string

    name: string
    description: string

    phone: string
    email: string

    address: string
    area: string
    city: string
    state: string
    pincode: string

    latitude: number
    longitude: number

    logo_url: string | null
    cover_image_url: string | null
    gallery: string[]

    opening_time: string
    closing_time: string

    average_preparation_time: number

    is_open: boolean
    is_active: boolean
    accepts_cod: boolean

    approval_status:
        | "APPROVED"
        | "PENDING"
        | "REJECTED"

    created_at: string
    updated_at: string

    // Add these later if API starts returning them
    rating?: number | string | null
    review_count?: number | null
    distance?: number | null
    price_for_two?: number | null
}

export const getRestaurantById = (restaurantId: string) => {
    return api.get(`/restaurants/${restaurantId}`)
}

export interface MenuDetails {
    id: string
    category_id: string
    restaurant_id: string

    name: string
    description: string
    rating: string
    review_count: string
    calories: string

    image_url: string | null

    price: number

    is_available: boolean
    is_vegetarian: boolean

    preparation_time: number
    display_order: number

    created_at: string
    updated_at: string
}

export const getMenuById = (menuId: string) => {
    return api.get(`/menu/${menuId}`)
}

export type CartPreviewItem = {
    menu_id: string
    name: string
    unit_price: string
    quantity: number
    total: string
    is_available: boolean
}

export type CartPreviewAddress = {
    id: string
    user_id: string

    label: string

    receiver_name: string
    receiver_phone: string

    address_line: string
    landmark: string
    area: string

    city: string
    state: string
    pincode: string

    latitude: number
    longitude: number

    is_default: boolean

    created_at: string
    updated_at: string
}

export type CartPreview = {
    restaurant_id: string
    restaurant_name: string
    restaurant_is_open: boolean

    distance: string

    address: CartPreviewAddress | null

    items: CartPreviewItem[]

    subtotal: string
    delivery_fee: string
    taxes: string
    discount: string
    final_total: string
}

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