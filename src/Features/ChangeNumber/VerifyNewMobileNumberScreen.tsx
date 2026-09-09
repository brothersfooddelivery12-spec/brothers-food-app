import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import RefreshIcon from '@/assets/icon/RefreshIcon.svg'
import GradientButton from '@/components/GradientButton'
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { sendOtp, verifyOtp } from '../Services/api-service'
import { hideLoader, showLoader } from '../Services/loader-service'
import { useToast } from '../hook/ToastContext'

export default function VerifyNewMobileNumberScreen(){
    const {showToast} = useToast()
    const { mobileNumber, purpose } = useLocalSearchParams<{mobileNumber: string, purpose: "LOGIN" | "VERIFY"}>()
    const otpInputRef = useRef<TextInput>(null)

    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState("")
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [resending, setResending] = useState(false)
    const hasError = Boolean(otpError)

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
        showLoader()

        try {
            const res = await sendOtp({
                phone: mobileNumber,
                purpose: purpose
            })

            console.log("Resend OTP Response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Failed to resend OTP.", "warning")

                return
            }

            setOtp("")
            setOtpError("")

            setResendTimer(60)
            setCanResend(false)

            showToast(res.data.message || "OTP sent successfully.", "success")
        } catch (error) {
            console.error("Resend OTP failed:", error)

            showToast("Unable to resend OTP. Please try again.", "warning")
        } finally {
            setResending(false)
            hideLoader()
        }
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

        if (loading) return

        setOtpError("")
        setLoading(true)

        try {
            const res = await verifyOtp({
                phone: mobileNumber,
                otp,
                role: "USER",
                purpose
            })
            
            console.log("Verify OTP response:", res.data)

            if (res.data.success) {
                showToast("Verification Successfully", "success")

                router.replace('/mobile-number-updated')

                return
            }

            setOtpError(res.data.message || "Invalid OTP. Please try again.")
        } catch (error: any) {
            console.error("Verify OTP error:", error?.message || error)

            setOtpError(error?.message || "Invalid OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(12),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>
            
                {/* <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Edit Profile
                    </Text>
                                
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Manage your personal information
                    </Text>
                </View> */}
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(30)
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    className='text-[#1F1F1F] font-extrabold text-center'
                    style={{
                        fontSize: moderateScale(18),
                        marginTop: verticalScale(12)
                    }}
                >
                    Enter Verification Code
                </Text>

                <Text
                    className='text-[#1F1F1F]/65 font-medium text-center'
                    style={{
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(5)
                    }}
                >
                    We've sent a 6-digit code to{"\n"}+91 {formattedNumber}
                </Text>

                <View className="relative w-full" style={{ marginTop: verticalScale(28) }}>
                    <TextInput
                        ref={otpInputRef}
                        value={otp}
                        onChangeText={handleOtpChange}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                        caretHidden
                        pointerEvents={loading ? "none" : "auto"}
                        className="absolute inset-0 z-10 opacity-0"
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
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
                        marginTop: verticalScale(28),
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

                <GradientButton title="Verify Code" onPress={handleVerify} loading={loading} />
            </ScrollView>
        </SafeAreaView>
    )
}