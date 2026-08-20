import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef, useState } from "react"
import { Animated, ImageBackground, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import LocationIcon from '@/assets/icon/locationIcon.svg'
import { router, useLocalSearchParams } from "expo-router"
import GradientButton from "@/components/GradientButton"
import RefreshIcon from '@/assets/icon/RefreshIcon.svg'
import ArrowLeft from '@/assets/icon/ArrowLeft.svg'
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function VerifyOtpScreen() {
    const logoScale = useRef(new Animated.Value(0.8)).current
    const otpInputRef = useRef<TextInput>(null)
    const insets = useSafeAreaInsets()
    const { mobileNumber } = useLocalSearchParams()

    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState("")
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [resending, setResending] = useState(false)
    const hasError = Boolean(otpError)

    const heroHeight = verticalScale(300)
    const logoSize = moderateScale(120)
    const logoTextSize = moderateScale(16)
    const taglineTextSize = moderateScale(7)
    const iconSize = moderateScale(15)

    const formattedNumber =
    typeof mobileNumber === "string"
        ? mobileNumber.replace(/(\d{5})(\d{5})/, "$1 $2")
        : ""

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    }

    useEffect(() => {
        if(resendTimer <= 0) {
            setCanResend(true)
            return
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => prev -1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendTimer])

    const handleOtpChange = (text: string) => {
        const numbersOnly = text.replace(/\D/g, "").slice(0, 6)

        setOtp(numbersOnly)

        if (otpError) {
            setOtpError("")
        }
    }

    const handleResend = async () => {
        if (!canResend || resending) {
            return
        }

        setResending(true)

        // try {
        //     // Call your resend OTP API here
        //     await resendOtp(mobileNumber);

        //     // Restart the cooldown
        //     setResendTimer(45);
        //     setCanResend(false);

        //     // Optional: clear the existing OTP
        //     setOtp("");
        //     setOtpError("");
        // } catch (error) {
        //     console.error("Resend OTP failed:", error);
        // } finally {
        //     setResending(false);
        // }
    }

    const handleVerify = async () => {
        if (otp.length === 0) {
            setOtpError("Please enter the OTP.")
            return
        }

        if (otp.length < 6) {
            setOtpError("Please enter the complete 6-digit OTP.")
            return
        }

        setOtpError("")

        router.push({
            pathname: '/completeProfile',
            params: { UserMobileNumber: mobileNumber }
        })
    }

    useEffect(() => {
        Animated.sequence([
          Animated.parallel([
            Animated.spring(logoScale, {
              toValue: 1,
              friction: 7,
              tension: 50,
              useNativeDriver: true,
            }),
          ])
        ]).start()
    }, [])

    return(
        <View className="flex-1">
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <View
                className="absolute left-0 right-0 top-0"
                style={{
                    height: heroHeight
                }}
            >
                {/* <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="absolute top-0 left-3 z-30 rounded-full bg-white items-center justify-center"
                    style={{
                        height: scale(42),
                        width: scale(42),
                        marginTop: insets.top + verticalScale(12)
                    }}
                >
                    <ArrowLeft width={scale(22)} height={scale(22)} color={"#1F1F1F"} strokeWidth={2} style={{ marginRight: scale(3) }} />
                </TouchableOpacity> */}

                <ImageBackground
                    source={require("@/assets/images/backgroundImage.png")}
                    resizeMode="cover"
                    className="h-full w-full"
                >

                <View className="absolute inset-0 bg-black/15" />

                <LinearGradient
                    colors={[
                        "transparent",
                        "rgba(255,255,255,0.08)",
                        "rgba(255,255,255,0.25)",
                        "rgba(255,255,255,0.55)",
                        "rgba(255,255,255,0.85)",
                        "#FFFFFF"
                    ]}
                    locations={[0, 0.25, 0.48, 0.68, 0.86, 1]}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "100%"
                    }}
                />
                </ImageBackground>
            </View>

            <SafeAreaView edges={["top","bottom"]} className="flex-1 z-20">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingTop: heroHeight * 0.58,
                        paddingBottom: verticalScale(30)
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View 
                        className="w-full items-center rounded-t-[22px] bg-[#F5F5F5]"
                        style={{ paddingHorizontal: scale(16) }}
                    >
                        <Animated.View
                            className="overflow-hidden rounded-[32px] border-[2px] border-white"
                            style={{
                                width: logoSize,
                                height: logoSize,
                                marginTop: -logoSize * 0.35,
                                transform: [{ scale: logoScale }],
                                shadowColor: "#FFFFFF",
                                shadowOffset: {
                                    width: 0,
                                    height: verticalScale(14)
                                },
                                shadowOpacity: 0.35,
                                shadowRadius: moderateScale(32),
                                elevation: 8
                            }}
                        >
                            <LinearGradient
                                colors={["#3F2516", "#311707"]}
                                locations={[0, 1]}
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text
                                        className="font-bold text-[#CEAB3D] text-[80%]"
                                        style={{
                                            fontSize: logoTextSize,
                                            letterSpacing: scale(0.25)
                                        }}
                                    >
                                        BR
                                    </Text>

                                    <View style={{ marginBottom: verticalScale(2) }}>
                                        <LocationIcon color={"#CEAB3D"} width={iconSize} height={iconSize}/>
                                    </View>

                                    <Text
                                        className="font-bold text-[#CEAB3D]"
                                        style={{
                                            fontSize: logoTextSize,
                                            letterSpacing: scale(0.25)
                                        }}
                                    >
                                        THERS
                                    </Text>
                                </View>

                                <View 
                                    className="flex-row items-center justify-center"
                                    style={{ marginTop: -verticalScale(0.6) }}
                                >
                                    <View className="bg-[#E8B93F]/85 rounded-full"
                                        style={{
                                            width: scale(5.4),
                                            height: verticalScale(1),
                                            marginRight: scale(2.5)
                                        }}
                                    />

                                    <Text
                                        className="font-medium text-center text-[#E8B93F]/85"
                                        style={{
                                            fontSize: taglineTextSize,
                                            letterSpacing: scale(0.25)
                                        }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                        minimumFontScale={0.7}
                                    >
                                        FOOD DELIVERY
                                    </Text>

                                    <View className="bg-[#E8B93F]/85 rounded-full"
                                        style={{
                                            width: scale(5.4),
                                            height: verticalScale(1),
                                            marginLeft: scale(1.25)
                                        }}
                                    />
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        <Text
                            className="font-extrabold text-[#1F1F1F]"
                            style={{ marginTop: verticalScale(14), fontSize: moderateScale(21) }}
                        >
                            Enter Verification Code
                        </Text>

                        <Text
                            className="font-medium text-[#1F1F1F]/60 text-center"
                            style={{ marginTop: verticalScale(3), fontSize: moderateScale(11) }}
                        >
                            Enter the 6-digit code sent to your mobile number
                        </Text>

                        <View
                            className="flex-row items-center justify-center"
                            style={{ marginTop: verticalScale(2) }}
                        >
                            <Text className="font-semibold text-[#1F1F1F]" style={{ fontSize: moderateScale(11) }}>
                                +91 {formattedNumber}
                            </Text>

                            <Pressable
                                style={{ marginLeft: scale(6) }}
                                onPress={() => router.back()}
                            >
                                <Text className="font-semibold text-[#E8B93F]" style={{ fontSize: moderateScale(13) }}>
                                    Change
                                </Text>
                            </Pressable>
                        </View>

                        <View className="relative w-full" style={{ marginTop: verticalScale(28) }}>
                            <TextInput
                                ref={otpInputRef}
                                value={otp}
                                onChangeText={handleOtpChange}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                caretHidden
                                className="absolute inset-0 z-10 opacity-0"
                            />

                            <View className="flex-row justify-center" style={{ gap: scale(4) }}>
                                {Array.from({ length: 6 }).map((_, index) => {
                                    const digit = otp[index]
                                    const isActive = index === Math.min(otp.length, 5)

                                    return (
                                        <View
                                            key={index}
                                            className={`items-center justify-center bg-white ${
                                                hasError
                                                    ? "border border-red-400"
                                                    : isActive
                                                        ? "border border-[#E8B93F]/75"
                                                        : "border border-[#1F1F1F]/10"
                                            }`}
                                            style={{
                                                height: scale(50),
                                                width: scale(50),
                                                borderRadius: moderateScale(18)
                                            }}
                                        >
                                            <Text className="font-semibold text-[#1F1F1F]" style={{ fontSize: moderateScale(18) }}>
                                                {digit || ""}
                                            </Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                        {otpError && (
                            <Text
                                className="self-start font-medium text-[#E05252]"
                                style={{ marginTop: verticalScale(6), marginLeft: scale(8), fontSize: moderateScale(11) }}
                            >
                                {otpError}
                            </Text>
                        )}

                        <View
                            className="flex-row items-center bg-white w-full border border-[#1F1F1F]/5"
                            style={{
                                padding: scale(12),
                                marginTop: verticalScale(24),
                                gap: scale(10),
                                borderRadius: moderateScale(18)
                            }}
                        >
                            <View
                                className="items-center justify-center rounded-full bg-[#3f25161d]"
                                style={{ width: scale(40), height: scale(40) }}
                            >
                                <RefreshIcon width={moderateScale(20)} height={moderateScale(20)} color={"#3F2516"} strokeWidth={2.2} />
                            </View>

                            <View className="flex-1 justify-center">
                                <Text className="font-semibold text-[#1F1F1F]" style={{ fontSize: moderateScale(12.5) }}>
                                    Didn't receive the code?
                                </Text>

                                <Text
                                    className="font-semibold text-[#1F1F1F]/60"
                                    style={{
                                        marginTop: verticalScale(4),
                                        fontSize: moderateScale(11)
                                    }}
                                >
                                    {canResend ? (
                                        "You can request a new code now"
                                    ) : (
                                        <>
                                            You can request a new code in{" "}
                                            <Text
                                                className="font-semibold text-[#1F1F1F]"
                                                style={{ fontSize: moderateScale(11) }}
                                            >
                                                {formatTimer(resendTimer)}
                                            </Text>
                                        </>
                                    )}
                                </Text>
                            </View>

                            <Pressable
                                onPress={handleResend}
                                disabled={!canResend || resending}
                                hitSlop={8}
                            >
                                <Text
                                    className={`font-semibold ${
                                        canResend
                                            ? "text-[#E8B93F]"
                                            : "text-[#1F1F1F]/30"
                                    }`}
                                    style={{
                                        fontSize: moderateScale(13),
                                        marginRight: scale(3)
                                    }}
                                >
                                    {"Resend"}
                                </Text>
                            </Pressable>
                        </View>

                        <GradientButton title="Verify & Continue" onPress={handleVerify} loading={loading} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )                
}