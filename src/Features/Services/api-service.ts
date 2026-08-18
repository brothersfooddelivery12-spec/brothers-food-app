import api from "./api-client"

type SendOtpRequest = {
    phone: string
};

type VerifyOtpRequest = {
    phone: string;
    otp: string;
    role: "USER";
}

type GoogleSignInRequest = {
    id_token: string,
    role: "USER"
}

export const sendOtp = (req: SendOtpRequest) => {
    return api.post("/auth/send-otp", req);
}

export const verifyOtp = (req: VerifyOtpRequest) => {
    return api.post("/auth/verify-otp", req);
}

export const googleSignIn = (req: GoogleSignInRequest) => {
    return api.post('auth/google', req)
}