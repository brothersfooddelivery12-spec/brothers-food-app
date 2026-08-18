import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuthStore } from "../Stores/auth-store"
import { tokenStorage } from "../Stores/token-storage"
import { api } from "./http-client"

export const generateToken = async (): Promise<string> => {
  const refreshToken = await tokenStorage.getRefreshToken()

  const response = await api.post("/auth/refresh", {
    refresh_token: refreshToken
  }) as any

  const access_token = response.access_token

  const refresh_token = response.refresh_token

  await tokenStorage.setAccessToken(access_token)
  await tokenStorage.setRefreshToken(refresh_token)

  useAuthStore.getState().setAccessToken(access_token)
  useAuthStore.getState().setRefreshToken(refresh_token)

  return access_token
}

export const getStoredToken = (): string | null => {
  return useAuthStore.getState().accessToken
}

export const restoreAccessToken = async (): Promise<string | null> => {
  const token = await tokenStorage.getAccessToken()

  if (token) {
    useAuthStore.getState().setAccessToken(token)
  }

  return token
}

export const refreshToken = async (): Promise<string> => {
  const userId = await AsyncStorage.getItem("userId")

  if (!userId) {
    throw new Error("No userId available for token refresh")
  }

  return generateToken()
}

export const clearStoredToken = async (): Promise<void> => {
  await tokenStorage.clearTokens()

  useAuthStore.getState().setAccessToken(null)
}