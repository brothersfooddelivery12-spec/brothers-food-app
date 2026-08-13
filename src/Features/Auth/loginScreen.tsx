import { Animated, ImageBackground, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import LocationIcon from '@/assets/icon/locationIcon.svg'
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef, useState } from "react"
import IndiaFlag from '@/assets/icon/India.svg'
import GradientButton from "@/components/GradientButton"
import GoogleIcon from '@/assets/icon/Google.svg'
import { router } from "expo-router"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
import "../../config/googleSignIn"
import { useToast } from "../hook/ToastContext"

export default function LoginScreen() {
    const logoScale = useRef(new Animated.Value(0.8)).current

    const [mobileNumber, setMobileNumber] = useState("")
    const [mobileNumberError, setMobileNumberError] = useState(false)
    const {showToast} = useToast()

    const heroHeight = verticalScale(300)
    const logoSize = moderateScale(120)
    const logoTextSize = moderateScale(16)
    const taglineTextSize = moderateScale(7)
    const iconSize = moderateScale(15)

    const formatMobileNumber = (text: string) => {
        let numbersOnly = text.replace(/\D/g, "")

        if (numbersOnly.startsWith("91") && numbersOnly.length > 10) {
            numbersOnly = numbersOnly.slice(2);
        }

        numbersOnly = numbersOnly.slice(0, 10)

        setMobileNumber(numbersOnly)
    }

    const handleLogin = () => {
        let hasError = false
        showToast("Something Went Wrong", "warning")

        if(mobileNumber.length !== 10) {
            setMobileNumberError(true)
            hasError = true
            return
        } else {
            setMobileNumberError(false)
        }

        if(hasError) {
            return
        }

        router.push({
            pathname: '/verifyOtp',
            params: { mobileNumber: mobileNumber }
        })
    }

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

            await GoogleSignin.signOut()

            const response = await GoogleSignin.signIn()

            console.log("Google SignIn Response: ", response)

            const idToken = response.data?.idToken

            if(!idToken) {
                console.log("Google ID token not received")
                return
            }

            // const result = await fetch("", {
            //     method: "POST",
            //     headers: { "Content-Type" : "application/json" },
            //     body: JSON.stringify(idToken)
            // })

            // const data = await result.json()

            // if(!result.success) {
            //     throw new Error(data.message || "Google Sign In Failed")
            // }

            // console.log("Backend Response: ", data)
        } catch(error: any) {
            console.error("Google Sign In Error: ", error)

            if (error?.code === "SIGN_IN_CANCELLED") {
                return
            }

            showToast("Unable to sign in with Google. Please try again.", "warning")
        }
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
                    height: heroHeight,
                }}
            >
                <ImageBackground
                    source={require("@/assets/images/foodImage.png")}
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
                        "#FFFFFF",
                    ]}
                    locations={[0, 0.25, 0.48, 0.68, 0.86, 1]}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "100%",
                    }}
                />
                </ImageBackground>
            </View>

            <SafeAreaView edges={["top","bottom"]} className="flex-1">
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
                                    height: verticalScale(14),
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
                                    justifyContent: "center",
                                }}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Text
                                        className="font-bold text-[#CEAB3D] text-[80%]"
                                        style={{
                                            fontSize: logoTextSize,
                                            letterSpacing: scale(0.25),
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
                                            letterSpacing: scale(0.25),
                                        }}
                                    >
                                        THERS
                                    </Text>
                                </View>

                                <View 
                                    className="flex-row items-center justify-center"
                                    style={{
                                        marginTop: -verticalScale(0.6),
                                    }}
                                >
                                    <View className="bg-[#E8B93F]/85 rounded-full"
                                        style={{
                                            width: scale(5.4),
                                            height: verticalScale(1),
                                            marginRight: scale(2.5),
                                        }}
                                    />

                                    <Text
                                        className="font-medium text-center text-[#E8B93F]/85"
                                        style={{
                                            fontSize: taglineTextSize,
                                            letterSpacing: scale(0.25),
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
                                            marginLeft: scale(1.25),
                                        }}
                                    />
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        <Text
                            className="font-extrabold text-[#1F1F1F]"
                            style={{ marginTop: verticalScale(14), fontSize: moderateScale(24) }}
                        >
                            Welcome Back
                        </Text>

                        <Text
                            className="font-medium text-[#1F1F1F]/60 text-center"
                            style={{ marginTop: verticalScale(3), fontSize: moderateScale(12) }}
                        >
                            {`Log in to continue ordering your\nfavorite meals`}
                        </Text>

                        <Text
                            className="font-medium text-[#1F1F1F]/85 self-start"
                            style={{ fontSize: moderateScale(13), marginTop: verticalScale(25), marginLeft: scale(6) }}
                        >
                            Mobile Number
                        </Text>

                        <View className={`w-full flex-row overflow-hidden
                            ${mobileNumberError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
                            style={{ marginTop: verticalScale(6), height: verticalScale(48), borderRadius: moderateScale(18) }}
                        >
                            <View className="flex-row items-center justify-center relative" style={{ width: "22%" }}>
                                <IndiaFlag width={scale(20)} height={verticalScale(22)} style={{ marginRight: scale(6) }} />

                                <Text className="font-medium text-[#151515]" style={{ fontSize: moderateScale(14) }}>
                                    +91
                                </Text>

                                <View className="absolute right-0 top-0 bottom-0 bg-[#1F1F1F]/10" style={{ width: scale(0.8) }} />
                            </View>

                            <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                                <TextInput
                                    className="p-0 tracking-wide font-medium text-[#151515]"
                                    style={{
                                        height: verticalScale(40),
                                        fontSize: moderateScale(14),
                                        textAlignVertical: "center",
                                        includeFontPadding: false,
                                    }}
                                    value={mobileNumber.replace(/(\d{5})(\d{0,5})/, "$1 $2").trim()}
                                    onChangeText={(text) => {
                                        formatMobileNumber(text)
                                        setMobileNumberError(false)
                                    }}
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#7A7D81"
                                    keyboardType="phone-pad"
                                    returnKeyType="done"
                                    selectionColor="#79685e"
                                />
                            </View>
                        </View>

                        {mobileNumberError && (
                            <Text
                                className="self-start font-medium text-[#E05252]"
                                style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                            >
                                Please enter a valid 10-digit mobile number
                            </Text>
                        )}

                        <GradientButton title="Login" onPress={handleLogin} />

                        <View
                            className="w-full flex-row items-center justify-center"
                            style={{ marginVertical: verticalScale(18) }}
                        >
                            <View className="bg-[#1F1F1F]/10" style={{ height: verticalScale(1), width: scale(90) }} />

                            <Text
                                className="font-medium text-[#1F1F1F]/45"
                                style={{ marginHorizontal: scale(8), fontSize: moderateScale(11) }}
                            >
                                Or Continue With
                            </Text>

                            <View className="bg-[#1F1F1F]/10" style={{ height: verticalScale(1), width: scale(90) }} />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={handleGoogleSignIn}
                            className="w-full flex-row items-center justify-center rounded-[32px] bg-white border border-[#1F1F1F]/10"
                            style={{ marginBottom: verticalScale(14), height: verticalScale(48), paddingVertical: verticalScale(12) }}
                        >
                            <GoogleIcon width={scale(20)} height={scale(20)} style={{ marginRight: scale(6) }} />

                            <Text className="tracking-wide font-semibold text-[#1F1F1F]" style={{ fontSize: moderateScale(13) }}>
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        <View
                            className="w-full flex-row items-center justify-center"
                            style={{ marginVertical: verticalScale(8) }}
                        >
                            <Text className="font-medium text-[#1F1F1F]/60" style={{ fontSize: moderateScale(11) }}>
                                Don't have an account?
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => { router.push('/signUp') }}
                            >
                                <Text
                                    className="font-semibold text-[#3F2516]"
                                    style={{ marginLeft: scale(2), fontSize: moderateScale(11) }}
                                >
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View> 
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}