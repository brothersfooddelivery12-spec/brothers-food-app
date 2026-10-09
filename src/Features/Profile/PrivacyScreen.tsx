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
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function PrivacyScreen(){
    const [phoneNumberHide, setPhoneNumberHide] = useState(false)

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
                        Privacy
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                                    We respect{"\n"}your privacy
                                </Text>

                                <Text
                                    className='font-normal leading-5 ml-2'
                                    style={{
                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
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
                            className="font-semibold mt-4"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Privacy Controls
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
                                    <UsersOutlineIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Public Visibility
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Choose who can see your profile information
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
                                    <SparkleIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Personalized Recommendations
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Get food suggestions tailored to your preferences
                                    </Text>
                                </View>

                                <ToggleSwitch enabled={phoneNumberHide} onPress={() => setPhoneNumberHide(!phoneNumberHide)} />
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
                                        Search History Storage
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Save your searches to improve recommendations
                                    </Text>
                                </View>

                                <ToggleSwitch enabled={phoneNumberHide} onPress={() => setPhoneNumberHide(!phoneNumberHide)} />
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
                                    <LocationIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Location Sharing
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Manage location access and sharing preferences
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
                            Data & Permissions
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
                                        Delete Search History
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Permanently clear your recent search history
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
                                    <SecurityIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Permissions
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Manage app permissions
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
                                    <DownloadIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Download My Data
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Request a copy of your data
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
                                    <DeleteIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Delete My Account
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Permanently delete your account and all data
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
                            Privacy Policy
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
                                    <DescriptionIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Privacy Policy
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Read our full privacy policy
                                    </Text>
                                </View>

                                <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={1.5} />
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
                                    <DescriptionIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Terms of Service
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Read our terms and conditions
                                    </Text>
                                </View>

                                <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={1.5} />
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
                                    <BiscuitIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Cookies Policy
                                    </Text>

                                    <Text
                                        className='font-medium mt-1'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Learn about how we use cookies
                                    </Text>
                                </View>

                                <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={1.5} />
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}