import { AxiosError, AxiosHeaders } from "axios"
import { tokenStorage } from "../Stores/token-storage"
import { useSessionStore } from "../Stores/useSessionStore"
import { clearStoredTokens, generateToken } from "./auth-service"
import { api, retryApi } from "./http-client"

let interceptorId: number | null = null
let refreshPromise: Promise<string> | null = null

const isRefreshTokenExpired = (error: any): boolean => {
  const status = error?.response?.status
  const message = error?.response?.data?.message
    ?.trim()?.toLowerCase() ?? ""

  if (status === 401 || status === 403) {
    return true
  }

  const expiredMessages = [
    "refresh token has been revoked",
    "refresh token has expired",
    "refresh token expired",
    "invalid refresh token",
    "refresh token is invalid"
  ]

  return expiredMessages.some(item => message.includes(item))
}

const handleSessionExpired = async (): Promise<void> => {
  const session = useSessionStore.getState()
  
  if (session.sessionExpired) {
    return
  }

  console.log("⛔ [AUTH] Session expired")

  session.showSessionExpired()

  await clearStoredTokens()

  console.log("🗑️ [AUTH] Invalid tokens cleared")
}

const getNewAccessToken = (): Promise<string> => {
  if (refreshPromise) {
    console.log("⏳ [AUTH] Joining existing refresh")

    return refreshPromise
  }

  console.log("🚀 [AUTH] Starting ONE token refresh")

  refreshPromise = generateToken()
    .then((token) => {
      console.log("✅ [AUTH] Shared refresh succeeded")

      return token
    })
    .catch(async (refreshError: any) => {
      const status = refreshError?.response?.status

      const data = refreshError?.response?.data

      console.log("❌ [AUTH] TOKEN REFRESH FAILED",
        {
          status,
          data,
          message: refreshError?.message
        }
      )

      if (isRefreshTokenExpired(refreshError)) {
        await handleSessionExpired()
      }

      throw refreshError
    })
    .finally(() => {
      console.log("🏁 [AUTH] Refresh finished")

      refreshPromise = null
    })

  return refreshPromise
}

const getAuthorizationHeader = (headers: any): string | undefined => {
  if (!headers) {
    return undefined
  }

  if (headers instanceof AxiosHeaders) {
    return (headers.get("Authorization")?.toString() ?? undefined)
  }

  return (headers.Authorization ?? headers.authorization)
}

const setAuthorizationHeader = (request: any, token: string): void => {
  if (!(request.headers instanceof AxiosHeaders)) {
    request.headers = new AxiosHeaders(request.headers)
  }

  request.headers.set("Authorization", `Bearer ${token}`)
}

export const registerAuthInterceptor = (): void => {
  if (
    interceptorId !== null
  ) {
    console.log("ℹ️ [AUTH] Interceptor already registered")

    return
  }

  console.log("✅ [AUTH] Registering auth interceptor")

  interceptorId = api.interceptors.response.use(
    response => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as any

      const status = error.response?.status

      console.log("🔴 [AUTH] API ERROR",
        {
          method: originalRequest?.method,
          url: originalRequest?.url,
          status,
          retry: originalRequest?._retry,
          data: error.response?.data
        }
      )

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        console.log("⚠️ [AUTH] Request already retried:", originalRequest.url)

        return Promise.reject(error)
      }

      const currentToken = await tokenStorage.getAccessToken()

      const requestAuth = getAuthorizationHeader(originalRequest.headers)

      const currentAuth = currentToken? `Bearer ${currentToken}` : undefined

      if (currentToken && requestAuth && requestAuth !== currentAuth) {
        console.log("♻️ [AUTH] Token already refreshed by another request")

        originalRequest._retry = true

        setAuthorizationHeader(originalRequest, currentToken)

        try {
          console.log("🔁 [AUTH] Retrying with already refreshed token:", originalRequest.url)

          const response = await retryApi(originalRequest)

          console.log("✅ [AUTH] Retry succeeded:", originalRequest.url)

          return response
        } catch (
          retryError: any
        ) {
          console.log("❌ [AUTH] RETRY WITH STORED TOKEN FAILED",
            {
              url: originalRequest.url,
              status: retryError?.response?.status,
              data: retryError?.response?.data
            }
          )

          return Promise.reject(retryError)
        }
      }

      originalRequest._retry = true

      let newToken: string

      try {
        newToken = await getNewAccessToken()
      } catch (
        refreshError
      ) {
        return Promise.reject(refreshError)
      }

      setAuthorizationHeader(originalRequest, newToken)

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
            data: retryError?.response?.data, 
            message: retryError?.message
          }
        )

        return Promise.reject(retryError)
      }
    }
  )
}