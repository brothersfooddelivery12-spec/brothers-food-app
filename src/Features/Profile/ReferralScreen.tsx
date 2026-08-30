import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BankIcon from '@/assets/icon/BankIcon.svg'
import BagIcon from '@/assets/icon/CartIcon.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import CopyIcon from '@/assets/icon/CopyIcon.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import GiftIcon from '@/assets/icon/GiftIcon.svg'
import OfferIcon from '@/assets/icon/OfferFilledIcon.svg'
import SendIcon from '@/assets/icon/SendIcon.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import UserIcon from '@/assets/icon/UserFilledIcon.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import { referralFriends } from '@/constant/referralFriends'
import * as Clipboard from "expo-clipboard"
import { Image } from 'expo-image'
import { router } from "expo-router"
import React, { useCallback } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import ReferralFriendCard from './Components/ReferralFriendCard'

const HOW_IT_WORKS = [
    {
        id: "1",
        step: "1. Share",
        description: "Share your code with friends and family.",
        icon: ShareIcon,
    },
    {
        id: "2",
        step: "2. Order",
        description: "They place their first order on Brothers.",
        icon: BagIcon,
    },
    {
        id: "3",
        step: "3. Earn",
        description: "You both get rewards instantly!",
        icon: GiftIcon,
    },
]

export default function ReferralScreen(){
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const {showToast} = useToast()

    const horizontalPadding = scale(28)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 2

    const handleCopy = async () => {
        await Clipboard.setStringAsync("YOUR_REFERRAL_CODE")

        showToast("Referral code copied!", "success")
    }

    const renderReferralFriend = useCallback(
        ({ item }: { item: any }) => (
            <ReferralFriendCard
                item={item}
            />
        ),[]
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
                    
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Refer & Earn
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Invite friends, unlock exciting rewards
                    </Text>
                </View>
            </View>

            <FlatList
                data={referralFriends}
                renderItem={renderReferralFriend}
                keyExtractor={item => item.id}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: insets.bottom + verticalScale(25)
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
                            <View className='justify-center flex-1 items-start'>
                                <View
                                    className='flex-row items-center justify-center gap-2 bg-[#F8D56A]'
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingRight: scale(8),
                                        paddingLeft: scale(6),
                                        paddingVertical: verticalScale(3)
                                    }}
                                >
                                    <CrownIcon width={moderateScale(16)} height={moderateScale(16)} color={"#3F2516"} />

                                    <Text
                                        className='text-[#3F2516] font-semibold uppercase'
                                        style={{ fontSize: moderateScale(9) }}
                                    >
                                        EXCLUSIVE OFFER
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#FFFFFF] font-extrabold ml-2'
                                    style={{
                                        fontSize: moderateScale(20),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    Refer Friends, Earn Rewards
                                </Text>

                                <Text
                                    className='text-[#FFFFFF]/75 font-normal leading-5 ml-2'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(4)
                                    }}
                                >
                                    Share the joy of fine dining with
                                    your inner circle. Bring a friend
                                    and both of you enjoy our
                                    premium rewards.
                                </Text>
                            </View>

                            <Image
                                source={require("@/assets/images/ReferIllustration.png")}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                style={{
                                    width: moderateScale(145),
                                    height: moderateScale(145)
                                }}
                            />
                        </View>

                        <View className="flex-row items-center gap-3 mt-5">
                            <View
                                className="items-center justify-center bg-[#FFFFFF] border border-[#1F1F1F]/10 py-4 px-3"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(125),
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
                                    <UserIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} />
                                </View>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium mt-2"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Your Reward
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-bold mt-1"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    You Earn ₹100
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium mt-2"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Credited after their first order
                                </Text>
                            </View>

                            <View
                                className="items-center bg-[#FFFFFF] border border-[#1F1F1F]/10 py-4 px-3"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(125),
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
                                    <OfferIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} />
                                </View>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium mt-2"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Friend's Rewards
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-bold mt-1"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Friend Gets ₹100 OFF
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium mt-2"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    On their first gourmet meal
                                </Text>
                            </View>
                        </View>

                        <View
                            className="py-6 px-8 bg-[#E5E4E2]/60 mx-2 items-center justify-center"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: moderateScale(18)
                            }}
                        >
                            <Text
                                className='text-[#1F1F1F] font-bold'
                                style={{ fontSize: moderateScale(16) }}
                            >
                                Your Personal Referral Code
                            </Text>

                            <View
                                className='bg-[#FFFFFF] w-full border border-dashed border-[#1F1F1F]/20 p-4 items-center justify-center'
                                style={{
                                    borderRadius: moderateScale(18),
                                    marginTop: verticalScale(14)
                                }}
                            >
                                <Text
                                    className='text-[#1F1F1F] font-black'
                                    style={{ fontSize: moderateScale(18), letterSpacing: 4 }}
                                >
                                    RAJ12345
                                </Text>
                            </View>

                            <View
                                className="flex-row"
                                style={{
                                    marginTop: verticalScale(18),
                                    gap: scale(12)
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={handleCopy}
                                    className="flex-1 flex-row gap-2 bg-[#3F2516] items-center justify-center"
                                    style={{
                                        borderRadius: moderateScale(28),
                                        paddingVertical: verticalScale(10),
                                        paddingHorizontal: scale(12)
                                    }}
                                >
                                    <CopyIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.8} />

                                    <Text
                                        className="text-white font-semibold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Copy
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className="flex-1 flex-row gap-2 bg-[#F8D56A] items-center justify-center"
                                    style={{
                                        borderRadius: moderateScale(28),
                                        paddingVertical: verticalScale(10),
                                        paddingHorizontal: scale(12)
                                    }}
                                >
                                    <SendIcon width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" strokeWidth={1.8} />

                                    <Text
                                        className="text-[#5C4639] font-semibold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Share
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(18),
                                marginBottom: verticalScale(8)
                            }}
                        >
                            Your Referrals
                        </Text>
                    </>
                }
                ListFooterComponent={
                    <>
                        <View
                            className="bg-[#3F2516] py-5 px-5 mx-1"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <Text
                                className="text-white/70 font-medium"
                                style={{ fontSize: moderateScale(12) }}
                            >
                                Reward Wallet
                            </Text>

                            <View
                                className="flex-row items-center gap-2"
                                style={{ marginTop: verticalScale(5) }}
                            >
                                <Text
                                    className="text-white font-black tracking-wider"
                                    style={{ fontSize: moderateScale(24) }}
                                >
                                    ₹1,250
                                </Text>

                                <CircleStarIcon width={moderateScale(23)} height={moderateScale(23)} color="#F8D56A" />
                            </View>

                            <View
                                className="flex-row items-stretch"
                                style={{
                                    marginTop: verticalScale(18),
                                    gap: scale(10)
                                }}
                            >
                                <View
                                    className="flex-1 flex-row items-center bg-white/10 border border-white/20"
                                    style={{
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(16)
                                    }}
                                >
                                    <WalletIcon width={moderateScale(22)} height={moderateScale(22)} color="#FFFFFF" />

                                    <View
                                        className="flex-1"
                                        style={{ marginLeft: scale(8) }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            className="text-white/60 font-medium"
                                            style={{ fontSize: moderateScale(10) }}
                                        >
                                            Pending Rewards
                                        </Text>

                                        <Text
                                            className="text-white font-bold tracking-wider"
                                            style={{
                                                fontSize: moderateScale(14),
                                                marginTop: verticalScale(2)
                                            }}
                                        >
                                            ₹300
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {}}
                                    className="flex-1 flex-row items-center justify-center bg-[#F8D56A]"
                                    style={{
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(16)
                                    }}
                                >
                                    <BankIcon width={moderateScale(20)} height={moderateScale(20)} color="#5C4639" strokeWidth={1.8} />

                                    <Text
                                        numberOfLines={1}
                                        className="text-[#5C4639] font-bold"
                                        style={{
                                            fontSize: moderateScale(12),
                                            marginLeft: scale(6)
                                        }}
                                    >
                                        Withdraw to Bank
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            className="bg-white border border-[#1F1F1F]/10 mx-2"
                            style={{
                                borderRadius: moderateScale(22),
                                paddingHorizontal: scale(14),
                                paddingVertical: verticalScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(12),
                                    letterSpacing: 0.8
                                }}
                            >
                                How It Works
                            </Text>

                            <View
                                className="flex-row items-start"
                                style={{ marginTop: verticalScale(15) }}
                            >
                                {HOW_IT_WORKS.map((item, index) => {
                                    const Icon = item.icon

                                    return (
                                        <React.Fragment key={item.id}>
                                            <View className="flex-1 items-center">
                                                <View
                                                    className="items-center justify-center bg-[#E8B93F]/15"
                                                    style={{
                                                        width: moderateScale(42),
                                                        height: moderateScale(42),
                                                        borderRadius: moderateScale(28)
                                                    }}
                                                >
                                                    <Icon width={moderateScale(19)} height={moderateScale(19)} color="#5C4639" strokeWidth={1.8} />
                                                </View>

                                                <Text
                                                    className="text-[#1F1F1F] font-bold text-center"
                                                    style={{
                                                        fontSize: moderateScale(12),
                                                        marginTop: verticalScale(8)
                                                    }}
                                                >
                                                    {item.step}
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F]/65 font-medium text-center"
                                                    style={{
                                                        fontSize: moderateScale(10),
                                                        lineHeight: moderateScale(13),
                                                        marginTop: verticalScale(4)
                                                    }}
                                                >
                                                    {item.description}
                                                </Text>
                                            </View>

                                            {index !== HOW_IT_WORKS.length - 1 && (
                                                <View
                                                    className="flex-row items-center overflow-hidden"
                                                    style={{
                                                        width: scale(40),
                                                        marginTop: moderateScale(21),
                                                        gap: scale(2)
                                                    }}
                                                >
                                                    {Array.from({
                                                        length: Math.floor(scale(40) / (scale(3) + scale(2))),
                                                    }).map((_, dashIndex) => (
                                                        <View
                                                            key={dashIndex}
                                                            style={{
                                                                width: scale(3),
                                                                height: 1,
                                                                backgroundColor: "rgba(31,31,31,0.18)"
                                                            }}
                                                        />
                                                    ))}
                                                </View>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center bg-[#3F2516] mx-2"
                            style={{
                                marginTop: verticalScale(20),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <SendIcon width={moderateScale(20)} height={moderateScale(20)} color={"#FFFFFF"} strokeWidth={1.8} />
                        
                            <Text
                                className="text-[#FFFFFF] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Invite Friends Now
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </SafeAreaView>
    )
}