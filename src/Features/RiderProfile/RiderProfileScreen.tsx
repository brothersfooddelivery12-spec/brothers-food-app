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
import { deliveryReviews } from '@/constant/DeliveryReviewData'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import DeliveryReviewCard from './Components/DeliveryReviewCard'

const languages = ["Hindi", "English", "Gujarati"]

export default function RiderProfileScreen() {
    const insets = useSafeAreaInsets()
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
                    marginBottom: verticalScale(10),
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
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Delivery Partner
                    </Text>

                    <View className='flex-row gap-1 items-center'>
                        <VerifiedIcon width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} />

                        <Text
                            className="text-[#5c4639] font-medium"
                            style={{ fontSize: moderateScale(10) }}
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
                            className='bg-[#3F2516] p-4'
                            style={{
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(4)
                            }}
                        >
                            <View className='flex-row gap-3 items-center'>
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
                                            borderColor: "#E8B93F"
                                        }}
                                    />

                                    <View
                                        className={`absolute border border-white items-center justify-center ${
                                            isOnline ? "bg-[#22A06B]" : "bg-[#7A7D81]"
                                        }`}
                                        style={{
                                            bottom: verticalScale(-5),
                                            alignSelf: "center",
                                            paddingHorizontal: scale(7),
                                            paddingVertical: verticalScale(2),
                                            borderRadius: moderateScale(10)
                                        }}
                                    >
                                        <Text
                                            className="text-white font-bold"
                                            style={{ fontSize: moderateScale(7) }}
                                        >
                                            {isOnline ? "ONLINE" : "OFFLINE"}
                                        </Text>
                                    </View>
                                </View>

                                <View className='justify-center items-start'>
                                    <View className='flex-row gap-1 justify-center items-center'>
                                        <Text
                                            className='text-[#FFFFFF] font-bold'
                                            style={{ fontSize: moderateScale(16) }}
                                        >
                                            Rahul Sharma
                                        </Text>

                                        <VerifiedIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} />
                                    </View>

                                    <View className='flex-row gap-3 mt-2'>
                                        <View
                                            className="flex-row gap-1 items-center bg-[#F8D56A] self-start"
                                            style={{
                                                paddingHorizontal: moderateScale(6),
                                                paddingVertical: moderateScale(3),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                                            <Text
                                                className="font-bold text-[#5c4639]"
                                                style={{ fontSize: moderateScale(11), marginRight: moderateScale(2) }}
                                            >
                                                4.9
                                            </Text>
                                        </View>

                                        <View
                                            className="flex-row gap-1 items-center bg-[#F8D56A] self-start"
                                            style={{
                                                paddingHorizontal: moderateScale(6),
                                                paddingVertical: moderateScale(3),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <CrownIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                                            <Text
                                                className="font-bold text-[#5c4639]"
                                                style={{ fontSize: moderateScale(11), marginRight: moderateScale(2) }}
                                            >
                                                Elite Partner
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View
                                className="rounded-full bg-[#E8DDD3]/40 mt-4"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View className="flex-row items-center">
                                <View className="gap-4 flex-1 ml-2">
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full bg-[#FFFFFF]/15"
                                            style={{
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <ClipboardIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="text-[#FFFFFF]/75 font-normal uppercase"
                                                style={{ fontSize: moderateScale(11) }}
                                            >
                                                Delivered
                                            </Text>

                                            <Text
                                                className="text-[#FFFFFF] font-bold"
                                                style={{ fontSize: moderateScale(12) }}
                                            >
                                                8,452
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full bg-[#FFFFFF]/15"
                                            style={{
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <StarIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="text-[#FFFFFF]/75 font-normal uppercase"
                                                style={{ fontSize: moderateScale(11) }}
                                            >
                                                Experience
                                            </Text>

                                            <Text
                                                className="text-[#FFFFFF] font-bold"
                                                style={{ fontSize: moderateScale(12) }}
                                            >
                                                4 Years
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="gap-4 mr-4">
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full bg-[#FFFFFF]/15"
                                            style={{
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <ClockIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.5} />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="text-[#FFFFFF]/75 font-normal uppercase"
                                                style={{ fontSize: moderateScale(11) }}
                                            >
                                                Response
                                            </Text>

                                            <Text
                                                className="text-[#FFFFFF] font-bold"
                                                style={{ fontSize: moderateScale(12) }}
                                            >
                                                25s
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="items-center justify-center rounded-full bg-[#FFFFFF]/15"
                                            style={{
                                                width: moderateScale(34),
                                                height: moderateScale(34)
                                            }}
                                        >
                                            <CheckCircleIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.5} />
                                        </View>

                                        <View className="justify-center">
                                            <Text
                                                className="text-[#FFFFFF]/75 font-normal uppercase"
                                                style={{ fontSize: moderateScale(11) }}
                                            >
                                                On Time
                                            </Text>

                                            <Text
                                                className="text-[#FFFFFF] font-bold"
                                                style={{ fontSize: moderateScale(12) }}
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
                            className='p-3 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(18), marginTop: verticalScale(16) }}
                        >
                            <View className='flex-row gap-3 items-center'>
                                <View
                                    className="rounded-full items-center justify-center bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38)
                                    }}
                                >
                                    <VehicleIcon width={moderateScale(20)} height={moderateScale(20)} color={"#3F2516"} />
                                </View>

                                <View className='justify-center'>
                                    <Text
                                        className='text-[#1F1F1F]/85 font-medium uppercase'
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Vehicle
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F] font-bold mt-1'
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Honda Activa 125
                                    </Text>

                                    <Text
                                        className='text-[#5c4639] font-medium'
                                        style={{ fontSize: moderateScale(12), marginTop: moderateScale(2) }}
                                    >
                                        RJ14 AB 4587
                                    </Text>
                                </View>

                            </View>

                            <View
                                className="rounded-full bg-[#E8DDD3]/55"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: verticalScale(8)
                                }}
                            />

                            <Text
                                className='text-[#1F1F1F]/75 font-medium uppercase ml-2'
                                style={{ fontSize: moderateScale(12) }}
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
                                        className="items-center justify-center bg-[#E5E4E2]/35"
                                        style={{
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(4),
                                            borderRadius: moderateScale(18),
                                        }}
                                    >
                                        <Text
                                            className="text-[#1F1F1F] font-semibold"
                                            style={{
                                                fontSize: moderateScale(12),
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
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(15) }}
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
                                className='items-center justify-center px-4 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                                style={{
                                    borderRadius: moderateScale(18),
                                    width: moderateScale(100),
                                    height: moderateScale(100)
                                }}
                            >
                                <View
                                    className="items-center justify-center bg-[#F8D56A] rounded-full"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <MedalIcon width={moderateScale(22)} height={moderateScale(22)} color="#5c4639" />
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-semibold text-center'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Elite Rider
                                </Text>
                            </View>

                            <View
                                className='items-center justify-center px-4 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                                style={{
                                    borderRadius: moderateScale(18),
                                    width: moderateScale(100),
                                    height: moderateScale(100)
                                }}
                            >
                                <View
                                    className="items-center justify-center bg-[#F8D56A] rounded-full"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <ThunderIcon width={moderateScale(22)} height={moderateScale(22)} color="#5c4639" />
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-semibold text-center'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Fastest Delivery
                                </Text>
                            </View>

                            <View
                                className='items-center justify-center px-4 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                                style={{
                                    borderRadius: moderateScale(18),
                                    width: moderateScale(100),
                                    height: moderateScale(100)
                                }}
                            >
                                <View
                                    className="items-center justify-center bg-[#F8D56A] rounded-full"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <CircleStarIcon width={moderateScale(26)} height={moderateScale(26)} color="#5c4639" />
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-semibold text-center'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Top Rated
                                </Text>
                            </View>
                        </ScrollView>

                        <View
                            className='p-4 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(18), marginTop: verticalScale(16) }}
                        >
                            <View className='flex-row gap-1 items-center'>
                                <VerifyIcon width={moderateScale(18)} height={moderateScale(18)} color={"#5c4639"} />

                                <Text
                                    className='text-[#5c4639] font-semibold'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Brothers Safety Seal
                                </Text>
                            </View>

                            <View className='flex-row gap-2 items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={"#4d9151"} strokeWidth={1.8} />

                                <Text
                                    className='text-[#1F1F1F] font-semibold flex-1'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Government Verified Identity
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    ID: 884X-XXXX
                                </Text>
                            </View>

                            <View className='flex-row gap-2 items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={"#4d9151"} strokeWidth={1.8} />

                                <Text
                                    className='text-[#1F1F1F] font-semibold flex-1'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Background Checked
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Clear
                                </Text>
                            </View>

                            <View className='flex-row gap-2 items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={"#4d9151"} strokeWidth={1.8} />

                                <Text
                                    className='text-[#1F1F1F] font-semibold flex-1'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Masked Number Protocol
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{ fontSize: moderateScale(11) }}
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
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Customer Feed
                            </Text>

                            <Text
                                className="text-[#3F2516] font-bold"
                                style={{ fontSize: moderateScale(12) }}
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
                            className="bg-[#3F2516] items-center justify-center py-4 px-5 gap-2"
                            style={{
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <CallFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={"#FFFFFF"} />

                            <Text
                                className="text-[#FFFFFF] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Call
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="bg-white items-center justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                            style={{
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <ChatFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} />

                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Chat
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="bg-white items-center justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                            style={{
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <ShareFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} />

                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Share
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="bg-[#FEE2E2] items-center justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                            style={{
                                width: cardWidth,
                                height: moderateScale(75),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <WarningFilledIcon width={moderateScale(26)} height={moderateScale(26)} color={"#DC2626"} />

                            <Text
                                className="text-[#DC2626] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
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