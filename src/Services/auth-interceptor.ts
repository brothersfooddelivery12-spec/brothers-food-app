import { AxiosError, AxiosHeaders } from "axios"
import { tokenStorage } from "../Stores/token-storage"
import { useSessionStore } from "../Stores/useSessionStore"
import { clearStoredTokens, generateToken } from "./auth-service"
import { api, retryApi } from "./http-client"

let interceptorId: number | null = null
let refreshPromise: Promise<string> | null = null

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

  return (
    headers.Authorization ??
    headers.authorization
  )
}


const setAuthorizationHeader = (request: any, token: string) => {
  if (!(request.headers instanceof AxiosHeaders)) {
    request.headers = new AxiosHeaders(request.headers)
  }

  request.headers.set("Authorization", `Bearer ${token}`)
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

      /*
        * Check whether another
        * request already refreshed
        * the token.
        */
        const currentToken = await tokenStorage.getAccessToken()

        const requestAuth = getAuthorizationHeader(originalRequest.headers)

        const currentAuth = currentToken ? `Bearer ${currentToken}` : undefined

        /*
          * Request used OLD token,
          * but storage already has
          * NEW token.
          *
          * Don't refresh again.
          */
        if (currentToken && requestAuth && requestAuth !== currentAuth) {
          console.log("♻️ [AUTH] Token already refreshed by another request")

          originalRequest._retry = true

          setAuthorizationHeader(originalRequest, currentToken)

            console.log("🔁 [AUTH] Retrying with already refreshed token:", originalRequest.url)

            return retryApi(originalRequest)
          }

          originalRequest._retry = true

          /*
            * No newer token exists.
            * Refresh or join the
            * currently running refresh.
            */
          let newToken: string

          try {
            newToken = await getNewAccessToken()
          } catch (
            refreshError: any
          ) {
            const refreshStatus = refreshError ?.response ?.status

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
            * Put new access token
            * into failed request.
            */
          setAuthorizationHeader(originalRequest, newToken)

          /*
            * Retry original request.
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