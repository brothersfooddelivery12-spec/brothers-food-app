import { COLORS } from "@/constant/colors"
import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

type GradientButtonProps = {
    title: string,
    onPress: () => void,
    loading?: boolean
}

export default function GradientButton({ title, onPress, loading = false }: GradientButtonProps) {
    return(
        <TouchableOpacity
            activeOpacity={0.95} 
            onPress={onPress}
            disabled={loading}
            className="w-full"
        >
            <View
                style={{
                    marginTop: verticalScale(22),
                    borderRadius: moderateScale(32),

                    shadowColor: COLORS.primaryColor,
                    shadowOffset: { width: 0, height: verticalScale(8) },
                    shadowOpacity: 0.35,
                    shadowRadius: moderateScale(10),
                    elevation: 6
                }}
            >
                <LinearGradient
                    colors={[
                        COLORS.brandGradientStart,
                        COLORS.brandGradientEnd
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        height: verticalScale(48),
                        width: "100%",
                        borderRadius: moderateScale(32),
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {loading ? (
                        <LottieView
                            source={require("../../assets/animations/Loading.json")}
                            autoPlay
                            loop
                            style={{
                                width: moderateScale(62),
                                height: moderateScale(62)
                            }}
                        />
                    ) : (
                        <Text
                            className="tracking-wide font-semibold"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            {title}
                        </Text>
                    )}
                </LinearGradient>
            </View>
        </TouchableOpacity>
    )
}