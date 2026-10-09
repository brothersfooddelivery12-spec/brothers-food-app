import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import SecurityIcon from '@/assets/icon/SecurityIcon.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import UtenisilIcon from '@/assets/icon/UtensilIcon2.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { useLocalSearchParams, useRouter } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useState } from "react"
import { StatusBar, Text, TextInput, useWindowDimensions, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { scheduleOnRN } from "react-native-worklets"
import { editUserProfile } from '../../Services/api-service'
import { hideLoader, showLoader } from '../../Services/loader-service'
import { useAuthStore } from '../../Stores/auth-store'
import { useToast } from '../hook/ToastContext'

export default function VerificationSuccessScreen() {
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const {showToast} = useToast()
    const [fullName, setFullName] = useState("")
    const [nameError, setNameError] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const router = useRouter()
    const { isExist, userMobileNumber } = useLocalSearchParams<{
        isExist?: string
        userMobileNumber?: string
    }>()

    const userExists = isExist === "true"

    const resetSwipe = useCallback(() => {
        translateX.value = withSpring(0)
    }, [])

    const handleStartOrdering = useCallback(async () => {
        if (isUpdating) return

        if (userExists) {
            router.dismissAll()
            router.replace(
                "/(tabs)/home"
            )

            return
        }

        const trimmedName = fullName.trim()

        if (!trimmedName) {
            setNameError(true)
            resetSwipe()

            return
        }

        setNameError(false)
        setIsUpdating(true)

        showLoader()

        try {
            const res = await editUserProfile(
                {
                    name: trimmedName
                }
            )

            console.log("Edit profile response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Failed to update profile", "warning")

                resetSwipe()

                return
            }

            useAuthStore
                .getState()
                .updateUser({name: res.data.data ?.name ?? trimmedName})

            showToast("Profile updated successfully", "success")

            router.dismissAll()

            router.replace(
                "/(tabs)/home"
            )
        } catch (error: any) {
            console.log("Update profile error:", error)

            showToast(error?.message || "Unable to update profile", "warning")

            resetSwipe()
        } finally {
            hideLoader()
            setIsUpdating(false)
        }
    }, [userExists, fullName, isUpdating, resetSwipe, router, showToast])

    const THUMB_SIZE = moderateScale(40)
    const HORIZONTAL_PADDING = scale(8)

    const buttonWidth = useSharedValue(0)
    const translateX = useSharedValue(0)

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            const maxTranslateX =
                buttonWidth.value -
                THUMB_SIZE -
                HORIZONTAL_PADDING * 2

            translateX.value = Math.max(
                0,
                Math.min(event.translationX, maxTranslateX)
            )
        })
        .onEnd(() => {
            const maxTranslateX =
                buttonWidth.value -
                THUMB_SIZE -
                HORIZONTAL_PADDING * 2

            const threshold = maxTranslateX * 0.8

            if (translateX.value >= threshold) {
                translateX.value = withSpring(
                    maxTranslateX,
                    {},
                    (finished) => {
                        if (finished) {
                            scheduleOnRN(handleStartOrdering)
                        }
                    }
                )
            } else {
                translateX.value = withSpring(0)
            }
        })

    const animatedThumbStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value
            }
        ]
    }))

    return(
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}
        >
            <StatusBar
                translucent
                backgroundColor={ COLORS.primaryBackgroundColor }
                barStyle="dark-content"
            />

            <KeyboardAwareScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: verticalScale(25),
                    paddingHorizontal: scale(14)
                }}
                bottomOffset={30}
                extraKeyboardSpace={20}
            >
                <View className="items-center justify-center -mt-2">
                    <LottieView
                        source={require("@/assets/animations/Success_ Animation.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(242),
                            height: moderateScale(242)
                        }}
                    />
                </View>

                <Text
                    className="font-extrabold text-center -mt-4"
                    style={{
                        fontSize: moderateScale(20),
                        color: COLORS.primaryTextColor
                    }}
                >
                    {userExists ? "Welcome back!" : "Welcome to Brothers!"}
                </Text>

                <Text
                    className="font-medium leading-5 text-center mx-4"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(10)
                    }}
                >
                    {userExists ? "Your mobile number has been verified successfully. You're all set to continue ordering your favorite food, discover new dishes, and enjoy fast delivery."
                     : "Your mobile number has been verified successfully. You're just one tap away from discovering delicious food delivered fast."}
                </Text>

                <View
                    className="flex-row gap-3 p-3"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        borderRadius: moderateScale(20),
                        marginTop: verticalScale(22)
                    }}
                >
                    <View
                        className="items-center justify-center bg-[#FFDBC9]/75"
                        style={{
                            width: moderateScale(48),
                            height: moderateScale(48),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} />
                    </View>

                    <View className="items-start gap-1 justify-center">
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(14),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Lightning Fast Delivery
                        </Text>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                color: hexToRgba(COLORS.primaryTextColor, 0.75)
                            }}
                        >
                            Fresh food delivered in minutes.
                        </Text>
                    </View>
                </View>

                <View
                    className="flex-row gap-3 p-3"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        borderRadius: moderateScale(20),
                        marginTop: verticalScale(8)
                    }}
                >
                    <View
                        className="items-center justify-center bg-[#FFE08E]/75"
                        style={{
                            width: moderateScale(48),
                            height: moderateScale(48),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <UtenisilIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.secondaryColor} />
                    </View>

                    <View className="items-start gap-1 justify-center">
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(14),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            500+ Restaurants
                        </Text>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                color: hexToRgba(COLORS.primaryTextColor, 0.75)
                            }}
                        >
                            Discover local favorites and brands.
                        </Text>
                    </View>
                </View>

                <View
                    className="flex-row gap-3 p-3"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        borderRadius: moderateScale(20),
                        marginTop: verticalScale(8)
                    }}
                >
                    <View
                        className="items-center justify-center bg-[#ECE1D5]/75"
                        style={{
                            width: moderateScale(48),
                            height: moderateScale(48),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <SecurityIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} />
                    </View>

                    <View className="items-start gap-1 justify-center">
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(14),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Safe & Secure
                        </Text>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                color: hexToRgba(COLORS.primaryTextColor, 0.75)
                            }}
                        >
                            Protected login and secure payments.
                        </Text>
                    </View>
                </View>

                {!userExists && (
                    <>
                        <View
                            className="self-start"
                            style={{
                                marginTop: verticalScale(18),
                                marginLeft: scale(6)
                            }}
                        >
                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(13),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                What should we call you?
                            </Text>

                            <Text
                                className="font-medium"
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                    fontSize: moderateScale(11),
                                    marginTop: verticalScale(3)
                                }}
                            >
                                Enter your name to personalize your experience.
                            </Text>
                        </View>
        
                        <View
                            className="flex-row items-center overflow-hidden"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: nameError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.7),
                                marginTop: verticalScale(6),
                                paddingRight: scale(10),
                                paddingLeft: scale(9),
                                height: verticalScale(48),
                                borderRadius: moderateScale(18)
                            }}
                        >
                            <View
                                className="items-center justify-center"
                                style={{
                                    width: moderateScale(36),
                                    height: moderateScale(36),
                                    borderRadius: moderateScale(10),
                                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65)
                                }}
                            >
                                <UserIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} /> 
                            </View>
        
                            <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                                <TextInput
                                    className="p-0 tracking-wide font-medium"
                                    style={{
                                        color: COLORS.inputTextColor,
                                        height: verticalScale(40),
                                        fontSize: moderateScale(13),
                                        textAlignVertical: "center",
                                        includeFontPadding: false
                                    }}
                                    value={fullName}
                                    onChangeText={(text) => {
                                        setFullName(text)
                                        setNameError(false)
                                    }}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={ COLORS.placeholderTextColor }
                                    keyboardType="default"
                                    returnKeyType="default"
                                    selectionColor={ COLORS.selectionColor }
                                />
                            </View>
                        </View>
        
                        {nameError && (
                            <Text
                                className="self-start font-medium"
                                style={{
                                    marginTop: verticalScale(4),
                                    marginLeft: scale(8),
                                    fontSize: moderateScale(11),
                                    color: COLORS.errorTextColor
                                }}
                            >
                                Please enter your full name
                            </Text>
                        )}
                    </>
                )}

                <GestureDetector gesture={panGesture}>
                    <View
                        className="flex-row items-center p-2 rounded-full w-full"
                        onLayout={(event) => {
                            buttonWidth.value = event.nativeEvent.layout.width
                        }}
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            marginTop: userExists ? verticalScale(55) : verticalScale(20)
                        }}
                    >
                        <Animated.View
                            className="rounded-full items-center justify-center"
                            style={[
                                {
                                    width: THUMB_SIZE,
                                    height: THUMB_SIZE,
                                    backgroundColor: COLORS.accentLightColor
                                },
                                animatedThumbStyle
                            ]}
                        >
                            <ArrowRightIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryColor} strokeWidth={2} />
                        </Animated.View>

                        <View
                            pointerEvents="none"
                            className="absolute left-0 right-0 items-center"
                        >
                            <Text
                                className="font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryBackgroundColor
                                }}
                            >
                                Start Ordering
                            </Text>
                        </View>
                    </View>
                </GestureDetector>

                <Text
                    className="font-medium text-center"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
                        marginTop: verticalScale(14),
                        fontSize: moderateScale(11)
                    }}
                >
                    You can always update your delivery location later.
                </Text>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}