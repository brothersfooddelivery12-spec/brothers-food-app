import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import BubbleChatQuestionIcon from '@/assets/icon/BubbleChatQuestionIcon.svg'
import CameraIcon from '@/assets/icon/CameraIcon.svg'
import ChatIcon from '@/assets/icon/ChatIcon.svg'
import CouponIcon from '@/assets/icon/CouponFilledIcon.svg'
import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import EditIcon from '@/assets/icon/EditIcon.svg'
import HeartIcon from '@/assets/icon/FavouriteIconOutline.svg'
import FoodIcon from '@/assets/icon/FoodIcon.svg'
import HelpCircleIcon from '@/assets/icon/HelpCircleIcon.svg'
import InformationCircleIcon from '@/assets/icon/InformationCircleIcon.svg'
import LanguagesIcon from '@/assets/icon/LanguagesIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import LogoutIcon from '@/assets/icon/LogoutIcon.svg'
import MedalIcon from '@/assets/icon/MedalIcon.svg'
import MoneyIcon from '@/assets/icon/MoneyIcon.svg'
import NotepadTextIcon from '@/assets/icon/NotepadTextIcon.svg'
import OrderIcon from '@/assets/icon/OrderIcon.svg'
import PaintBoardIcon from '@/assets/icon/PaintBoardIcon.svg'
import PrivacyIcon from '@/assets/icon/SecurityIcon2.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import SecurityIcon from '@/assets/icon/ShieldCheckIcon.svg'
import PremiumBadgeIcon from '@/assets/icon/StarBadgeFilledIcon.svg'
import StarBadgeIcon from '@/assets/icon/StarBadgeIcon.svg'
import VegIcon from '@/assets/icon/VeganIcon.svg'
import WalletFilledIcon from '@/assets/icon/WalletFilledIcon.svg'
import ToggleSwitch from '@/components/ToggleSwitch'
import { Image } from "expo-image"
import { router } from 'expo-router'
import React, { useState } from "react"
import { Pressable, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import ProfileMenuItem from './Components/ProfileMenuItem'

const TITLE_HEIGHT_FALLBACK  = verticalScale(48)

const APPEARANCE_OPTIONS = [
    "System Default",
    "Light",
    "Dark"
]

const LANGUAGE_OPTIONS = [
    "English",
    "Hindi"
]

type OpenMenu = "appearance" | "language" | null

export default function ProfileScreen() {
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const preventDoublePress = usePreventDoublePress()
    const [vegMode, setVegMode] = useState(false)
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
    const [selectedAppearance, setSelectedAppearance] = useState("System Default")
    const [selectedLanguage, setSelectedLanguage] = useState("English")

    const horizontalPadding = scale(28)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 2

    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()
    const [titleHeight, setTitleHeight] = useState(TITLE_HEIGHT_FALLBACK)
    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y
        },
        onMomentumEnd: (event) => {
            const y = event.contentOffset.y
            if (y > 0 && y < titleHeight) {
                const shouldOpen = y < titleHeight / 2
                scrollTo(animatedRef, 0, shouldOpen ? 0 : titleHeight, true)
            }
        },
    })

    const headerContainerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, titleHeight],
            [0, -titleHeight],
               Extrapolation.CLAMP
        )
        return { transform: [{ translateY }] }
    })

    const headerTitleStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [0, titleHeight * 0.6],
            [1, 0],
            Extrapolation.CLAMP
        )
    }))

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <Animated.View
                className="w-full bg-[#F5F5F5] absolute left-0 right-0"
                style={[
                    {
                        paddingHorizontal: scale(14),
                        top: insets.top,
                        zIndex: 10
                    },
                    headerContainerStyle
                ]}
            >
                <Animated.View
                    style={headerTitleStyle}
                    onLayout={(e) => {
                        const h = e.nativeEvent.layout.height
                        if (h > 0 && Math.abs(h - titleHeight) > 1) {
                            setTitleHeight(h)
                        }
                    }}
                >
                    <View className="gap-1">
                        <Text
                            className="text-[#1F1F1F] font-extrabold self-start"
                            style={{
                                fontSize: moderateScale(18),
                                marginTop: verticalScale(10)
                            }}
                        >
                            My Profile
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/65 font-medium self-start"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Personalize your account and experience
                        </Text>
                    </View>
                </Animated.View>
            </Animated.View>

            <Animated.FlatList
                ref={animatedRef}
                data={[{}]}
                renderItem={null}
                onScroll={scrollHandler}
                onScrollBeginDrag={() => {
                    setOpenMenu(null)
                }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingTop: TITLE_HEIGHT_FALLBACK,
                    paddingBottom: insets.bottom + verticalScale(75)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="relative bg-[#3F2516] p-4"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => 
                                    preventDoublePress(() => {
                                        router.push('/edit-profile')
                                    })
                                }
                                className="absolute flex-row items-center justify-center gap-1 bg-[#F8D56A]"
                                style={{
                                    top: verticalScale(12),
                                    right: scale(12),
                                    paddingHorizontal: scale(9),
                                    paddingVertical: verticalScale(5),
                                    borderRadius: moderateScale(12),
                                    zIndex: 10
                                }}
                            >
                                <EditIcon width={moderateScale(13)} height={moderateScale(13)} color="#5C4639" strokeWidth={2.2} />

                                <Text
                                    className="font-bold text-[#5C4639]"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>

                            <View className="flex-row items-center gap-3">
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        width: moderateScale(74),
                                        height: moderateScale(74)
                                    }}
                                >
                                    <Image
                                        source={require("@/assets/images/profile-placeholder.jpg")}
                                        contentFit="cover"
                                        transition={200}
                                        style={{
                                            width: moderateScale(68),
                                            height: moderateScale(68),
                                            borderRadius: moderateScale(37),
                                            borderWidth: moderateScale(2),
                                            borderColor: "#FFFFFF"
                                        }}
                                    />

                                    <Pressable
                                        onPress={() => {}}
                                        className="absolute bg-white items-center justify-center rounded-full"
                                        style={{
                                            right: moderateScale(5),
                                            bottom: moderateScale(3),
                                            width: moderateScale(23),
                                            height: moderateScale(23)
                                        }}
                                    >
                                        <CameraIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" strokeWidth={2} />
                                    </Pressable>
                                </View>

                                <View
                                    className="flex-1 justify-center"
                                    style={{ paddingRight: scale(4) }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        className="text-white font-bold tracking-wide"
                                        style={{
                                            fontSize: moderateScale(16),
                                            paddingRight: scale(70)
                                        }}
                                    >
                                        Harsh Suthar
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        className="text-white/75 font-medium"
                                        style={{
                                            fontSize: moderateScale(11),
                                            marginTop: verticalScale(7)
                                        }}
                                    >
                                        +91 98765 43210
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        className="text-white/75 font-medium"
                                        style={{
                                            fontSize: moderateScale(11),
                                            marginTop: verticalScale(2)
                                        }}
                                    >
                                        harsh@email.com
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            className="flex-row items-center gap-3 bg-[#3F2516] p-4"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(12)
                            }}
                        >
                            <View
                                className="items-center justify-center rounded-full bg-[#F8D56A]"
                                style={{
                                    width: moderateScale(40),
                                    height: moderateScale(40)
                                }}
                            >
                                <PremiumBadgeIcon width={moderateScale(24)} height={moderateScale(24)} color={"#3F2516"} />
                            </View>

                            <View
                                className="flex-1 justify-center"
                                style={{ paddingRight: scale(4) }}
                            >
                                <Text
                                    numberOfLines={1}
                                    className="text-white font-semibold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        paddingRight: scale(70)
                                    }}
                                >
                                    Brothers Plus
                                </Text>

                                <Text
                                    numberOfLines={1}
                                    className="text-[#F8D56A] font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        marginTop: verticalScale(2)
                                    }}
                                >
                                    PREMIUM DELIVERY BENEFITS
                                </Text>

                                <Text
                                    numberOfLines={1}
                                    className="text-white/75 font-medium"
                                    style={{
                                        fontSize: moderateScale(9),
                                        marginTop: verticalScale(4)
                                    }}
                                >
                                    Exclusive offers, priority support & more
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => 
                                    preventDoublePress(() => {
                                        router.push('/brothers-plus')
                                    })
                                }
                                className="flex-row items-center justify-center gap-1 bg-[#F8D56A]"
                                style={{
                                    paddingStart: scale(9),
                                    paddingEnd: scale(4),
                                    paddingVertical: verticalScale(5),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="font-bold text-[#5C4639]"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Join Now
                                </Text>

                                <ArrowRightIcon width={moderateScale(13)} height={moderateScale(13)} color="#5C4639" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center gap-3 mt-5">
                            <View
                                className="flex-row items-center bg-[#FFFFFF] border border-[#1F1F1F]/10 py-4 px-3 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(60),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <View
                                    className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38)
                                    }}
                                >
                                    <WalletFilledIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} />
                                </View>

                                <View className='items-center gap-1'>
                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Brothers Wallet
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F] font-semibold self-start"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        ₹520
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => 
                                    preventDoublePress(() => {
                                        router.push('/rewards-coupons')
                                    })
                                }
                                className="flex-row items-center bg-[#FFFFFF] border border-[#1F1F1F]/10 py-4 px-3 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(60),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <View
                                    className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38)
                                    }}
                                >
                                    <CouponIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} />
                                </View>

                                <View className='items-center gap-1'>
                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Active Coupons
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F] font-semibold self-start"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        8 Available
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Preferences
                        </Text>

                        <View
                            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row items-center gap-2'>
                                <View
                                    className="items-center justify-center"
                                    style={{ width: moderateScale(24) }}
                                >
                                    <VegIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.5} />
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-medium flex-1'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Veg Mode
                                </Text>

                                <ToggleSwitch enabled={vegMode} onPress={() => setVegMode(!vegMode)} />
                            </View>

                            <View
                                className="bg-[#1F1F1F]/15"
                                style={{
                                    height: 1,
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <View className="relative">
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        setOpenMenu((prev) =>
                                            prev === "appearance" ? null : "appearance"
                                        )
                                    }
                                    className="flex-row items-center gap-2"
                                >
                                    <View
                                        className="items-center justify-center"
                                        style={{ width: moderateScale(24) }}
                                    >
                                        <PaintBoardIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F" strokeWidth={1.5} />
                                    </View>

                                    <Text
                                        className="text-[#1F1F1F] font-medium flex-1"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Appearance
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium -mr-1"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        {selectedAppearance}
                                    </Text>

                                    <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                                </TouchableOpacity>

                                {openMenu === "appearance" && (
                                    <View
                                        className="absolute right-0 bg-white border border-[#1F1F1F]/10"
                                        style={{
                                            top: "100%",
                                            marginTop: verticalScale(8),
                                            width: moderateScale(145),
                                            borderRadius: moderateScale(14),
                                            paddingVertical: verticalScale(7),
                                            zIndex: 100
                                        }}
                                    >
                                        {APPEARANCE_OPTIONS.map((option, index) => {
                                            const isSelected = selectedAppearance === option

                                            return (
                                                <React.Fragment key={option}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.9}
                                                        onPress={() => {
                                                            setSelectedAppearance(option)
                                                            setOpenMenu(null)
                                                        }}
                                                        style={{
                                                            paddingHorizontal: scale(12),
                                                            paddingVertical: verticalScale(5)
                                                        }}
                                                    >
                                                        <Text
                                                            className={
                                                                isSelected
                                                                    ? "text-[#3F2516] font-semibold"
                                                                    : "text-[#1F1F1F]/75 font-medium"
                                                            }
                                                            style={{ fontSize: moderateScale(13) }}
                                                        >
                                                            {option}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    {index !== APPEARANCE_OPTIONS.length - 1 && (
                                                        <View
                                                            className="bg-[#1F1F1F]/10"
                                                            style={{
                                                                height: 1,
                                                                marginVertical: verticalScale(2),
                                                                marginHorizontal: scale(10)
                                                            }}
                                                        />
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </View>
                                )}
                            </View>

                            <View
                                className="bg-[#1F1F1F]/15"
                                style={{
                                    height: 1,
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <View className="relative">
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() =>
                                        setOpenMenu((prev) =>
                                            prev === "language" ? null : "language"
                                        )
                                    }
                                    className="flex-row items-center gap-2"
                                >
                                    <View
                                        className="items-center justify-center"
                                        style={{ width: moderateScale(24) }}
                                    >
                                        <LanguagesIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F" strokeWidth={1.5} />
                                    </View>

                                    <Text
                                        className="text-[#1F1F1F] font-medium flex-1"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Language
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium -mr-1"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        {selectedLanguage}
                                    </Text>

                                    <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                                </TouchableOpacity>

                                {openMenu === "language" && (
                                    <View
                                        className="absolute right-0 bg-white border border-[#1F1F1F]/10"
                                        style={{
                                            top: "100%",
                                            marginTop: verticalScale(6),
                                            width: moderateScale(145),
                                            borderRadius: moderateScale(14),
                                            paddingVertical: verticalScale(7),
                                            zIndex: 100
                                        }}
                                    >
                                        {LANGUAGE_OPTIONS.map((option, index) => (
                                            <React.Fragment key={option}>
                                                <TouchableOpacity
                                                    activeOpacity={0.9}
                                                    onPress={() => {
                                                        setSelectedLanguage(option)
                                                        setOpenMenu(null)
                                                    }}
                                                    style={{
                                                        paddingHorizontal: scale(12),
                                                        paddingVertical: verticalScale(6),
                                                    }}
                                                >
                                                    <Text
                                                        className={
                                                            selectedLanguage === option
                                                                ? "text-[#3F2516] font-semibold"
                                                                : "text-[#1F1F1F]/75 font-medium"
                                                        }
                                                        style={{ fontSize: moderateScale(13) }}
                                                    >
                                                        {option}
                                                    </Text>
                                                </TouchableOpacity>

                                                {index !== LANGUAGE_OPTIONS.length - 1 && (
                                                    <View
                                                        className="bg-[#1F1F1F]/10"
                                                        style={{
                                                            height: 1,
                                                            marginVertical: verticalScale(2),
                                                            marginHorizontal: scale(10)
                                                        }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Food Delivery
                        </Text>

                        <View
                            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <ProfileMenuItem label="My orders" icon={OrderIcon} showDivider={true}
                                onPress={()=> 
                                    preventDoublePress(() => {
                                        router.push('/(tabs)/order')
                                    })
                                }
                            />

                            <ProfileMenuItem label="Saved Addresses" icon={LocationIcon} showDivider={true}
                                onPress={()=>
                                    preventDoublePress(() => {
                                        router.push('/saved-address')
                                    })
                                }
                            />

                            <ProfileMenuItem label="Favorite Restaurants" icon={HeartIcon} showDivider={true}
                                onPress={()=> 
                                    preventDoublePress(() => {
                                        router.push('/(tabs)/favourite')
                                    })
                                }
                            />

                            <ProfileMenuItem label="Favorite Foods" icon={FoodIcon} showDivider={false}
                                onPress={()=> 
                                    preventDoublePress(() => {
                                        router.push('/(tabs)/favourite')
                                    })
                                }
                            />
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Saved Information
                        </Text>

                        <View
                            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <ProfileMenuItem label="Payment Methods" icon={MoneyIcon} showDivider={true} onPress={()=> {}} />

                            <ProfileMenuItem label="Delivery Instructions" icon={NotepadTextIcon} showDivider={false} onPress={()=> {}} />
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Rewards
                        </Text>

                        <View
                            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row items-center gap-2'>
                                <View
                                    className="items-center justify-center"
                                    style={{ width: moderateScale(24) }}
                                >
                                    <MedalIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.5} />
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-medium flex-1'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Reward Points
                                </Text>

                                <Text
                                    className='text-[#5c4639] font-semibold -mr-1'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    2,450 pts
                                </Text>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>

                            <View
                                className="bg-[#1F1F1F]/15"
                                style={{
                                    height: 1,
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />

                            <ProfileMenuItem label="Membership Status" icon={StarBadgeIcon} showDivider={true} onPress={()=> {}} />

                            <ProfileMenuItem label="Referral Program" icon={ShareIcon} showDivider={false}
                                onPress={()=>
                                    preventDoublePress(() => {
                                        router.push('/refferral')
                                    })
                                }
                            />
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Support
                        </Text>

                        <View
                            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <ProfileMenuItem label="Help Center" icon={HelpCircleIcon} showDivider={true}
                                onPress={()=>
                                    preventDoublePress(() => {
                                        router.push('/help-center')
                                    })
                                }
                            />

                            <ProfileMenuItem label="Chat Support" icon={ChatIcon} showDivider={true}
                                onPress={()=>
                                    preventDoublePress(() => {
                                        router.push('/chat-support')
                                    })
                                }
                            />

                            <ProfileMenuItem label="FAQs" icon={BubbleChatQuestionIcon} showDivider={false}
                                onPress={()=>
                                    preventDoublePress(() => {
                                        router.push('/faq-screen')
                                    })
                                }
                            />
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Settings
                        </Text>

                        <View
                            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <ProfileMenuItem label="Privacy" icon={PrivacyIcon} showDivider={true} onPress={()=> {}} />

                            <ProfileMenuItem label="Security" icon={SecurityIcon} showDivider={true} onPress={()=> {}} />

                            <View className='flex-row items-center gap-2'>
                                <View
                                    className="items-center justify-center"
                                    style={{ width: moderateScale(24) }}
                                >
                                    <InformationCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.5} />
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-medium flex-1'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    App Version
                                </Text>

                                <Text
                                    className='text-[#5c4639] font-semibold -mr-1'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    v4.2.1
                                </Text>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center bg-[#3F2516] mx-2"
                            style={{
                                marginTop: verticalScale(16),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <LogoutIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} strokeWidth={1.8} />

                            <Text
                                className="text-[#FFFFFF] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                LogOut
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center bg-[#FEE2E2]/80 mx-2"
                            style={{
                                marginTop: verticalScale(16),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <DeleteIcon width={moderateScale(18)} height={moderateScale(18)} color={"#DC2626"} strokeWidth={1.8} />

                            <Text
                                className="text-[#DC2626] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    )
}