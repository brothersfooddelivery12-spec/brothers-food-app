import { verifyCashfreePayment } from '@/Services/api-service'
import { hideLoader, showLoader } from '@/Services/loader-service'
import { topupWallet } from '@/Services/wallet-service'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BHIMUpiIcon from '@/assets/icon/BHIMUpiIcon.svg'
import GooglePayIcon from '@/assets/icon/GooglePayIcon.svg'
import PaytmIcon from '@/assets/icon/PaytmLogo.svg'
import PhonePeIcon from '@/assets/icon/PhonePe.svg'
import SuperMoneyIcon from '@/assets/icon/SuperMoneyLogo.svg'
import UpiIcon from '@/assets/icon/upi.svg'
import GradientButton from '@/components/GradientButton'
import { router } from "expo-router"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Keyboard, Pressable, StatusBar, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import { CashfreePaymentError, useCashfreeUpi } from '../hook/useCashfreeUpi'

const AMOUNTS = [
    500,
    1000,
    2000,
    5000,
    10000,
    20000
]

export default function AddMoneyScreen(){
    const { width } = useWindowDimensions()
    const {showToast} = useToast()

    const [loading, setLoading] = useState(false)
    const [selectedAmount, setSelectedAmount] = useState<number | null>(500)
    const [amount, setAmount] = useState("")
    const [amountError, setAmountError] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

    const amountRef = useRef<TextInput>(null)

    const horizontalPadding = scale(14)
    const gap = scale(8)

    const cardWidth = useMemo(() => {
        return (width - horizontalPadding * 2 - gap * 2) / 3
    }, [width, horizontalPadding, gap])

    const [creatingOrder, setCreatingOrder] = useState(false)
    const [verifyingPayment, setVerifyingPayment] = useState(false)
    const [processingUpiApp, setProcessingUpiApp] = useState<string | null>(null)

    const paymentHandledRef = useRef(false)
    const paymentVerifyingRef = useRef(false)

    const handleVerifyPayment = useCallback(async (cashfreeOrderId: string) => {
        if (
            paymentHandledRef.current ||
            paymentVerifyingRef.current
        ) {
            return
        }

        try {
            paymentVerifyingRef.current = true

            setVerifyingPayment(true)
            showLoader()

            console.log("Verifying payment:", cashfreeOrderId)

            const res = await verifyCashfreePayment({order_id: cashfreeOrderId})

            console.log("Verify response:", res.data)

            const message = res.data.message?.trim().toLowerCase()

            if (
                res.data.success &&
                message === "payment verified successfully"
            ) {
                paymentHandledRef.current = true
                setProcessingUpiApp(null)

                showToast("Payment successful", "success")

                router.replace({
                    pathname: "/order-success",
                    params: {
                        orderId: cashfreeOrderId
                    }
                })

                return
            }

            if (message === "payment is still incomplete") {
                setProcessingUpiApp(null)

                showToast("Payment is incomplete", "warning")

                return
            }

            setProcessingUpiApp(null)

            showToast(res.data.message || "Payment is being verified.", "warning")
        } catch (error: any) {
            console.log("Payment verification error:", error)

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

    const getUpiAppIcon = (packageName: string) => {
        switch (packageName) {
            case "com.google.android.apps.nbu.paisa.user":
                return GooglePayIcon

            case "com.phonepe.app":
                return PhonePeIcon

            case "net.one97.paytm":
                return PaytmIcon

            case "in.org.npci.upiapp":
                return BHIMUpiIcon

            case "money.super.payments":
                return SuperMoneyIcon

            default:
                return UpiIcon
        }
    }

    const getUpiAppName = (packageName: string) => {
        switch (packageName) {
            case "com.google.android.apps.nbu.paisa.user":
                return "Google Pay"

            case "com.phonepe.app":
                return "PhonePe"

            case "net.one97.paytm":
                return "Paytm"

            case "in.org.npci.upiapp":
                return "BHIM"

            case "money.super.payments":
                return "super.money"

            default:
                return "UPI App"
        }
    }

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

    const selectedUpiMethod = useMemo(() => {
        return deviceUpiMethods.find(
            (item) => item.id === selectedPayment
        ) ?? null
    }, [deviceUpiMethods, selectedPayment])

    const handleAddMoney = useCallback(async () => {
        if (loading || creatingOrder || verifyingPayment) {
            return
        }

        const finalAmount = amount.trim()
            ? Number(amount)
            : selectedAmount ?? 0

        if (!finalAmount || Number.isNaN(finalAmount)) {
            setAmountError(true)

            showToast("Please enter a valid amount", "info")

            return
        }

        if (finalAmount < 100) {
            setAmountError(true)

            showToast("Minimum amount is ₹100", "info")

            return
        }

        if (finalAmount > 50000) {
            setAmountError(true)

            showToast("Maximum amount is ₹50,000", "info")

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

            console.log("Wallet topup amount:", finalAmount)

            const res = await topupWallet({
                amount: finalAmount
            })

            console.log("Wallet topup response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to initiate wallet topup", "warning")

                return
            }

            const data = res.data.data ?? res.data
            const orderId = data?.order_id
            const paymentSessionId = data?.payment_session_id

            if (!orderId || !paymentSessionId) {
                showToast("Unable to start payment", "warning")

                return
            }

            setProcessingUpiApp(selectedUpiMethod.packageName)

            setLoading(false)
            setCreatingOrder(false)

            hideLoader()

            // await startUpiPayment({
            //     orderId,
            //     paymentSessionId,
            //     appPackage: selectedUpiMethod.packageName
            // })
        } catch (error: any) {
            console.log("Wallet topup error:", error)

            setProcessingUpiApp(null)

            showToast(error?.message || "Unable to add money", "warning")
        } finally {
            setLoading(false)
            setCreatingOrder(false)

            hideLoader()
        }
    }, [
        amount,
        selectedAmount,
        selectedPayment,
        selectedUpiMethod,
        loading,
        creatingOrder,
        verifyingPayment,
        startUpiPayment
    ])

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
                        Add Money
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Top up your Brothers Wallet
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
                    paddingBottom: verticalScale(25),
                    gap: verticalScale(8)
                }}
                ListHeaderComponent={
                    <>
                        <Text
                            className='text-[#1F1F1F] font-semibold'
                            style={{
                                fontSize: moderateScale(15)
                            }}
                        >
                            Select Amount
                        </Text>

                        <View
                            className="flex-row flex-wrap mt-3"
                            style={{ gap }}
                        >
                            {AMOUNTS.map((amount) => {
                                const isSelected = selectedAmount === amount

                                return (
                                    <TouchableOpacity
                                        key={amount}
                                        activeOpacity={0.95}
                                        onPress={() => {
                                            setSelectedAmount(amount)

                                            setAmount("")
                                            setAmountError(false)
                                        }}
                                        className="items-center justify-center"
                                        style={{
                                            width: cardWidth,
                                            height: verticalScale(38),
                                            borderRadius: moderateScale(14),
                                            backgroundColor: isSelected ? "#3F2516" : "#FFFFFF",
                                            borderWidth: isSelected ? 1 : 1,
                                            borderColor: "rgba(31,31,31,0.10)"
                                        }}
                                    >
                                        <Text
                                            className="font-bold"
                                            style={{
                                                fontSize: moderateScale(14),
                                                color: isSelected ? "#FFFFFF" : "#1F1F1F"
                                            }}
                                        >
                                            ₹{amount.toLocaleString("en-IN")}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <View
                            className="flex-row items-center mx-5"
                            style={{ marginTop: verticalScale(18) }}
                        >
                            <View
                                className="flex-1"
                                style={{
                                    height: 1,
                                    backgroundColor: "rgba(31,31,31,0.10)"
                                }}
                            />

                            <Text
                                className="text-[#1F1F1F]/70 font-semibold"
                                style={{
                                    fontSize: moderateScale(11),
                                    marginHorizontal: scale(15)
                                }}
                            >
                                OR
                            </Text>

                            <View
                                className="flex-1"
                                style={{
                                    height: 1,
                                    backgroundColor: "rgba(31,31,31,0.10)"
                                }}
                            />
                        </View>

                        <Text
                            className='text-[#1F1F1F]/85 font-semibold'
                            style={{
                                fontSize: moderateScale(13),
                                marginTop: moderateScale(18)
                            }}
                        >
                            Enter Amount
                        </Text>

                        <Pressable
                            onPress={() => {
                                if (!loading) {
                                    amountRef.current?.focus()
                                }
                            }}
                            className={`flex-row items-center overflow-hidden ${
                                amountError
                                    ? "border border-red-400"
                                    : "border border-[#1F1F1F]/10"
                            } bg-white`}
                            style={{
                                marginTop: verticalScale(6),
                                paddingRight: scale(10),
                                paddingLeft: scale(9),
                                height: verticalScale(46),
                                borderRadius: moderateScale(18)
                            }}
                        >
                            <View
                                className="items-center justify-center bg-[#F5F5F5]"
                                style={{
                                    width: moderateScale(36),
                                    height: moderateScale(36),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <Text
                                    className="font-bold text-[#655145]"
                                    style={{ fontSize: moderateScale(18) }}
                                >
                                    ₹
                                </Text>
                            </View>

                            <View
                                className="flex-1 justify-center"
                                style={{ paddingHorizontal: scale(10) }}
                            >
                                <TextInput
                                    ref={amountRef}
                                    className={`p-0 tracking-wide font-medium ${
                                        loading
                                            ? "text-[#9CA3AF]"
                                            : "text-[#151515]"
                                    }`}
                                    style={{
                                        height: verticalScale(40),
                                        fontSize: moderateScale(13),
                                        textAlignVertical: "center",
                                        includeFontPadding: false
                                    }}
                                    value={amount}
                                    onChangeText={(text) => {
                                        const cleaned = text.replace(/[^0-9]/g, "")

                                        setAmount(cleaned)
                                        setSelectedAmount(null)
                                        setAmountError(false)
                                    }}
                                    placeholder="Enter amount"
                                    placeholderTextColor="#9A9A9A"
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    maxLength={7}
                                    selectionColor="#79685e"
                                    editable={!loading}
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                />
                            </View>
                        </Pressable>

                        {amountError && (
                            <Text
                                className="self-start font-medium text-[#E05252]"
                                style={{
                                    marginTop: verticalScale(4),
                                    marginLeft: scale(8),
                                    fontSize: moderateScale(11)
                                }}
                            >
                                Please enter a valid amount
                            </Text>
                        )}

                        <Text
                            className='text-[#1F1F1F]/65 font-medium'
                            style={{
                                marginTop: verticalScale(5),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11)
                            }}
                        >
                            Min ₹100  •  Max ₹50,000
                        </Text>

                        <Text
                            className='text-[#1F1F1F] font-semibold'
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: moderateScale(22)
                            }}
                        >
                            Choose Payment Method
                        </Text>

                        {deviceUpiMethods.length > 0 && (
                            <>
                                <View
                                    className="bg-white border border-[#1F1F1F]/10 overflow-hidden mt-3"
                                    style={{ borderRadius: moderateScale(20) }}
                                >
                                    {deviceUpiMethods.map((item, index) => {
                                        const Icon = item.icon
                                        const isLast = index === deviceUpiMethods.length - 1
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
                                                            processingUpiApp !==
                                                                null &&
                                                            !isProcessing
                                                                ? 0.5
                                                                : 1
                                                    }}
                                                >
                                                    <View
                                                        className="items-center justify-center rounded-full bg-[#E5E4E2]/55"
                                                        style={{
                                                            width: moderateScale(42),
                                                            height: moderateScale(42)
                                                        }}
                                                    >
                                                        <Icon
                                                            width={moderateScale(item.size)}
                                                            height={moderateScale(item.size)}
                                                        />
                                                    </View>

                                                    <View className="flex-1 ml-3">
                                                        <Text
                                                            className="text-[#1F1F1F] font-semibold"
                                                            style={{ fontSize: moderateScale(14) }}
                                                        >
                                                            {item.title}
                                                        </Text>

                                                        <Text
                                                            className="text-[#1F1F1F]/65 font-medium mt-1"
                                                            style={{ fontSize: moderateScale(11) }}
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
                                                                ? "#5c4639"
                                                                : "#D6D0CA"
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <View
                                                                style={{
                                                                    width: moderateScale(14),
                                                                    height: moderateScale(14),
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

                        <GradientButton
                            title="Add Money"
                            onPress={handleAddMoney}
                            loading={
                                loading ||
                                creatingOrder ||
                                verifyingPayment
                            }
                        />
                    </>
                }
            />
        </SafeAreaView>
    )
}