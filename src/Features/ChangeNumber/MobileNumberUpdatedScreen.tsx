import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import GradientButton from '@/components/GradientButton'
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
                    className='text-[#1F1F1F] font-extrabold text-center'
                    style={{
                        fontSize: moderateScale(18),
                        marginTop: verticalScale(16)
                    }}
                >
                    {title}
                </Text>

                <Text
                    className='text-[#1F1F1F]/65 font-medium text-center mb-3'
                    style={{
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