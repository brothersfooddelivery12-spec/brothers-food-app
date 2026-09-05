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