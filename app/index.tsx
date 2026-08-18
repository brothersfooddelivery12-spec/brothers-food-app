import { Redirect } from "expo-router"
import { useState } from "react"

export default function Index() {
  const [authenticated, setAuthenticated] = useState(true)

  return authenticated ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />
}
