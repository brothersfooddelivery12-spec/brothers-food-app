import ClockFilledIcon from '@/assets/icon/ClockFilledIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import { getUpiAppIcon, getUpiAppName } from '@/Features/Checkout/CheckoutScreen'
import { useToast } from '@/Features/hook/ToastContext'
import { CashfreePaymentError, useCashfreeUpi } from '@/Features/hook/useCashfreeUpi'
import { retryOrderPayment, verifyCashfreePayment } from '@/Services/api-service'
import { SavedPaymentMethod, usePaymentMethodStore } from '@/Stores/usePaymentMethodStore'
import LottieView from "lottie-react-native"
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type RetryPaymentItem = {
    id: string
    name: string
    quantity: number
    unit_price: number
    total: number
}

export type RetryPaymentOrder = {
    id: string
    restaurantId: string
    restaurantName: string
    amount: number
    paymentRetry: number | null
    items: RetryPaymentItem[]

    receiverName: string
    receiverPhone: string

    addressLine: string
    landmark?: string | null
    area: string
    city: string
    state: string
    pincode: string
}

export interface OrderSuccessParams {
    [key: string]: string | undefined
    orderId: string
    restaurantName: string
    restaurantId: string
    totalAmount: string
    paymentMethod: string
    items: string
}

interface RetryPaymentModalProps {
    visible: boolean

    orderId: string
    restaurantId: string
    restaurantName: string

    amount: number
    paymentRetry?: number | null

    items: RetryPaymentItem[]

    receiverName: string
    receiverPhone: string

    addressLine: string
    landmark?: string | null
    area: string
    city: string
    state: string
    pincode: string

    onCancel: () => void
    onPaymentSuccess: (params: OrderSuccessParams) => void
}

const RetryPaymentModal = memo(({
    visible,

    orderId,
    restaurantId,
    restaurantName,

    amount,
    paymentRetry,

    items,

    receiverName,
    receiverPhone,

    addressLine,
    landmark,
    area,
    city,
    state,
    pincode,

    onCancel,
    onPaymentSuccess
}: RetryPaymentModalProps) => {
    const {showToast} = useToast()
    const [creatingOrder, setCreatingOrder] = useState(false)
    const [verifyingPayment, setVerifyingPayment] = useState(false)
    const [processingUpiApp, setProcessingUpiApp] = useState<string | null>(null)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

    const isPaymentProcessing = creatingOrder || verifyingPayment
    
    const {savedPaymentMethods, addPaymentMethod, removePaymentMethod} = usePaymentMethodStore()

    const currentPaymentUpiRef = useRef<SavedPaymentMethod | null>(null)
    const currentOrderIdRef = useRef<string | null>(null)
    const paymentHandledRef = useRef(false)
    const paymentVerifyingRef = useRef(false)

    const formattedDeliveryAddress = useMemo(() => {
        return [
            addressLine,
            landmark,
            area,
            city,
            state,
            pincode
        ]
            .filter(Boolean)
            .join(", ")
    }, [
        addressLine,
        landmark,
        area,
        city,
        state,
        pincode
    ])

    const handleVerifyPayment = useCallback(async (cashfreeOrderId: string) => {
        if (paymentHandledRef.current || paymentVerifyingRef.current) {
            return
        }

        try {
            paymentVerifyingRef.current = true

            setVerifyingPayment(true)

            console.log("Verifying payment:", cashfreeOrderId)

            const res = await verifyCashfreePayment({order_id: cashfreeOrderId})

            console.log("Verify response:", res.data)

            const message = res.data.message?.trim().toLowerCase() ?? ""
            const paymentStatus = res.data.data?.status?.trim().toLowerCase() ?? ""

            if (res.data.success &&
                (
                    paymentStatus === "success" ||
                    message === "payment is completed" ||
                    message === "payment verified successfully"
                )
            ) {
                paymentHandledRef.current = true

                const paymentMethod = currentPaymentUpiRef.current

                const backendOrderId = currentOrderIdRef.current

                if (paymentMethod) {
                    addPaymentMethod(paymentMethod)

                    currentPaymentUpiRef.current = null
                }

                setProcessingUpiApp(null)

                const successParams = {
                    orderId: backendOrderId ?? orderId,
                    restaurantName,
                    restaurantId,
                    totalAmount: amount.toString(),
                    paymentMethod: paymentMethod?.type ?? "UPI",
                    items: JSON.stringify(items)
                }

                showToast("Payment successful", "success")

                onPaymentSuccess(successParams)

                currentOrderIdRef.current = null

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
        }
    }, [
        orderId,
        restaurantId,
        restaurantName,
        amount,
        items,
        addPaymentMethod,
        onCancel
    ])

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

            showToast(error.message || "Payment was not completed", "warning")
        },
        [handleVerifyPayment]
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

    const handleRetryPayment = useCallback(async () => {
        if (isPaymentProcessing) {
            return
        }

        if (!selectedUpiMethod) {
            showToast("Please select a payment method", "info")

            return
        }

        try {
            setCreatingOrder(true)

            paymentHandledRef.current = false
            paymentVerifyingRef.current = false

            currentOrderIdRef.current = orderId

            currentPaymentUpiRef.current = {
                id: selectedUpiMethod.id,
                type: "UPI",
                name: selectedUpiMethod.title,
                packageName: selectedUpiMethod.packageName
            }

            setProcessingUpiApp(selectedUpiMethod.packageName)

            const res = await retryOrderPayment(orderId)

            console.log("Retry payment response:", res.data)

            if (!res.data.success) {
                throw new Error(res.data.message || "Unable to retry payment.")
            }

            const payment = res.data.data

            if (!payment?.payment_id || !payment?.payment_session_id) {
                throw new Error("Invalid payment session.")
            }

            await startUpiPayment({
                orderId: payment.payment_id,
                paymentSessionId: payment.payment_session_id,
                appPackage: selectedUpiMethod.packageName
            })
        } catch (error: any) {
            console.log("Retry payment error:", error?.response?.data || error)

            currentPaymentUpiRef.current = null
            currentOrderIdRef.current = null

            setProcessingUpiApp(null)

            showToast(error?.response?.data?.message || error?.message || "Unable to retry payment.", "warning")
        } finally {
            setCreatingOrder(false)
        }
    }, [orderId, selectedUpiMethod, isPaymentProcessing, startUpiPayment])

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="fade"
            onRequestClose={() => {
                if (!isPaymentProcessing) {
                    onCancel()
                }
            }}
        >
            <View className="flex-1 justify-end">
                <Pressable
                    onPress={() => {
                        if (!isPaymentProcessing) {
                            onCancel()
                        }
                    }}
                    className="absolute inset-0 bg-black/50"
                />

                <View
                    className="bg-[#FFFFFF] border border-[#1F1F1F]/10 overflow-hidden"
                    style={{
                        marginHorizontal: scale(8),
                        marginBottom: verticalScale(22),
                        borderRadius: moderateScale(24),
                        maxHeight: "88%"
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
                        <View
                            className="flex-row items-center"
                            style={{ gap: scale(10) }}
                        >
                            <View
                                className="items-center justify-center"
                                style={{
                                    width: moderateScale(38),
                                    height: moderateScale(38),
                                    borderRadius: moderateScale(12),
                                    backgroundColor: "rgba(232,185,63,0.15)"
                                }}
                            >
                                <ClockFilledIcon width={moderateScale(21)} height={moderateScale(21)} color="#3F2516" strokeWidth={1.8} />
                            </View>

                            <View className="flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(16) }}
                                >
                                    Payment pending
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{
                                        fontSize: moderateScale(10.5),
                                        marginTop: verticalScale(1)
                                    }}
                                >
                                    Complete your payment to confirm the order.
                                </Text>
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                lineHeight: moderateScale(18),
                                marginTop: verticalScale(13)
                            }}
                        >
                            Your order from{" "}
                            <Text className="text-[#1F1F1F] font-bold">
                                {restaurantName}
                            </Text>{" "}
                            is waiting for payment.
                        </Text>

                        <View
                            className="bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{
                                borderWidth: moderateScale(0.7),
                                marginTop: verticalScale(14),
                                borderRadius: moderateScale(16),
                                paddingHorizontal: scale(10),
                                paddingVertical: verticalScale(10)
                            }}
                        >
                            <View className="flex-row items-start">
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        width: moderateScale(34),
                                        height: moderateScale(34),
                                        borderRadius: moderateScale(11),
                                        backgroundColor: "rgba(232,185,63,0.15)"
                                    }}
                                >
                                    <LocationIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" />
                                </View>

                                <View
                                    className="flex-1"
                                    style={{ marginLeft: scale(10) }}
                                >
                                    <Text
                                        className="text-[#1F1F1F] font-semibold"
                                        style={{ fontSize: moderateScale(12.5) }}
                                    >
                                        Delivery Address
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium"
                                        style={{
                                            fontSize: moderateScale(10.5),
                                            lineHeight: moderateScale(15),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        {formattedDeliveryAddress}
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{
                                            fontSize: moderateScale(10),
                                            marginTop: verticalScale(4)
                                        }}
                                    >
                                        {receiverName}
                                        {receiverPhone
                                            ? ` • ${receiverPhone}`
                                            : ""
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {items.length > 0 && (
                            <View
                                className="bg-[#FAFAFA] border-[#1F1F1F]/10"
                                style={{
                                    borderWidth: moderateScale(0.7),
                                    marginTop: verticalScale(14),
                                    borderRadius: moderateScale(16),
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(5)
                                }}
                            >
                                {items.map((item, index) => (
                                    <View
                                        key={item.id}
                                        className="relative"
                                    >
                                        <View
                                            className="flex-row items-center"
                                            style={{ paddingVertical: verticalScale(10) }}
                                        >
                                            <View
                                                className="items-center justify-center bg-[#3F2516]"
                                                style={{
                                                    width: moderateScale(28),
                                                    height: moderateScale(28),
                                                    borderRadius: moderateScale(10)
                                                }}
                                            >
                                                <Text
                                                    className="text-[#FFFFFF] font-bold"
                                                    style={{ fontSize: moderateScale(10.5) }}
                                                >
                                                    {item.quantity}×
                                                </Text>
                                            </View>

                                            <View
                                                className="flex-1"
                                                style={{ marginLeft: scale(8) }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    className="text-[#1F1F1F] font-semibold"
                                                    style={{ fontSize: moderateScale(12) }}
                                                >
                                                    {item.name}
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F]/65 font-medium"
                                                    style={{
                                                        fontSize: moderateScale(10),
                                                        marginTop: verticalScale(2)
                                                    }}
                                                >
                                                    ₹{item.unit_price} each
                                                </Text>
                                            </View>

                                            <Text
                                                className="text-[#1F1F1F] font-bold"
                                                style={{ fontSize: moderateScale(13) }}
                                            >
                                                ₹{item.total}
                                            </Text>
                                        </View>

                                        {index <
                                            items.length - 1 && (
                                            <View
                                                style={{
                                                    height: moderateScale(0.7),
                                                    backgroundColor: "rgba(31,31,31,0.10)"
                                                }}
                                            />
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        <View
                            className="bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{
                                borderWidth: moderateScale(0.7),
                                marginTop: verticalScale(14),
                                borderRadius: moderateScale(16),
                                paddingHorizontal: scale(14),
                                paddingVertical: verticalScale(12)
                            }}
                        >
                            <View className="flex-row items-center justify-between">
                                <Text
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{ fontSize: moderateScale(11.5) }}
                                >
                                    Amount to pay
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(17) }}
                                >
                                    ₹{amount}
                                </Text>
                            </View>

                            {paymentRetry != null && (
                                <>
                                    <View
                                        style={{
                                            height: moderateScale(0.7),
                                            backgroundColor: "rgba(31,31,31,0.10)",
                                            marginVertical: verticalScale(10)
                                        }}
                                    />

                                    <View className="flex-row items-center gap-2">
                                        <ClockIcon width={moderateScale(16)} height={moderateScale(16)} color="#B7791F" strokeWidth={1.8} />

                                        <Text
                                            className="text-[#B7791F] font-semibold flex-1"
                                            style={{ fontSize: moderateScale(11.5) }}
                                        >
                                            {paymentRetry > 0
                                                ? `Complete payment within ${paymentRetry} min`
                                                : "Retry payment now"
                                            }
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                        {savedDeviceUpiMethods.length > 0 && (
                            <>
                                <Text
                                    className="text-[#1F1F1F] font-semibold mt-8 mb-2"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Saved Payment Method
                                </Text>
        
                                <View
                                    className="bg-[#FAFAFA] border-[#1F1F1F]/10 overflow-hidden"
                                    style={{ borderRadius: moderateScale(20), borderWidth: moderateScale(0.5) }}
                                >
                                    {savedDeviceUpiMethods.map((item, index) => {
                                        const isSelected = selectedPayment === item.id
                                        const isLast = index === savedDeviceUpiMethods.length - 1
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
                                                        paddingVertical: verticalScale(10)
                                                    }}
                                                >
                                                    <View
                                                        className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                                                        style={{
                                                            width: moderateScale(40),
                                                            height: moderateScale(40)
                                                        }}
                                                    >
                                                        <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color="#3F2516" />
                                                    </View>
        
                                                    <View className="flex-1 ml-3">
                                                        <Text
                                                            className="text-[#1F1F1F] font-semibold"
                                                            style={{ fontSize: moderateScale(13) }}
                                                        >
                                                            {item.title}
                                                        </Text>
        
                                                        {item.description && (
                                                            <Text
                                                                className="text-[#1F1F1F]/75 font-medium mt-1"
                                                                style={{ fontSize: moderateScale(10) }}
                                                            >
                                                                {item.description}
                                                            </Text>
                                                        )}
                                                    </View>
        
                                                    <View
                                                        className='border border-[#1F1F1F]/10 items-center justify-center'
                                                        style={{
                                                            borderRadius: moderateScale(8),
                                                            paddingHorizontal: scale(8),
                                                            paddingVertical: verticalScale(3)
                                                        }}
                                                    >
                                                        <Text 
                                                            className='text-[#1F1F1F] font-medium uppercase'
                                                            style={{ fontSize: moderateScale(9) }}
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
                                                                ? "#5c4639"
                                                                : "#D6D0CA"
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <View
                                                                style={{
                                                                    width: moderateScale(12),
                                                                    height: moderateScale(12),
                                                                    borderRadius: "100%",
                                                                    backgroundColor: "#5c4639"
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
        
                                                {!isLast && (
                                                    <View
                                                        className="bg-[#1F1F1F]/10"
                                                        style={{
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
                                    className="text-[#1F1F1F] font-semibold mb-2"
                                    style={{
                                        fontSize: moderateScale(13),
                                        marginTop: savedPaymentMethods.length > 0 ? moderateScale(14) : moderateScale(18)
                                    }}
                                >
                                    {savedPaymentMethods.length > 0 ? "Other UPI Apps" : "UPI Apps"}
                                </Text>

                                <View
                                    className="bg-[#FAFAFA] border-[#1F1F1F]/10 overflow-hidden"
                                    style={{ borderRadius: moderateScale(20), borderWidth: moderateScale(0.5) }}
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
                                                        opacity: 
                                                            processingUpiApp !== null &&
                                                            !isProcessing ? 0.5 : 1
                                                    }}
                                                >
                                                    <View
                                                        className="items-center justify-center rounded-full bg-[#E5E4E2]/65"
                                                        style={{
                                                            width: moderateScale(40),
                                                            height: moderateScale(40)
                                                        }}
                                                    >
                                                        <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} />
                                                    </View>

                                                    <View className="flex-1 ml-3">
                                                        <Text
                                                            className="text-[#1F1F1F] font-semibold"
                                                            style={{ fontSize: moderateScale(13) }}
                                                        >
                                                            {item.title}
                                                        </Text>

                                                        <Text
                                                            className="text-[#1F1F1F]/65 font-medium mt-1"
                                                            style={{ fontSize: moderateScale(10) }}
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
                                                                ? "#5c4639"
                                                                : "#D6D0CA"
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <View
                                                                style={{
                                                                    width: moderateScale(12),
                                                                    height: moderateScale(12),
                                                                    borderRadius: "100%",
                                                                    backgroundColor: "#5c4639"
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>

                                                {!isLast && (
                                                    <View
                                                        className="bg-[#1F1F1F]/10"
                                                        style={{
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

                        <View
                            className="flex-row"
                            style={{
                                gap: scale(12),
                                marginTop: verticalScale(20)
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.95}
                                disabled={isPaymentProcessing}
                                onPress={onCancel}
                                className="flex-1 items-center justify-center bg-[#E5E4E2]/65"
                                style={{
                                    height: verticalScale(44),
                                    borderRadius: moderateScale(20)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Not Now
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                disabled={isPaymentProcessing}
                                onPress={handleRetryPayment}
                                className="flex-1 items-center justify-center bg-[#3F2516]"
                                style={{
                                    height: verticalScale(44),
                                    borderRadius: moderateScale(20)
                                }}
                            >
                                {isPaymentProcessing ? (
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
                                        className="text-[#FFFFFF] font-semibold"
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Retry Payment
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

RetryPaymentModal.displayName = "RetryPaymentModal"

export default RetryPaymentModal