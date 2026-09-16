import AddLocationIcon from '@/assets/icon/AddLocationIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import { default as ArrowRight, default as ArrowRightIcon } from '@/assets/icon/ArrowRight.svg'
import BHIMUpiIcon from '@/assets/icon/BHIMUpiIcon.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import CouponIcon from '@/assets/icon/CouponIcon.svg'
import CreditCardIcon from '@/assets/icon/DebitCardIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import DescriptionIcon from '@/assets/icon/DescriptionIcon.svg'
import GooglePayIcon from '@/assets/icon/GooglePayIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import MoneyBagIcon from '@/assets/icon/MoneyBagIcon.svg'
import PaytmIcon from '@/assets/icon/PaytmLogo.svg'
import PhonePeIcon from '@/assets/icon/PhonePe.svg'
import PlusSignCircleIcon from '@/assets/icon/PlusSignCircleIcon.svg'
import SuperMoneyIcon from '@/assets/icon/SuperMoneyLogo.svg'
import ClockIcon from '@/assets/icon/TimerIcon.svg'
import UpiIcon from '@/assets/icon/upi.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import OrderPriceRow from "@/Features/Cart/Components/OrderPriceRow"
import { usePreventDoublePress } from "@/Features/hook/usePreventDoublePress"
import { Image } from "expo-image"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from 'react-native-svg'
import { getAllAddresses, UserAddress } from '../../Services/address-service'
import { CartPreview, CartPreviewRequest, createCheckoutOrder, CreateOrderRequest, getCartPreview, OrderPaymentMethod, verifyCashfreePayment } from '../../Services/api-service'
import { hideLoader, showLoader } from '../../Services/loader-service'
import { getMyWallet, Wallet } from '../../Services/wallet-service'
import { useAddressRefreshStore } from '../../Stores/address-refresh-store'
import { useCartStore } from '../../Stores/useCartStore'
import CartItemRow from '../Cart/Components/CartItemRow'
import { useToast } from '../hook/ToastContext'
import { CashfreePaymentError, useCashfreeUpi } from '../hook/useCashfreeUpi'
import AddressCard from "./Components/AddressCard"

export type PaymentMethod = {
    id: string
    title: string
    description: string
    paymentType: string
    icon: React.FC<SvgProps>
    size: number
    isDefault?: boolean
}

const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: "gpay",
        title: "Google Pay",
        description: "harshsuthar@oksbi",
        paymentType: "upi",
        icon: GooglePayIcon,
        size: 20
    },
    {
        id: "phonepe",
        title: "PhonePe",
        description: "harshsuthar@ybl",
        paymentType: "upi",
        icon: PhonePeIcon,
        size: 20
    },
    {
        id: "paytm",
        title: "Paytm",
        description: "harshsuthar@paytm",
        paymentType: "upi",
        icon: PaytmIcon,
        size: 28
    },
    {
        id: "hdfc-card",
        title: "HDFC Bank ****4567",
        description: "Credit Card",
        paymentType: "card",
        icon: CreditCardIcon,
        size: 22
    }
]

export default function CheckoutScreen() {
    const { restaurantId } = useLocalSearchParams<{restaurantId: string}>()
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const {showToast} = useToast()

    const hasFetchedAddresses = useRef(false)
    const addressesDirty = useAddressRefreshStore((state) => state.addressesDirty)
    const clearAddressesDirty = useAddressRefreshStore((state) => state.clearAddressesDirty)

    const [addresses, setAddresses] = useState<UserAddress[]>([])
    const [loadingAddresses, setLoadingAddresses] = useState(true)
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
    const [couponSavings, setCouponSavings] = useState(0)
    const [loading, setLoading] = useState(true)
    const [wallet, setWallet] = useState<Wallet | null>(null)
    const [hasPreviewLoaded, setHasPreviewLoaded] = useState(false)

    const fetchWallet = useCallback(async () => {
        try {
            setLoading(true)

            const res = await getMyWallet()

            console.log("Wallet response:", res.data)

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

    useFocusEffect(
        useCallback(() => {
            fetchWallet()
        }, [fetchWallet])
    )

    const walletBalance = wallet?.balance ?? 0

    const OTHER_PAYMENT_METHODS = useMemo(
        () => [
            {
                id: "cod",
                title: "Cash on Delivery",
                description: "Pay in cash when your order is delivered",
                icon: MoneyBagIcon
            },
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

    const fetchAddresses = useCallback(
        async () => {
            try {
                setLoadingAddresses(true)

                const res = await getAllAddresses()

                console.log("Addresses response:", res.data)

                if (!res.data.success) {
                    showToast(res.data.message || "Unable to fetch addresses", "warning")

                    return
                }

                const fetchedAddresses = res.data.data ?? []

                const defaultAddress =
                    fetchedAddresses.find(
                        (address: UserAddress) => address.is_default
                    ) ?? fetchedAddresses[0]

                setAddresses(fetchedAddresses)

                if (defaultAddress) {
                    setSelectedAddress(
                        (currentAddress) =>
                            currentAddress ?? defaultAddress.id
                    )
                }
            } catch (error: any) {
                console.log("Fetch addresses error:", error)

                showToast(error?.message || "Unable to fetch addresses", "warning")
            } finally {
                setLoadingAddresses(false)
            }
        },[]
    )

    useFocusEffect(
        useCallback(() => {
            const shouldFetch = !hasFetchedAddresses.current || addressesDirty

            if (!shouldFetch) {
                return
            }

            const loadAddresses = async () => {
                await fetchAddresses()

                hasFetchedAddresses.current = true

                if (addressesDirty) {
                    clearAddressesDirty()
                }
            }

            loadAddresses()

        }, [addressesDirty, clearAddressesDirty, fetchAddresses])
    )

    const router = useRouter()

    const [creatingOrder, setCreatingOrder] = useState(false)
    const [verifyingPayment, setVerifyingPayment] = useState(false)
    const [processingUpiApp, setProcessingUpiApp] = useState<string | null>(null)

    const horizontalPadding = scale(28)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 2

    const carts = useCartStore((state) => state.carts)

    const selectedCart = useMemo(() => {
        if (!restaurantId) {
            return null
        }

        return (
            carts.find((cart) => cart.id === restaurantId) ?? null
        )
    }, [carts, restaurantId])

    const [imageError, setImageError] = useState(false)
    
    const DefaultRestaurantLogo = require("../../../assets/images/Default_Restaurant_Logo.png")

    useEffect(() => {
        setImageError(true)
    }, [selectedCart?.restaurantLogoUrl])

    const hasImage = !!selectedCart?.restaurantLogoUrl && !imageError

    const [cartPreview, setCartPreview] = useState<CartPreview | null>(null)
    const [previewLoading, setPreviewLoading] = useState(false)

    const handleCartPreview = useCallback(
        async () => {
            if (
                !selectedCart ||
                selectedCart.items.length === 0 ||
                !selectedAddress
            ) {
                return
            }

            try {
                setPreviewLoading(true)

                const payload: CartPreviewRequest = {
                    restaurant_id: selectedCart.id,
                    address_id: selectedAddress,
                    items: selectedCart.items.map(
                        (item) => ({
                            menu_id: item.id,
                            quantity: item.quantity
                        })
                    )
                }

                console.log("Cart preview payload:", payload)

                const res = await getCartPreview(payload)

                console.log("Cart preview response:", res.data)

                if (res.data.success) {
                    setCartPreview(res.data.data)
                }
            } catch (error: any) {
                console.log("Cart preview error:", error?.response?.data || error?.message || error)

                showToast(error?.message || "Unable to calculate cart", "warning")
            } finally {
                setPreviewLoading(false)
                setHasPreviewLoaded(true)
            }
        },
        [selectedCart, selectedAddress]
    )

    useEffect(() => {
        if (
            loadingAddresses ||
            !selectedAddress ||
            !selectedCart ||
            selectedCart.items.length === 0
        ) {
            return
        }

        handleCartPreview()
    }, [loadingAddresses, selectedAddress, selectedCart, handleCartPreview])

    const itemsTotal = Number(cartPreview?.subtotal ?? 0)
    const deliveryFee = Number(cartPreview?.delivery_fee ?? 0)
    const gstAndTaxes = Number(cartPreview?.taxes ?? 0)
    const platformFee = selectedCart ? 5 : 0
    const packingFee = selectedCart ? 20 : 0
    const grandTotal = Math.max(
        itemsTotal +
            deliveryFee +
            gstAndTaxes -
            couponSavings,
        0
    )

    const hasUnavailableItems = useMemo(() => {
        if (!selectedCart) {
            return false
        }

        return selectedCart.items.some(
            (item) => !item.isAvailable
        )
    }, [selectedCart])

    const canPlaceOrder =
        !!selectedCart &&
        selectedCart.isOpen &&
        selectedCart.items.length > 0 &&
        !hasUnavailableItems &&
        !!selectedPayment

    const isPaymentProcessing =
        creatingOrder ||
        verifyingPayment

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

    const isCheckoutLoading =
        loadingAddresses ||
        loadingApps ||
        (
            addresses.length > 0 &&
            !!selectedCart &&
            !hasPreviewLoaded
        )
    
    const isPreviewRefreshing = hasPreviewLoaded && previewLoading

    useEffect(() => {
        if (isPreviewRefreshing) {
            showLoader()
            return
        }

        hideLoader()
    }, [
        isPreviewRefreshing,
        showLoader,
        hideLoader
    ])

    useEffect(() => {
        return () => {
            hideLoader()
        }
    }, [hideLoader])

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
    }, [
        deviceUpiMethods,
        selectedPayment
    ])

    const getOrderPaymentMethod = (): OrderPaymentMethod => {
        if (selectedPayment === "cod") {
            return "COD"
        }

        if (selectedPayment === "wallet") {
            return "WALLET"
        }

        if (selectedPayment?.startsWith("upi-")) {
            return "ONLINE"
        }

        return "ONLINE"
    }

    const handlePlaceOrder = useCallback(async () => {
        if (!selectedCart) {
            return
        }

        if (!selectedAddress) {
            showToast("Please select a delivery address", "info")
            
            return
        }

        if (!selectedCart.isOpen) {
            showToast("Restaurant is currently closed", "info")
            
            return
        }

        if (hasUnavailableItems) {
            showToast("Some items are currently unavailable", "info")
            
            return
        }

        if (!selectedPayment) {
            showToast("Please select a payment method", "info")
            
            return
        }

        if (creatingOrder || verifyingPayment) {
            return
        }

        if (selectedPayment === "wallet") {
            if (loading) {
                showToast("Please wait while we check your wallet balance", "info")
                
                return
            }

            if (!wallet) {
                showToast("Unable to access your wallet", "warning")
                return

            }

            const walletBalance = Number(wallet.balance ?? 0)

            const payableAmount = Number(grandTotal ?? 0)

            if (walletBalance <= 0) {
                showToast("Your Brothers Wallet has insufficient balance", "info")
                
                return
            }

            if (walletBalance < payableAmount) {
                const requiredAmount = payableAmount - walletBalance

                showToast(
                    `Add ₹${requiredAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 2
                    })} to continue.`,
                    "info"
                )

                return
            }
        }

        const payload: CreateOrderRequest = {
            restaurant_id: selectedCart.id,
            address_id: selectedAddress,
            payment_method: getOrderPaymentMethod(),
            items:
                selectedCart.items.map(
                    (item) => ({
                        menu_id: item.id,
                        quantity: item.quantity
                    })
                ),
            note: "Hello Order Kar po"
        }

        try {
            setCreatingOrder(true)
            showLoader()

            console.log("Create Order Payload:", payload)

            if (selectedPayment === "wallet") {
                const res = await createCheckoutOrder(payload)

                console.log("Wallet order response:", res.data)

                if (!res.data.success) {
                    throw new Error(res.data.message || "Unable to place order.")
                }

                const orderId = res.data.data?.order_id

                if (!orderId) {
                    throw new Error("Order ID not found.")
                }

                router.replace({
                    pathname: "/order-success",
                    params: {
                        orderId
                    }
                })

                return
            }

            if (selectedPayment === "cod") {
                const res = await createCheckoutOrder(payload)

                console.log("COD order response:", res.data)

                if (!res.data.success) {
                    throw new Error(res.data.message || "Unable to place order.")
                }

                const orderId = res.data.data?.order_id

                if (!orderId) {
                    throw new Error("Order ID not found.")
                }

                router.replace({
                    pathname: "/order-success",
                    params: {
                        orderId
                    }
                })

                return
            }

            if (selectedUpiMethod) {
                setProcessingUpiApp(selectedUpiMethod.packageName)

                const res = await createCheckoutOrder(payload)

                console.log("UPI order response:", res.data)

                if (!res.data.success) {
                    throw new Error(res.data.message || "Unable to create order.")
                }

                const payment = res.data.data

                if (!payment?.order_id || !payment?.payment_session_id) {
                    throw new Error("Invalid Cashfree payment session.")
                }

                paymentHandledRef.current = false
                paymentVerifyingRef.current = false

                await startUpiPayment({
                    orderId: payment.order_id,
                    paymentSessionId: payment.payment_session_id,
                    appPackage: selectedUpiMethod.packageName
                })

                return
            }

            showToast("This payment method is not available yet.", "warning")
        } catch (error: any) {
            console.log("Place order error:", error)

            setProcessingUpiApp(null)

            showToast(error?.message || "Unable to place order.", "warning")
        } finally {
            setCreatingOrder(false)
            hideLoader()
        }
    }, [
        selectedCart,
        selectedAddress,
        selectedPayment,
        selectedUpiMethod,
        hasUnavailableItems,
        creatingOrder,
        verifyingPayment,
        loading,
        wallet,
        grandTotal,
        getOrderPaymentMethod,
        startUpiPayment,
        router
    ])

    const LoadingDots = React.memo(() => {
        const [count, setCount] = useState(0)

        useEffect(() => {
            const interval = setInterval(() => {
                setCount((prev) =>
                    prev === 3 ? 0 : prev + 1
                )
            }, 450)

            return () => clearInterval(interval)
        }, [])

        return (
            <View
                style={{
                    width: moderateScale(16)
                }}
            >
                <Text
                    className="text-[#3F2516] font-extrabold"
                    style={{
                        fontSize: moderateScale(15.5)
                    }}
                >
                    {".".repeat(count)}
                </Text>
            </View>
        )
    })

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
                    marginBottom: verticalScale(10),
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
                        Checkout
                    </Text>
                    
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Almost there! Review your order before placing it.
                    </Text>
                </View>
            </View>

            {isCheckoutLoading ? (
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
            ) : !selectedCart ? (
                <View
                    className="flex-1 items-center justify-center"
                    style={{
                        paddingHorizontal: scale(30),
                        paddingBottom:
                            insets.bottom +
                            verticalScale(40)
                    }}
                >
                    <View
                        className="items-center justify-center bg-[#E8B93F]/15"
                        style={{
                            width: moderateScale(82),
                            height: moderateScale(82),
                            borderRadius: moderateScale(30),
                            marginBottom: verticalScale(18)
                        }}
                    >
                        <CartIcon
                            width={moderateScale(38)}
                            height={moderateScale(38)}
                            color="#3F2516"
                            strokeWidth={1.5}
                        />
                    </View>

                    <Text
                        className="text-[#1F1F1F] font-extrabold text-center"
                        style={{
                            fontSize: moderateScale(19)
                        }}
                    >
                        Cart not found
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/60 font-medium text-center"
                        style={{
                            fontSize: moderateScale(11),
                            marginTop: verticalScale(6),
                            lineHeight: moderateScale(17),
                            paddingHorizontal: scale(20)
                        }}
                    >
                        The selected restaurant cart is no longer available.
                        Please return to your cart and select a restaurant.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => router.back()}
                        className="flex-row items-center justify-center bg-[#3F2516]"
                        style={{
                            gap: moderateScale(6),
                            marginTop: verticalScale(20),
                            paddingHorizontal: scale(22),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(22)
                        }}
                    >
                        <Text
                            className="text-white font-semibold"
                            style={{
                                fontSize: moderateScale(13)
                            }}
                        >
                            Back to Cart
                        </Text>

                        <ArrowRight
                            width={moderateScale(17)}
                            height={moderateScale(17)}
                            color="#FFFFFF"
                            strokeWidth={1.8}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={[{}]}
                        renderItem={null}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="none"
                        contentContainerStyle={{
                            paddingHorizontal: scale(14),
                            paddingBottom: verticalScale(85)
                        }}
                        ListHeaderComponent={
                            <View className="mt-3">
                                {selectedCart && (
                                    <View
                                        className="bg-white border border-[#1F1F1F]/10 overflow-hidden"
                                        style={{ borderRadius: moderateScale(20)}}
                                    >
                                        <View className="p-3 flex-row items-center gap-2">
                                            <View
                                                className="relative items-start overflow-hidden justify-center self-start rounded-full"
                                                style={{
                                                    width: moderateScale(52),
                                                    height: moderateScale(52),
                                                    borderWidth: !hasImage && !selectedCart.isOpen ? 1 : 0,
                                                    borderColor: "rgba(31,31,31,0.08)"
                                                }}
                                            >
                                                <Image
                                                    source={
                                                        hasImage
                                                            ? {
                                                                uri: selectedCart.restaurantLogoUrl!
                                                            }
                                                            : DefaultRestaurantLogo
                                                    }
                                                    contentFit="cover"
                                                    cachePolicy="memory-disk"
                                                    transition={0}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                />
                                            </View>
        
                                            <View className="flex-1">
                                                <Text
                                                    numberOfLines={1}
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{ fontSize: moderateScale(14) }}
                                                >
                                                    {selectedCart.restaurantName}
                                                </Text>
        
                                                <View className="flex-row gap-1 items-center mt-1">
                                                    <View
                                                        className="flex-row items-center justify-center"
                                                        style={{
                                                            gap: moderateScale(5),
                                                            paddingHorizontal: moderateScale(7),
                                                            paddingVertical: moderateScale(3),
                                                            borderRadius: moderateScale(10),
                                                            backgroundColor: "rgba(232,185,63,0.15)"
                                                        }}
                                                    >
                                                        <DeliveryIcon
                                                            width={moderateScale(16)}
                                                            height={moderateScale(16)}
                                                            color={"#5C4639"}
                                                        />
                        
                                                        <Text
                                                            className="font-semibold"
                                                            style={{
                                                                fontSize: moderateScale(10),
                                                                color: "#5C4639"
                                                            }}
                                                        >
                                                            {selectedCart.deliveryFee === 0 ? "FREE" : `₹${selectedCart.deliveryFee}`}
                                                        </Text>
                                                    </View>
                        
                                                    <View className="flex-row items-center gap-1">
                                                        <View
                                                            className="items-center justify-center rounded-full"
                                                            style={{
                                                                width: moderateScale(22),
                                                                height: moderateScale(22),
                                                                backgroundColor: "rgba(232,185,63,0.15)"
                                                            }}
                                                        >
                                                            <ClockIcon
                                                                width={moderateScale(14)}
                                                                height={moderateScale(14)}
                                                                color={"#5C4639"} strokeWidth={1.8}
                                                            />
                                                        </View>
                        
                                                        <Text
                                                            className="font-medium"
                                                            style={{
                                                                fontSize: moderateScale(10),
                                                                color: "rgba(31,31,31,0.75)"
                                                            }}
                                                        >
                                                            {selectedCart.deliveryTime} min
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
        
                                            <TouchableOpacity
                                                activeOpacity={0.95}
                                                onPress={() =>
                                                    router.back()
                                                }
                                                className="bg-[#3F2516]"
                                                style={{
                                                    paddingHorizontal: scale(14),
                                                    paddingVertical: verticalScale(7),
                                                    borderRadius: moderateScale(12)
                                                }}
                                            >
                                                <Text
                                                    className="text-white font-semibold"
                                                    style={{ fontSize: moderateScale(11) }}
                                                >
                                                    View Cart
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
        
                                        <View
                                            className="p-3 border mx-3 mb-3 mt-2"
                                            style={{
                                                borderRadius: moderateScale(18),
                                                backgroundColor: "#FFFFFF",
                                                borderColor: "rgba(31,31,31,0.10)"
                                            }}
                                        >
                                            {selectedCart.items.map(
                                                (item, index) => (
                                                    <React.Fragment
                                                        key={item.id}
                                                    >
                                                        <CartItemRow
                                                            item={item}
                                                            isRestaurantOpen={selectedCart.isOpen}
                                                            editable={false}
                                                        />
        
                                                        {index < selectedCart.items.length -1 && (
                                                            <View
                                                                style={{
                                                                    height: verticalScale(0.7),
                                                                    marginVertical: verticalScale(8),
                                                                    marginHorizontal: verticalScale(2),
                                                                    backgroundColor: "rgba(31,31,31,0.10)"
                                                                }}
                                                            />
                                                        )}
                                                    </React.Fragment>
                                                )
                                            )}
                                        </View>
                                    </View>
                                )}
        
                                <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{
                                        fontSize: moderateScale(15),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    Deliver To
                                </Text>
        
                                {addresses.length === 0 ? (
                                    <View
                                        className="items-center justify-center mx-2 bg-white border border-[#1F1F1F]/10"
                                        style={{
                                            marginTop: verticalScale(10),
                                            paddingHorizontal: scale(20),
                                            paddingVertical: verticalScale(20),
                                            borderRadius: moderateScale(20)
                                        }}
                                    >
                                        <View
                                            className='bg-[#E8B93F]/15 rounded-full items-center justify-center'
                                            style={{
                                                width: moderateScale(44),
                                                height: moderateScale(44)
                                            }}
                                        >
                                            <LocationIcon width={moderateScale(24)} height={moderateScale(24)} color="#5A3825" strokeWidth={1.5} />
                                        </View>
        
                                        <Text
                                            className="text-[#1F1F1F] font-semibold"
                                            style={{
                                                fontSize: moderateScale(14),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            No saved addresses yet
                                        </Text>
        
                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium text-center"
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(3)
                                            }}
                                        >
                                            Add a delivery address to make checkout faster and easier.
                                        </Text>
                                    </View>
                                ) : (
                                    addresses.map((item) => (
                                        <AddressCard
                                            key={item.id}
                                            item={item}
                                            isSelected={selectedAddress === item.id}
                                            onPress={() => {
                                                setSelectedAddress(item.id)
                                            }}
                                            onEdit={() => {
                                                router.push({
                                                    pathname: "/add-address",
                                                    params: {
                                                        addressId: item.id,
                                                        mode: "edit"
                                                    }
                                                })
                                            }}
                                        />
                                    ))
                                )}
        
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => preventDoublePress(() => {
                                        router.push("/add-address")
                                    })}
                                    className="flex-row gap-2 items-center justify-center p-4 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                                    style={{
                                        borderRadius: moderateScale(18),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    <AddLocationIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.8} />
        
                                    <Text
                                        className="text-[#1F1F1F] font-semibold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Add New Address
                                    </Text>
                                </TouchableOpacity>
        
                                {/* <View className="flex-row items-center gap-3 mt-6">
                                    <View
                                        className="bg-[#3F2516] py-4 px-5 gap-1 justify-center items-center"
                                        style={{
                                            width: cardWidth,
                                            height: moderateScale(105),
                                            borderRadius: moderateScale(22),
                                        }}
                                    >
                                        <View
                                            className="rounded-full bg-[#FFFFFF]/25 items-center justify-center"
                                            style={{
                                                width: moderateScale(42),
                                                height: moderateScale(42)
                                            }}
                                        >
                                            <FlashIcon width={moderateScale(25)} height={moderateScale(25)} color={"#FFFFFF"} strokeWidth={1.5} />
                                        </View>
                                               
                                        <Text
                                            className="text-[#FFFFFF] font-bold"
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            Delivery ASAP
                                        </Text>
        
                                        <Text
                                            className="text-[#FFFFFF]/75 font-normal"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            20-30 mins
                                        </Text>
                                    </View>
        
                                    <View
                                        className="bg-white justify-center items-center border border-[#1F1F1F]/10 py-4 px-5 gap-1"
                                        style={{
                                            width: cardWidth,
                                            height: moderateScale(105),
                                            borderRadius: moderateScale(22)
                                        }}
                                    >
                                        <View
                                            className="rounded-full bg-[#E8B93F]/15 items-center justify-center"
                                            style={{
                                                width: moderateScale(42),
                                                height: moderateScale(42)
                                            }}
                                        >
                                            <ClockIcon width={moderateScale(25)} height={moderateScale(25)} color={"#3F2516"} strokeWidth={1.5} />
                                        </View>
        
                                        <Text
                                            className="text-[#1F1F1F] font-bold"
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            Schedule
                                        </Text>
        
                                        <Text
                                            className="text-[#1F1F1F]/75 font-normal"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            Pick Time
                                        </Text>
                                    </View>
                                </View> */}
        
                                <View
                                    className="p-4 bg-white border border-[#1F1F1F]/10 flex-row items-start mt-6"
                                    style={{ borderRadius: moderateScale(18) }}
                                >
                                    <DescriptionIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" />
        
                                    <TextInput
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        placeholder="Add delivery instructions (e.g., Leave at the gate)"
                                        placeholderTextColor="#7A7D81"
                                        className="flex-1 ml-3 text-[#151515]"
                                        style={{
                                            minHeight: verticalScale(25),
                                            fontSize: moderateScale(13),
                                            lineHeight: moderateScale(20),
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }}
                                        selectionColor="#79685e"
                                    />
                                </View>
        
                                {deviceUpiMethods.length > 0 && (
                                    <>
                                        <Text
                                            className="text-[#1F1F1F] font-semibold mt-4 mb-2"
                                            style={{ fontSize: moderateScale(14) }}
                                        >
                                            UPI Apps
                                        </Text>
        
                                        <View
                                            className="bg-white border border-[#1F1F1F]/10 overflow-hidden"
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
        
                                {/* <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{
                                        fontSize: moderateScale(15),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    Saved Payment Method
                                </Text>
        
                                <View
                                    className="bg-white border border-[#1F1F1F]/10 overflow-hidden mt-3"
                                    style={{ borderRadius: moderateScale(20) }}
                                >
                                    {PAYMENT_METHODS.map((item, index) => {
                                        const isSelected = selectedPayment === item.id
                                        const isLast = index === PAYMENT_METHODS.length - 1
                                        const Icon = item.icon
        
                                        return (
                                            <React.Fragment key={item.id}>
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => setSelectedPayment(item.id)}
                                                    className="flex-row items-center"
                                                    style={{
                                                        paddingHorizontal: scale(14),
                                                        paddingVertical: verticalScale(10)
                                                    }}
                                                >
                                                    <View
                                                        className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                                                        style={{
                                                            width: moderateScale(42),
                                                            height: moderateScale(42)
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
                                                                style={{ fontSize: moderateScale(11) }}
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
                                                            style={{ fontSize: moderateScale(10) }}
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
                                </View> */}
        
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className="items-center flex-row mt-3 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                                    style={{
                                        gap: moderateScale(8),
                                        paddingHorizontal: moderateScale(12),
                                        paddingVertical: moderateScale(12),
                                        borderRadius: moderateScale(16)
                                    }}
                                >
                                    <PlusSignCircleIcon width={moderateScale(23)} height={moderateScale(23)} color="#1F1F1F" strokeWidth={1.5} />
        
                                    <Text
                                        className="text-[#1F1F1F] font-semibold flex-1"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Add New Payment Method
                                    </Text>
        
                                    <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.5} />
                                </TouchableOpacity>
        
                                <Text
                                    className="text-[#1F1F1F] font-medium"
                                    style={{
                                        fontSize: moderateScale(15),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    Other Payment Options
                                </Text>
        
                                <View
                                    className="bg-white border border-[#1F1F1F]/10 overflow-hidden mt-3"
                                    style={{ borderRadius: moderateScale(20) }}
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
                                                        className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                                        style={{
                                                            width: moderateScale(42),
                                                            height: moderateScale(42)
                                                        }}
                                                    >
                                                        <Icon width={moderateScale(22)} height={moderateScale(22)} color="#3F2516" strokeWidth={1.8} />
                                                    </View>
        
                                                    <View
                                                        className="flex-1"
                                                        style={{ marginLeft: scale(11) }}
                                                    >
                                                        <View className="flex-row items-center gap-2">
                                                            <Text
                                                                className="text-[#1F1F1F] font-semibold"
                                                                style={{ fontSize: moderateScale(13) }}
                                                            >
                                                                {item.title}
                                                            </Text>
        
                                                            {item.badge && (
                                                                <View
                                                                    className="bg-[#F8D56A]/25"
                                                                    style={{
                                                                        borderRadius: moderateScale(12),
                                                                        paddingHorizontal: scale(8),
                                                                        paddingVertical: verticalScale(3)
                                                                    }}
                                                                >
                                                                    <Text
                                                                        className="text-[#3F2516] font-medium"
                                                                        style={{
                                                                            fontSize: moderateScale(9.5)
                                                                        }}
                                                                    >
                                                                        {item.badge}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
        
                                                        <Text
                                                            className="text-[#1F1F1F]/65 font-medium"
                                                            style={{
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
                                                                ? "#5c4639"
                                                                : "#D6D0CA",
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <View
                                                                style={{
                                                                    width: moderateScale(14),
                                                                    height: moderateScale(14),
                                                                    borderRadius: "100%",
                                                                    backgroundColor: "#5c4639",
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
        
                                <View
                                    className="p-4 items-center flex-row gap-3 bg-white border border-[#1F1F1F]/10"
                                    style={{
                                        borderRadius: moderateScale(18),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    <View
                                        className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                                        style={{
                                            width: moderateScale(40),
                                            height: moderateScale(40)
                                        }}
                                    >
                                        <CouponIcon width={moderateScale(22)} height={moderateScale(22)} color="#3F2516" strokeWidth={1.5} />
                                    </View>
        
                                    <View className="items-start gap-1 flex-1">
                                        <Text
                                            className="text-[#1F1F1F] font-bold"
                                            style={{ fontSize: moderateScale(14) }}
                                        >
                                            SAVE50 Applied!
                                        </Text>
        
                                        <Text
                                            className="text-[#1F1F1F]/65 font-medium"
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            You saved ₹100 on this order
                                        </Text>
                                    </View>
        
                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={() => {}}
                                        className="items-center justify-center bg-[#3F2516]"
                                        style={{
                                            paddingHorizontal: moderateScale(10),
                                            paddingVertical: moderateScale(6),
                                            borderRadius: moderateScale(18)
                                        }}
                                    >
                                        <Text
                                            className="font-medium text-white"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            Change
                                        </Text>
                                    </TouchableOpacity>
                                </View>
        
                               {selectedCart && (
                                    <View
                                        className="p-5 bg-white border border-[#1F1F1F]/10"
                                        style={{
                                            borderRadius: moderateScale(18),
                                            marginTop: verticalScale(14)
                                        }}
                                    >
                                        <Text
                                            className="text-[#1F1F1F] font-bold"
                                            style={{
                                                fontSize: moderateScale(14),
                                                marginBottom: verticalScale(8)
                                            }}
                                        >
                                            Order Summary
                                        </Text>
        
                                        <OrderPriceRow
                                            label="Item Total"
                                            value={itemsTotal}
                                        />
        
                                        <OrderPriceRow
                                            label="Delivery Fee"
                                            value={deliveryFee === 0 ? "FREE" : deliveryFee}
                                        />
        
                                        <OrderPriceRow
                                            label="Platform Fee"
                                            value={platformFee}
                                        />
        
                                        <OrderPriceRow
                                            label="Restaurant Packing"
                                            value={packingFee}
                                        />
        
                                        <OrderPriceRow
                                            label="GST and Taxes"
                                            value={gstAndTaxes}
                                        />
        
                                        {couponSavings > 0 && (
                                            <View
                                                className="items-center flex-row justify-center bg-[#E3F2E8] mt-3 -mx-1"
                                                style={{
                                                    paddingHorizontal: scale(12),
                                                    paddingVertical: verticalScale(8),
                                                    borderRadius: moderateScale(12)
                                                }}
                                            >
                                                <Text
                                                    className="text-[#4D9151] font-semibold flex-1"
                                                    style={{ fontSize: moderateScale(13) }}
                                                >
                                                    Coupon Savings
                                                </Text>
        
                                                <Text
                                                    className="text-[#4D9151] font-bold"
                                                    style={{ fontSize: moderateScale(14) }}
                                                >
                                                    -₹{couponSavings.toLocaleString("en-IN")}
                                                </Text>
                                            </View>
                                        )}
        
                                        <View
                                            className="rounded-full bg-[#E8DDD3]/65"
                                            style={{
                                                height: verticalScale(0.7),
                                                marginVertical: verticalScale(12),
                                                marginHorizontal: verticalScale(2)
                                            }}
                                        />
        
                                        <View className="flex-row justify-between items-center">
                                            <Text
                                                className="text-[#1F1F1F]/85 font-extrabold"
                                                style={{ fontSize: moderateScale(15) }}
                                            >
                                                Grand Total
                                            </Text>
        
                                            <Text
                                                className="text-[#1F1F1F] font-black tracking-wide"
                                                style={{ fontSize: moderateScale(16) }}
                                            >
                                                ₹{grandTotal.toLocaleString("en-IN")}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        }
                    />

                    {selectedCart && (
                        <View
                            className="flex-row items-center absolute left-0 right-0 bottom-0"
                            style={{
                                paddingHorizontal: scale(16),
                                paddingTop: verticalScale(16),
                                paddingBottom: verticalScale(12) + insets.bottom,
                                borderTopRightRadius: moderateScale(22),
                                borderTopLeftRadius: moderateScale(22),
                                zIndex: 100,
                                backgroundColor: canPlaceOrder
                                    ? "#3F2516"
                                    : "#4D4D4D"
                            }}
                        >
                            <View className="items-start gap-1 ml-4">
                                <Text
                                    className="text-[#FFFFFF]/75 font-normal"
                                    style={{
                                        fontSize: moderateScale(14)
                                    }}
                                >
                                    Total to pay
                                </Text>

                                <Text
                                    className="text-[#FFFFFF] font-extrabold"
                                    style={{
                                        fontSize: moderateScale(18)
                                    }}
                                >
                                    ₹{grandTotal.toLocaleString("en-IN")}
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={handlePlaceOrder}
                                className="flex-row ml-auto items-center justify-center border"
                                style={{
                                    gap: moderateScale(6),
                                    minWidth: scale(115),

                                    borderRadius: moderateScale(24),

                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(9),

                                    backgroundColor: canPlaceOrder
                                        ? "#FFFFFF"
                                        : "#D1D1D1",

                                    borderColor: "rgba(31,31,31,0.15)"
                                }}
                            >
                                {isPaymentProcessing ? (
                                    <Animated.View
                                        entering={
                                            FadeInDown
                                                .duration(400)
                                                .withInitialValues({
                                                    opacity: 0,
                                                    transform: [
                                                        { translateY: -4 }
                                                    ]
                                                })
                                        }
                                        exiting={
                                            FadeOutUp.duration(250)
                                        }
                                        className="flex-row items-center"
                                    >
                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(13),
                                                color: "#3F2516"
                                            }}
                                        >
                                            {verifyingPayment
                                                ? "Verifying"
                                                : "Processing"}
                                        </Text>

                                        <LoadingDots />
                                    </Animated.View>
                                ) : (
                                    <>
                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(14),
                                                color: canPlaceOrder
                                                    ? "#3F2516"
                                                    : "#777777"
                                            }}
                                        >
                                            {!selectedCart.isOpen
                                                ? "Restaurant Closed"
                                                : hasUnavailableItems
                                                ? "Items Unavailable"
                                                : !selectedPayment
                                                ? "Select Payment"
                                                : "Place Order"}
                                        </Text>

                                        {canPlaceOrder && (
                                            <ArrowRight
                                                width={moderateScale(18)}
                                                height={moderateScale(18)}
                                                color="#3F2516"
                                                strokeWidth={2}
                                                style={{ marginRight: -moderateScale(8) }}
                                            />
                                        )}
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )
        }
        </SafeAreaView>
    )
}