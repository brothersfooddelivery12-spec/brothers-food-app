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

export const getCategories = () => {
    return api.get("/categories")
}

export const getAdvertisements = () => {
    return api.get("/admin/advertisement")
}

export const getPopularRestaurants = () => {
    return api.get("/restaurants/popular")
}

export const getPopularMenu = () => {
    return api.get("/menu/popular")
}

export interface NearbyRestaurant {
    id: string
    owner_id: string

    name: string
    description: string

    email: string
    phone: string

    address: string
    area: string
    city: string
    state: string
    pincode: string

    latitude: number
    longitude: number

    opening_time: string
    closing_time: string

    logo_url: string
    cover_image_url: string

    gallery: string[]

    is_open: boolean
    is_active: boolean
    accepts_cod: boolean

    approval_status: "PENDING" | "APPROVED" | "REJECTED"

    rating?: number | null
    distance?: number | null
    discount?: string | null
    price_for_two?: number | null

    created_at: string
    updated_at: string
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