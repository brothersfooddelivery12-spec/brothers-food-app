import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import PhoneIcon from '@/assets/icon/CallOutlineIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import MailIcon from '@/assets/icon/MailIcon.svg'
import MonitorSmartphoneIcon from '@/assets/icon/MonitorSmartphoneIcon.svg'
import BellIcon from '@/assets/icon/NotificationIcon.svg'
import ToggleSwitch from '@/components/ToggleSwitch'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function SecurityScreen(){
    const [suspiciousActivity, setSuspiciousActivity] = useState(false)

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
                    
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Security
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                            className="px-4 py-6 items-center flex-row"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1'>
                                <Text
                                    className='font-extrabold ml-2'
                                    style={{
                                        fontSize: moderateScale(20),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    Your security,{"\n"}our priority
                                </Text>

                                <Text
                                    className='font-normal leading-5 ml-2'
                                    style={{
                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
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
                            className="font-semibold mt-4"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Account Security
                        </Text>

                        <View
                            className="mt-3 p-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <ClockIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Login Activity
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        View your recent login history
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={2} />
                            </View>

                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    height: moderateScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <MonitorSmartphoneIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Devices & Sessions
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Manage devices connected to your account
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={2} />
                            </View>
                        </View>

                        <Text
                            className="font-semibold mt-4"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Security Settings
                        </Text>

                        <View
                            className="mt-3 p-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <BellIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Suspicious Activity Alerts
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Get notified about suspicious logins
                                    </Text>
                                </View>

                                <ToggleSwitch enabled={suspiciousActivity} onPress={() => setSuspiciousActivity(!suspiciousActivity)} />
                            </View>
                        </View>

                        <Text
                            className="font-semibold mt-4"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Recovery Options
                        </Text>

                        <View
                            className="mt-3 p-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <MailIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Recovery Email
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Manage your recovery email
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={2} />
                            </View>

                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    height: moderateScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <View className='flex-row gap-2 items-center'>
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                        width: moderateScale(38),
                                        height: moderateScale(38),
                                        borderRadius: moderateScale(10)
                                    }}
                                >
                                    <PhoneIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Recovery Phone
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Manage your recovery phone number
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={2} />
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}