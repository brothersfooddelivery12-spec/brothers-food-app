import { useAuthStore } from "@/Features/Stores/auth-store"
import { useSessionStore } from "@/Features/Stores/useSessionStore"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useCallback } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function SessionExpiredModal() {
    const router = useRouter()

    const sessionExpired = useSessionStore((state) => state.sessionExpired)
    const hideSessionExpired = useSessionStore((state) => state.hideSessionExpired)

    const handleLoginAgain = useCallback(() => {
        useAuthStore.getState().clearAuth()
 
        hideSessionExpired()

        router.replace("/login")
    }, [
        hideSessionExpired,
        router
    ])

    return (
        <Modal
            visible={sessionExpired}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => {}}
        >
            <View
                className="flex-1 items-center justify-center bg-black/50"
                style={{ paddingHorizontal: scale(22) }}
            >
                <View
                    className="w-full bg-white"
                    style={{
                        maxWidth: moderateScale(380),
                        borderRadius: moderateScale(24),
                        paddingTop: verticalScale(5),
                        paddingHorizontal: scale(20),
                        paddingBottom: verticalScale(20)
                    }}
                >
                    <View className="items-center justify-center w-full">
                        <Image
                            source={require("@/assets/images/SessionExpiredIllustration.png")}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                            style={{
                                width: moderateScale(115),
                                height: moderateScale(115)
                            }}
                        />
                    </View>

                    <Text
                        className="text-[#1F1F1F] font-bold text-center"
                        style={{ fontSize: moderateScale(18) }}
                    >
                        Session Expired
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium text-center"
                        style={{
                            marginTop: verticalScale(5),
                            fontSize: moderateScale(12.5),
                            lineHeight: moderateScale(16)
                        }}
                    >
                        Your session has expired. Please log in again to continue and enjoy uninterrupted service.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleLoginAgain}
                        className="bg-[#3F2516] items-center justify-center"
                        style={{
                            height: verticalScale(48),
                            borderRadius: moderateScale(18),
                            marginTop: verticalScale(15)
                        }}
                    >
                        <Text
                            className="text-white font-bold"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Log In Again
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}