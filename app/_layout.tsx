import { LoaderProvider } from "@/Features/hook/LoaderProvider"
import { ToastProvider } from "@/Features/hook/ToastContext"
import AppLoader from "@/components/AppLoader"
import CustomSplashScreen from "@/components/splash"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"
import "../global.css"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [showCustomSplash, setShowCustomSplash] = useState(true)

  useEffect(() => {
    const init = async () => {
      await SplashScreen.hideAsync()

      setTimeout(() => {
        setShowCustomSplash(false)
      }, 2000)
    };

    init()
  }, [])

  if (showCustomSplash) {
    return <CustomSplashScreen />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
            <KeyboardProvider>
                <LoaderProvider>
                    <ToastProvider>
                        <AppLoader />

                        <Stack
                            screenOptions={{ headerShown: false }}
                        />
                    </ToastProvider>
                </LoaderProvider>
            </KeyboardProvider>
        </SafeAreaProvider>
    </GestureHandlerRootView>
)
}
