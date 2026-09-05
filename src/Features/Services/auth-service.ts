import { useAuthStore } from "../Stores/auth-store"
import { tokenStorage } from "../Stores/token-storage"
import { retryApi } from "./http-client"

export const generateToken = async (): Promise<string> => {
  const storedRefreshToken = await tokenStorage.getRefreshToken()

  if (!storedRefreshToken) {
    throw new Error("No refresh token available")
  }

  console.log("Refreshing token...", !!storedRefreshToken)

  const response = await retryApi.post("/auth/refresh", {refresh_token: storedRefreshToken})

  console.log("Refresh response:", response.data)

  // Supports either:
  // { access_token, refresh_token }
  // or
  // { success, data: { access_token, refresh_token } }
  const tokenData = response.data?.data ?? response.data

  const accessToken = tokenData?.access_token

  const newRefreshToken = tokenData?.refresh_token

  if (!accessToken) {
    throw new Error("No access token returned from refresh")
  }

  await tokenStorage.setAccessToken(
    accessToken
  )

  if (newRefreshToken) {
    await tokenStorage.setRefreshToken(newRefreshToken)
  }

  useAuthStore.getState().setAuthenticated(true)

  return accessToken
}

export const getStoredToken = async (): Promise<string | null> => {
  return await tokenStorage.getAccessToken()
}

export const restoreAccessToken = async (): Promise<string | null> => {
  const token = await tokenStorage.getAccessToken()

  if (token) {
    useAuthStore.getState().setAuthenticated(true)
  }

  return token
}

export const refreshToken = async (): Promise<string> => {
  return generateToken()
}

export const clearStoredToken = async (): Promise<void> => {
  console.log("🚨 CLEARING ACCESS AND REFRESH TOKENS")

  await tokenStorage.clearTokens()

  useAuthStore.getState().clearAuth()
}