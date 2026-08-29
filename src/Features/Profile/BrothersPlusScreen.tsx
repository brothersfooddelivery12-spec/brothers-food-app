import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ChatIcon from '@/assets/icon/ChatIcon.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import HeadphoneIcon from '@/assets/icon/CustomerServiceIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import SupportIcon from '@/assets/icon/HeadsetFilledIcon.svg'
import SpeedIcon from '@/assets/icon/LimitationIcon.svg'
import LockFilledIcon from '@/assets/icon/LockFilledIcon.svg'
import LockIcon from '@/assets/icon/LockIcon.svg'
import TagIcon from '@/assets/icon/OfferFilledIcon.svg'
import StarOutlineIcon from '@/assets/icon/RatingIcon3.svg'
import VerifyIcon from '@/assets/icon/SecurityIcon.svg'
import StarBadgeIcon from '@/assets/icon/StarBadgeIcon.svg'
import CheckCircleIcon from '@/assets/icon/SuccessIcon2.svg'
import ProfileIcon from '@/assets/icon/UserIcon.svg'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import BenefitCard, { BenefitItem } from './Components/BenefitCard'

const MEMBERSHIP_BENEFITS: BenefitItem[] = [
    {
        id: "1",
        title: "Free Delivery",
        description:
            "Unlimited free shipping on all orders above ₹199.",
        icon: DeliveryIcon,
        size: 28
    },
    {
        id: "2",
        title: "Priority Support",
        description:
            "Jump the queue with 24/7 dedicated assistance.",
        icon: SupportIcon,
        size: 26
    },
    {
        id: "3",
        title: "Double Points",
        description:
            "Earn 2x rewards on every purchase you make.",
        icon: CircleStarIcon,
        size: 38
    },
    {
        id: "4",
        title: "VIP Offers",
        description:
            "Unlock access to member-only menus and deals.",
        icon: TagIcon,
        size: 32
    },
]

export const LOCKED_MEMBERSHIP_FEATURES = [
    {
        id: "1",
        title: "Rider Profile & Performance History",
        description:
            "View your profile details and past performance insights.",
        icon: ProfileIcon
    },
    {
        id: "2",
        title: "Real-time Safety Ratings",
        description:
            "Check live safety ratings from customers and platform.",
        icon: StarOutlineIcon
    },
    {
        id: "3",
        title: "Live Traffic & Precision ETA Information",
        description:
            "Access live traffic updates and precise ETA for better planning.",
        icon: SpeedIcon
    },
    {
        id: "4",
        title: "Direct Rider Chat & Media Sharing",
        description:
            "Chat directly with riders and share photos or documents securely.",
        icon: ChatIcon
    },
    {
        id: "5",
        title: "24/7 Premium Dispute Support",
        description:
            "Get priority support and faster resolution for your disputes.",
        icon: HeadphoneIcon
    }
]

export default function BrothersPlusScreen(){
    const insets = useSafeAreaInsets()

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
                        Brothers Plus
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Unlock exclusive benefits and rewards
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
                    paddingBottom: insets.bottom + verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <View
                            className="bg-[#3F2516] px-4 py-6 items-center flex-row gap-2"
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
                                        className='text-[#3F2516] font-semibold'
                                        style={{ fontSize: moderateScale(9) }}
                                    >
                                        VIP MEMBERSHIP
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#FFFFFF] font-extrabold ml-2'
                                    style={{
                                        fontSize: moderateScale(20),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    Bhai Chara
                                </Text>

                                <Text
                                    className='text-[#FFFFFF]/75 font-normal leading-5 ml-2'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(4)
                                    }}
                                >
                                    Unlimited savings, faster deliveries
                                    and exclusive member benefits
                                    designed for the epicurean elite.
                                </Text>
                            </View>

                            <Image
                                source={require("@/assets/images/BrothersPlusIllustration.png")}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                style={{
                                    width: moderateScale(125),
                                    height: moderateScale(125)
                                }}
                            />
                        </View>

                        <View
                            className="mt-5 p-4 bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18),
                                position: "relative"
                            }}
                        >
                            <View
                                className="absolute flex-row items-center justify-center gap-1 bg-[#F8D56A]"
                                style={{
                                    top: verticalScale(12),
                                    right: scale(12),
                                    paddingHorizontal: scale(8),
                                    paddingVertical: verticalScale(3),
                                    borderRadius: moderateScale(12),
                                    zIndex: 10
                                }}
                            >
                                <LockIcon width={moderateScale(14)} height={moderateScale(14)} color="#3F2516" strokeWidth={1.8} />

                                <Text
                                    className="text-[#3F2516] font-semibold uppercase"
                                    style={{
                                        fontSize: moderateScale(7),
                                        letterSpacing: 0.3
                                    }}
                                >
                                    Locked Content
                                </Text>
                            </View>

                            <View className="flex-row items-start gap-3">
                                <View
                                    className="items-center justify-center rounded-full bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <LockFilledIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" />
                                </View>

                                <View
                                    className="flex-1"
                                    style={{ paddingRight: scale(38) }}
                                >
                                    <Text
                                        className="text-[#1F1F1F] font-bold"
                                        style={{ fontSize: moderateScale(14), paddingRight: scale(58) }}
                                    >
                                        Standard Access Restricted
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{
                                            fontSize: moderateScale(10),
                                            lineHeight: moderateScale(15),
                                            marginTop: verticalScale(4)
                                        }}
                                    >
                                        Upgrade your access to unlock advanced rider features and
                                        insights.
                                    </Text>
                                </View>
                            </View>
                                
                            <View
                                style={{
                                    marginTop: verticalScale(14),
                                    gap: verticalScale(10)
                                }}
                            >
                                {LOCKED_MEMBERSHIP_FEATURES.map((item) => {
                                    const Icon = item.icon

                                    return (
                                        <View
                                            key={item.id}
                                            className="flex-row items-center bg-white border border-[#1F1F1F]/10"
                                            style={{
                                                borderRadius: moderateScale(16),
                                                paddingHorizontal: scale(10),
                                                paddingVertical: verticalScale(10)
                                            }}
                                        >
                                            <View
                                                className="items-center justify-center bg-[#E8B93F]/15"
                                                style={{
                                                    width: moderateScale(44),
                                                    height: moderateScale(44),
                                                    borderRadius: moderateScale(14)
                                                }}
                                            >
                                                <Icon width={moderateScale(22)} height={moderateScale(22)} color="#3F2516" strokeWidth={1.8} />
                                            </View>

                                            <View
                                                className="flex-1"
                                                style={{
                                                    marginLeft: scale(10),
                                                    paddingRight: scale(8)
                                                }}
                                            >
                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{
                                                        fontSize: moderateScale(12),
                                                        lineHeight: moderateScale(17)
                                                    }}
                                                >
                                                    {item.title}
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F]/75 font-medium"
                                                    style={{
                                                        fontSize: moderateScale(9.5),
                                                        lineHeight: moderateScale(14),
                                                        marginTop: verticalScale(2)
                                                    }}
                                                >
                                                    {item.description}
                                                </Text>
                                            </View>

                                            <View
                                                className="items-center justify-center border border-[#EF4444]/30 bg-[#EF4444]/5"
                                                style={{
                                                    width: moderateScale(38),
                                                    height: moderateScale(38),
                                                    borderRadius: moderateScale(11),
                                                }}
                                            >
                                                <LockIcon width={moderateScale(18)} height={moderateScale(18)} color="#EF4444" strokeWidth={1.8} />
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-bold text-center'
                            style={{
                                fontSize: moderateScale(18),
                                marginTop: verticalScale(24)
                            }}
                        >
                            Choose Your Plan
                        </Text>

                        <Text
                            className='text-[#1F1F1F]/75 font-medium text-center'
                            style={{
                                fontSize: moderateScale(12),
                                marginTop: verticalScale(4)
                            }}
                        >
                            {`Unlock a world of premium culinary\nexperiences`}
                        </Text>

                        <View
                            className="py-6 px-5 bg-[#E5E4E2]/60 mx-2 items-center justify-center"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: moderateScale(18)
                            }}
                        >
                            <View className="flex-row items-center  justify-center w-full">
                                <View
                                    className="bg-[#1F1F1F]/20"
                                    style={{
                                        height: verticalScale(0.7),
                                        width: scale(30)
                                    }}
                                />

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium uppercase"
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginHorizontal: scale(8)
                                    }}
                                >
                                    Monthly
                                </Text>

                                <View
                                    className="bg-[#1F1F1F]/20"
                                    style={{
                                        height: verticalScale(0.7),
                                        width: scale(30)
                                    }}
                                />
                            </View>

                            <Text
                                className='text-[#1F1F1F] font-extrabold tracking-wide'
                                style={{
                                    fontSize: moderateScale(32),
                                    marginTop: verticalScale(10)
                                }}
                            >
                                <Text
                                    className='text-[#1F1F1F] font-extrabold'
                                    style={{
                                        fontSize: moderateScale(22)
                                    }}
                                >
                                    ₹
                                </Text>

                                99
                            </Text>

                            <View className='flex-row gap-2 justify-center items-center mt-3'>
                                <CheckCircleIcon width={moderateScale(18)} height={moderateScale(18)} color={"#4d9151"} />

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{
                                        fontSize: moderateScale(12)
                                    }}
                                >
                                    Free Delivery
                                </Text>
                            </View>

                            <View className='flex-row gap-2 justify-center items-center mt-2'>
                                <CheckCircleIcon width={moderateScale(18)} height={moderateScale(18)} color={"#4d9151"} />

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{
                                        fontSize: moderateScale(12)
                                    }}
                                >
                                    All Benefits
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="w-full items-center justify-center bg-[#3F2516] mx-2"
                                style={{
                                    marginTop: verticalScale(20),
                                    borderRadius: moderateScale(28),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(14)
                                }}
                            >
                                <Text
                                    className="text-[#FFFFFF] font-semibold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Select Plan
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            className="relative py-6 px-5 bg-white border border-[#1F1F1F]/15 mx-2 items-center justify-center"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(30)
                            }}
                        >
                            <View
                                className="absolute bg-[#F8D56A] items-center justify-center"
                                style={{
                                    top: 0,
                                    alignSelf: "center",
                                    transform: [
                                        {
                                            translateY: -verticalScale(8)
                                        }
                                    ],
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(20),
                                    zIndex: 10
                                }}
                            >
                                <Text
                                    className="text-[#5C4639] font-bold uppercase"
                                    style={{ fontSize: moderateScale(9) }}
                                >
                                    Most Popular
                                </Text>
                            </View>

                            <View className="flex-row items-center  justify-center w-full">
                                <View
                                    className="bg-[#1F1F1F]/20"
                                    style={{
                                        height: verticalScale(0.7),
                                        width: scale(30)
                                    }}
                                />

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium uppercase"
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginHorizontal: scale(8)
                                    }}
                                >
                                    Quarterly
                                </Text>

                                <View
                                    className="bg-[#1F1F1F]/20"
                                    style={{
                                        height: verticalScale(0.7),
                                        width: scale(30)
                                    }}
                                />
                            </View>

                            <Text
                                className="text-[#1F1F1F] font-extrabold tracking-wide"
                                style={{
                                    fontSize: moderateScale(32),
                                    marginTop: verticalScale(10)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(22) }}
                                >
                                    ₹
                                </Text>
                                249
                            </Text>

                            <Text
                                className="text-[#4D9151] font-medium"
                                style={{ fontSize: moderateScale(12) }}
                            >
                                Save 15%
                            </Text>

                            <View className="items-start mt-3">
                                {[
                                    "Free Delivery",
                                    "VIP Support",
                                    "Exclusive Offers"
                                ].map((benefit) => (
                                    <View
                                        key={benefit}
                                        className="flex-row gap-2 items-center"
                                        style={{ marginTop: verticalScale(7) }}
                                    >
                                        <CheckCircleIcon width={moderateScale(16)} height={moderateScale(16)} color="#4D9151" />

                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            {benefit}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="w-full items-center justify-center bg-[#3F2516]"
                                style={{
                                    marginTop: verticalScale(20),
                                    borderRadius: moderateScale(28),
                                    paddingVertical: verticalScale(14)
                                }}
                            >
                                <Text
                                    className="text-white font-semibold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Select Plan
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            className="relative py-6 px-5 bg-[#E8B93F]/10 border border-[#E8B93F]/15 mx-2 items-center justify-center"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(30)
                            }}
                        >
                            <View
                                className="absolute bg-[#F8D56A] items-center justify-center"
                                style={{
                                    top: 0,
                                    alignSelf: "center",
                                    transform: [
                                        {
                                            translateY: -verticalScale(8)
                                        }
                                    ],
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(20),
                                    zIndex: 10
                                }}
                            >
                                <Text
                                    className="text-[#3F2516] font-bold uppercase"
                                    style={{
                                        fontSize: moderateScale(9),
                                        letterSpacing: 0.3
                                    }}
                                >
                                    YEARLY SAVER
                                </Text>
                            </View>
                            
                            <View className="flex-row items-center  justify-center w-full">
                                <View
                                    className="bg-[#1F1F1F]/20"
                                    style={{
                                        height: verticalScale(0.7),
                                        width: scale(30)
                                    }}
                                />

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium uppercase"
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginHorizontal: scale(8)
                                    }}
                                >
                                    Yearly
                                </Text>

                                <View
                                    className="bg-[#1F1F1F]/20"
                                    style={{
                                        height: verticalScale(0.7),
                                        width: scale(30)
                                    }}
                                />
                            </View>

                            <Text
                                className="text-[#1F1F1F] font-extrabold tracking-wide"
                                style={{
                                    fontSize: moderateScale(32),
                                    marginTop: verticalScale(10)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(22) }}
                                >
                                    ₹
                                </Text>

                                799
                            </Text>

                            <Text
                                className="text-[#4D9151] font-semibold"
                                style={{ fontSize: moderateScale(12) }}
                            >
                                Save 35%
                            </Text>

                            <View
                                className="items-start"
                                style={{ marginTop: verticalScale(10) }}
                            >
                                {[
                                    "Best Value Plan",
                                    "Year-round Savings",
                                    "Golden Access"
                                ].map((benefit) => (
                                    <View
                                        key={benefit}
                                        className="flex-row gap-2 items-center"
                                        style={{
                                            marginTop: verticalScale(7),
                                        }}
                                    >
                                        <CheckCircleIcon width={moderateScale(18)} height={moderateScale(18)} color="#4D9151" />

                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            {benefit}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="w-full items-center justify-center bg-[#3F2516]"
                                style={{
                                    marginTop: verticalScale(20),
                                    borderRadius: moderateScale(28),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(14)
                                }}
                            >
                                <Text
                                    className="text-white font-semibold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Select Plan
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-semibold text-center'
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(22)
                            }}
                        >
                            Membership Privileges
                        </Text>

                        <View
                            className="flex-row flex-wrap justify-between mx-2"
                            style={{
                                gap: moderateScale(12),
                                marginTop: verticalScale(16)
                            }}
                        >
                            {MEMBERSHIP_BENEFITS.map((item) => (
                                <BenefitCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </View>

                        {/* <View
                            className="p-4 bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <Text
                                className='text-[#1F1F1F] font-bold ml-2 mt-1'
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Calculate Your Savings
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium mt-2 ml-2'
                                style={{ fontSize: moderateScale(12) }}
                            >
                                See how much you would have saved
                                on your last 10 orders.
                            </Text>

                            <View
                                className="flex-row gap-4"
                                style={{ marginTop: verticalScale(12) }}
                            >
                                <View
                                    className="flex-1 bg-[#3F2516] p-4"
                                    style={{ borderRadius: moderateScale(16) }}
                                >
                                    <Text
                                        className="text-white/75 font-semibold"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Estimated Monthly Savings
                                    </Text>

                                    <Text
                                        className="text-white font-bold mt-2"
                                        style={{ fontSize: moderateScale(18) }}
                                    >
                                        ₹450
                                    </Text>
                                </View>

                                <View
                                    className="flex-1 bg-[#F8D56A] p-4"
                                    style={{ borderRadius: moderateScale(16) }}
                                >
                                    <Text
                                        className="text-[#5C4639]/95 font-semibold"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Estimated Yearly Savings
                                    </Text>

                                    <Text
                                        className="text-[#5C4639] font-bold mt-2"
                                        style={{ fontSize: moderateScale(18) }}
                                    >
                                        ₹5,400
                                    </Text>
                                </View>
                            </View>
                        </View> */}

                        <View className='mt-10 w-full justify-center items-center'>
                            <View
                                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                style={{
                                    width: moderateScale(56),
                                    height: moderateScale(56)
                                }}
                            >
                                <VerifyIcon width={moderateScale(28)} height={moderateScale(28)} color="#5c4639" />
                            </View>
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-bold text-center'
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(8)
                            }}
                        >
                            Brothers Verified
                        </Text>

                        <Text
                            className='text-[#1F1F1F]/75 font-medium text-center'
                            style={{
                                fontSize: moderateScale(12),
                                marginTop: verticalScale(4)
                            }}
                        >  
                            Our membership program is built on a decade{"\n"}
                            of culinary excellence and trusted service.
                        </Text>

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
                            <StarBadgeIcon width={moderateScale(20)} height={moderateScale(20)} color={"#FFFFFF"} strokeWidth={1.8} />
                        
                            <Text
                                className="text-[#FFFFFF] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Become a Plus Member
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </SafeAreaView>
    )
}