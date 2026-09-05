import AddLocationIcon from '@/assets/icon/AddLocationIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import { default as ArrowRight, default as ArrowRightIcon } from '@/assets/icon/ArrowRight.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import CouponIcon from '@/assets/icon/CouponIcon.svg'
import CreditCardIcon from '@/assets/icon/DebitCardIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import DescriptionIcon from '@/assets/icon/DescriptionIcon.svg'
import FlashIcon from '@/assets/icon/FlashIcon.svg'
import GooglePayIcon from '@/assets/icon/GooglePayIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import MoneyBagIcon from '@/assets/icon/MoneyBagIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import PaytmIcon from '@/assets/icon/PaytmLogo.svg'
import PhonePeIcon from '@/assets/icon/PhonePe.svg'
import PlusSignCircleIcon from '@/assets/icon/PlusSignCircleIcon.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import OrderPriceRow from "@/Features/Cart/Components/OrderPriceRow"
import { usePreventDoublePress } from "@/Features/hook/usePreventDoublePress"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback, useMemo, useState } from "react"
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from 'react-native-svg'
import CartItemRow from '../Cart/Components/CartItemRow'
import { useToast } from '../hook/ToastContext'
import { useCartStore } from '../Stores/useCartStore'
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

const walletBalance = 1850

const OTHER_PAYMENT_METHODS = [
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
        badge: `Balance: ₹${walletBalance.toLocaleString("en-IN")}`
    }
]

const ADDRESSES = [
    {
        id: "home",
        title: "Home",
        name: "Harsh Suthar",
        address:
            "House No. 24, Heritage Enclave, Sumerpur, Rajasthan - 306902",
        icon: HomeIcon,
    },
    {
        id: "work",
        title: "Work",
        name: "Harsh Suthar",
        address:
            "Main Market, Sumerpur, Rajasthan - 306902",
        icon: OfficeIcon,
    }
]

export default function CheckoutScreen() {
    const { restaurantId } = useLocalSearchParams<{restaurantId: string}>()
    const preventDoublePress = usePreventDoublePress()
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const {showToast} = useToast()

    const [selectedAddress, setSelectedAddress] = useState("home")
    const [selectedPayment, setSelectedPayment] = useState("gpay")
    const [couponSavings, setCouponSavings] = useState(100)

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

    const itemsTotal = useMemo(() => {
        if (!selectedCart) {
            return 0
        }

        return selectedCart.items.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        )
    }, [selectedCart])

    const deliveryFee = selectedCart?.deliveryFee ?? 0

    const platformFee = selectedCart ? 5 : 0

    const packingFee = selectedCart ? 20 : 0

    const gstAndTaxes = useMemo(() => {
        return Math.round(itemsTotal * 0.05)
    }, [itemsTotal])

    const grandTotal = useMemo(() => {
        const total =
            itemsTotal +
            deliveryFee +
            platformFee +
            packingFee +
            gstAndTaxes -
            couponSavings

        return Math.max(total, 0)
    }, [
        itemsTotal,
        deliveryFee,
        platformFee,
        packingFee,
        gstAndTaxes,
        couponSavings
    ])

    const hasUnavailableItems = useMemo(() => {
        if (!selectedCart) {
            return false
        }

        return selectedCart.items.some(
            (item) => !item.isActive
        )
    }, [selectedCart])

    const canPlaceOrder =
        !!selectedCart &&
        selectedCart.isActive &&
        selectedCart.items.length > 0 &&
        !hasUnavailableItems

    const handlePlaceOrder = useCallback(() => {
        if (!selectedCart) {
            return
        }

        if (!selectedCart.isActive) {
            showToast("Restaurant is currently closed", "warning")

            return
        }

        if (hasUnavailableItems) {
            showToast("Some items are currently unavailable", "warning")

            return
        }

        preventDoublePress(() => {
            router.push("/order-success")
        })
    }, [
        selectedCart,
        hasUnavailableItems,
        preventDoublePress
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

            {!selectedCart ? (
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
                                            className="relative items-start overflow-hidden justify-center self-start rounded-full border"
                                            style={{
                                                width: moderateScale(52),
                                                height: moderateScale(52),
                                                borderColor: "rgba(31,31,31,0.10)"
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri: selectedCart.restaurantImage
                                                }}
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
                                                            color={"#5C4639"}
                                                        />
                                                    </View>
                    
                                                    <Text
                                                        className="font-medium"
                                                        style={{
                                                            fontSize: moderateScale(10),
                                                            color: "rgba(31,31,31,0.75)"
                                                        }}
                                                    >
                                                        {selectedCart.deliveryTime}
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
                                                        isRestaurantActive={
                                                            selectedCart.isActive
                                                        }
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
    
                            {ADDRESSES.map((item) => (
                                <AddressCard
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedAddress === item.id}
                                    onPress={() => setSelectedAddress(item.id)}
                                    onEdit={() => {
                                        // edit item.id
                                    }}
                                />
                            ))}
    
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
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
    
                            <View className="flex-row items-center gap-3 mt-6">
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
                            </View>
    
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
    
                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{
                                    fontSize: moderateScale(15),
                                    marginTop: verticalScale(18)
                                }}
                            >
                                Payment Method
                            </Text>
    
                            <Text
                                className="text-[#1F1F1F]/75 font-medium"
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: verticalScale(4)
                                }}
                            >
                                Recommended
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
                            </View>
    
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
                                                        className="text-[#1F1F1F]/75 font-medium"
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
            )}

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
                        backgroundColor: canPlaceOrder ? "#3F2516" : "#4D4D4D"
                    }}
                >
                    <View className="items-start gap-1 ml-4">
                        <Text
                            className="text-[#FFFFFF]/75 font-normal"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Total to pay
                        </Text>

                        <Text
                            className="text-[#FFFFFF] font-extrabold"
                            style={{ fontSize: moderateScale(18) }}
                        >
                            ₹{grandTotal.toLocaleString("en-IN")}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={!canPlaceOrder}
                        onPress={handlePlaceOrder}
                        className="flex-row ml-auto items-center justify-center border"
                        style={{
                            gap: moderateScale(5),
                            borderRadius: moderateScale(24),
                            paddingLeft: scale(12),
                            paddingRight: scale(8),
                            paddingVertical: verticalScale(8),
                            backgroundColor:
                                canPlaceOrder
                                    ? "#FFFFFF"
                                    : "#D1D1D1",

                            borderColor: "rgba(31,31,31,0.15)"
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(14),
                                color: canPlaceOrder ? "#3F2516" : "#777777"
                            }}
                        >
                            {!selectedCart.isActive
                                ? "Restaurant Closed"
                                : hasUnavailableItems
                                ? "Items Unavailable"
                                : "Place Order"}
                        </Text>

                        {canPlaceOrder && (
                            <ArrowRight
                                width={moderateScale(18)}
                                height={moderateScale(18)}
                                color="#3F2516"
                                strokeWidth={1.8}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}