import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import InvoiceIcon from '@/assets/icon/InvoiceIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import ReorderIcon from '@/assets/icon/ReorderIcon.svg'
import { COLORS } from '@/constant/colors'
import { formatOrderId } from '@/utils/formatOrderID'
import { hexToRgba } from '@/utils/hexToRgba'
import { router, useLocalSearchParams } from "expo-router"
import LottieView from "lottie-react-native"
import { useMemo } from 'react'
import { ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

const ORDER_STATUSES = [
    {
        id: "placed",
        label: "Placed",
        color: COLORS.activeStatusTextColor
    },
    {
        id: "confirmed",
        label: "Confirmed",
        color: "#22A06B",
    },
    {
        id: "preparing",
        label: "Preparing",
        color: "#F59E0B",
    },
    {
        id: "pickedUp",
        label: "Picked Up",
        color: "#3B82F6",
    },
    {
        id: "onTheWay",
        label: "On the Way",
        color: "#8B5CF6",
    },
]

export default function OrderSuccessScreen() {
    const {
        orderId,
        restaurantId,
        restaurantName,
        totalAmount,
        deliveryTime,
        paymentMethod,
        items
    } = useLocalSearchParams<{
        orderId?: string
        restaurantId?: string
        restaurantName?: string
        totalAmount?: string
        deliveryTime?: string
        paymentMethod?: string
        items?: string
    }>()

    const orderItems = useMemo(() => {
        try {
            return items ? JSON.parse(items) : []
        } catch {
            return []
        }
    }, [items])

    const { width: SCREEN_WIDTH } = useWindowDimensions()

    const horizontalPadding = scale(45)
    const gap = scale(18)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 3

    const currentStatus = "placed"
    const currentIndex = ORDER_STATUSES.findIndex(
        (status) => status.id === currentStatus
    )

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
        
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: verticalScale(25),
                    paddingHorizontal: scale(16)
                }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className=" absolute items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        top: moderateScale(14),
                        left: moderateScale(14),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-center justify-center">
                    <LottieView
                        source={require("@/assets/animations/Success_ Animation.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(242),
                            height: moderateScale(242)
                        }}
                    />
                </View>

                <Text
                    className="font-extrabold text-center -mt-4"
                    style={{
                        fontSize: moderateScale(18),
                        color: COLORS.primaryTextColor
                    }}
                >
                    Order Placed Successfully!
                </Text>
                
                <Text
                    className="font-medium leading-5 text-center mx-4"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(10)
                    }}
                >
                    The restaurant has received your order and preparation will begin shortly.
                </Text>

                <View
                    className="items-center justify-center p-4 gap-2"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(18)
                    }}
                >
                    <Text
                        className="font-medium uppercase"
                        style={{
                            fontSize: moderateScale(12),
                            color: hexToRgba(COLORS.primaryTextColor, 0.85)
                        }}
                    >
                        Estimated delivery
                    </Text>

                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(20),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {deliveryTime || "--"}{" "}
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            mins
                        </Text>
                    </Text>
                </View>

               <View className="flex-row items-center justify-center mt-8 gap-5">
                    {ORDER_STATUSES.map((status, index) => {
                        const isActive = index <= currentIndex

                        return (
                            <View
                                key={status.id}
                                className="justify-center items-center gap-2"
                            >
                                <View
                                    className="rounded-full"
                                    style={{
                                        height: moderateScale(4),
                                        width: moderateScale(55),
                                        backgroundColor: isActive
                                            ? status.color
                                            : COLORS.progressTrackColor
                                    }}
                                />

                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: isActive
                                            ? COLORS.primaryTextColor
                                            : hexToRgba(COLORS.primaryTextColor, 0.45)
                                    }}
                                >
                                    {status.label}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                <View
                    className="justify-center p-5"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(18)
                    }}
                >
                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(13.5),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {restaurantName || "Restaurant"}
                    </Text>

                    <Text
                        className="font-normal mt-1"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                        }}
                    >
                        Order ID {formatOrderId(orderId)}
                    </Text>

                    {orderItems.map((item: any) => (
                        <View
                            key={item.id}
                            className="flex-row justify-between items-center mt-3"
                        >
                            <Text
                                numberOfLines={1}
                                className="flex-1 font-medium"
                                style={{
                                    fontSize: moderateScale(12),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                {item.name} x{item.quantity}
                            </Text>

                            <Text
                                className="font-semibold tracking-wide"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                               ₹{(
                                    Number(item.price ?? item.unit_price ??0) * Number(item.quantity)
                                ).toLocaleString("en-IN")}
                            </Text>
                        </View>
                    ))}

                    <View
                        className="rounded-full"
                        style={{
                            backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                            height: verticalScale(0.7),
                            marginVertical: verticalScale(8),
                            marginHorizontal: verticalScale(2)
                        }}
                    />

                    <View className="flex-row justify-between items-center">
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(14),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
                        >
                            {paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : `Paid via ${paymentMethod || "UPI"}`
                            }
                        </Text>

                        <Text
                            className="font-bold tracking-wide"
                            style={{
                                fontSize: moderateScale(16),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            ₹{Number(totalAmount ?? 0).toLocaleString("en-IN")}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-center gap-4 mt-5">
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="justify-center items-center py-4 px-5 gap-2"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            width: cardWidth,
                            height: moderateScale(75),
                            borderRadius: moderateScale(22)
                        }}
                    >
                        <LocationIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={1.8} />
                        
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Track
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="items-center py-4 px-5 gap-2 justify-center"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            width: cardWidth,
                            height: moderateScale(75),
                            borderRadius: moderateScale(22),
                        }}
                    >
                        <ReorderIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={1.8} />
                        
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Reorder
                        </Text>  
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="items-center py-4 px-5 gap-2 justify-center"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            width: cardWidth,
                            height: moderateScale(75),
                            borderRadius: moderateScale(22),
                        }}
                    >
                        <InvoiceIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={1.8} />
                        
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Invoice
                        </Text> 
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}