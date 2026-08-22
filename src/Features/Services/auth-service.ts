import { useAuthStore } from "../Stores/auth-store"
import { tokenStorage } from "../Stores/token-storage"
import { api } from "./http-client"

export const generateToken = async (): Promise<string> => {
  const storedRefreshToken = await tokenStorage.getRefreshToken()

  if (!storedRefreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await api.post("/auth/refresh", {
    refresh_token: storedRefreshToken,
  })

  const { access_token, refresh_token} = response.data

  await tokenStorage.setAccessToken(access_token)

  if (refresh_token) {
    await tokenStorage.setRefreshToken(refresh_token)
  }

  useAuthStore.getState().setAuthenticated(true)

  return access_token
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
  await tokenStorage.clearTokens()

  useAuthStore.getState().clearAuth()
}