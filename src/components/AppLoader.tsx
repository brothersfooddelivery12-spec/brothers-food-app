import { useLoader } from "@/Features/hook/LoaderProvider"
import LottieView from "lottie-react-native"
import { StyleSheet, View } from "react-native"
import { moderateScale } from "react-native-size-matters"

export default function AppLoader() {
  const { loading } = useLoader()

  if (!loading) return null

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require("../../assets/animations/Food_Loading.json")}
        autoPlay
        loop
        style={{
            width: moderateScale(115),
            height: moderateScale(115)
        }}
    />
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
