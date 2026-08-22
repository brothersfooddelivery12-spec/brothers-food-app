import { AxiosHeaders } from "axios"
import { registerAuthInterceptor } from "./auth-interceptor"
import { getStoredToken } from "./auth-service"
import { api } from "./http-client"

registerAuthInterceptor()

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  async (config) => {

    // SHow loader

    const token = await getStoredToken()

    if (token) {
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers)
      }

      config.headers.set("Authorization", `Bearer ${token}`)
    }

    return config
  },
  (error) => {
    // hideLoader

    let message = "Something went wrong"

    if (error.response) {
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Server error"
    } else if (error.request) {
      message = "Network error. Please check your connection."
    } else {
      // Other errors
      message = error.message
    }

    return Promise.reject(new Error(message))
  },
)

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => {
    // hideLoader
    return response
  },
  async (error) => {
    // hideLoader

    const response = error.response

    let message = "Something went wrong"

    if (response?.status === 429) {
        const message = response.data?.message || "Too many requests. Please try again later."

        return Promise.reject(new Error(message))
    }

    if (response) {
      message = response.data?.message || response.data?.error || "Server error";
    } else if (error.request) {
      message = "Network error. Please check your connection."
    } else if (error.message) {
      message = error.message
    }
    
    return Promise.reject(new Error(message))
  },
)

export default api
