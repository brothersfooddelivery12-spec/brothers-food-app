import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useLoader } from "@/Features/hook/LoaderProvider"

export default function AppLoader() {
  const { loading } = useLoader()

  if (!loading) return null

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  }
})
