import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CallFilledIcon from '@/assets/icon/CallFilledIcon.svg'
import ChatFilledIcon from '@/assets/icon/ChatFilledIcon.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import ClipboardIcon from '@/assets/icon/ClipboardIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import VehicleIcon from '@/assets/icon/DeliveryIcon.svg'
import MedalIcon from '@/assets/icon/MedalFilledIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import StarIcon from '@/assets/icon/RatingIcon3.svg'
import VerifyIcon from '@/assets/icon/SecurityIcon.svg'
import ShareFilledIcon from '@/assets/icon/ShareFilledIcon.svg'
import CheckCircleIcon from '@/assets/icon/SuccessIcon2.svg'
import ThunderIcon from '@/assets/icon/ThunderIconFilled.svg'
import VerifiedIcon from '@/assets/icon/VerifiedIcon.svg'
import WarningFilledIcon from '@/assets/icon/WarningFilledIcon.svg'
import { COLORS } from '@/constant/colors'
import { deliveryReviews } from '@/constant/DeliveryReviewData'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import DeliveryReviewCard from './Components/DeliveryReviewCard'

const languages = ["Hindi", "English", "Gujarati"]

export default function RiderProfileScreen() {
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const horizontalPadding = scale(42)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 4

    const isOnline = true

    const [driverLocation, setDriverLocation] = useState({
        latitude: 26.9124,
        longitude: 75.7873,
    })

    const renderDeliveryReview = useCallback(
        ({ item }: { item: any }) => (
            <DeliveryReviewCard item={item} />
        ),
        []
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
                    marginBottom: verticalScale(10),
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
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Delivery Partner
                    </Text>

                    <View className='flex-row gap-1 items-center'>
                        <VerifiedIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(10),
                                color: COLORS.primaryColor
                            }}
                        >
                            VERIFIED PREMIUM FEATURE
                        </Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={deliveryReviews}
                keyExtractor={(item) => item.id}
                renderItem={renderDeliveryReview}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: verticalScale(8),
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25),
                    gap: verticalScale(10)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className='p-4'
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(4)
                            }}
                        >
                            <View className='flex-row gap-3 items-center mb-2'>
                                <View className="relative self-start">
                                    <Image
                                        source={require("@/assets/images/profile-placeholder.jpg")}
                                        contentFit="cover"
                                        cachePolicy="memory-disk"
                                        style={{
                                            width: moderateScale(58),
                                            height: moderateScale(58),
                                            borderRadius: moderateScale(12),
                                            borderWidth: 1,
                                            borderColor: COLORS.accentLightColor
                                        }}
                                    />

                                    <View
                                        className="absolute items-center justify-center"
                                        style={{
                                            borderColor: COLORS.primaryBackgroundColor,
                                            backgroundColor: isOnline
                                                ? COLORS.activeStatusTextColor
                                                : COLORS.neutralSurfaceColor,
                                            bottom: verticalScale(-5),
                                            borderWidth: moderateScale(1),
                                            alignSelf: "center",
                                            paddingHorizontal: scale(7),
                                            paddingVertical: verticalScale(2),
                                            borderRadius: moderateScale(10)
                                        }}
                                    >
                                        <Text
                                            className="font-bold"
                                            style={{
                                                fontSize: moderateScale(7),
                                                color: COLORS.primaryBackgroundColor
                                            }}
                                        >
                                            {isOnline ? "ONLINE" : "OFFLINE"}
                                        </Text>
                                    </View>
                                </View>

                                <View className='justify-center items-start'>
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <Text
                                            className='font-bold'
                                            style={{
                                                fontSize: moderateScale(16),
                                                color: COLORS.primaryBackgroundColor
                                            }}
                                        >
                                            Rahul Sharma
                                        </Text>

                                        <VerifiedIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} />
                                    </View>

                                    <View className='flex-row gap-3 mt-2'>
                                        <View
                                            className="flex-row gap-1 items-center self-start"
                                            style={{
                                                backgroundColor: COLORS.accentLightColor,
                                                paddingHorizontal: moderateScale(6),
                                                paddingVertical: moderateScale(3),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} />

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    color: COLORS.primaryColor,
                                                    fontSize: moderateScale(10),
                                                    marginRight: moderateScale(2)
                                                }}
                                            >
                                                4.9
                                            </Text>
                                        </View>

                                        <View
                                            className="flex-row gap-1 items-center self-start"
                                            style={{
                                                backgroundColor: COLORS.accentLightColor,
                                                paddingHorizontal: moderateScale(6),
                                                paddingVertical: moderateScale(3),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <CrownIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} />

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    marginRight: moderateScale(2),
                                                    color: COLORS.primaryColor
                                                }}
                                            >
                                                Elite Partner
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View
                                className="rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.borderColor, 0.2),
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: verticalScale(6)
                                }}
                            />

                            <View className="flex-row items-center">
                                <View className="gap-4 flex-1 ml-2">
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <ClipboardIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="font-normal uppercase"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    color: hexToRgba(COLORS.primaryBackgroundColor, 0.75)
                                                }}
                                            >
                                                Delivered
                                            </Text>

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    color: COLORS.primaryBackgroundColor
                                                }}
                                            >
                                                8,452
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <StarIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="font-normal uppercase"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    color: hexToRgba(COLORS.primaryBackgroundColor, 0.75)
                                                }}
                                            >
                                                Experience
                                            </Text>

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    color: COLORS.primaryBackgroundColor
                                                }}
                                            >
                                                4 Years
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="gap-4 mr-4">
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <ClockIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="font-normal uppercase"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    color: hexToRgba(COLORS.primaryBackgroundColor, 0.75)
                                                }}
                                            >
                                                Response
                                            </Text>

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    color: COLORS.primaryBackgroundColor
                                                }}
                                            >
                                                25s
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <CheckCircleIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="font-normal uppercase"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    color: hexToRgba(COLORS.primaryBackgroundColor, 0.75)
                                                }}
                                            >
                                                On Time
                                            </Text>

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    color: COLORS.primaryBackgroundColor
                                                }}
                                            >
                                                99%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* <DeliveryTrackingMap
                            driverLocation={driverLocation}
                            distance="1.2 km"
                            eta="4 mins"
                        /> */}

                        <View
                            className='p-3'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(16),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className='flex-row gap-3 items-center'>
                                <View
                                    className="rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(38),
                                        height: moderateScale(38)
                                    }}
                                >
                                    <VehicleIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} />
                                </View>

                                <View className='justify-center'>
                                    <Text
                                        className='font-medium uppercase'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                        }}
                                    >
                                        Vehicle
                                    </Text>

                                    <Text
                                        className='font-bold mt-1'
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Honda Activa 125
                                    </Text>

                                    <Text
                                        className='font-medium'
                                        style={{
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                            fontSize: moderateScale(11),
                                            marginTop: moderateScale(2)
                                        }}
                                    >
                                        RJ14 AB 4587
                                    </Text>
                                </View>

                            </View>

                            <View
                                className="rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: verticalScale(8)
                                }}
                            />

                            <Text
                                className='font-medium uppercase ml-2'
                                style={{
                                    fontSize: moderateScale(11),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                fluent in
                            </Text>

                            <View
                                className="flex-row flex-wrap items-center gap-2"
                                style={{ marginTop: verticalScale(8) }}
                            >
                                {languages.map((language) => (
                                    <View
                                        key={language}
                                        className="items-center justify-center"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.55),
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(4),
                                            borderRadius: moderateScale(18),
                                        }}
                                    >
                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(12)
                                            }}
                                        >
                                            {language}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View
                            className="flex-row items-center w-full"
                            style={{ marginTop: verticalScale(18) }}
                        >
                            <Text
                                className="font-semibold flex-1"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(15)
                                }}
                            >
                                Achievements
                            </Text>

                            {/* <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="items-center"
                            >
                                <Text
                                    className="text-[#3F2516] font-bold"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity> */}
                        </View>

                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-3 mb-0"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(8)
                            }}
                        >
                            <View
                                className='items-center justify-center px-4'
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(18),
                                    width: moderateScale(100),
                                    height: moderateScale(100)
                                }}
                            >
                                <View
                                    className="items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: COLORS.accentLightColor,
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <MedalIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryColor} />
                                </View>

                                <Text
                                    className='font-semibold text-center'
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Elite Rider
                                </Text>
                            </View>

                            <View
                                className='items-center justify-center px-4'
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(18),
                                    width: moderateScale(100),
                                    height: moderateScale(100)
                                }}
                            >
                                <View
                                    className="items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: COLORS.accentLightColor,
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <ThunderIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryColor} />
                                </View>

                                <Text
                                    className='font-semibold text-center'
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Fastest Delivery
                                </Text>
                            </View>

                            <View
                                className='items-center justify-center px-4'
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(18),
                                    width: moderateScale(100),
                                    height: moderateScale(100)
                                }}
                            >
                                <View
                                    className="items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: COLORS.accentLightColor,
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <CircleStarIcon width={moderateScale(26)} height={moderateScale(26)} color={COLORS.primaryColor} />
                                </View>

                                <Text
                                    className='font-semibold text-center'
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Top Rated
                                </Text>
                            </View>
                        </ScrollView>

                        <View
                            className='p-4'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(16),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className='flex-row gap-1 items-center'>
                                <VerifyIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />

                                <Text
                                    className='font-semibold'
                                    style={{
                                        color: COLORS.primaryColor,
                                        fontSize: moderateScale(12)
                                    }}
                                >
                                    Brothers Safety Seal
                                </Text>
                            </View>

                            <View className='flex-row gap-2 items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.activeStatusTextColor} strokeWidth={1.8} />

                                <Text
                                    className='font-semibold flex-1'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Government Verified Identity
                                </Text>

                                <Text
                                    className='font-medium'
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    ID: 884X-XXXX
                                </Text>
                            </View>

                            <View className='flex-row gap-2 items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.activeStatusTextColor} strokeWidth={1.8} />

                                <Text
                                    className='font-semibold flex-1'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Background Checked
                                </Text>

                                <Text
                                    className='font-medium'
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Clear
                                </Text>
                            </View>

                            <View className='flex-row gap-2 items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.activeStatusTextColor} strokeWidth={1.8} />

                                <Text
                                    className='font-semibold flex-1'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Masked Number Protocol
                                </Text>

                                <Text
                                    className='font-medium'
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Active
                                </Text>
                            </View>
                        </View>

                        <View
                            className="flex-row items-center w-full"
                            style={{ marginTop: verticalScale(18) }}
                        >
                            <Text
                                className="font-semibold flex-1"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Customer Feed
                            </Text>

                            <Text
                                className="font-bold"
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryColor
                                }}
                            >
                                98% Satisfaction
                            </Text>
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <View className="flex-row items-center justify-center gap-3 mt-5">
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="items-center justify-center py-4 px-5 gap-2"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <CallFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryBackgroundColor} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryBackgroundColor
                                }}
                            >
                                Call
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="items-center justify-center py-4 px-5 gap-2"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <ChatFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Chat
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="items-center justify-center py-4 px-5 gap-2"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <ShareFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Share
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="items-center justify-center py-4 px-5 gap-2"
                            style={{
                                backgroundColor: COLORS.dangerBackgroundColor,
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <WarningFilledIcon width={moderateScale(26)} height={moderateScale(26)} color={COLORS.dangerTextColor} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.dangerTextColor
                                }}
                            >
                                SOS
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    )
}