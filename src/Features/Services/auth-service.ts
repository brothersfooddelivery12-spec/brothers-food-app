import AsyncStorage from "@react-native-async-storage/async-storage"
// import { platform } from "../constant/platform"
import { useAuthStore } from "../Stores/auth-store"
import { tokenStorage } from "../Stores/token-storage"
import { api } from "./http-client"

export const generateToken = async (userId: string): Promise<string> => {
  const secretKey = await AsyncStorage.getItem("secretKey")

  const response = await api.get("/auth/token", {
    params: {
      userId,
      platForm: "Application",
      secretKey: secretKey,
    },
  })

  const token = response.data

  await tokenStorage.setAccessToken(token)

  useAuthStore.getState().setAccessToken(token)

  return token
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

  return generateToken(userId)
}

export const clearStoredToken = async (): Promise<void> => {
  await tokenStorage.clearTokens()

  useAuthStore.getState().setAccessToken(null)
}