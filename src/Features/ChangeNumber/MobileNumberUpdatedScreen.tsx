import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import GradientButton from '@/components/GradientButton'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback } from 'react'
import { BackHandler, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'

export default function MobileNumberUpdatedScreen(){
    const preventDoublePress = usePreventDoublePress()
    const router = useRouter()

    const { mode } = useLocalSearchParams<{mode?: "add" | "change"}>()

    const isChangeMode = mode === "change"
    const title = isChangeMode
        ? "Mobile Number Updated!"
        : "Mobile Number Added!"

    const description = isChangeMode
        ? "Your mobile number has been\nsuccessfully changed."
        : "Your mobile number has been successfully\nadded to your account."

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.dismissAll()
                router.replace("/(tabs)/profile")

                return true
            }

            const subscription =
                BackHandler.addEventListener(
                    "hardwareBackPress",
                    onBackPress
                )

            return () => {
                subscription.remove()
            }
        }, [router])
    )

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
                <View className='w-full items-center justify-center mt-8'>
                    <Image
                        source={require("@/assets/images/NumberUpdatedSuccessfully.png")}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        style={{
                            width: moderateScale(265),
                            height: moderateScale(265)
                        }}
                    />
                </View>

                <Text
                    className='font-extrabold text-center'
                    style={{
                        color: COLORS.primaryTextColor,
                        fontSize: moderateScale(18),
                        marginTop: verticalScale(16)
                    }}
                >
                    {title}
                </Text>

                <Text
                    className='font-medium text-center mb-3'
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(5)
                    }}
                >
                    {description}
                </Text>

                <GradientButton title='Go to Profile' onPress={() => preventDoublePress(() => {
                    router.dismissAll()
                    router.replace('/(tabs)/profile')
                })}/>
            </ScrollView>
        </SafeAreaView>
    )
}