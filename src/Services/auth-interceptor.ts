import { AxiosError, AxiosHeaders } from "axios"
import { useSessionStore } from "../Stores/useSessionStore"
import { clearStoredTokens, generateToken } from "./auth-service"
import { api, retryApi } from "./http-client"

let interceptorId: number | null = null
let refreshPromise: Promise<string> | null = null

const getNewAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
      refreshPromise = generateToken().finally(
        () => { refreshPromise = null }
      )
  }

  return refreshPromise
}

export const registerAuthInterceptor = (): void => {
  if (interceptorId !== null) {
    return
  }

  interceptorId = api.interceptors.response.use(
    response => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as any

      const status = error.response?.status

      console.log("🔴 [AUTH] API ERROR",
        {
          url: originalRequest?.url,
          status,
          retry: originalRequest?._retry,
          data: error.response?.data
        }
      )

      if (status !== 401 || !originalRequest || originalRequest._retry) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      let newToken: string

      /*
      * STEP 1
      * Refresh access token
      */
      try {
        console.log("🔄 [AUTH] Refreshing token...")

        newToken = await getNewAccessToken()

        console.log("✅ [AUTH] Token refreshed")
      } catch (
        refreshError: any
      ) {
        const refreshStatus = refreshError?.response?.status

        console.log("❌ [AUTH] TOKEN REFRESH FAILED",
          {
            status: refreshStatus,
            data: refreshError?.response?.data,
            message: refreshError?.message
          }
        )

        if (refreshStatus === 401 || refreshStatus === 403) {
          console.log("⛔ [AUTH] Session expired")

          await clearStoredTokens()

          const session = useSessionStore.getState()

          if (!session.sessionExpired) {
            session.showSessionExpired()
          }
        }

        return Promise.reject(refreshError)
      }

      /*
      * STEP 2
      * Put new token on request
      */
      if (!(originalRequest.headers instanceof AxiosHeaders)) {
        originalRequest.headers = new AxiosHeaders(originalRequest.headers)
      }

      originalRequest.headers.set("Authorization", `Bearer ${newToken}`)

      /*
      * STEP 3
      * Retry original API
      */

      try {
        console.log("🔁 [AUTH] Retrying:", originalRequest.url)

        const response = await retryApi(originalRequest)

        console.log("✅ [AUTH] Retry succeeded:", originalRequest.url)

        return response
      } catch (
        retryError: any
      ) {
        console.log("❌ [AUTH] RETRIED API FAILED",
          {
            url: originalRequest.url,
            status: retryError?.response?.status,
            data: retryError?.response?.data
          }
        )

        return Promise.reject(retryError)
      }
    }
  )
}