import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import IndiaFlag from '@/assets/icon/India.svg'
import GradientButton from '@/components/GradientButton'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from "expo-router"
import { useState } from 'react'
import { Keyboard, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { sendOtp } from '../../Services/api-service'
import { useToast } from '../hook/ToastContext'

export default function EnterMobileNumberScreen(){
    const [mobileNumber, setMobileNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [mobileNumberError, setMobileNumberError] = useState(false)
    const {showToast} = useToast()

    const {mode, currentPhone} = useLocalSearchParams<{mode?: "add" | "change", currentPhone?: string}>()
    const isChangeMode = mode === "change"

    const screenTitle = isChangeMode
        ? "Enter New Mobile Number"
        : "Enter Mobile Number"

    const screenDescription = isChangeMode
        ? "We'll send a 6-digit verification code to\nyour new mobile number."
        : "We'll send a 6-digit verification code to\nverify your mobile number."

    const bottomDescription = isChangeMode
        ? "You'll receive an SMS with a 6-digit code\non your new number."
        : "You'll receive an SMS with a 6-digit code\non this number."

    const formatMobileNumber = (text: string) => {
        let numbersOnly = text.replace(/\D/g, "")

        if (numbersOnly.startsWith("91") && numbersOnly.length > 10) {
            numbersOnly = numbersOnly.slice(2)
        }

        numbersOnly = numbersOnly.slice(0, 10)

        setMobileNumber(numbersOnly)
    }

    const handleSentVerificationCode = async () => {
        if (mobileNumber.length !== 10) {
            setMobileNumberError(true)
            return
        }

        if (
            isChangeMode &&
            currentPhone &&
            mobileNumber === currentPhone
        ) {
            showToast("Please enter a different mobile number", "info")

            return
        }

        if (loading) return

        setMobileNumberError(false)
        setLoading(true)

        try {
            console.log("Sending OTP to:", mobileNumber)

            const res = await sendOtp({
                phone: mobileNumber,
                purpose: "VERIFY"
            })

            console.log("Send OTP response:", res.data)

            if (res.data.success) {
                showToast(res.data.message, "success")

                router.push({
                    pathname: "/verify-new-mobile",
                    params: {
                        mobileNumber,
                        purpose: "VERIFY",
                        mode: mode
                    }
                })

                return
            }

            showToast(res.data.message || "Unable to send OTP", "warning")
        } catch (error: any) {
            console.error("Send OTP error:", error?.response?.data || error)

            showToast(error?.response?.data?.message || "Unable to send OTP","warning")
        } finally {
            setLoading(false)
        }
    }

    return(
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}
        >
            <StatusBar
                translucent
                backgroundColor={COLORS.primaryBackgroundColor}
                barStyle="dark-content"
            />

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(8),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
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
                    className='font-extrabold text-center'
                    style={{
                        color: COLORS.primaryTextColor,
                        fontSize: moderateScale(18),
                        marginTop: verticalScale(12)
                    }}
                >
                    {screenTitle}
                </Text>

                <Text
                    className='font-medium text-center'
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(5)
                    }}
                >
                    {screenDescription}
                </Text>

                <Text
                    className="font-medium self-start"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.85),
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(25),
                        marginLeft: scale(6)
                    }}
                >
                    Mobile Number
                </Text>

                <View className="w-full flex-row overflow-hidden"
                    style={{
                        marginTop: verticalScale(6),
                        height: verticalScale(48),
                        borderRadius: moderateScale(18),
                        borderWidth: moderateScale(0.7),
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: mobileNumberError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1)
                    }}
                >
                    <View className="flex-row items-center justify-center relative" style={{ width: "22%" }}>
                        <IndiaFlag width={scale(20)} height={verticalScale(22)} style={{ marginRight: scale(6) }} />

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(14),
                                color: COLORS.inputTextColor    
                            }}
                        >
                            +91
                        </Text>

                        <View
                            className="absolute right-0 top-0 bottom-0"
                            style={{
                                width: scale(0.7),
                                backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                            }}
                        />
                    </View>

                    <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                        <TextInput
                            className="p-0 tracking-wide font-medium"
                            style={{
                                height: verticalScale(40),
                                fontSize: moderateScale(13),
                                textAlignVertical: "center",
                                includeFontPadding: false,
                                color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor
                            }}
                            value={
                                mobileNumber
                                    .replace(/(\d{5})(\d{0,5})/,"$1 $2")
                                    .trim()
                            }
                            onChangeText={(text) => {
                                formatMobileNumber(text)
                                setMobileNumberError(false)
                            }}
                            placeholder="Enter 10-digit mobile number"
                            placeholderTextColor={ COLORS.placeholderTextColor }
                            keyboardType="phone-pad"
                            returnKeyType="done"
                            autoCorrect={false}
                            autoCapitalize="none"
                            textContentType="telephoneNumber"
                            autoComplete="tel"
                            maxLength={16}
                            selectionColor={ COLORS.selectionColor }
                            editable={!loading}
                            onSubmitEditing={() => {
                                Keyboard.dismiss()
                            }}
                        />
                    </View>
                </View>

                {mobileNumberError && (
                    <Text
                        className="self-start font-medium"
                        style={{
                            marginTop: verticalScale(4),
                            marginLeft: scale(8),
                            fontSize: moderateScale(11),
                            color: COLORS.errorTextColor
                        }}
                    >
                        Please enter a valid 10-digit mobile number
                    </Text>
                )}

                <GradientButton title='Send Verification Code' onPress={handleSentVerificationCode} loading={loading} />

                <View className='w-full items-center justify-center mt-6'>
                    <Image
                        source={require("@/assets/images/VerificationCodeSent.png")}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        style={{
                            width: moderateScale(245),
                            height: moderateScale(245)
                        }}
                    />
                </View>

                <Text
                    className='font-medium text-center'
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16)
                    }}
                >
                   {bottomDescription}
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}