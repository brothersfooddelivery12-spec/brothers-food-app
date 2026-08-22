import { restoreAccessToken } from "@/Features/Services/auth-service"
import { Redirect } from "expo-router"
import { useEffect, useState } from "react"

export default function Index() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await restoreAccessToken()

        setAuthenticated(!!token)
      } catch (error) {
        console.error("Restore auth error:", error)
        setAuthenticated(false)
      }
    }

    restoreAuth()
  }, [])

  if (authenticated === null) {
    return null
  }

  return authenticated ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />
}
