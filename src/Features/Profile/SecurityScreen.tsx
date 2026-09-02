import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import PhoneIcon from '@/assets/icon/CallOutlineIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import MailIcon from '@/assets/icon/MailIcon.svg'
import MonitorSmartphoneIcon from '@/assets/icon/MonitorSmartphoneIcon.svg'
import BellIcon from '@/assets/icon/NotificationIcon.svg'
import ToggleSwitch from '@/components/ToggleSwitch'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function SecurityScreen(){
    const [suspiciousActivity, setSuspiciousActivity] = useState(false)

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
                    
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Security
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Keep your account safe with advanced security controls.
                    </Text>
                </View>
            </View>

            <FlatList
                data={[{}]}
                renderItem={null}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <View
                            className="bg-[#3F2516] px-4 py-6 items-center flex-row"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#FFFFFF] font-extrabold ml-2'
                                    style={{ fontSize: moderateScale(20) }}
                                >
                                    Your security,{"\n"}our priority
                                </Text>

                                <Text
                                    className='text-[#FFFFFF]/75 font-normal leading-5 ml-2'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Manage your account security{"\n"}and keep your information safe.
                                </Text>
                            </View>

                            <Image
                                source={require("@/assets/images/SecurityIllustration.png")}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                style={{
                                    width: moderateScale(145),
                                    height: moderateScale(125),
                                    marginRight: -moderateScale(6),
                                    marginVertical: -verticalScale(6)
                                }}
                            />
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Account Security
                        </Text>

                        <View
                            className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center bg-[#F5F5F5]"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <ClockIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Login Activity
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        View your recent login history
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>

                            <View
                                className="bg-[#1F1F1F]/10"
                                style={{
                                    height: 1,
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center bg-[#F5F5F5]"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <MonitorSmartphoneIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Devices & Sessions
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Manage devices connected to your account
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Security Settings
                        </Text>

                        <View
                            className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center bg-[#F5F5F5]"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <BellIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Suspicious Activity Alerts
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Get notified about suspicious logins
                                    </Text>
                                </View>

                                <ToggleSwitch enabled={suspiciousActivity} onPress={() => setSuspiciousActivity(!suspiciousActivity)} />
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Recovery Options
                        </Text>

                        <View
                            className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center bg-[#F5F5F5]"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <MailIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Recovery Email
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Manage your recovery email
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>

                            <View
                                className="bg-[#1F1F1F]/10"
                                style={{
                                    height: 1,
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center bg-[#F5F5F5]"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <PhoneIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Recovery Phone
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Manage your recovery phone number
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}