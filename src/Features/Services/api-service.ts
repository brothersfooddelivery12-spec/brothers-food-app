import api from "./api-client"

type SendOtpRequest = {
  phone : String;
}

type VerifyOtpRequest = {
  phone: String;
  otp: "123456"
  role: "USER"
}

export const sendOtp = (req  : SendOtpRequest) => {
  return api.post(`auth/send-otp`, req);
}


export const verifyOtp = (req  : VerifyOtpRequest) => {
  return api.post(`auth/verify-otp`, req);
}