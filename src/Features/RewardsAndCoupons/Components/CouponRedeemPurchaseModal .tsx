import CouponIcon from '@/assets/icon/CouponFilledIcon.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import { COLORS } from "@/constant/colors"
import { getUpiAppIcon, getUpiAppName } from "@/Features/Checkout/CheckoutScreen"
import { useToast } from "@/Features/hook/ToastContext"
import { CashfreePaymentError, useCashfreeUpi } from "@/Features/hook/useCashfreeUpi"
import { Coupon, redeemCoupon, verifyCashfreePayment } from "@/Services/api-service"
import { getMyWallet, Wallet } from '@/Services/wallet-service'
import { SavedPaymentMethod, usePaymentMethodStore } from "@/Stores/usePaymentMethodStore"
import { hexToRgba } from "@/utils/hexToRgba"
import LottieView from "lottie-react-native"
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { CouponItem } from "./CouponCard"
import RewardCouponCard from "./RewardCouponCard"

type CouponRedeemPurchaseModalProps = {
    visible: boolean
    coupon: Coupon | null
    rewardBalance: number

    onCancel: () => void
    onSuccess: (coupon: Coupon) => void
}

const CouponRedeemPurchaseModal = memo(({
    visible,
    coupon,
    rewardBalance,
    onCancel,
    onSuccess
}: CouponRedeemPurchaseModalProps) => {
    const { showToast } = useToast()
    const insets = useSafeAreaInsets()

    const {savedPaymentMethods, addPaymentMethod} = usePaymentMethodStore()
    const [processing, setProcessing] = useState(false)
    const [verifyingPayment, setVerifyingPayment] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
    const [processingUpiApp, setProcessingUpiApp] = useState<string | null>(null)

    const currentPaymentUpiRef = useRef<SavedPaymentMethod | null>(null)
    const currentPurchaseIdRef = useRef<string | null>(null)
    const paymentHandledRef = useRef(false)
    const paymentVerifyingRef = useRef(false)
    const isProcessing = processing || verifyingPayment

    const isRewardCoupon = coupon?.purchase_method === "REWARD_POINTS"
    const isMoneyCoupon = coupon?.purchase_method === "MONEY"

    const requiredPoints = coupon?.points_required ?? 0
    const hasEnoughPoints = rewardBalance >= requiredPoints

    const moneyPrice = Number(coupon?.money_price ?? 0)

    const mapAvailableCoupon = (coupon: Coupon): CouponItem => {
        const validTo = new Date(coupon.valid_to) 
        const isExpired = validTo.getTime() < Date.now()

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
            note: isExpired
                ? `Expired on ${formattedExpiry}`
                : `Valid until ${formattedExpiry}`,
            noteType: "expiry",
            featured: coupon.purchase_method === "REWARD_POINTS",
            purchaseMethod: coupon.purchase_method,
            pointsRequired: coupon.points_required,
            moneyPrice: Number(coupon.money_price),
            isActive: coupon.is_active,
            isExpired
        }
    }

    const mappedCoupon = useMemo(() => {
        if (!coupon) {
            return null
        }

        return mapAvailableCoupon(coupon)
    }, [coupon])

    const [loading, setLoading] = useState(true)
    const [wallet, setWallet] = useState<Wallet | null>(null)

    const fetchWallet = useCallback(async () => {
        try {
            setLoading(true)

            const res = await getMyWallet()

            //console.log("Wallet response:", res.data)

            setWallet(res.data.data)
        } catch (error: any) {
            console.log("Fetch wallet error:", error)

            showToast(
                error?.message || "Unable to fetch wallet",
                "warning"
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchWallet()
    },[fetchWallet])

    const walletBalance = wallet?.balance ?? 0
    
    const OTHER_PAYMENT_METHODS = useMemo(
        () => [
            // {
            //     id: "cod",
            //     title: "Cash on Delivery",
            //     description: "Pay in cash when your order is delivered",
            //     icon: MoneyBagIcon
            // },
            {
                id: "wallet",
                title: "Brothers Wallet",
                description: "Pay using your wallet balance",
                icon: WalletIcon,
                badge: loading
                    ? "Loading..."
                    : `Balance: ₹${walletBalance.toLocaleString("en-IN")}`
            }
        ],
        [walletBalance, loading]
    )

    const handleVerifyPayment = useCallback(async (cashfreeOrderId: string) => {
            if (
                paymentHandledRef.current ||
                paymentVerifyingRef.current ||
                !coupon
            ) {
                return
            }

            try {
                paymentVerifyingRef.current = true

                setVerifyingPayment(true)

                console.log("Verifying coupon payment:", cashfreeOrderId)

                const res = await verifyCashfreePayment({order_id: cashfreeOrderId})

                console.log("Coupon payment verification:", res.data)

                const paymentStatus = res.data.data?.status?.trim().toLowerCase() ?? ""

                const message = res.data.message?.trim().toLowerCase() ?? ""

                if (res.data.success && (
                        paymentStatus === "success" ||
                        message === "payment is completed" ||
                        message === "payment verified successfully"
                    )
                ) {
                    paymentHandledRef.current = true

                    const paymentMethod = currentPaymentUpiRef.current

                    if (paymentMethod) {
                        addPaymentMethod(paymentMethod)
                    }

                    currentPaymentUpiRef.current = null

                    currentPurchaseIdRef.current = null

                    setProcessingUpiApp(null)

                    showToast("Coupon purchased successfully", "success")

                    onSuccess(coupon)

                    return
                }

                if (paymentStatus === "pending" || paymentStatus === "incomplete") {
                    setProcessingUpiApp(null)

                    showToast("Payment is incomplete", "warning")

                    return
                }

                showToast(res.data.message || "Unable to verify payment", "warning")
            } catch (error: any) {
                console.log("Coupon payment verification error:", error)

                currentPaymentUpiRef.current = null

                setProcessingUpiApp(null)

                showToast(error?.message || "Unable to verify payment", "warning")
            } finally {
                paymentVerifyingRef.current = false
                setVerifyingPayment(false)
            }
        },
        [
            coupon,
            addPaymentMethod,
            onSuccess
        ]
    )

    const handlePaymentError = useCallback(async (error: CashfreePaymentError) => {
        console.log("Cashfree payment error:", {
            message: error.message,
            orderId: error.orderId,
            code: error.code,
            type: error.type,
            status: error.status,
            originalError: error.originalError
        })

        if (paymentHandledRef.current) {
            return
        }

        if (paymentVerifyingRef.current) {
            return
        }

        if (error.orderId) {
            await handleVerifyPayment(error.orderId)

            return
        }

        currentPaymentUpiRef.current = null

        setProcessing(false)

        setProcessingUpiApp(null)

        showToast(error?.message || "Payment was not completed", "warning")
    },[handleVerifyPayment])

    const {
        upiApps,
        fetchUpiApps,
        startUpiPayment
    } = useCashfreeUpi({
        onVerify: handleVerifyPayment,
        onError: handlePaymentError
    })


    useEffect(() => {
        if (visible && isMoneyCoupon) {
            fetchUpiApps()
        }
    }, [visible, isMoneyCoupon, fetchUpiApps])

    const deviceUpiMethods = useMemo(() => {
        return upiApps.map((app) => ({
            id: `upi-${app.appPackage}`,
            title: app.appName || getUpiAppName(app.appPackage),
            description: "Pay securely using UPI",
            paymentType: "UPI" as const,
            packageName: app.appPackage,
            icon: getUpiAppIcon(app.appPackage),
            size: 20
        }))
    }, [upiApps])

    const defaultPaymentMethod = useMemo(() => {
        return (
            savedPaymentMethods.find((item) => item.isDefault) ?? null
        )
    }, [savedPaymentMethods])

    useEffect(() => {
        if (selectedPayment) {
            return
        }

        if (!defaultPaymentMethod) {
            return
        }

        if (defaultPaymentMethod.type === "UPI") {
            const isAvailable = deviceUpiMethods.some((item) => item.id === defaultPaymentMethod.id)

            if (!isAvailable) {
                return
            }
        }

        setSelectedPayment(defaultPaymentMethod.id)
    }, [defaultPaymentMethod, deviceUpiMethods, selectedPayment])

    const savedUpiMethods = useMemo(() => {
        return savedPaymentMethods.filter(
            (item) =>
                item.type === "UPI" &&
                !!item.packageName
        )
    }, [savedPaymentMethods])

    const savedDeviceUpiMethods = useMemo(() => {
        return savedUpiMethods
            .map((savedMethod) => {
                return (
                    deviceUpiMethods.find((item) => item.packageName === savedMethod.packageName) ?? null
                )
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
    }, [savedUpiMethods, deviceUpiMethods])

    const selectedUpiMethod = useMemo(() => {
        return (
            deviceUpiMethods.find((item) => item.id === selectedPayment) ?? null
        )
    }, [deviceUpiMethods, selectedPayment])

    const otherUpiMethods = useMemo(() => {
        const savedPackages = new Set(
            savedUpiMethods
                .map((item) => item.packageName)
                .filter(Boolean)
        )

        return deviceUpiMethods.filter((item) => !savedPackages.has(item.packageName))
    }, [deviceUpiMethods, savedUpiMethods])

    const handleRewardRedeem = useCallback(async () => {
        if (!coupon || processing) {
            return
        }

        if (!hasEnoughPoints) {
            showToast(`You need ${requiredPoints} points to redeem this coupon`, "info")

            return
        }

        try {
            setProcessing(true)

            const res = await redeemCoupon(coupon.id, false)

            console.log("Redeem coupon:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to redeem coupon", "warning")

                return
            }

            showToast(res.data.message || "Coupon redeemed successfully", "success")

            onSuccess(coupon)
        } catch (error: any) {
            console.log("Coupon redeem error:", error?.response?.data || error)

            showToast(error?.response?.data ?.message || error?.message ||
                "Unable to redeem coupon", "info"
            )
        } finally {
            setProcessing(false)
        }
    }, [
        coupon,
        processing,
        hasEnoughPoints,
        requiredPoints,
        onSuccess
    ])

    const handleMoneyPurchase = useCallback(async () => {
        if (!coupon || isProcessing) {
            return
        }

        const isWalletPayment = selectedPayment === "wallet"

        if (!isWalletPayment && !selectedUpiMethod) {
            showToast("Please select a payment method", "info")
            return
        }

        try {
            setProcessing(true)

            paymentHandledRef.current = false
            paymentVerifyingRef.current = false

            if (isWalletPayment) {
                const res = await redeemCoupon(coupon.id, true)

                console.log("Wallet coupon purchase response:", res.data)

                if (!res.data.success) {
                    throw new Error(res.data.message || "Unable to purchase coupon")
                }

                showToast(res.data.message || "Coupon purchased successfully", "success")

                return
            }

            if (!selectedUpiMethod) {
                return
            }

            currentPaymentUpiRef.current = {
                id: selectedUpiMethod.id,
                type: "UPI",
                name: selectedUpiMethod.title,
                packageName: selectedUpiMethod.packageName
            }

            setProcessingUpiApp(selectedUpiMethod.packageName)

            const res = await redeemCoupon(coupon.id, false)

            console.log("UPI coupon purchase response:", res.data)

            if (!res.data.success) {
                throw new Error(res.data.message || "Unable to purchase coupon")
            }

            const payment = res.data.data

            if (!payment?.payment_id || !payment?.payment_session_id) {
                throw new Error("Invalid payment session")
            }

            currentPurchaseIdRef.current = payment.purchase_id ?? null

            await startUpiPayment({
                orderId: payment.payment_id,
                paymentSessionId: payment.payment_session_id,
                appPackage: selectedUpiMethod.packageName
            })
        } catch (error: any) {
            console.log("Coupon purchase error:", error?.response?.data || error)

            currentPaymentUpiRef.current = null
            currentPurchaseIdRef.current = null

            setProcessingUpiApp(null)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to purchase coupon", "warning"
            )
        } finally {
            setProcessing(false)
        }
    }, [
        coupon,
        isProcessing,
        selectedPayment,
        selectedUpiMethod,
        startUpiPayment
    ])

    const handleContinue = useCallback(() => {
        if (!coupon) {
            return
        }

        if (isRewardCoupon) {
            handleRewardRedeem()
            return
        }

        if (isMoneyCoupon) {
            handleMoneyPurchase()
            return
        }
    }, [
        coupon,
        isRewardCoupon,
        isMoneyCoupon,
        handleRewardRedeem,
        handleMoneyPurchase
    ])


    if (!coupon) {
        return null
    }

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="fade"
            onRequestClose={() => {
                if (!isProcessing) {
                    onCancel()
                }
            }}
        >
            <View className="flex-1 justify-end">
                <Pressable
                    onPress={() => {
                        if (!isProcessing) {
                            onCancel()
                        }
                    }}
                    className="absolute inset-0 bg-black/50"
                />

                <View
                    className="overflow-hidden"
                    style={{
                        backgroundColor: COLORS.primaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.7),
                        marginHorizontal: scale(8),
                        marginBottom: insets.bottom + verticalScale(12),
                        borderRadius: moderateScale(24),
                        maxHeight: "85%"
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingHorizontal: scale(16),
                            paddingTop: verticalScale(16),
                            paddingBottom: verticalScale(14)
                        }}
                    >
                        <View className="flex-row items-center">
                            <View
                                className="items-center justify-center"
                                style={{
                                    width: moderateScale(42),
                                    height: moderateScale(42),
                                    borderRadius: moderateScale(14),
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15)
                                }}
                            >
                                <CouponIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.secondaryColor} />
                            </View>

                            <View
                                className="flex-1"
                                style={{ marginLeft: scale(11) }}
                            >
                                <Text
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(16),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    {isRewardCoupon
                                        ? "Redeem Reward"
                                        : isMoneyCoupon
                                            ? "Get This Coupon"
                                            : "Claim Coupon"
                                    }
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10.5),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.65),

                                        marginTop: verticalScale(1)
                                    }}
                                >
                                    {isRewardCoupon
                                        ? "Use your reward points to unlock this offer"
                                        : isMoneyCoupon
                                            ? "Complete payment to unlock this offer"
                                            : "Add this coupon to your account"
                                    }
                                </Text>
                            </View>
                        </View>

                        {mappedCoupon && (
                            <View
                                style={{ marginTop: verticalScale(16) }}
                            >
                                <RewardCouponCard
                                    item={mappedCoupon}
                                    showActionButton={false}
                                    variant="modal"
                                    cutoutColor={COLORS.primaryBackgroundColor}
                                />
                            </View>
                        )}

                        {isRewardCoupon && (
                            <View
                                style={{
                                    marginTop: verticalScale(16),
                                    padding: moderateScale(14),
                                    borderRadius: moderateScale(20),
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderWidth: moderateScale(0.5),
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                                }}
                            >
                                <Text
                                    className="font-bold ml-1"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(12)
                                    }}
                                >
                                    Reward Points
                                </Text>

                                <View
                                    className="flex-row"
                                    style={{
                                        gap: scale(10),
                                        marginTop: verticalScale(9)
                                    }}
                                >
                                    <View
                                        className="flex-1"
                                        style={{
                                            padding: moderateScale(12),
                                            borderRadius: moderateScale(16),
                                            backgroundColor: COLORS.primaryBackgroundColor
                                        }}
                                    >
                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(9.5)
                                            }}
                                        >
                                            Available
                                        </Text>

                                        <Text
                                            className="font-extrabold"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(17),
                                                marginTop: verticalScale(3)
                                            }}
                                        >
                                            {rewardBalance.toLocaleString()}
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(8.5)
                                            }}
                                        >
                                            points
                                        </Text>
                                    </View>

                                    <View
                                        className="flex-1"
                                        style={{
                                            padding: moderateScale(12),
                                            borderRadius: moderateScale(16),
                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.1)
                                        }}
                                    >
                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(9.5)
                                            }}
                                        >
                                            Required
                                        </Text>

                                        <Text
                                            className="font-extrabold"
                                            style={{
                                                color: COLORS.primaryColor,
                                                fontSize: moderateScale(17),
                                                marginTop: verticalScale(3)
                                            }}
                                        >
                                            {requiredPoints.toLocaleString()}
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(8.5)
                                            }}
                                        >
                                            points
                                        </Text>
                                    </View>
                                </View>

                                {hasEnoughPoints && (
                                    <View
                                        className="flex-row items-center justify-between mx-1"
                                        style={{ marginTop: verticalScale(8) }}
                                    >
                                        <Text
                                            className="font-medium"
                                            style={{
                                                fontSize: moderateScale(10),
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                            }}
                                        >
                                            Balance after redemption
                                        </Text>

                                        <Text
                                            className="font-bold"
                                            style={{
                                                fontSize: moderateScale(11),
                                                color: COLORS.primaryTextColor
                                            }}
                                        >
                                            {(rewardBalance - requiredPoints).toLocaleString()}{" "}
                                            pts
                                        </Text>
                                    </View>
                                )}

                                {!hasEnoughPoints && (
                                    <View
                                        style={{
                                            marginTop: verticalScale(12),
                                            paddingHorizontal: scale(10),
                                            paddingVertical: verticalScale(9),
                                            borderRadius: moderateScale(12),
                                            backgroundColor: hexToRgba(COLORS.dangerBackgroundColor, 0.55)
                                        }}
                                    >
                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: COLORS.errorTextColor,
                                                fontSize: moderateScale(10),
                                                lineHeight: moderateScale(15)
                                            }}
                                        >
                                            You need{" "}
                                            {Math.max(requiredPoints - rewardBalance, 0).toLocaleString()}{" "}
                                            more points to redeem this coupon.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {isMoneyCoupon && (
                            <>
                                <View
                                    className="flex-row items-end justify-between"
                                    style={{
                                        marginTop: verticalScale(14),
                                        marginBottom: verticalScale(5)
                                    }}
                                >
                                    <View>
                                        <Text
                                            className="font-bold"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(13)
                                            }}
                                        >
                                            Payment Method
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(10),
                                                marginTop: verticalScale(2)
                                            }}
                                        >
                                            Choose how you'd like to pay
                                        </Text>
                                    </View>
                                </View>

                                {savedDeviceUpiMethods.length > 0 && (
                                    <>
                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(10),
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                marginBottom: verticalScale(7),
                                                marginTop: verticalScale(4)
                                            }}
                                        >
                                            SAVED
                                        </Text>

                                        <View
                                            className="overflow-hidden"
                                            style={{
                                                borderRadius: moderateScale(20),
                                                borderWidth: moderateScale(0.5),
                                                backgroundColor: COLORS.secondaryBackgroundColor,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                                            }}
                                        >
                                            {savedDeviceUpiMethods.map((item, index) => {
                                                const isSelected = selectedPayment === item.id
                                                const isLast = index === savedDeviceUpiMethods.length - 1
                                                const isProcessing = processingUpiApp === item.packageName
                                                const Icon = item.icon
                
                                                return (
                                                    <React.Fragment key={item.id}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.95}
                                                            onPress={() => {
                                                                setSelectedPayment(item.id)
                                                            }}
                                                            className="flex-row items-center"
                                                            style={{
                                                                paddingHorizontal: scale(14),
                                                                paddingVertical: verticalScale(11),
                                                                opacity: processingUpiApp !== null && !isProcessing ? 0.5 : 1
                                                            }}
                                                        >
                                                            <View
                                                                className="items-center justify-center rounded-full"
                                                                style={{
                                                                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                                                    width: moderateScale(40),
                                                                    height: moderateScale(40)
                                                                }}
                                                            >
                                                                <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color={COLORS.primaryTextColor} />
                                                            </View>
                
                                                            <View className="flex-1 ml-3">
                                                                <Text
                                                                    className="font-semibold"
                                                                    style={{
                                                                        fontSize: moderateScale(13),
                                                                        color: COLORS.primaryTextColor
                                                                    }}
                                                                >
                                                                    {item.title}
                                                                </Text>
                
                                                                {item.description && (
                                                                    <Text
                                                                        className="font-medium mt-1"
                                                                        style={{
                                                                            fontSize: moderateScale(10),
                                                                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                                                        }}
                                                                    >
                                                                        {item.description}
                                                                    </Text>
                                                                )}
                                                            </View>
                
                                                            <View
                                                                className='items-center justify-center'
                                                                style={{
                                                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                                    borderWidth: moderateScale(0.7),
                                                                    borderRadius: moderateScale(8),
                                                                    paddingHorizontal: scale(8),
                                                                    paddingVertical: verticalScale(3)
                                                                }}
                                                            >
                                                                <Text 
                                                                    className='font-medium uppercase'
                                                                    style={{
                                                                        fontSize: moderateScale(9),
                                                                        color: COLORS.primaryTextColor
                                                                    }}
                                                                >
                                                                    {item.paymentType}
                                                                </Text>
                                                            </View>
                
                                                            <View
                                                                className="items-center justify-center ml-3"
                                                                style={{
                                                                    width: moderateScale(20),
                                                                    height: moderateScale(20),
                                                                    borderRadius: "100%",
                                                                    borderWidth: moderateScale(2),
                                                                    borderColor: isSelected
                                                                        ? COLORS.secondaryColor
                                                                        : hexToRgba(COLORS.neutralSurfaceColor, 0.85)
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <View
                                                                        style={{
                                                                            width: moderateScale(12),
                                                                            height: moderateScale(12),
                                                                            borderRadius: "100%",
                                                                            backgroundColor: COLORS.secondaryColor
                                                                        }}
                                                                    />
                                                                )}
                                                            </View>
                                                        </TouchableOpacity>
                
                                                        {!isLast && (
                                                            <View
                                                                style={{
                                                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                                    height: 1,
                                                                    marginHorizontal: scale(14)
                                                                }}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </View>
                                    </>
                                )}

                                {otherUpiMethods.length > 0 && (
                                    <>
                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(10),
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                marginTop: verticalScale(12),
                                                marginBottom: verticalScale(7)
                                            }}
                                        >
                                            {savedPaymentMethods.length > 0 ? "OTHER UPI APPS" : "UPI APPS"}
                                        </Text>

                                        <View
                                            className="overflow-hidden"
                                            style={{
                                                backgroundColor: COLORS.secondaryBackgroundColor,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderRadius: moderateScale(20),
                                                borderWidth: moderateScale(0.5)
                                            }}
                                        >
                                            {otherUpiMethods.map((item, index) => {
                                                const Icon = item.icon
                                                const isLast = index === otherUpiMethods.length - 1
                                                const isProcessing = processingUpiApp === item.packageName
                                                const isSelected = selectedPayment === item.id
        
                                                return (
                                                    <React.Fragment
                                                        key={item.id}
                                                    >
                                                        <TouchableOpacity
                                                            activeOpacity={0.95}
                                                            disabled={processingUpiApp !== null}
                                                            onPress={() => {
                                                                setSelectedPayment(item.id)
                                                            }}
                                                            className="flex-row items-center"
                                                            style={{
                                                                paddingHorizontal: scale(14),
                                                                paddingVertical: verticalScale(11),
                                                                opacity: processingUpiApp !== null && !isProcessing ? 0.5 : 1
                                                            }}
                                                        >
                                                            <View
                                                                className="items-center justify-center rounded-full"
                                                                style={{
                                                                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                                                    width: moderateScale(40),
                                                                    height: moderateScale(40)
                                                                }}
                                                            >
                                                                <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} />
                                                            </View>
        
                                                            <View className="flex-1 ml-3">
                                                                <Text
                                                                    className="font-semibold"
                                                                    style={{
                                                                        fontSize: moderateScale(13),
                                                                        color: COLORS.primaryTextColor
                                                                    }}
                                                                >
                                                                    {item.title}
                                                                </Text>
        
                                                                <Text
                                                                    className="font-medium mt-1"
                                                                    style={{
                                                                        fontSize: moderateScale(10),
                                                                        color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                                                    }}
                                                                >
                                                                    {item.description}
                                                                </Text>
                                                            </View>
        
                                                            <View
                                                                className="items-center justify-center ml-3"
                                                                style={{
                                                                    width: moderateScale(20),
                                                                    height: moderateScale(20),
                                                                    borderRadius: "100%",
                                                                    borderWidth: moderateScale(2),
                                                                    borderColor: isSelected
                                                                        ? COLORS.secondaryColor
                                                                        : hexToRgba(COLORS.neutralSurfaceColor, 0.85)
                                                                }}
                                                            >
                                                                {isSelected && (
                                                                    <View
                                                                        style={{
                                                                            width: moderateScale(12),
                                                                            height: moderateScale(12),
                                                                            borderRadius: "100%",
                                                                            backgroundColor: COLORS.secondaryColor
                                                                        }}
                                                                    />
                                                                )}
                                                            </View>
                                                        </TouchableOpacity>
        
                                                        {!isLast && (
                                                            <View
                                                                style={{
                                                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                                    height: moderateScale(0.7),
                                                                    marginHorizontal: scale(14)
                                                                }}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </View>
                                    </>
                                )}

                                <Text
                                    className="font-medium mt-4 mb-2"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Other Payment Options
                                </Text>
        
                                <View
                                    className="overflow-hidden"
                                    style={{
                                        borderRadius: moderateScale(20),
                                        borderWidth: moderateScale(0.5),
                                        backgroundColor: COLORS.secondaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                                    }}
                                >
                                    {OTHER_PAYMENT_METHODS.map((item, index) => {
                                        const Icon = item.icon
                                        const isSelected = selectedPayment === item.id
                                        const isLast = index === OTHER_PAYMENT_METHODS.length - 1
        
                                        return (
                                            <React.Fragment key={item.id}>
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => setSelectedPayment(item.id)}
                                                    className="flex-row items-center"
                                                    style={{
                                                        paddingHorizontal: scale(12),
                                                        paddingVertical: verticalScale(12)
                                                    }}
                                                >
                                                    <View
                                                        className="items-center justify-center rounded-full"
                                                        style={{
                                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                            width: moderateScale(42),
                                                            height: moderateScale(42)
                                                        }}
                                                    >
                                                        <Icon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryColor} strokeWidth={1.8} />
                                                    </View>
        
                                                    <View
                                                        className="flex-1"
                                                        style={{ marginLeft: scale(11) }}
                                                    >
                                                        <View className="flex-row items-center gap-2">
                                                            <Text
                                                                className="font-semibold"
                                                                style={{
                                                                    fontSize: moderateScale(13),
                                                                    color: COLORS.primaryTextColor
                                                                }}
                                                            >
                                                                {item.title}
                                                            </Text>
        
                                                            {item.badge && (
                                                                <View
                                                                    style={{
                                                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.20),
                                                                        borderRadius: moderateScale(12),
                                                                        paddingHorizontal: scale(8),
                                                                        paddingVertical: verticalScale(3)
                                                                    }}
                                                                >
                                                                    <Text
                                                                        className="font-medium"
                                                                        style={{
                                                                            color: COLORS.primaryColor,
                                                                            fontSize: moderateScale(9.5)
                                                                        }}
                                                                    >
                                                                        {item.badge}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
        
                                                        <Text
                                                            className="font-medium"
                                                            style={{
                                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                                fontSize: moderateScale(10.5),
                                                                marginTop: verticalScale(2)
                                                            }}
                                                        >
                                                            {item.description}
                                                        </Text>
                                                    </View>
        
                                                    <View
                                                        className="items-center justify-center"
                                                        style={{
                                                            width: moderateScale(22),
                                                            height: moderateScale(22),
                                                            borderRadius: "100%",
                                                            borderWidth: moderateScale(2),
                                                            borderColor: isSelected
                                                                ? COLORS.secondaryColor
                                                                : hexToRgba(COLORS.neutralSurfaceColor, 0.85)
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <View
                                                                style={{
                                                                    width: moderateScale(14),
                                                                    height: moderateScale(14),
                                                                    borderRadius: "100%",
                                                                    backgroundColor: COLORS.secondaryColor
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
        
                                                {!isLast && (
                                                    <View
                                                        style={{
                                                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                            height: moderateScale(0.5),
                                                            marginHorizontal: scale(14)
                                                        }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </View>
                            </>
                        )}

                        <View
                            className="flex-row"
                            style={{
                                gap: scale(12),
                                marginTop: verticalScale(20)
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.95}
                                disabled={isProcessing}
                                onPress={onCancel}
                                className="flex-1 items-center justify-center"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                    height: verticalScale(44),
                                    borderRadius: moderateScale(20)
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(13)
                                    }}
                                >
                                    Not Now
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={handleContinue}
                                className="flex-1 items-center justify-center"
                                style={{
                                    backgroundColor: COLORS.primaryColor,
                                    height: verticalScale(44),
                                    borderRadius: moderateScale(20)
                                }}
                            >
                                {isProcessing ? (
                                    <LottieView
                                        source={require(
                                            "../../../../assets/animations/Loading.json"
                                        )}
                                        autoPlay
                                        loop
                                        style={{
                                            width: moderateScale(52),
                                            height: moderateScale(52)
                                        }}
                                    />
                                ) : (
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            color: COLORS.primaryBackgroundColor,
                                            fontSize: moderateScale(12.5)
                                        }}
                                    >
                                        {isRewardCoupon
                                            ? `Redeem Coupon`
                                            : isMoneyCoupon
                                                ? `Pay ₹${moneyPrice}`
                                                : "Claim Coupon"
                                        }
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
})

CouponRedeemPurchaseModal.displayName = "CouponRedeemPurchaseModal"

export default CouponRedeemPurchaseModal