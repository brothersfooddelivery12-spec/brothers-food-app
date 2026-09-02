import SparkleIcon from '@/assets/icon/AiSparklesIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import BiscuitIcon from '@/assets/icon/BiscuitIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import DescriptionIcon from '@/assets/icon/DescriptionIcon.svg'
import DownloadIcon from '@/assets/icon/InvoiceIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import ShareIcon from '@/assets/icon/ShareIcon2.svg'
import SecurityIcon from '@/assets/icon/ShieldCheckIcon.svg'
import UsersOutlineIcon from '@/assets/icon/UsersOutlineIcon.svg'
import ToggleSwitch from '@/components/ToggleSwitch'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function PrivacyScreen(){
    const [phoneNumberHide, setPhoneNumberHide] = useState(false)

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
                        Privacy
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Manage your data, permissions, and privacy preferences
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
                                    We respect{"\n"}your privacy
                                </Text>

                                <Text
                                    className='text-[#FFFFFF]/75 font-normal leading-5 ml-2'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    We're committed to protecting{"\n"}your personal information{"\n"}and giving you full control.
                                </Text>
                            </View>

                            <Image
                                source={require("@/assets/images/PrivacyIllustration.png")}
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
                            Privacy Controls
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
                                    <UsersOutlineIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Public Visibility
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Choose who can see your profile information
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
                                    <SparkleIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Personalized Recommendations
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Get food suggestions tailored to your preferences
                                    </Text>
                                </View>

                                <ToggleSwitch enabled={phoneNumberHide} onPress={() => setPhoneNumberHide(!phoneNumberHide)} />
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
                                    <ClockIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Search History Storage
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Save your searches to improve recommendations
                                    </Text>
                                </View>

                                <ToggleSwitch enabled={phoneNumberHide} onPress={() => setPhoneNumberHide(!phoneNumberHide)} />
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
                                    <LocationIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Location Sharing
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Manage location access and sharing preferences
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Data & Permissions
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
                                        Delete Search History
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Permanently clear your recent search history
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
                                    <SecurityIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Permissions
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Manage app permissions
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
                                    <DownloadIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Download My Data
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Request a copy of your data
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
                                    <DeleteIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Delete My Account
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Permanently delete your account and all data
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Privacy Policy
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
                                    <DescriptionIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Privacy Policy
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Read our full privacy policy
                                    </Text>
                                </View>

                                <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F85" strokeWidth={1.5} />
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
                                    <DescriptionIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Terms of Service
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Read our terms and conditions
                                    </Text>
                                </View>

                                <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F85" strokeWidth={1.5} />
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
                                    <BiscuitIcon width={scale(20)} height={scale(20)} color={"#1F1F1F"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Cookies Policy
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium mt-1'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Learn about how we use cookies
                                    </Text>
                                </View>

                                <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F85" strokeWidth={1.5} />
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}