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
import { COLORS } from '@/constant/colors'
import { getMembershipPlans, getMyMemberships, MembershipBenefit, MembershipCode, MembershipPlan, MyMembershipResponse } from '@/Services/api-service'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import BenefitCard, { BenefitItem } from './Components/BenefitCard'
import MembershipPlanModal from './Components/MembershipPlanModal'

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
    const {showToast} = useToast()

    const flatListRef = useRef<FlatList<any>>(null)
    const membershipSectionYRef = useRef(0)

    const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([])
    const [loadingPlans, setLoadingPlans] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
    const [showPlanModal, setShowPlanModal] = useState(false)

    const selectedPlan = useMemo(() => {
        return (
            membershipPlans.find(
                (plan) => plan.id === selectedPlanId
            ) ?? null
        )
    }, [membershipPlans, selectedPlanId])

    const fetchMembershipPlans = useCallback(async () => {
        try {
            setLoadingPlans(true)

            const res = await getMembershipPlans()

            console.log("Membership plans:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch membership plans", "warning")

                return
            }

            const activePlans: MembershipPlan[] = (res.data.data ?? []).filter(
                (plan: MembershipPlan) => plan.is_active
            )

            setMembershipPlans(activePlans)

            const defaultPlan = activePlans.find(
                (plan) => plan.is_default
            )

            if (defaultPlan) {
                setSelectedPlanId(defaultPlan.id)
            }
        } catch (error: any) {
            console.log("Membership plans error:", error)

            showToast(error?.message || "Unable to fetch membership plans", "warning")
        } finally {
            setLoadingPlans(false)
        }
    }, [])

    useEffect(() => {
        fetchMembershipPlans()
    }, [fetchMembershipPlans])

    const [myMembership, setMyMembership] = useState<MyMembershipResponse | null>(null)
    const [loadingMembership, setLoadingMembership] = useState(false)

    const fetchMyMembership = useCallback(async () => {
        try {
            setLoadingMembership(true)

            const res = await getMyMemberships()

            console.log("My membership:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch membership", "warning")

                return
            }

            setMyMembership(res.data.data ?? null)
        } catch (error: any) {
            console.log("My membership error:", error?.response?.data || error)

            showToast(error?.response?.data?.message || error?.message ||
                    "Unable to fetch membership", "warning"
            )
        } finally {
            setLoadingMembership(false)
        }
    }, [])

    useEffect(() => {
        fetchMyMembership()
    }, [fetchMyMembership])

    const getBenefitText = (benefit: MembershipBenefit): string | null => {
        const { benefit_code, config } = benefit

        switch (benefit_code) {
            case "DELIVERY_DISCOUNT": {
                const percentage = config.percentage ?? 0

                if (percentage <= 0) {
                    return null
                }

                if (config.max_discount) {
                    return `${percentage}% delivery discount up to ₹${config.max_discount}`
                }

                return `${percentage}% delivery discount`
            }

            case "REWARD_MULTIPLIER": {
                const multiplier = config.multiplier ?? 1

                return `${multiplier}x reward points`
            }

            case "REDUCED_ADS": {
                if (!config.enabled) {
                    return null
                }

                if (config.reduction_percentage) {
                    return `${config.reduction_percentage}% fewer ads`
                }

                return "Reduced ads"
            }

            case "PRIORITY_SUPPORT":
                return config.enabled
                    ? "Priority support"
                    : null

            case "EARLY_COUPON_ACCESS":
                return config.enabled
                    ? "Early coupon access"
                    : null

            default:
                return null
        }
    }

    const MEMBERSHIP_LEVEL: Record<MembershipCode, number> = {
        BASIC: 0,
        BHAICHARA_PLUS: 1,
        BHAICHARA_PLUS_VIP: 2
    }

    const currentMembershipCode: MembershipCode =
        myMembership?.membership.status === "ACTIVE"
            ? myMembership.plan.code
            : "BASIC"

    const hasActiveMembership =myMembership?.membership?.status === "ACTIVE"

    const currentMembershipLevel = hasActiveMembership
        ? MEMBERSHIP_LEVEL[myMembership.plan.code]
        : 0
    
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
                        Brothers Plus
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Unlock exclusive benefits and rewards
                    </Text>
                </View>
            </View>

            {loadingPlans ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        source={require("../../../assets/animations/Food_Loading2.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(125),
                            height: moderateScale(125)
                        }}
                    />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
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
                                className="px-4 py-6 items-center flex-row gap-2"
                                style={{
                                    backgroundColor: COLORS.primaryColor,
                                    borderRadius: moderateScale(22),
                                    marginTop: verticalScale(10)
                                }}
                            >
                                <View className='justify-center flex-1 items-start'>
                                    <View
                                        className='flex-row items-center justify-center gap-2'
                                        style={{
                                            backgroundColor: COLORS.accentLightColor,
                                            borderRadius: moderateScale(18),
                                            paddingRight: scale(8),
                                            paddingLeft: scale(6),
                                            paddingVertical: verticalScale(3)
                                        }}
                                    >
                                        <CrownIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryColor} />
    
                                        <Text
                                            className='font-semibold'
                                            style={{
                                                fontSize: moderateScale(9),
                                                color: COLORS.primaryColor
                                            }}
                                        >
                                            VIP MEMBERSHIP
                                        </Text>
                                    </View>
    
                                    <Text
                                        className='font-extrabold ml-2'
                                        style={{
                                            color: COLORS.primaryBackgroundColor,
                                            fontSize: moderateScale(20),
                                            marginTop: verticalScale(10)
                                        }}
                                    >
                                        Bhai Chara
                                    </Text>
    
                                    <Text
                                        className='font-normal leading-5 ml-2'
                                        style={{
                                            color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
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
                                className="mt-5 p-4"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(18),
                                    position: "relative"
                                }}
                            >
                                <View
                                    className="absolute flex-row items-center justify-center gap-1"
                                    style={{
                                        backgroundColor: COLORS.accentLightColor,
                                        top: verticalScale(12),
                                        right: scale(12),
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(3),
                                        borderRadius: moderateScale(12),
                                        zIndex: 10
                                    }}
                                >
                                    <LockIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} strokeWidth={1.8} />
    
                                    <Text
                                        className="font-semibold uppercase"
                                        style={{
                                            color: COLORS.primaryColor,
                                            fontSize: moderateScale(7),
                                            letterSpacing: 0.3
                                        }}
                                    >
                                        Locked Content
                                    </Text>
                                </View>
    
                                <View className="flex-row items-start gap-3">
                                    <View
                                        className="items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                            width: moderateScale(42),
                                            height: moderateScale(42)
                                        }}
                                    >
                                        <LockFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} />
                                    </View>
    
                                    <View
                                        className="flex-1"
                                        style={{ paddingRight: scale(38) }}
                                    >
                                        <Text
                                            className="font-bold"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(14),
                                                paddingRight: scale(58)
                                            }}
                                        >
                                            Standard Access Restricted
                                        </Text>
    
                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
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
                                                className="flex-row items-center"
                                                style={{
                                                    backgroundColor: COLORS.primaryBackgroundColor,
                                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                    borderWidth: moderateScale(0.7),
                                                    borderRadius: moderateScale(16),
                                                    paddingHorizontal: scale(10),
                                                    paddingVertical: verticalScale(10)
                                                }}
                                            >
                                                <View
                                                    className="items-center justify-center"
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                        width: moderateScale(44),
                                                        height: moderateScale(44),
                                                        borderRadius: moderateScale(14)
                                                    }}
                                                >
                                                    <Icon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                                                </View>
    
                                                <View
                                                    className="flex-1"
                                                    style={{
                                                        marginLeft: scale(10),
                                                        paddingRight: scale(8)
                                                    }}
                                                >
                                                    <Text
                                                        className="font-bold"
                                                        style={{
                                                            color: COLORS.primaryTextColor,
                                                            fontSize: moderateScale(12),
                                                            lineHeight: moderateScale(17)
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Text>
    
                                                    <Text
                                                        className="font-medium"
                                                        style={{
                                                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                                            fontSize: moderateScale(9.5),
                                                            lineHeight: moderateScale(14),
                                                            marginTop: verticalScale(2)
                                                        }}
                                                    >
                                                        {item.description}
                                                    </Text>
                                                </View>
    
                                                <View
                                                    className="items-center justify-center"
                                                    style={{
                                                        borderColor: hexToRgba(COLORS.errorBorderColor, 0.75),
                                                        borderWidth: moderateScale(0.5),
                                                        backgroundColor: hexToRgba(COLORS.dangerBackgroundColor, 0.75),
                                                        width: moderateScale(38),
                                                        height: moderateScale(38),
                                                        borderRadius: moderateScale(11),
                                                    }}
                                                >
                                                    <LockIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.dangerTextColor} strokeWidth={1.8} />
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
    
                            <View
                                onLayout={(event) => {
                                    membershipSectionYRef.current = event.nativeEvent.layout.y
                                }}
                            >
                                <Text
                                    className='font-bold text-center'
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(18),
                                        marginTop: verticalScale(24)
                                    }}
                                >
                                    Choose Your Plan
                                </Text>
        
                                <Text
                                    className='font-medium text-center'
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(4)
                                    }}
                                >
                                    {`Unlock a world of premium culinary\nexperiences`}
                                </Text>
        
                                {membershipPlans.map((plan, index) => {
                                    const planLevel = MEMBERSHIP_LEVEL[plan.code]

                                    const isCurrentPlan = hasActiveMembership && myMembership?.plan.id === plan.id
                                    const canUpgrade = hasActiveMembership && planLevel > currentMembershipLevel
                                    const canSelect = !hasActiveMembership && !plan.is_default
                                    const isDowngrade = hasActiveMembership && planLevel < currentMembershipLevel

                                    const isBasic = plan.code === "BASIC"
                                    const isPlus = plan.code === "BHAICHARA_PLUS"
                                    const isVip = plan.code === "BHAICHARA_PLUS_VIP"
        
                                    const benefits = plan.benefits
                                        .map(getBenefitText)
                                        .filter((item): item is string => !!item)
        
                                    return (
                                        <View
                                            key={plan.id}
                                            className="relative py-6 px-5 mx-2 items-center justify-center"
                                            style={{
                                                backgroundColor: isVip
                                                    ? hexToRgba(COLORS.accentColor, 0.1)
                                                    : isPlus
                                                        ? hexToRgba(COLORS.neutralSurfaceColor, 0.45)
                                                        : COLORS.secondaryBackgroundColor,
                                                borderColor: isVip
                                                    ? hexToRgba(COLORS.accentColor, 0.15)
                                                    : hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderWidth: moderateScale(0.5),
                                                borderRadius: moderateScale(22),
                                                marginTop: verticalScale(index === 0 ? 18 : 30)
                                            }}
                                        >
                                            {(isPlus || isVip) && (
                                                <View
                                                    className="absolute items-center justify-center"
                                                    style={{
                                                        backgroundColor: COLORS.accentLightColor,
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
                                                        className="font-bold uppercase"
                                                        style={{
                                                            color: COLORS.primaryColor,
                                                            fontSize: moderateScale(9),
                                                            letterSpacing: 0.3
                                                        }}
                                                    >
                                                        {isVip ? "PREMIUM" : "MOST POPULAR"}
                                                    </Text>
                                                </View>
                                            )}
        
                                            <View className="flex-row items-center justify-center w-full">
                                                <View
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.2),
                                                        height: verticalScale(0.7),
                                                        width: scale(30)
                                                    }}
                                                />
        
                                                <Text
                                                    className="font-medium uppercase"
                                                    style={{
                                                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                        fontSize: moderateScale(13),
                                                        marginHorizontal: scale(8)
                                                    }}
                                                >
                                                    {plan.name}
                                                </Text>
        
                                                <View
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.2),
                                                        height: verticalScale(0.7),
                                                        width: scale(30)
                                                    }}
                                                />
                                            </View>
        
                                            <Text
                                                className="font-extrabold tracking-wide"
                                                style={{
                                                    color: COLORS.primaryTextColor,
                                                    fontSize: moderateScale(32),
                                                    marginTop: verticalScale(10)
                                                }}
                                            >
                                                {plan.price > 0 && (
                                                    <Text
                                                        className="font-extrabold"
                                                        style={{
                                                            color: COLORS.primaryTextColor,
                                                            fontSize: moderateScale(22)
                                                        }}
                                                    >
                                                        ₹
                                                    </Text>
                                                )}
        
                                                {plan.price === 0
                                                    ? "Free"
                                                    : plan.price
                                                }
                                            </Text>
        
                                            {plan.duration_days && (
                                                <Text
                                                    className="font-medium"
                                                    style={{
                                                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                        fontSize: moderateScale(11),
                                                        marginTop: verticalScale(2)
                                                    }}
                                                >
                                                    for {plan.duration_days} days
                                                </Text>
                                            )}
        
                                            <Text
                                                className="font-medium text-center"
                                                style={{
                                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                                    fontSize: moderateScale(11),
                                                    marginTop: verticalScale(8),
                                                    paddingHorizontal: scale(10)
                                                }}
                                            >
                                                {plan.description}
                                            </Text>
        
                                            <View
                                                className="items-center"
                                                style={{ marginTop: verticalScale(12) }}
                                            >
                                                <View className="items-start">
                                                    {benefits.map((benefit) => (
                                                        <View
                                                            key={benefit}
                                                            className="flex-row gap-2 items-center"
                                                            style={{marginTop: verticalScale(7)  }}
                                                        >
                                                            <CheckCircleIcon
                                                                width={moderateScale(17)}
                                                                height={moderateScale(17)}
                                                                color={COLORS.activeStatusTextColor}
                                                            />

                                                            <Text
                                                                className="font-medium"
                                                                style={{
                                                                    fontSize: moderateScale(12),
                                                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                                                }}
                                                            >
                                                                {benefit}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                                
                                            {!isBasic && (isCurrentPlan || canUpgrade || canSelect) && (
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => {
                                                        if(!canUpgrade) {
                                                            return
                                                        }
                                                        
                                                        setSelectedPlanId(plan.id)
                                                        setShowPlanModal(true)
                                                    }}
                                                    className="w-full items-center justify-center"
                                                    style={{
                                                        backgroundColor: COLORS.primaryColor,
                                                        marginTop: verticalScale(20),
                                                        borderRadius: moderateScale(28),
                                                        paddingVertical: verticalScale(14)
                                                    }}
                                                >
                                                    <Text
                                                        className="font-semibold"
                                                        style={{
                                                            fontSize: moderateScale(14),
                                                            color: COLORS.primaryBackgroundColor
                                                        }}
                                                    >
                                                        {isCurrentPlan
                                                            ? "Current Plan"
                                                            : canUpgrade
                                                                ? "Upgrade Plan"
                                                                : "Select Plan"
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )
                                })}
                            </View>
    
                            <Text
                                className='font-semibold text-center'
                                style={{
                                    color: COLORS.primaryTextColor,
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
                                    className="items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(56),
                                        height: moderateScale(56)
                                    }}
                                >
                                    <VerifyIcon width={moderateScale(28)} height={moderateScale(28)} color={COLORS.secondaryColor} />
                                </View>
                            </View>
    
                            <Text
                                className='font-bold text-center'
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(16),
                                    marginTop: verticalScale(8)
                                }}
                            >
                                Brothers Verified
                            </Text>
    
                            <Text
                                className='font-medium text-center'
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                    fontSize: moderateScale(12),
                                    marginTop: verticalScale(4)
                                }}
                            >  
                                Our membership program is built on a decade{"\n"}
                                of culinary excellence and trusted service.
                            </Text>
    
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {
                                    flatListRef.current?.scrollToOffset({
                                        offset: Math.max(membershipSectionYRef.current - verticalScale(15), 0),
                                        animated: true
                                    })
                                }}
                                className="flex-row gap-2 items-center justify-center mx-2"
                                style={{
                                    backgroundColor: COLORS.primaryColor,
                                    marginTop: verticalScale(20),
                                    borderRadius: moderateScale(28),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(14)
                                }}
                            >
                                <StarBadgeIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />
                            
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    Become a Plus Member
                                </Text>
                            </TouchableOpacity>
                        </>
                    }
                />
            )}

            {showPlanModal && (
                <MembershipPlanModal
                    visible={showPlanModal}
                    plan={selectedPlan}
                    onCancel={() => {
                        setShowPlanModal(false)
                    }}
                    onSuccess={async () => {
                        setShowPlanModal(false)

                        await Promise.all([
                            fetchMembershipPlans(),
                            fetchMyMembership()
                        ])
                    }}
                />
            )}
        </SafeAreaView>
    )
}