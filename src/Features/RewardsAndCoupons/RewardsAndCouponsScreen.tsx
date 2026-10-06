import ReferIcon from '@/assets/icon/AddUserFilledIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BirthdayIcon from '@/assets/icon/CakeIcon.svg'
import ReviewIcon from '@/assets/icon/ChatFilledIcon.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import CompassIcon from '@/assets/icon/CompassIcon.svg'
import CouponIcon from '@/assets/icon/CouponFilledIcon.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import DateIcon from '@/assets/icon/DateIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import DiamondIcon from '@/assets/icon/DiamondIcon.svg'
import GiftIcon from '@/assets/icon/GiftFilledIcon.svg'
import LeafIcon from '@/assets/icon/LeafIcon.svg'
import ChallengeIcon from '@/assets/icon/MedalFilledIcon.svg'
import MoneyFilledIcon from '@/assets/icon/MoneyFilledIcon.svg'
import RefreshIcon from '@/assets/icon/RefundIcon.svg'
import RobotIcon from '@/assets/icon/RobotIcon.svg'
import PremiumBadgeIcon from '@/assets/icon/StarBadgeFilledIcon.svg'
import { default as FoodIcon, default as UtensilsIcon } from '@/assets/icon/UtensilIcon2.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import SearchBar from '@/components/SearchBar'
import { Coupon, getAvailableCoupons, getCoupons } from '@/Services/api-service'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import CouponCard, { CouponItem } from './Components/CouponCard'
import LoyaltyProgress from './Components/LoyaltyProgress'
import RewardActionsList from './Components/RewardActionsList'
import RewardAndCouponTabs from './Components/RewardAndCouponTabs'
import RewardCouponCard from './Components/RewardCouponCard'
import RewardStatsGrid from './Components/RewardStatsGrid'

const UPCOMING_EVENTS = [
    {
        id: "1",
        imageUrl: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1788079370/UpcomingEvent01_yawg59.png"
    },
    {
        id: "2",
        imageUrl: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1788079368/UpcomingEvent02_tzp5cp.png"
    },
    {
        id: "3",
        imageUrl: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1788079368/UpcomingEvent03_xhzele.png"
    },
    {
        id: "4",
        imageUrl: "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1788079368/ChatGPT_Image_Aug_30_2026_02_07_06_PM_ukhbqw.png"
    }
]

const REWARD_STATS = [
    {
        id: "1",
        title: "Reward Points",
        value: "2,450",
        icon: GiftIcon,
        size: 22
    },
    {
        id: "2",
        title: "Lifetime Points",
        value: "12,580",
        icon: CircleStarIcon,
        size: 25
    },
    {
        id: "3",
        title: "Points Redeemed",
        value: "8,300",
        icon: RefreshIcon,
        size: 21
    },
    {
        id: "4",
        title: "Available Cashback",
        value: "₹250",
        icon: WalletIcon,
        size: 22
    }
]

const rewardActions = [
    {
        id: "order_food",
        title: "Order Food",
        description: "+10 pts per ₹100 spent",
        badge: "Always Active",
        icon: FoodIcon,
    },
    {
        id: "write_review",
        title: "Write Review",
        description: "+50 pts per review",
        icon: ReviewIcon,
    },
    {
        id: "refer_friend",
        title: "Refer Friend",
        description: "+100 pts per referral",
        icon: ReferIcon,
    },
    {
        id: "birthday_bonus",
        title: "Birthday Bonus",
        description: "+250 pts on your day",
        icon: BirthdayIcon,
    },
    {
        id: "complete_challenges",
        title: "Complete Challenges",
        description: "+500 pts for milestones",
        icon: ChallengeIcon,
    }
]

const brothersPlus = {
    id: "brothers_plus",
    title: "Brothers Plus",
    description: "Earn 2x points on all",
    icon: PremiumBadgeIcon,
}

const COUPONS_CATEGORIES = [
    {
        id: "1",
        title: "All",
        icon: null
    },
    {
        id: "2",
        title: "Food",
        icon: FoodIcon
    },
    {
        id: "3",
        title: "Delivery",
        icon: DeliveryIcon
    },
    {
        id: "4",
        title: "Cashback",
        icon: MoneyFilledIcon
    }
]

const LOYALTY_TIERS = [
    {
        id: "1",
        title: "Bronze",
        subtitle: "Foodie",
        icon: LeafIcon,

        iconColor: "#FF6B1A",
        borderColor: "rgba(255, 107, 26, 0.40)",
        backgroundColor: "rgba(255, 107, 26, 0.08)",

        disabled: false,
    },
    {
        id: "2",
        title: "Silver",
        subtitle: "Explorer",
        icon: CompassIcon,

        iconColor: "#6E7F99",
        borderColor: "rgba(110, 127, 153, 0.40)",
        backgroundColor: "rgba(110, 127, 153, 0.08)",

        disabled: false,
    },
    {
        id: "3",
        title: "Gold",
        subtitle: "Gourmet",
        icon: UtensilsIcon,

        iconColor: "#C58A00",
        borderColor: "rgba(197, 138, 0, 0.40)",
        backgroundColor: "rgba(197, 138, 0, 0.08)",

        disabled: false,
    },
    {
        id: "4",
        title: "Platinum",
        subtitle: "VIP",
        icon: DiamondIcon,

        iconColor: "#B889E8",
        borderColor: "rgba(184, 137, 232, 0.40)",
        backgroundColor: "rgba(184, 137, 232, 0.08)",

        disabled: true,
    },
]

export type RedeemItem = {
    id: string
    title: string
    description: string
    points: number
    image: any
}

export const REDEEM_ITEMS: RedeemItem[] = [
    {
        id: "1",
        title: "Cashback Voucher",
        description: "Flat ₹50 discount on orders above ₹400",
        points: 500,
        image: require("@/assets/images/ReedeemPointsIllustration.png"),
    },
    {
        id: "2",
        title: "Free Delivery",
        description: "Enjoy free delivery on your next eligible order",
        points: 350,
        image: require("@/assets/images/ReedeemPointsIllustration.png"),
    },
    {
        id: "3",
        title: "₹100 Off",
        description: "Get ₹100 off on orders above ₹699",
        points: 850,
        image: require("@/assets/images/ReedeemPointsIllustration.png"),
    },
]

export default function RewardsAndCouponsScreen(){
    const insets = useSafeAreaInsets()
    const {showToast} = useToast()

    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("1")

    const params = useLocalSearchParams<{
        tab?: "rewards" | "coupons"
        section?: "redeem" | "purchase"
    }>()
    
    const [activeTab, setActiveTab] = useState<"rewards" | "coupons">(
        params.tab === "coupons" ? "coupons" : "rewards"
    )

    const rewardsListRef = useRef<FlatList>(null)
    const [redeemSectionY, setRedeemSectionY] = useState<number | null>(null)
    const [purchaseSectionY, setPurchaseSectionY] = useState<number | null>(null)

    useEffect(() => {
        if (params.tab !== "rewards" || activeTab !== "rewards") {
            return
        }

        let sectionY: number | null = null

        if (params.section === "redeem") {
            sectionY = redeemSectionY
        }

        if (params.section === "purchase") {
            sectionY = purchaseSectionY
        }

        if (sectionY === null) {
            return
        }

        requestAnimationFrame(() => {
            rewardsListRef.current?.scrollToOffset({
                offset: Math.max(0, sectionY - verticalScale(12)),
                animated: true
            })
        })
    }, [
        params.tab,
        params.section,
        activeTab,
        redeemSectionY,
        purchaseSectionY
    ])

    const [rewardCoupons, setRewardCoupons] = useState<Coupon[]>([])
    const [moneyCoupons, setMoneyCoupons] = useState<Coupon[]>([])
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])

    const [loadingRewardCoupons, setLoadingRewardCoupons] = useState(false)
    const [loadingAvailableCoupons, setLoadingAvailableCoupons] = useState(false)

    const [rewardCouponsLoaded, setRewardCouponsLoaded] = useState(false)
    const [availableCouponsLoaded, setAvailableCouponsLoaded] = useState(false)

    const fetchingRewardsRef = useRef(false)
    const fetchingAvailableRef = useRef(false)

    const fetchCouponsByTab = useCallback(async (tab: "rewards" | "coupons") => {
        if (tab === "rewards") {
            if (fetchingRewardsRef.current) {
                return
            }

            try {
                fetchingRewardsRef.current = true
                setLoadingRewardCoupons(true)

                const res = await getCoupons(0, 50)

                console.log("Reward coupons response:", res.data)

                if (!res.data.success) {
                    showToast(res.data.message || "Unable to fetch reward coupons", "warning")

                    return
                }

                const data: Coupon[] = res.data.data ?? []

                const rewards = data.filter(item => item.purchase_method === "REWARD_POINTS")

                const money = data.filter(item => item.purchase_method === "MONEY")

                setRewardCoupons(rewards)
                setMoneyCoupons(money)

                setRewardCouponsLoaded(true)
            } catch (error: any) {
                console.log("Reward coupons error:", error)

                showToast(error?.response?.data?.message || error?.message ||
                    "Unable to fetch reward coupons",
                    "warning"
                )
            } finally {
                fetchingRewardsRef.current = false
                setLoadingRewardCoupons(false)
            }

            return
        }

        if (fetchingAvailableRef.current) {
            return
        }

        try {
            fetchingAvailableRef.current = true
            setLoadingAvailableCoupons(true)

            const res = await getAvailableCoupons()

            console.log("Available coupons response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch available coupons", "warning")

                return
            }

            setAvailableCoupons(res.data.data ?? [])

            setAvailableCouponsLoaded(true)
        } catch (error: any) {
            console.log("Available coupons error:", error)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to fetch available coupons",
                "warning"
            )
        } finally {
            fetchingAvailableRef.current = false
            setLoadingAvailableCoupons(false)
        }
    },[])

    const mapAvailableCoupon = (coupon: Coupon): CouponItem => {
        const validTo = new Date(coupon.valid_to)

        const formattedExpiry =
            validTo.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )

        return {
            id: coupon.id,
            code: coupon.code,
            title: coupon.title,
            description: coupon.description,
            note: `Valid until ${formattedExpiry}`,
            noteType: "expiry",
            featured: coupon.purchase_method === "FREE",
            purchaseMethod: coupon.purchase_method,
            pointsRequired: coupon.points_required,
            moneyPrice: Number(coupon.money_price)
        }
    }

    useEffect(() => {
        fetchCouponsByTab(activeTab)
    }, [activeTab, fetchCouponsByTab])

    const handleRedeemCoupon = useCallback((coupon: Coupon) => {
        if (coupon.purchase_method !== "REWARD_POINTS") {
            return
        }

        console.log("Redeem coupon:", coupon.id)

        console.log("Points required:", coupon.points_required)

        // call redeem API here
    },[])

    const handlePurchaseCoupon = useCallback((coupon: Coupon) => {
        if (coupon.purchase_method !== "MONEY") {
            return
        }

        console.log("Purchase coupon:", coupon.id)

        console.log("Price:", coupon.money_price)

        // create payment / purchase API here
    },[])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])
    
    return(
        <SafeAreaView className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
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
                    className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10 rounded-full"
                    style={{
                        borderWidth: moderateScale(0.5),
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
                        Rewards & Coupons
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Explore your rewards and available coupons.
                    </Text>
                </View>
            </View>

            <FlatList
                ref={rewardsListRef}
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
                            className="bg-[#3F2516] px-4 py-4 items-center flex-row gap-2"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1 items-start'>
                                <View
                                    className='flex-row items-center justify-center gap-1 bg-[#F8D56A]'
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingRight: scale(6),
                                        paddingLeft: scale(4),
                                        paddingVertical: verticalScale(1)
                                    }}
                                >
                                    <CircleStarIcon width={moderateScale(19)} height={moderateScale(19)} color={"#3F2516"} />

                                    <Text
                                        className='text-[#3F2516] font-semibold uppercase'
                                        style={{ fontSize: moderateScale(9) }}
                                    >
                                        Brothers rewards
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#FFFFFF]/80 font-normal ml-2'
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    Current Balance
                                </Text>

                                <Text
                                    className='text-[#FFFFFF] tracking-wider font-black ml-2'
                                    style={{
                                        fontSize: moderateScale(28),
                                        marginTop: verticalScale(2)
                                    }}
                                >
                                    2,450

                                    <Text
                                        className='text-[#F8D56A] font-medium self-end'
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        {" "}Points
                                    </Text>
                                </Text>
                                
                                <View className='flex-row justify-center mt-4 gap-3'>
                                    <View
                                        className='flex-row items-center justify-center gap-1 bg-[#FFFFFF]/20'
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingRight: scale(6),
                                            paddingLeft: scale(4),
                                            paddingVertical: verticalScale(1)
                                        }}
                                    >
                                        <CrownIcon width={moderateScale(19)} height={moderateScale(19)} color={"rgba(248, 213, 106, 0.80)"} />

                                        <Text
                                            className='text-[#FFFFFF] font-semibold'
                                            style={{ fontSize: moderateScale(9) }}
                                        >
                                            Gold Member
                                        </Text>
                                    </View>

                                    <View
                                        className='flex-row items-center justify-center bg-[#FFFFFF]/20'
                                        style={{
                                            gap: moderateScale(4),
                                            borderRadius: moderateScale(18),
                                            paddingRight: scale(8),
                                            paddingLeft: scale(5),
                                            paddingVertical: verticalScale(1)
                                        }}
                                    >
                                        <DateIcon width={moderateScale(16)} height={moderateScale(16)} color={"rgba(248, 213, 106, 0.80)"} />

                                        <Text
                                            className='text-[#FFFFFF] font-semibold'
                                            style={{ fontSize: moderateScale(9) }}
                                        >
                                            Member Since, July 2026
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <LoyaltyProgress
                            currentPoints={2450}
                            currentTierPoints={2000}
                            nextTierPoints={3000}
                            currentTier="Gold"
                            nextTier="Platinum"
                        />

                        <View
                            className="bg-[#3F2516] px-5 py-5 mb-5"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='flex-row gap-2 items-center '>
                                <RobotIcon width={moderateScale(21)} height={moderateScale(21)} color={"rgba(248, 213, 106, 0.85)"} />

                                <Text 
                                    className='text-[#F8D56A]/85 font-semibold'
                                    style={{ fontSize: moderateScale(12.5) }}    
                                >
                                    AI Smart Goal
                                </Text>
                            </View>

                            <Text
                                className='text-[#FFFFFF]/75 font-medium leading-5'
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: verticalScale(6)
                                }}
                            >
                                You're only
                                <Text
                                    className='text-[#F8D56A]/75 font-medium'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    {" "}550 points away{" "}
                                </Text>
                                from
                                Platinum. Order ₹800 this week to
                                unlock Premium Benefits.
                            </Text>
                        </View>

                        <RewardAndCouponTabs activeTab={activeTab} onChange={setActiveTab} />

                        {activeTab === "rewards" ? (
                            <>
                                <View
                                    style={{ marginTop: verticalScale(14) }}
                                >
                                    <RewardStatsGrid data={REWARD_STATS} />
                                </View>
        
                                <Text
                                    className="text-[#1F1F1F] font-bold mt-3 mb-3"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    How to Earn
                                </Text>
        
                                <RewardActionsList
                                    data={rewardActions}
                                    brothersPlus={brothersPlus}
                                    onPress={item => {
                                        console.log("Pressed:", item.id)
                                    }}
                                />

                                <View
                                    onLayout={(event) => {
                                        setRedeemSectionY(event.nativeEvent.layout.y)
                                    }}
                                >
                                    <Text
                                        className="text-[#1F1F1F] font-bold mt-6 mb-3"
                                        style={{ fontSize: moderateScale(15) }}
                                    >
                                        Redeem Points
                                    </Text>

                                    {loadingRewardCoupons ? (
                                        <View
                                            className="items-center justify-center"
                                            style={{ height: verticalScale(150) }}
                                        >
                                            <LottieView
                                                source={require(
                                                    "../../../assets/animations/Loading3.json"
                                                )}
                                                autoPlay
                                                loop
                                                style={{
                                                    width: moderateScale(50),
                                                    height: moderateScale(50)
                                                }}
                                            />
                                        </View>
                                    ) : rewardCouponsLoaded && rewardCoupons.length === 0 ? (
                                        <View
                                            className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10"
                                            style={{
                                                borderWidth: moderateScale(0.5),
                                                borderRadius: moderateScale(20),
                                                paddingHorizontal: scale(20),
                                                paddingVertical: verticalScale(24),
                                                marginTop: verticalScale(12)
                                            }}
                                        >
                                            <View
                                                className='bg-[#E8B93F]/15 rounded-full items-center justify-center'
                                                style={{
                                                    width: moderateScale(46),
                                                    height: moderateScale(46)
                                                }}
                                            >
                                                <CircleStarIcon width={moderateScale(30)} height={moderateScale(30)} color="#5A3825"/>
                                            </View>

                                            <Text
                                                className="text-[#1F1F1F] font-semibold"
                                                style={{
                                                    fontSize: moderateScale(14),
                                                    marginTop: verticalScale(8)
                                                }}
                                            >
                                                No Rewards Available
                                            </Text>

                                            <Text
                                                className="text-[#1F1F1F]/75 font-medium text-center"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    marginTop: verticalScale(3)
                                                }}
                                            >
                                                New reward coupons will appear here.
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ gap: verticalScale(12) }}>
                                            {rewardCoupons.map((coupon) => {
                                                const mappedCoupon = mapAvailableCoupon(coupon)

                                                return (
                                                    <RewardCouponCard
                                                        key={coupon.id}
                                                        item={mappedCoupon}
                                                        onRedeem={() => {
                                                            console.log("Redeem with points:", coupon)

                                                            handleRedeemCoupon(coupon)
                                                        }}
                                                    />
                                                )
                                            })}
                                        </View>
                                    )}
                                </View>

                                <View
                                    onLayout={(event) => {
                                        setPurchaseSectionY(event.nativeEvent.layout.y)
                                    }}
                                    style={{ marginTop: verticalScale(20) }}
                                >
                                    {!loadingRewardCoupons && moneyCoupons.length > 0 && (
                                        <>
                                            <Text
                                                className="text-[#1F1F1F] font-bold mb-3"
                                                style={{ fontSize: moderateScale(15) }}
                                            >
                                                Purchase Coupons
                                            </Text>

                                            <View style={{ gap: verticalScale(12) }}>
                                                {moneyCoupons.map((coupon) => {
                                                    const mappedCoupon = mapAvailableCoupon(coupon)

                                                    return (
                                                        <RewardCouponCard
                                                            key={coupon.id}
                                                            item={mappedCoupon}
                                                            onPurchase={() => {
                                                                console.log("Purchase coupon:", coupon)

                                                                handlePurchaseCoupon(coupon)
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </View>
                                        </>
                                    )}
                                </View>

                                <Text
                                    className="text-[#1F1F1F] font-bold mt-5"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    Achievement Badges
                                </Text>

                                <ScrollView
                                    horizontal
                                    nestedScrollEnabled
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    className="-mx-5 mt-4"
                                    contentContainerStyle={{
                                        paddingHorizontal: scale(14),
                                        gap: scale(6)
                                    }}
                                >
                                    {LOYALTY_TIERS.map((item) => {
                                        const Icon = item.icon

                                        return (
                                            <View
                                                key={item.id}
                                                className="items-center"
                                                style={{
                                                    width: moderateScale(78)
                                                }}
                                            >
                                                <View
                                                    className="items-center justify-center"
                                                    style={{
                                                        width: moderateScale(62),
                                                        height: moderateScale(62),
                                                        borderRadius: moderateScale(31),
                                                        borderWidth: 2,
                                                        borderColor: item.borderColor,
                                                        backgroundColor: item.backgroundColor
                                                    }}
                                                >
                                                    <Icon width={moderateScale(25)} height={moderateScale(25)} color={item.iconColor} strokeWidth={1.8} />
                                                </View>

                                                <Text
                                                    className="text-[#1F1F1F] font-semibold text-center"
                                                    style={{
                                                        fontSize: moderateScale(12),
                                                        marginTop: verticalScale(4)
                                                    }}
                                                >
                                                    {item.title}
                                                </Text>

                                                <Text
                                                    numberOfLines={1}
                                                    className="text-[#1F1F1F]/75 font-medium text-center"
                                                    style={{
                                                        fontSize: moderateScale(10),
                                                        marginTop: verticalScale(2)
                                                    }}
                                                >
                                                    {item.subtitle}
                                                </Text>
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </>
                        ) : (
                            <>
                                <View
                                    style={{
                                        marginTop: verticalScale(14),
                                        marginBottom: verticalScale(10)
                                    }}
                                >
                                    <SearchBar
                                        value={search}
                                        onChangeText={setsearch}
                                        placeholder="Search coupon code"
                                    />
                                </View>

                                <ScrollView
                                    horizontal
                                    nestedScrollEnabled
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    className="-mx-5 mt-1"
                                    contentContainerStyle={{
                                        paddingHorizontal: scale(14),
                                        gap: scale(10)
                                    }}
                                >
                                    {COUPONS_CATEGORIES.map((category) => {
                                        const isSelected = selectedCategory === category.id
                                        const Icon = category.icon
                                
                                        return (
                                            <TouchableOpacity
                                                key={category.id}
                                                activeOpacity={0.85}
                                                onPress={() => setSelectedCategory(category.id)}
                                                className={`flex-row gap-2 items-center justify-center ${
                                                    isSelected ? "bg-[#3F2516]" : "bg-[#FAF5EF]/75"
                                                }`}
                                                style={{
                                                    borderRadius: moderateScale(18),
                                                    paddingHorizontal: scale(14),
                                                    paddingVertical: verticalScale(7),
                                                    borderWidth: 0.7,
                                                    borderColor: isSelected ? "#3F2516" : "#E8DDD3"
                                                }}
                                            >
                                                {Icon && (
                                                    <Icon width={moderateScale(17)} height={moderateScale(17)} color={isSelected ? "#FFFFFF" : "#5A3825"} />
                                                )}
                                                <Text
                                                    className={`font-semibold ${
                                                        isSelected ? "text-[#FFFFFF]" : "text-[#5A3825]"
                                                    }`}
                                                    style={{ fontSize: moderateScale(13) }}
                                                >
                                                    {category.title}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>

                                <Text
                                    className="text-[#1F1F1F] font-bold mt-5 mb-4"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    Active Coupons
                                </Text>

                                {loadingAvailableCoupons ? (
                                    <View
                                        className="items-center justify-center"
                                        style={{ height: verticalScale(150) }}
                                    >
                                        <LottieView
                                            source={require(
                                                "../../../assets/animations/Loading3.json"
                                            )}
                                            autoPlay
                                            loop
                                            style={{
                                                width: moderateScale(50),
                                                height: moderateScale(50)
                                            }}
                                        />
                                    </View>
                                ) : availableCouponsLoaded && availableCoupons.length === 0 ? (
                                    <View
                                        className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10"
                                        style={{
                                            borderWidth: moderateScale(0.5),
                                            borderRadius: moderateScale(20),
                                            paddingHorizontal: scale(20),
                                            paddingVertical: verticalScale(24)
                                        }}
                                    >
                                        <View
                                            className='bg-[#E8B93F]/15 rounded-full items-center justify-center'
                                            style={{
                                                width: moderateScale(46),
                                                height: moderateScale(46)
                                            }}
                                        >
                                            <CouponIcon width={moderateScale(28)} height={moderateScale(28)} color="#5A3825"/>
                                        </View>

                                        <Text
                                            className="text-[#1F1F1F] font-semibold"
                                            style={{
                                                fontSize: moderateScale(14),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            No Coupons Available
                                        </Text>

                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium text-center"
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(3)
                                            }}
                                        >
                                            New offers and coupons will appear here.
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ gap: verticalScale(12) }}>
                                        {availableCoupons.map(coupon => {
                                            const item = mapAvailableCoupon(coupon)

                                            return (
                                                <CouponCard
                                                    key={coupon.id}
                                                    item={item}
                                                    onApply={item => {
                                                        console.log("Apply:", item.code)
                                                    }}
                                                    onCopy={item => {
                                                        console.log("Copy:", item.code)
                                                    }}
                                                />
                                            )
                                        })}
                                    </View>
                                )}

                                <View
                                    className="bg-[#3F2516] px-5 py-5"
                                    style={{
                                        borderRadius: moderateScale(22),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    <View className='flex-row gap-2 items-center '>
                                        <RobotIcon width={moderateScale(21)} height={moderateScale(21)} color={"rgba(248, 213, 106, 0.85)"} />

                                        <Text 
                                            className='text-[#F8D56A]/85 font-semibold'
                                            style={{ fontSize: moderateScale(12.5) }}    
                                        >
                                            Smart Recommendation
                                        </Text>
                                    </View>

                                    <Text
                                        className='text-[#FFFFFF]/75 font-medium leading-5'
                                        style={{
                                            fontSize: moderateScale(12),
                                            marginTop: verticalScale(6)
                                        }}
                                    >
                                        Use
                                        <Text
                                            className='text-[#F8D56A]/75 font-medium'
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            {" "}SAVE100{" "}
                                        </Text>
                                            today. You'll save ₹100 on your current cart.
                                    </Text>
                                </View>

                                <Text
                                    className="text-[#1F1F1F] font-bold mt-5 mb-2"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    Upcoming Events
                                </Text>

                                <FlatList
                                    data={UPCOMING_EVENTS}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    nestedScrollEnabled
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    className="-mx-5"
                                    contentContainerStyle={{
                                        paddingHorizontal: scale(14),
                                        gap: scale(12),
                                        paddingVertical: verticalScale(4)
                                    }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            activeOpacity={0.95}
                                            onPress={() => {}}
                                            className='overflow-hidden'
                                            style={{
                                                width: moderateScale(280),
                                                height: moderateScale(175),
                                                borderRadius: moderateScale(20)
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri: item.imageUrl
                                                }}
                                                cachePolicy={'memory-disk'}
                                                contentFit='cover'
                                                style={{
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                />
                            </>
                        )}     
                    </>
                }
            />
        </SafeAreaView>
    )
}