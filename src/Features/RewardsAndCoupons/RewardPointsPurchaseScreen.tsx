import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import GradientButton from '@/components/GradientButton'
import { COLORS } from "@/constant/colors"
import { getRewardsConfig, purchaseRewardPoints, RewardConfig, verifyCashfreePayment } from '@/Services/api-service'
import { hideLoader, showLoader } from '@/Services/loader-service'
import { getMyWallet, Wallet } from '@/Services/wallet-service'
import { SavedPaymentMethod, usePaymentMethodStore } from '@/Stores/usePaymentMethodStore'
import { hexToRgba } from "@/utils/hexToRgba"
import { router, useFocusEffect } from "expo-router"
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { getUpiAppIcon, getUpiAppName } from '../Checkout/CheckoutScreen'
import { useToast } from '../hook/ToastContext'
import { CashfreePaymentError, useCashfreeUpi } from '../hook/useCashfreeUpi'

export default function RewardPointsPurchaseScreen(){
    const {showToast} = useToast()
    const { width } = useWindowDimensions()

    const horizontalPadding = scale(14)
    const gap = scale(8)

    const cardWidth = useMemo(() => {
        return (width - horizontalPadding * 2 - gap * 2) / 3
    }, [width, horizontalPadding, gap])

    const [rewardConfigLoading, setRewardConfigLoading] = useState(true)
    const [rewardConfig, setRewardConfig] = useState<RewardConfig | null>(null)
    const [selectedPoints, setSelectedPoints] = useState<number | null>(null)
    const [customPoints, setCustomPoints] = useState("")
    const [pointsError, setPointsError] = useState(false)

    const fetchRewardConfig = useCallback(async () => {
        try {
            setRewardConfigLoading(true)

            const res = await getRewardsConfig()

            console.log("Reward config:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch reward configuration", "warning")

                return
            }

            const config = res.data.data as RewardConfig

            setRewardConfig(config)

            setSelectedPoints(config.points_purchase)
            setRewardConfigLoading(false)
        } catch (error: any) {
            setRewardConfigLoading(false)
            console.log("Reward config error:", error?.response?.data || error)
        }
    }, [])

    useEffect(() => {
        fetchRewardConfig()
    },[fetchRewardConfig])

    const minimumPoints = rewardConfig?.points_purchase ?? 0
    const basePrice = rewardConfig?.money_price ?? 0
    const POINT_MULTIPLIERS = [
        1,
        2,
        3,
        5,
        10,
        20
    ]

    const POINT_OPTIONS = useMemo(() => {
        if (!minimumPoints) {
            return []
        }

        return POINT_MULTIPLIERS.map(
            (multiplier) => minimumPoints * multiplier
        )
    }, [minimumPoints])

    const finalPoints = useMemo(() => {
        if (customPoints.trim()) {
            return Number(customPoints)
        }

        return selectedPoints ?? 0
    }, [customPoints, selectedPoints])

    const payableAmount = useMemo(() => {
        if (!finalPoints || !minimumPoints || !basePrice) {
            return 0
        }

        return (finalPoints / minimumPoints) * basePrice
    }, [finalPoints, minimumPoints, basePrice])

    const [loading, setLoading] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
    const {savedPaymentMethods, addPaymentMethod, removePaymentMethod} = usePaymentMethodStore()
    const currentPaymentUpiRef = useRef<SavedPaymentMethod | null>(null)

    const [creatingOrder, setCreatingOrder] = useState(false)
    const [verifyingPayment, setVerifyingPayment] = useState(false)
    const [processingUpiApp, setProcessingUpiApp] = useState<string | null>(null)

    const paymentHandledRef = useRef(false)
    const paymentVerifyingRef = useRef(false)

    const handleVerifyPayment = useCallback(async (cashfreeOrderId: string) => {
        if (paymentHandledRef.current || paymentVerifyingRef.current) {
            return
        }

        try {
            paymentVerifyingRef.current = true

            setVerifyingPayment(true)
            showLoader()

            console.log("Verifying payment:", cashfreeOrderId)

            const res = await verifyCashfreePayment({order_id: cashfreeOrderId})

            console.log("Verify response:", res.data)

            const message = res?.data.message?.trim().toLowerCase() ?? ""
            const paymentStatus = res?.data?.status?.trim().toLowerCase() ?? ""

            if (res?.data.success &&
                (
                    paymentStatus === "success" ||
                    message === "payment is completed" ||
                    message === "payment verified successfully"
                )
            ) {
                paymentHandledRef.current = true

                if (currentPaymentUpiRef.current) {
                    console.log("Saving payment method:", currentPaymentUpiRef.current)

                    addPaymentMethod(currentPaymentUpiRef.current)

                    currentPaymentUpiRef.current = null
                }

                setProcessingUpiApp(null)

                showToast("Points purchased successfully", "success")

                router.back()

                return
            }

            if (
                paymentStatus === "pending" ||
                paymentStatus === "incomplete" ||
                message === "payment is still incomplete"
            ) {
                setProcessingUpiApp(null)

                showToast("Payment is incomplete", "warning")

                return
            }

            setProcessingUpiApp(null)

            showToast(res.data.message || "Payment is being verified.", "warning")
        } catch (error: any) {
            console.log("Payment verification error:", error)

            currentPaymentUpiRef.current = null

            setProcessingUpiApp(null)

            showToast(error?.message || "Unable to verify payment.", "warning")
        } finally {
            paymentVerifyingRef.current = false

            setVerifyingPayment(false)
            hideLoader()
        }
    },[router])

    const handlePaymentError = useCallback(
        async (error: CashfreePaymentError) => {
            console.log("Cashfree payment error:", {
                message: error.message,
                orderId: error.orderId,
                code: error.code,
                type: error.type,
                status: error.status,
                originalError: error.originalError
            })

            // Payment already handled successfully
            if (paymentHandledRef.current) {
                return
            }

            // Verification already running
            if (paymentVerifyingRef.current) {
                return
            }

            // Cashfree may call onError when user returns
            // from its payment result screen.
            // Verify with backend before treating it as failed.
            if (error.orderId) {
                await handleVerifyPayment(
                    error.orderId
                )

                return
            }

            currentPaymentUpiRef.current = null
            setCreatingOrder(false)
            setVerifyingPayment(false)
            setProcessingUpiApp(null)

            hideLoader()

            showToast(error.message || "Payment was not completed", "warning")
        },
        [
            handleVerifyPayment,
            hideLoader,
            showToast
        ]
    )

    const {
        upiApps,
        loadingApps,
        fetchUpiApps,
        startUpiPayment
    } = useCashfreeUpi({
        onVerify: handleVerifyPayment,

        onError: handlePaymentError
    })
    
    useEffect(() => {
        fetchUpiApps()
    }, [fetchUpiApps])

    const deviceUpiMethods = useMemo(() => {
        return upiApps.map((app) => ({
            id: `upi-${app.appPackage}`,
            title: app.appName || getUpiAppName(app.appPackage),
            description: "Pay securely using UPI",
            paymentType: "UPI" as const,
            packageName: app.appPackage,
            icon: getUpiAppIcon(app.appPackage),
            size: 23
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

    const [walletLoading, setWalletLoading] = useState(true)
    const [wallet, setWallet] = useState<Wallet | null>(null)

    const fetchWallet = useCallback(async () => {
        try {
            setWalletLoading(true)

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
            setWalletLoading(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchWallet()
        }, [fetchWallet])
    )

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

    const handlePurchasePoints = useCallback(async () => {
        if (loading || creatingOrder || verifyingPayment) {
            return
        }

        if (!rewardConfig?.is_active) {
            showToast("Reward points purchase is currently unavailable", "info")

            return
        }

        if (!finalPoints || Number.isNaN(finalPoints)) {
            setPointsError(true)

            showToast("Please select reward points", "info")

            return
        }

        if (finalPoints < minimumPoints) {
            setPointsError(true)

            showToast(`Minimum purchase is ${minimumPoints} points`, "info")

            return
        }

        if (finalPoints % minimumPoints !== 0) {
            setPointsError(true)

            showToast(`Points must be in multiples of ${minimumPoints}`, "info")

            return
        }

        if (!selectedPayment) {
            showToast("Please select a payment method", "info")

            return
        }

        if (!selectedUpiMethod) {
            showToast("Please select a UPI app", "info")

            return
        }

        try {
            setLoading(true)
            setCreatingOrder(true)

            showLoader()

            paymentHandledRef.current = false
            paymentVerifyingRef.current = false

            currentPaymentUpiRef.current = {
                id: selectedUpiMethod.id,
                type: "UPI",
                name: selectedUpiMethod.title,
                packageName: selectedUpiMethod.packageName
            }

            const res = await purchaseRewardPoints(finalPoints)

            console.log("Reward points purchase:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to purchase points", "warning")

                return
            }

            const data = res.data.data ?? res.data

            const orderId = data?.payment_id

            const paymentSessionId = data?.payment_session_id

            if (!orderId || !paymentSessionId) {
                showToast("Unable to start payment", "warning")

                return
            }

            setProcessingUpiApp(selectedUpiMethod.packageName)

            setLoading(false)
            setCreatingOrder(false)

            hideLoader()

            await startUpiPayment({
                orderId,
                paymentSessionId,
                appPackage: selectedUpiMethod.packageName
            })
        } catch (error: any) {
            console.log("Reward points purchase error:", error?.response?.data || error)

            setProcessingUpiApp(null)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to purchase reward points", "warning"
            )
        } finally {
            setLoading(false)
            setCreatingOrder(false)

            hideLoader()
        }
    }, [
        rewardConfig,
        finalPoints,
        minimumPoints,
        selectedPayment,
        selectedUpiMethod,
        loading,
        creatingOrder,
        verifyingPayment,
        startUpiPayment
    ])

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
                        Buy Reward Points
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Buy points and unlock more rewards.
                    </Text>
                </View>
            </View>

            {rewardConfigLoading ? (
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
                        paddingHorizontal: scale(14),
                        paddingBottom: verticalScale(25)
                    }}
                    ListHeaderComponent={
                        <>
                            <View
                                className="flex-row items-center"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(20),
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(14),
                                    marginTop: verticalScale(10)
                                }}
                            >
                                <View className="flex-1">
                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                        }}
                                    >
                                        Reward Points Rate
                                    </Text>

                                    <Text
                                        className="font-extrabold"
                                        style={{
                                            fontSize: moderateScale(20),
                                            color: COLORS.primaryTextColor,
                                            marginTop: verticalScale(2)
                                        }}
                                    >
                                        {minimumPoints.toLocaleString()} Points
                                    </Text>

                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                            marginTop: verticalScale(2)
                                        }}
                                    >
                                        Minimum points purchase
                                    </Text>
                                </View>

                                <View className="items-end">
                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                        }}
                                    >
                                        Price
                                    </Text>

                                    <Text
                                        className="font-extrabold"
                                        style={{
                                            fontSize: moderateScale(22),
                                            color: COLORS.primaryTextColor,
                                            marginTop: verticalScale(2)
                                        }}
                                    >
                                        ₹{basePrice.toLocaleString("en-IN")}
                                    </Text>
                                </View>
                            </View>

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor,
                                    marginTop: verticalScale(14)
                                }}
                            >
                                Select Points
                            </Text>

                            <View
                                className="flex-row flex-wrap mt-3"
                                style={{ gap }}
                            >
                                {POINT_OPTIONS.map((points) => {
                                    const isSelected = selectedPoints === points && !customPoints
                                    const amount = (points / minimumPoints) * basePrice

                                    return (
                                        <TouchableOpacity
                                            key={points}
                                            activeOpacity={0.95}
                                            onPress={() => {
                                                setSelectedPoints(points)
                                                setCustomPoints("")
                                                setPointsError(false)
                                            }}
                                            className="items-center justify-center"
                                            style={{
                                                width: cardWidth,
                                                height: verticalScale(38),
                                                borderRadius: moderateScale(14),
                                                backgroundColor: isSelected ? COLORS.primaryColor : COLORS.secondaryBackgroundColor,
                                                borderWidth: 0.5,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                                            }}
                                        >
                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(14),
                                                    color: isSelected ? COLORS.primaryBackgroundColor : COLORS.primaryTextColor
                                                }}
                                            >
                                                {points.toLocaleString()} pts
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>

                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                                    borderColor: hexToRgba(COLORS.accentColor, 0.15),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(20),
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(14),
                                    marginTop: verticalScale(20)
                                }}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Purchase Summary
                                </Text>

                                <View
                                    className="flex-row items-center justify-between"
                                    style={{ marginTop: verticalScale(12) }}
                                >
                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Reward Points
                                    </Text>

                                    <Text
                                        className="font-bold"
                                        style={{
                                            fontSize: moderateScale(13.5),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        {finalPoints.toLocaleString()} pts
                                    </Text>
                                </View>

                                <View
                                    className="flex-row items-center justify-between"
                                    style={{ marginTop: verticalScale(8) }}
                                >
                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Amount to Pay
                                    </Text>

                                    <Text
                                        className="font-extrabold"
                                        style={{
                                            fontSize: moderateScale(18),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        ₹{payableAmount.toLocaleString("en-IN")}
                                    </Text>
                                </View>
                            </View>

                            <View
                                className="flex-row items-end justify-between"
                                style={{ marginTop: verticalScale(14) }}
                            >
                                <View>
                                    <Text
                                        className="font-bold"
                                        style={{
                                            color: COLORS.primaryTextColor,
                                            fontSize: moderateScale(14)
                                        }}
                                    >
                                        Payment Method
                                    </Text>

                                    <Text
                                        className="font-medium"
                                        style={{
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                            fontSize: moderateScale(11),
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
                                        className="font-medium mt-3 mb-2"
                                        style={{
                                            fontSize: moderateScale(12),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                        }}
                                    >
                                        SAVED
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
                                                                width: moderateScale(42),
                                                                height: moderateScale(42)
                                                            }}
                                                        >
                                                            <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color={COLORS.primaryTextColor} />
                                                        </View>
            
                                                        <View className="flex-1 ml-3">
                                                            <Text
                                                                className="font-semibold"
                                                                style={{
                                                                    fontSize: moderateScale(14),
                                                                    color: COLORS.primaryTextColor
                                                                }}
                                                            >
                                                                {item.title}
                                                            </Text>
            
                                                            {item.description && (
                                                                <Text
                                                                    className="font-medium mt-1"
                                                                    style={{
                                                                        fontSize: moderateScale(11),
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
                                                                    fontSize: moderateScale(10),
                                                                    color: COLORS.primaryTextColor
                                                                }}
                                                            >
                                                                {item.paymentType}
                                                            </Text>
                                                        </View>
            
                                                        <View
                                                            className="items-center justify-center ml-3"
                                                            style={{
                                                                width: moderateScale(22),
                                                                height: moderateScale(22),
                                                                borderRadius: "100%",
                                                                borderWidth: moderateScale(2),
                                                                borderColor: isSelected
                                                                    ? COLORS.secondaryColor
                                                                    : hexToRgba(COLORS.neutralSurfaceColor, 0.85),
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

                            {otherUpiMethods.length > 0 && (
                                <>
                                    <Text
                                        className="font-medium mt-3 mb-2"
                                        style={{
                                            fontSize: moderateScale(12),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                        }}
                                    >
                                        {savedPaymentMethods.length > 0 ? "Other UPI Apps" : "UPI Apps"}
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
                                                            opacity:  processingUpiApp !== null && !isProcessing ? 0.5 : 1
                                                        }}
                                                    >
                                                        <View
                                                            className="items-center justify-center rounded-full"
                                                            style={{
                                                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                                                width: moderateScale(42),
                                                                height: moderateScale(42)
                                                            }}
                                                        >
                                                            <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} />
                                                        </View>

                                                        <View className="flex-1 ml-3">
                                                            <Text
                                                                className="font-semibold"
                                                                style={{
                                                                    fontSize: moderateScale(14),
                                                                    color: COLORS.primaryTextColor
                                                                }}
                                                            >
                                                                {item.title}
                                                            </Text>

                                                            <Text
                                                                className="font-medium mt-1"
                                                                style={{
                                                                    fontSize: moderateScale(11),
                                                                    color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                                                }}
                                                            >
                                                                {item.description}
                                                            </Text>
                                                        </View>

                                                        <View
                                                            className="items-center justify-center ml-3"
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

                            {/* <Text
                                className="font-medium mt-4 mb-2"
                                style={{
                                    fontSize: moderateScale(13),
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
                            </View> */}

                            <GradientButton
                                title={
                                    payableAmount > 0
                                        ? `Pay ₹${payableAmount.toLocaleString("en-IN")}`
                                        : "Buy Reward Points"
                                }
                                onPress={handlePurchasePoints}
                                loading={loading || creatingOrder || verifyingPayment}
                            />
                        </>
                    }
                />
            )}
        </SafeAreaView>
    )
}