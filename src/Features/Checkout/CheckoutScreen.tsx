import AddLocationIcon from '@/assets/icon/AddLocationIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRight from '@/assets/icon/ArrowRight.svg'
import CardAddIcon from '@/assets/icon/CardAddIcon.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import CouponIcon from '@/assets/icon/CouponIcon.svg'
import DebitCardIcon from '@/assets/icon/DebitCardIcon.svg'
import DescriptionIcon from '@/assets/icon/DescriptionIcon.svg'
import FlashIcon from '@/assets/icon/FlashIcon.svg'
import GooglePayIcon from '@/assets/icon/GooglePayIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import MoneyBagIcon from '@/assets/icon/MoneyBagIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import PhonePeIcon from '@/assets/icon/PhonePe.svg'
import OrderPriceRow from "@/Features/Cart/Components/OrderPriceRow"
import { usePreventDoublePress } from "@/Features/hook/usePreventDoublePress"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import AddressCard from "./Components/AddressCard"

type PaymentMethod = {
    id: string
    title: string
    icon: React.ComponentType<{
        width?: number
        height?: number
    }>
}

const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: "gpay",
        title: "Google Pay",
        icon: GooglePayIcon,
    },
    {
        id: "phonepe",
        title: "PhonePe",
        icon: PhonePeIcon
    },
    {
        id: "cod",
        title: "Cash on Delivery",
        icon: MoneyBagIcon,
    },
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

const savedCard = {
    id: "card_4587",
    lastFour: "4587",
    expiry: "12/28",
    icon: DebitCardIcon
}

export default function CheckoutScreen() {
    const preventDoublePress = usePreventDoublePress()
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const [selectedAddress, setSelectedAddress] = useState("home")
    const [selectedPayment, setSelectedPayment] = useState("gpay")
    const isCardSelected = selectedPayment === savedCard.id

    const horizontalPadding = scale(28)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 2

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
                        <View
                            className="p-3 items-center flex-row gap-2 bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18)
                            }}
                        >
                            <View
                                className="overflow-hidden rounded-full border-[#FFFFFF]"
                                style={{
                                    borderWidth: moderateScale(3),
                                    width: moderateScale(66),
                                    height: moderateScale(66),
                                    marginLeft: -moderateScale(4)
                                }}
                            >
                                <Image
                                    source={{
                                        uri: "https://i.pinimg.com/736x/04/5c/e2/045ce255f197758acff31daef213e62d.jpg",
                                    }}
                                    contentFit="cover"
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                />
                            </View>
                            
                            <View className="items-start gap-1 flex-1">
                                <Text
                                    className="text-[#1F1F1F] self-start font-extrabold"
                                    style={{ fontSize: moderateScale(16) }}
                                >
                                    The Burger king
                                </Text>

                                <Text
                                    numberOfLines={1}
                                    className="font-medium text-[#1F1F1F]/65"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    North Indian, Chinese, Fast Food
                                </Text>
                            
                                <View className="gap-2 flex-row mt-1">
                                    <View
                                        className="flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                                        style={{
                                            paddingHorizontal: moderateScale(8),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <Text
                                            className="font-semibold text-[#5c4639]"
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            3 items
                                        </Text>
                                    </View>

                                    <View
                                        className="flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                                        style={{
                                            paddingHorizontal: moderateScale(8),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <Text
                                            className="font-semibold text-[#5c4639] tracking-wide"
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            ₹710
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {
                                    preventDoublePress(() => {
                                        router.back()
                                    })
                                }}
                                className="ml-1 flex-row items-center justify-center gap-1 bg-[#3F2516]"
                                style={{
                                    paddingHorizontal: moderateScale(12),
                                    paddingVertical: moderateScale(8),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <CartIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} strokeWidth={1.5} />

                                <Text
                                    className="text-[#FFFFFF] font-medium"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    View Cart
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
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
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Payment Method
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                marginTop: verticalScale(4)
                            }}
                        >
                            Recommended
                        </Text>

                        <View>
                            {PAYMENT_METHODS.map((item) => {
                                const isSelected = selectedPayment === item.id

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.95}
                                        onPress={() => setSelectedPayment(item.id)}
                                        className="bg-white border p-4 border-[#1F1F1F]/10 flex-row items-center"
                                        style={{
                                            borderRadius: moderateScale(18),
                                            marginTop: verticalScale(8),
                                        }}
                                    >
                                        <View
                                            className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                                            style={{
                                                width: moderateScale(40),
                                                height: moderateScale(40),
                                            }}
                                        >
                                            <item.icon width={moderateScale(20)} height={moderateScale(20)} />
                                        </View>

                                        <Text
                                            className="text-[#1F1F1F] font-bold flex-1 ml-3"
                                            style={{ fontSize: moderateScale(15) }}
                                        >
                                            {item.title}
                                        </Text>

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
                                )
                            })}
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Credit / Debit Cards
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => setSelectedPayment(savedCard.id)}
                            className="bg-white border p-4 border-[#1F1F1F]/10 flex-row items-center"
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(8),
                            }}
                        >
                            <View
                                className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                                style={{
                                    width: moderateScale(40),
                                    height: moderateScale(40),
                                }}
                            >   
                                <DebitCardIcon width={moderateScale(20)} height={moderateScale(20)} />
                            </View>

                            <View className="items-start gap-1 ml-3 flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                     ****{savedCard.lastFour}
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    EXP: {savedCard.expiry}
                                </Text>
                            </View>

                            <View
                                className="items-center justify-center"
                                style={{
                                    width: moderateScale(22),
                                    height: moderateScale(22),
                                    borderRadius: "100%",
                                    borderWidth: moderateScale(2),
                                    borderColor: isCardSelected
                                            ? "#5c4639"
                                            : "#D6D0CA",
                                }}
                            >
                                {isCardSelected && (
                                    <View
                                        style={{
                                            width: moderateScale(14),
                                            height: moderateScale(14),
                                            borderRadius: moderateScale(7),
                                            backgroundColor: "#5c4639",
                                        }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center p-4 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <CardAddIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.8} />

                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Add New Card
                            </Text>
                        </TouchableOpacity>

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

                            <OrderPriceRow label="Item Total" value={747} />

                            <OrderPriceRow label="Delivery Fee" value={"FREE"} />

                            <OrderPriceRow label="Platform Fee" value={5} />

                            <OrderPriceRow label="Restaurant Packing" value={20} />

                            <OrderPriceRow label="GST and Taxes" value={38} />

                            <View
                                className="items-center flex-row justify-center bg-[#E3F2E8] mt-3 -mx-1"
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="text-[#4d9151] font-semibold self-start flex-1"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Coupon Savings
                                </Text>

                                <Text
                                    className="text-[#4d9151] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    -₹100
                                </Text>
                            </View>

                            <View
                                className="rounded-full bg-[#E8DDD3]/65"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View
                                className="flex-row justify-between items-center"
                            >
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
                                    ₹710
                                </Text>
                            </View>
                        </View>
                    </View>
                }
            />

            <View
                className="flex-row items-center absolute left-0 right-0 bottom-0 bg-[#3F2516]"
                style={{
                    paddingHorizontal: scale(16),
                    paddingTop: verticalScale(16),
                    paddingBottom: verticalScale(12) + insets.bottom,
                    borderTopRightRadius: moderateScale(22),
                    borderTopLeftRadius: moderateScale(22),
                    zIndex: 100
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
                        ₹710
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => {
                        preventDoublePress(() => {
                            router.push('/order-success')
                        })
                    }}
                    className="flex-row ml-auto items-center justify-center bg-[#FFFFFF] border border-[#1F1F1F]/15"
                    style={{
                        gap: moderateScale(5),
                        borderRadius: moderateScale(24),
                        paddingLeft: scale(12),
                        paddingRight: scale(8),
                        paddingVertical: verticalScale(8)
                    }}  
                >
                    <Text
                        className="text-[#3F2516] font-semibold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Place Order
                    </Text>
                    
                    <ArrowRight width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={1.8} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}