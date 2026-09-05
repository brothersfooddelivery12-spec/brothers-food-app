import { AxiosHeaders } from "axios"
import { clearStoredToken, refreshToken } from "./auth-service"
import { api, retryApi } from "./http-client"

let interceptorId: number | null = null

export const registerAuthInterceptor = (): void => {
  if (interceptorId !== null) {
    return
  }

  interceptorId = api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config as any

      const status = error.response?.status

      console.log("AUTH INTERCEPTOR:", {
        url: originalRequest?.url,
        status,
        data: error.response?.data
      }
    )

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newToken = await refreshToken()

        if (!(originalRequest.headers instanceof AxiosHeaders)) {
          originalRequest.headers = new AxiosHeaders(originalRequest.headers)
        }

        originalRequest.headers.set("Authorization", `Bearer ${newToken}`)

        return retryApi(
          originalRequest
        )
      } catch (
        refreshError
      ) {
        console.log("REFRESH FAILED:", refreshError)

        await clearStoredToken()

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
    }
  )
}