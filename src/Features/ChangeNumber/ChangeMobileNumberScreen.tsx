import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import LockIcon from '@/assets/icon/LockIcon.svg'
import SecurityIcon from '@/assets/icon/ShieldCheckIcon.svg'
import GradientButton from '@/components/GradientButton'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from "expo-router"
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'

export default function ChangeMobileNumberScreen(){
    const preventDoublePress = usePreventDoublePress()

    const {mode, currentPhone} = useLocalSearchParams<{mode?: "change" | "add", currentPhone?: string}>()

    const isChangeMode = mode === "change"

    const screenTitle =
        isChangeMode
            ? "Change Mobile Number"
            : "Add Mobile Number"

    const screenDescription =
        isChangeMode
            ? `We'll send a verification code to your\nnew mobile number to confirm the change.`
            : "Add a mobile number to your account. We'll send a verification code to confirm it."

    const securityTitle =
        isChangeMode
            ? "Your account stays safe"
            : "Secure your account"

    const securityDescription =
        isChangeMode
            ? "We'll verify your new number before updating it."
            : "We'll verify your mobile number before adding it to your account."

    const dataTitle =
        isChangeMode
            ? "All your data remains secure"
            : "Your data stays protected"

    const dataDescription =
        isChangeMode
            ? "Your orders, addresses and preferences will not be lost."
            : "Your mobile number will be securely linked to your Brothers account."

    
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
                        marginTop: verticalScale(16)
                    }}
                >
                    {screenTitle}
                </Text>

                <Text
                    className='text-[#1F1F1F]/65 font-medium text-center'
                    style={{
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(5)
                    }}
                >
                    {screenDescription}
                </Text>

                <View className='w-full items-center justify-center mt-8'>
                    <Image
                        source={require("@/assets/images/ChangeNumber.png")}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        style={{
                            width: moderateScale(245),
                            height: moderateScale(245)
                        }}
                    />
                </View>

                <View
                    className="bg-white border border-[#1F1F1F]/10 overflow-visible mt-5 mb-3 p-3"
                    style={{ borderRadius: moderateScale(20) }}
                >
                    <View className='flex-row gap-3 items-center'>
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(40),
                                height: moderateScale(40)
                            }}
                        >
                            <LockIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.8} />
                        </View>

                        <View className='flex-1'>
                            <Text
                                className='text-[#1F1F1F] font-semibold'
                                style={{ fontSize: moderateScale(13) }}
                            >
                                {securityTitle}
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium mt-1'
                                style={{ fontSize: moderateScale(11) }}
                            >
                                {securityDescription}
                            </Text>
                        </View>
                    </View>

                    <View
                        className="bg-[#1F1F1F]/10"
                        style={{
                            height: 1,
                            marginHorizontal: scale(10),
                            marginVertical: verticalScale(8)
                        }}
                    />

                    <View className='flex-row gap-3 items-center'>
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(40),
                                height: moderateScale(40)
                            }}
                        >
                            <SecurityIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.8} />
                        </View>

                        <View className='flex-1'>
                            <Text
                                className='text-[#1F1F1F] font-semibold'
                                style={{ fontSize: moderateScale(13) }}
                            >
                               {dataTitle}
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium mt-1'
                                style={{ fontSize: moderateScale(11) }}
                            >
                                {dataDescription}
                            </Text>
                        </View>
                    </View>
                </View>

                <GradientButton title='Continue' onPress={() => preventDoublePress(() => {
                    router.push({
                        pathname : "/enter-new-mobile-number",
                        params: {
                            mode: mode,
                            currentPhone: currentPhone
                        }
                    })
                })}/>
            </ScrollView>
        </SafeAreaView>
    )
}