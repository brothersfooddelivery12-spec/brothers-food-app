import CrownIcon from '@/assets/icon/CrownIcon.svg'
import CheckCircleIcon from '@/assets/icon/SuccessIcon2.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import { COLORS } from "@/constant/colors"
import { getUpiAppIcon, getUpiAppName } from '@/Features/Checkout/CheckoutScreen'
import { useToast } from '@/Features/hook/ToastContext'
import { CashfreePaymentError, useCashfreeUpi } from '@/Features/hook/useCashfreeUpi'
import { MembershipBenefit, MembershipPlan, upgradeMembership, verifyCashfreePayment } from "@/Services/api-service"
import { getMyWallet, Wallet } from '@/Services/wallet-service'
import { SavedPaymentMethod, usePaymentMethodStore } from '@/Stores/usePaymentMethodStore'
import { hexToRgba } from "@/utils/hexToRgba"
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

interface MembershipPlanModalProps {
    visible: boolean
    plan: MembershipPlan | null
    onCancel: () => void
    onSuccess: (plan: MembershipPlan) => void
}

export default function MembershipPlanModal({
    visible,
    plan,
    onCancel,
    onSuccess
}: MembershipPlanModalProps) {
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

    if (!plan) {
        return null
    }

    const isPlus = plan.code === "BHAICHARA_PLUS"
    const isVip = plan.code === "BHAICHARA_PLUS_VIP"

    const getBenefitText = (benefit: MembershipBenefit): string | null => {
        const { benefit_code, config } = benefit

        switch (benefit_code) {
            case "DELIVERY_DISCOUNT":
                if (!config.percentage) {
                    return null
                }

                return `${config.percentage}% delivery discount`

            case "REWARD_MULTIPLIER":
                return `${config.multiplier ?? 1}x reward points`

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

    const benefits = plan.benefits
        .map(getBenefitText)
        .filter((item): item is string => !!item)

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

            showToast(error?.message || "Unable to fetch wallet", "warning")
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
        if (paymentHandledRef.current || paymentVerifyingRef.current || !plan) {
            return
        }

        try {
            paymentVerifyingRef.current = true
            setVerifyingPayment(true)

            console.log("Verifying membership payment:", cashfreeOrderId)

            const res = await verifyCashfreePayment({
                order_id: cashfreeOrderId
            })

            console.log("Membership payment verification:", res.data)

            const paymentStatus = res.data.data?.status?.trim().toLowerCase() ?? ""

            const message = res.data.message?.trim().toLowerCase() ?? ""

            const isSuccessful = res.data.success &&
                (
                    paymentStatus === "success" ||
                    message === "payment is completed" ||
                    message === "payment verified successfully"
                )

            if (isSuccessful) {
                paymentHandledRef.current = true

                const paymentMethod = currentPaymentUpiRef.current

                if (paymentMethod) {
                    addPaymentMethod(paymentMethod)
                }

                currentPaymentUpiRef.current = null
                currentPurchaseIdRef.current = null

                setProcessingUpiApp(null)

                showToast("Membership activated successfully", "success")

                onSuccess(plan)

                return
            }

            if (paymentStatus === "pending" || paymentStatus === "incomplete") {
                setProcessingUpiApp(null)

                showToast("Payment is incomplete", "warning")

                return
            }

            currentPaymentUpiRef.current = null
            setProcessingUpiApp(null)

            showToast(res.data.message || "Unable to verify membership payment", "warning")
        } catch (error: any) {
            console.log("Membership verification error:", error?.response?.data || error)

            currentPaymentUpiRef.current = null
            currentPurchaseIdRef.current = null

            setProcessingUpiApp(null)

            showToast(error?.response?.data?.message || error?.message ||
                    "Unable to verify membership payment", "warning"
            )
        } finally {
            paymentVerifyingRef.current = false
            setVerifyingPayment(false)
        }
    },[
        plan,
        addPaymentMethod,
        onSuccess
    ])

    const handlePaymentError = useCallback(async (error: CashfreePaymentError) => {
        console.log(
            "Membership Cashfree payment error:",
            {
                message: error.message,
                orderId: error.orderId,
                code: error.code,
                type: error.type,
                status: error.status,
                originalError: error.originalError
            }
        )

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
        currentPurchaseIdRef.current = null

        setProcessing(false)
        setProcessingUpiApp(null)

        showToast(error?.message || "Payment was not completed", "warning")
    },[handleVerifyPayment])

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

    const handleMembershipPurchase = useCallback(async () => {
        if (!plan || isProcessing) {
            return
        }

        if (plan.is_default || plan.price <= 0) {
            showToast("Please select a paid membership plan", "info")

            return
        }

        if (!selectedPayment) {
            showToast("Please select a payment method", "info")

            return
        }

        if (selectedPayment === "wallet") {
            showToast("Wallet payment is not available for membership yet", "info")

            return
        }

        if (!selectedUpiMethod) {
            showToast("Please select a valid UPI app", "info")

            return
        }

        try {
            setProcessing(true)

            paymentHandledRef.current = false
            paymentVerifyingRef.current = false

            currentPaymentUpiRef.current = {
                id: selectedUpiMethod.id,
                type: "UPI",
                name: selectedUpiMethod.title,
                packageName:selectedUpiMethod.packageName
            }

            setProcessingUpiApp(selectedUpiMethod.packageName)

            const res = await upgradeMembership({
                plan_id: plan.id,
                payment_method: "ONLINE"
            })

            console.log("Membership upgrade response:", res.data)

            if (!res.data.success) {
                throw new Error(res.data.message || "Unable to upgrade membership")
            }

            const payment = res.data.data

            if (!payment?.payment_id || !payment?.payment_session_id) {
                throw new Error("Invalid payment session")
            }

            currentPurchaseIdRef.current =
                payment.membership_id ??
                payment.purchase_id ??
                null

            await startUpiPayment({
                orderId: payment.payment_id,
                paymentSessionId: payment.payment_session_id,
                appPackage: selectedUpiMethod.packageName
            })
        } catch (error: any) {
            console.log("Membership purchase error:", error?.response?.data || error)

            currentPaymentUpiRef.current = null
            currentPurchaseIdRef.current = null

            setProcessingUpiApp(null)

            showToast(error?.response?.data?.message || error?.response?.data?.detail || error?.message ||
                "Unable to purchase membership", "warning"
            )
        } finally {
            setProcessing(false)
        }
    }, [
        plan,
        isProcessing,
        selectedPayment,
        selectedUpiMethod,
        startUpiPayment
    ])

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
                        contentContainerStyle={{
                            paddingHorizontal: scale(16),
                            paddingTop: verticalScale(18),
                            paddingBottom: verticalScale(16)
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
                                <CrownIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.secondaryColor} />
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
                                    {plan.name}
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10.5),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.65),

                                        marginTop: verticalScale(1)
                                    }}
                                >
                                    {plan.description}
                                </Text>
                            </View>
                        </View>

                        <View
                            className="relative py-6 px-5 items-center justify-center"
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
                                marginTop: moderateScale(24)
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
                                    Valid for{" "}
                                    {plan.duration_days} days
                                </Text>
                            )}

                            <View
                                style={{
                                    width: "85%",
                                    height: moderateScale(0.7),
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: scale(22)
                                }}
                            />

                            <Text
                                className="font-medium text-center"
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                    fontSize: moderateScale(11),
                                    paddingHorizontal: scale(10)
                                }}
                            >
                                What's included
                            </Text>

                            <View
                                className="items-center"
                                style={{ marginTop: verticalScale(1) }}
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
                        </View>

                        <Text
                            className="font-medium text-center"
                            style={{
                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                fontSize: moderateScale(10.5),
                                lineHeight: moderateScale(16),
                                marginTop: verticalScale(14)
                            }}
                        >
                            Continue to select your payment
                            method and activate your membership.
                        </Text>

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
                                onPress={handleMembershipPurchase}
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
                                        Pay • ₹{plan.price}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}