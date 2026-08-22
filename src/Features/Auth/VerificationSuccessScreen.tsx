import LottieView from "lottie-react-native"
import { ScrollView, StatusBar, Text, TextInput, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import UtenisilIcon from '@/assets/icon/UtensilIcon2.svg'
import SecurityIcon from '@/assets/icon/SecurityIcon.svg'
import { useCallback, useEffect, useState } from "react"
import UserIcon from '@/assets/icon/UserIcon.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { useLocalSearchParams, useRouter } from "expo-router"
import { scheduleOnRN } from "react-native-worklets"

export default function VerificationSuccessScreen() {
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const [fullName, setFullName] = useState("")
    const [nameError, setNameError] = useState(false)
    const router = useRouter()
    const { isExist, userMobileNumber } = useLocalSearchParams<{
        isExist?: string
        userMobileNumber?: string
    }>()

    const userExists = isExist === "true"

    const resetSwipe = useCallback(() => {
        translateX.value = withSpring(0)
    }, [])

    const handleStartOrdering = useCallback(() => {
        if(!userExists) {
            if (!fullName) {
                setNameError(true)
                resetSwipe()
                return
            }
    
            setNameError(false)
        }

        router.dismissAll()
        router.replace("/(tabs)/home")
    }, [fullName, resetSwipe, router])

    const BUTTON_WIDTH = SCREEN_WIDTH - scale(28)
    const THUMB_SIZE = moderateScale(34)
    const PADDING = scale(12)

    const maxTranslateX = BUTTON_WIDTH - THUMB_SIZE - PADDING * 2

    const translateX = useSharedValue(0)

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.max(
                0,
                Math.min(event.translationX, maxTranslateX)
            )
        })
        .onEnd(() => {
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
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: verticalScale(30),
                    paddingHorizontal: scale(14)
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center justify-center">
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
                    className="text-[#1F1F1F] font-extrabold text-center -mt-4"
                    style={{
                        fontSize: moderateScale(20)
                    }}
                >
                    Welcome to Brothers!
                </Text>

                <Text
                    className="text-[#1F1F1F]/75 font-medium leading-5 text-center mx-4"
                    style={{
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(10)
                    }}
                >
                    Your mobile number has been verified
                    successfully. You're just one tap away from
                    discovering delicious food delivered fast.
                </Text>

                <View
                    className="flex-row gap-3 bg-white border border-[#1F1F1F]/10 p-3"
                    style={{
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
                        <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} />
                    </View>

                    <View className="items-start gap-1 justify-center">
                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Lightning Fast Delivery
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Fresh food delivered in minutes.
                        </Text>
                    </View>
                </View>

                <View
                    className="flex-row gap-3 bg-white border border-[#1F1F1F]/10 p-3"
                    style={{
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
                        <UtenisilIcon width={moderateScale(24)} height={moderateScale(24)} color={"#5c4639"} />
                    </View>

                    <View className="items-start gap-1 justify-center">
                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            500+ Restaurants
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Discover local favorites and brands.
                        </Text>
                    </View>
                </View>

                <View
                    className="flex-row gap-3 bg-white border border-[#1F1F1F]/10 p-3"
                    style={{
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
                        <SecurityIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} />
                    </View>

                    <View className="items-start gap-1 justify-center">
                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Safe & Secure
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Protected login and secure payments.
                        </Text>
                    </View>
                </View>

                {!userExists && (
                    <>
                        <Text
                            className="font-medium text-[#1F1F1F]/85 self-start"
                            style={{ fontSize: moderateScale(13), marginTop: verticalScale(15), marginLeft: scale(6) }}
                        >
                            Full Name
                        </Text>
        
                        <View
                            className={`flex-row items-center overflow-hidden
                            ${nameError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
                            style={{
                                marginTop: verticalScale(6),
                                paddingRight: scale(10),
                                paddingLeft: scale(9),
                                height: verticalScale(48),
                                borderRadius: moderateScale(18)
                            }}
                        >
                            <View
                                className="items-center justify-center bg-[#3f25161d]"
                                style={{
                                    width: moderateScale(36),
                                    height: moderateScale(36),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <UserIcon width={scale(20)} height={scale(20)} color={"#655145"} /> 
                            </View>
        
                            <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                                <TextInput
                                    className="p-0 tracking-wide font-medium text-[#151515]"
                                    style={{
                                        height: verticalScale(40),
                                        fontSize: moderateScale(14),
                                        textAlignVertical: "center",
                                        includeFontPadding: false
                                    }}
                                    value={fullName}
                                    onChangeText={(text) => {
                                        setFullName(text)
                                        setNameError(false)
                                    }}
                                    placeholder="Full Name"
                                    placeholderTextColor="#7A7D81"
                                    keyboardType="default"
                                    returnKeyType="default"
                                    selectionColor="#79685e"
                                />
                            </View>
                        </View>
        
                        {nameError && (
                            <Text
                                className="self-start font-medium text-[#E05252]"
                                style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                            >
                                Please enter your full name
                            </Text>
                        )}
                    </>
                )}

                <GestureDetector gesture={panGesture}>
                    <View
                        className="flex-row items-center p-3 rounded-full w-full bg-[#3F2516]"
                        style={{ marginTop: userExists ? verticalScale(35) : verticalScale(20) }}
                    >
                        <Animated.View
                            className="rounded-full bg-[#F8D56A] items-center justify-center"
                            style={[
                                {
                                    width: moderateScale(34),
                                    height: moderateScale(34)
                                },
                                animatedThumbStyle
                            ]}
                        >
                            <ArrowRightIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" strokeWidth={1.8} />
                        </Animated.View>

                        <View
                            className="absolute items-center"
                            style={{ left: scale(52) }}    
                        >
                            <Text
                                className="text-[#FFFFFF] font-semibold uppercase"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Start Ordering
                            </Text>
                        </View>
                    </View>
                </GestureDetector>

                <Text
                    className="text-[#1F1F1F]/65 font-medium text-center"
                    style={{
                        marginTop: verticalScale(14),
                        fontSize: moderateScale(11)
                    }}
                >
                    You can always update your delivery location later.
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}