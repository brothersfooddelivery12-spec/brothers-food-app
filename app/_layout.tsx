import { Stack } from "expo-router"
import "../global.css"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as SplashScreen from "expo-splash-screen"
import { useEffect, useState } from "react"
import { ToastProvider } from "@/Features/hook/ToastContext"
import CustomSplashScreen from "@/components/splash"
import { GestureHandlerRootView } from "react-native-gesture-handler"

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
            <ToastProvider>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </ToastProvider>
        </SafeAreaProvider>
    </GestureHandlerRootView>
)
}
