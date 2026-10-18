import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import CheckCircleIcon from '@/assets/icon/SuccessIcon2.svg'
import { COLORS } from "@/constant/colors"
import { getMyMemberships, MembershipBenefit, MembershipStatus, MyMembershipResponse } from '@/Services/api-service'
import { hexToRgba } from "@/utils/hexToRgba"
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StatusBar, Text, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'

const getMembershipStatusColors = (status?: MembershipStatus) => {
    switch (status) {
        case "ACTIVE":
            return {
                background: hexToRgba(COLORS.activeStatusTextColor, 0.12),
                text: COLORS.activeStatusTextColor
            }

        case "EXPIRED":
            return {
                background: hexToRgba(COLORS.errorTextColor, 0.12),
                text: COLORS.errorTextColor
            }

        case "PENDING":
            return {
                background: hexToRgba(COLORS.accentColor, 0.1),
                text: COLORS.accentColor
            }

        default:
            return {
                background: hexToRgba(COLORS.primaryTextColor, 0.1),
                text: hexToRgba(COLORS.primaryTextColor, 0.65)
            }
    }
}

type MembershipDetailRowProps = {
    title: string
    value: string
    last?: boolean
}

function MembershipDetailRow({
    title,
    value,
    last = false
}: MembershipDetailRowProps) {
    return (
        <View
            className="flex-row items-center justify-between"
            style={{
                paddingVertical: verticalScale(13),
                borderBottomWidth: last ? 0 : moderateScale(0.5),
                borderBottomColor: hexToRgba(COLORS.primaryTextColor, 0.15)
            }}
        >
            <Text
                className="font-medium"
                style={{
                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                    fontSize: moderateScale(11)
                }}
            >
                {title}
            </Text>

            <Text
                className="font-semibold"
                style={{
                    color: COLORS.primaryTextColor,
                    fontSize: moderateScale(12)
                }}
            >
                {value}
            </Text>
        </View>
    )
}

export default function MemberShipStatusScreen(){
    const {showToast} = useToast()

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

    const formatMembershipDate = (date?: string | null) => {
        if (!date) {
            return "—"
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        )
    }

    const getBenefitText = (benefit: MembershipBenefit) => {
        const { benefit_code, config } = benefit

        switch (benefit_code) {
            case "DELIVERY_DISCOUNT":
                if (!config.percentage) {
                    return null
                }

                return config.max_discount
                    ? `${config.percentage}% delivery discount up to ₹${config.max_discount}`
                    : `${config.percentage}% delivery discount`

            case "REWARD_MULTIPLIER":
                return config.multiplier
                    ? `${config.multiplier}x reward points`
                    : null

            case "REDUCED_ADS":
                if (!config.enabled) {
                    return null
                }

                return config.reduction_percentage
                    ? `${config.reduction_percentage}% fewer ads`
                    : "Reduced ads"

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

    const plan = myMembership?.plan ?? null
    const membership = myMembership?.membership ?? null

    const benefits = useMemo(() => {
        return (
            plan?.benefits
                .map(getBenefitText)
                .filter((item): item is string =>!!item) ?? []
        )
    }, [plan])

    const remainingDays = useMemo(() => {
        if (!membership?.expires_at) {
            return null
        }

        const expiresAt = new Date(membership.expires_at).getTime()

        const now = Date.now()

        return Math.max(
            Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)),
            0
        )
    }, [membership?.expires_at])

    const statusColors = getMembershipStatusColors(membership?.status)

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
                        Membership Status
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        View your current plan and membership benefits.
                    </Text>
                </View>
            </View>

            {loadingMembership ? (
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
                    data={[{}]}
                    renderItem={null}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: scale(14),
                        paddingBottom: verticalScale(25)
                    }}
                    ListHeaderComponentStyle={{
                        flex: 1
                    }}
                    ListHeaderComponent={
                        <>
                            {!plan || !membership ? (
                                <View className="flex-1 items-center justify-center">

                                    <View
                                        className="w-full items-center justify-center"
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            borderRadius: moderateScale(22),
                                            paddingVertical: verticalScale(30),
                                            paddingHorizontal: scale(20),
                                            marginTop: verticalScale(15)
                                        }}
                                    >
                                        <CrownIcon width={moderateScale(38)} height={moderateScale(38)} color={COLORS.primaryColor} />
        
                                        <Text
                                            className="font-bold"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(15),
                                                marginTop: verticalScale(10)
                                            }}
                                        >
                                            No Active Membership
                                        </Text>
        
                                        <Text
                                            className="font-medium text-center"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(4)
                                            }}
                                        >
                                            Choose a membership plan to unlock premium benefits.
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View
                                        style={{
                                            backgroundColor: COLORS.primaryColor,
                                            borderRadius: moderateScale(24),
                                            paddingHorizontal: scale(16),
                                            paddingVertical: verticalScale(18),
                                            marginTop: verticalScale(12)
                                        }}
                                    >
                                        <View className="flex-row items-start">
                                            <View
                                                className="items-center justify-center"
                                                style={{
                                                    width: moderateScale(46),
                                                    height: moderateScale(46),
                                                    borderRadius:moderateScale(24),
                                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.18)
                                                }}
                                            >
                                                <CrownIcon width={moderateScale(27)} height={moderateScale(27)} color={COLORS.accentLightColor} />
                                            </View>
    
                                            <View className="flex-1 ml-3 mt-1">
                                                <Text
                                                    className="font-medium uppercase"
                                                    style={{
                                                        color: COLORS.accentColor,
                                                        fontSize: moderateScale(9),
                                                        letterSpacing: 0.5
                                                    }}
                                                >
                                                    Current Plan
                                                </Text>
    
                                                <Text
                                                    className="font-extrabold"
                                                    style={{
                                                        color: COLORS.primaryBackgroundColor,
                                                        fontSize: moderateScale(18),
                                                        marginTop: verticalScale(2)
                                                    }}
                                                >
                                                    {plan.name}
                                                </Text>
                                            </View>
    
                                            <View
                                                style={{
                                                    backgroundColor: statusColors.background,
                                                    borderRadius: moderateScale(18),
                                                    paddingHorizontal: scale(9),
                                                    paddingVertical: verticalScale(4)
                                                }}
                                            >
                                                <Text
                                                    className="font-bold uppercase"
                                                    style={{
                                                        color: statusColors.text,
                                                        fontSize: moderateScale(8.5)
                                                    }}
                                                >
                                                    {membership.status}
                                                </Text>
                                            </View>
                                        </View>
    
                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
                                                fontSize: moderateScale(11),
                                                lineHeight: moderateScale(17),
                                                marginTop: verticalScale(12)
                                            }}
                                        >
                                            {plan.description}
                                        </Text>
    
                                        <View
                                            style={{
                                                height: moderateScale(0.5),
                                                backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                                                marginVertical: verticalScale(10)
                                            }}
                                        />
    
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text
                                                    className="font-medium"
                                                    style={{
                                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.65),
                                                        fontSize: moderateScale(9.5)
                                                    }}
                                                >
                                                    Plan Price
                                                </Text>
    
                                                <Text
                                                    className="font-extrabold"
                                                    style={{
                                                        color: COLORS.primaryBackgroundColor,
                                                        fontSize: moderateScale(18),
                                                        marginTop: verticalScale(2)
                                                    }}
                                                >
                                                    ₹{plan.price}
                                                </Text>
                                            </View>
    
                                            <View className="items-end">
                                                <Text
                                                    className="font-medium"
                                                    style={{
                                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.65),
                                                        fontSize: moderateScale(9.5)
                                                    }}
                                                >
                                                    Validity
                                                </Text>
    
                                                <Text
                                                    className="font-bold"
                                                    style={{
                                                        color: COLORS.primaryBackgroundColor,
                                                        fontSize: moderateScale(14),
                                                        marginTop:verticalScale(2)
                                                    }}
                                                >
                                                    {plan.duration_days}{" "}days
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
    
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            color: COLORS.primaryTextColor,
                                            fontSize: moderateScale(15),
                                            marginTop: verticalScale(20),
                                            marginBottom: verticalScale(10)
                                        }}
                                    >
                                        Membership Details
                                    </Text>
    
                                    <View
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            borderRadius: moderateScale(20),
                                            paddingHorizontal: scale(14)
                                        }}
                                    >
                                        <MembershipDetailRow
                                            title="Started On"
                                            value={formatMembershipDate(membership.starts_at)}
                                        />
    
                                        <MembershipDetailRow
                                            title="Expires On"
                                            value={formatMembershipDate(membership.expires_at)}
                                        />
    
                                        <MembershipDetailRow
                                            title="Days Remaining"
                                            value={
                                                membership.status === "ACTIVE" &&
                                                remainingDays !== null
                                                    ? `${remainingDays} days`
                                                    : "—"
                                            }
                                        />
    
                                        <MembershipDetailRow
                                            title="Amount Paid"
                                            value={`₹${membership.amount_paid.toLocaleString("en-IN")}`}
                                            last
                                        />
                                    </View>
    
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            color: COLORS.primaryTextColor,
                                            fontSize: moderateScale(15),
                                            marginTop: verticalScale(20),
                                            marginBottom: verticalScale(10)
                                        }}
                                    >
                                        Your Benefits
                                    </Text>
    
                                    <View
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            borderRadius: moderateScale(20),
                                            paddingHorizontal: scale(14),
                                            paddingVertical: verticalScale(12),
                                            gap: verticalScale(11)
                                        }}
                                    >
                                        {benefits.map(
                                            (benefit) => (
                                                <View
                                                    key={benefit}
                                                    className="flex-row items-center"
                                                >
                                                    <CheckCircleIcon width={moderateScale(19)} height={moderateScale(19)} color={COLORS.activeStatusTextColor} />
    
                                                    <Text
                                                        className="font-medium flex-1"
                                                        style={{
                                                            color: COLORS.primaryTextColor,
                                                            fontSize: moderateScale(12),
                                                            marginLeft: scale(8)
                                                        }}
                                                    >
                                                        {benefit}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>
                                </>
                            )}
                        </>
                    }
                />
            )}
        </SafeAreaView>
    )
}