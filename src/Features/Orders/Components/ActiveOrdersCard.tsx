import BoxIcon from '@/assets/icon/BoxIcon.svg'
import BoxTimeIcon from '@/assets/icon/BoxTimeIcon.svg'
import CancelCircleIcon from '@/assets/icon/CancelCircleIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import CustomerServiceIcon from "@/assets/icon/CustomerServiceIcon.svg"
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import MoneyIcon from '@/assets/icon/MoneyIcon.svg'
import SuccessIcon from '@/assets/icon/SuccessIcon2.svg'
import TimerIcon from "@/assets/icon/TimerIcon.svg"
import { COLORS } from '@/constant/colors'
import { OrderStatusType } from '@/Services/api-service'
import { formatOrderId } from '@/utils/formatOrderID'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from 'react-native-svg'
import OrderStatus from './OrderStatus'

const STATUS_ICONS = {
    PENDING_PAYMENT: ClockIcon,
    PENDING: ClockIcon,
    CONFIRMED: BoxIcon,
    PREPARING: BoxTimeIcon,
    READY_FOR_PICKUP: BoxIcon,
    RIDER_ASSIGNED: DeliveryIcon,
    PICKED_UP: DeliveryIcon,
    OUT_FOR_DELIVERY: DeliveryIcon,
    DELIVERED: SuccessIcon,
    CANCELLED_BY_CUSTOMER: CancelCircleIcon,
    CANCELLED_BY_RESTAURANT: CancelCircleIcon,
    REJECTED_BY_RESTAURANT: CancelCircleIcon,
    CANCELLED_TIMEOUT: CancelCircleIcon
} satisfies Record<OrderStatusType, React.FC<SvgProps>>

const getStatusLabel = (status: OrderStatusType) => {
    switch (status) {
        case "PENDING_PAYMENT":
            return "Payment Pending"

        case "PENDING":
            return "Pending"

        case "CONFIRMED":
            return "Confirmed"

        case "PREPARING":
            return "Preparing"

        case "READY_FOR_PICKUP":
            return "Ready for Pickup"

        case "RIDER_ASSIGNED":
            return "Rider Assigned"

        case "PICKED_UP":
            return "Picked Up"

        case "OUT_FOR_DELIVERY":
            return "Out for Delivery"

        case "DELIVERED":
            return "Delivered"

        case "CANCELLED_BY_CUSTOMER":
            return "Cancelled by You"

        case "CANCELLED_BY_RESTAURANT":
            return "Cancelled"

        case "REJECTED_BY_RESTAURANT":
            return "Rejected"

        case "CANCELLED_TIMEOUT":
            return "Cancelled"

        default:
            return "Order"
    }
}

type ActiveOrderItem = {
    name: string
    quantity: number
}

type ActiveOrderCardProps = {
    restaurantName: string
    restaurantImage?: string | null
    orderId: string

    status: OrderStatusType
    remainingMinutes?: number | null
    estimatedDeliveryAt?: string | null
    paymentDeadline?: number | null
    canPay: boolean
    iscancellable: boolean

    items: ActiveOrderItem[]

    onPayNow?: () => void
    onCancelOrder?: () => void
    onTrackOrder?: () => void
    onContactRider?: () => void
}

const ActiveOrderCard = ({
    restaurantName,
    restaurantImage,
    orderId,
    status,
    remainingMinutes,
    estimatedDeliveryAt,
    paymentDeadline,
    canPay,
    iscancellable,
    items,
    onPayNow,
    onCancelOrder,
    onTrackOrder,
    onContactRider
}: ActiveOrderCardProps) => {
    const StatusIcon = STATUS_ICONS[status]
    const statusLabel = getStatusLabel(status)

    const isPendingPayment = status === "PENDING_PAYMENT"

    const isCancelled =
        status === "CANCELLED_BY_CUSTOMER" ||
        status === "CANCELLED_BY_RESTAURANT" ||
        status === "REJECTED_BY_RESTAURANT" ||
        status === "CANCELLED_TIMEOUT"

    const isRiderAvailable =
        status === "RIDER_ASSIGNED" ||
        status === "PICKED_UP" ||
        status === "OUT_FOR_DELIVERY"

    const canTrack =
        status === "CONFIRMED" ||
        status === "PREPARING" ||
        status === "READY_FOR_PICKUP" ||
        status === "RIDER_ASSIGNED" ||
        status === "PICKED_UP" ||
        status === "OUT_FOR_DELIVERY"

    const showPayNow = canPay && isPendingPayment

    const showCancel = iscancellable

    const showTrack = !showPayNow && canTrack

    const showContactRider = isRiderAvailable

    const getEtaText = () => {
        if (status === "PENDING_PAYMENT") {
            return null
        }

        if (status === "PENDING") {
            return "Waiting for confirmation"
        }

        if (
            status === "DELIVERED" ||
            status === "CANCELLED_BY_CUSTOMER" ||
            status === "CANCELLED_BY_RESTAURANT" ||
            status === "REJECTED_BY_RESTAURANT" ||
            status === "CANCELLED_TIMEOUT"
        ) {
            return null
        }

        if (remainingMinutes != null && remainingMinutes > 0) {
            return `${remainingMinutes} mins`
        }

        // if (estimatedDeliveryAt) {
        //     const date = new Date(estimatedDeliveryAt)

        //     return date.toLocaleTimeString(
        //         "en-IN",
        //         {
        //             hour: "numeric",
        //             minute: "2-digit",
        //             hour12: true
        //         }
        //     )
        // }

        return "Arriving soon"
    }

    const etaText = getEtaText()

    const [imageError, setImageError] = useState(false)
        
    const DefaultRestaurantImage = require("../../../../assets/images/Default_Restaurant_Logo.png")
    
    useEffect(() => {
        setImageError(false)
    }, [restaurantImage])

    const hasImage = !!restaurantImage && !imageError

    return (
        <View
            className="p-4"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(20),
                marginTop: verticalScale(14)
            }}
        >
            <View className="flex-row">
                <View
                    className="items-center justify-center overflow-hidden"
                    style={{
                        width: moderateScale(58),
                        height: moderateScale(58),
                        borderRadius: moderateScale(16)
                    }}
                >
                    <Image
                        source={
                            hasImage
                                ? {
                                    uri: restaurantImage!
                                }
                                : DefaultRestaurantImage
                        }
                        onError={() => {
                            setImageError(true)
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>

                <View className="justify-center gap-1 flex-1 mx-2">
                    <Text
                        numberOfLines={2}
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(15),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {restaurantName}
                    </Text>

                    <Text
                        numberOfLines={2}
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                        }}
                    >
                        OrderID {formatOrderId(orderId)}
                    </Text>
                </View>

                <View className="items-end justify-between my-1">
                    <View
                        className="flex-row items-center justify-center"
                        style={{
                            backgroundColor: isCancelled ? COLORS.dangerBackgroundColor : COLORS.accentLightColor,
                            gap: moderateScale(3),
                            paddingLeft: moderateScale(6),
                            paddingRight: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >   
                        <StatusIcon width={moderateScale(15)} height={moderateScale(15)} color={isCancelled ? COLORS.dangerTextColor : COLORS.primaryColor} strokeWidth={1.5} />

                        <Text
                            className="font-medium"
                            style={{ fontSize: moderateScale(10), color: isCancelled ? COLORS.dangerTextColor : COLORS.primaryColor }}
                        >
                            {statusLabel}
                        </Text>
                    </View>

                    {paymentDeadline != null && (
                        <View className="flex-row items-center gap-1">
                            <View
                                className="items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                    width: moderateScale(21),
                                    height: moderateScale(21)
                                }}
                            >
                                <TimerIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                            </View>

                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                {paymentDeadline > 0
                                    ? `Retry payment in ${paymentDeadline} min`
                                    : "Retry payment now"
                                }
                            </Text>
                        </View>
                    )}

                    {etaText && (
                        <View className="flex-row items-center gap-1 mr-1">
                            <View
                                className="items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                    width: moderateScale(21),
                                    height: moderateScale(21)
                                }}
                            >
                                <TimerIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                            </View>

                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                {status === "PENDING"
                                    ? etaText
                                    : `ETA: ${etaText}`
                                }
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <OrderStatus status={status} />

            <View
                className="items-start py-4 px-5"
                style={{
                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.55),
                    borderRadius: moderateScale(16),
                    marginTop: verticalScale(12),
                    marginHorizontal: scale(4)
                }}
            >
                {items.map((item, index) => (
                    <React.Fragment key={`${item.name}-${index}`}>
                        <Text
                            numberOfLines={1}
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {item.name} x{item.quantity}
                        </Text>

                        {index < items.length - 1 && (
                            <View
                                className="rounded-full w-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.15),
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(8)
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>

            <View
                className="flex-row items-center justify-center gap-3"
                style={{ marginTop: verticalScale(18) }}
            >
                {showPayNow && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onPayNow}
                        className="flex-row flex-1 items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <MoneyIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />

                        <Text
                            className="font-medium ml-2 mr-1"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Pay Now
                        </Text>

                        {/* <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} /> */}
                    </TouchableOpacity>
                )}

                {showTrack && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onTrackOrder}
                        className="flex-row flex-1 items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <LocationIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} />

                        <Text
                            className="font-medium ml-2 mr-1"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Track Order
                        </Text>

                        {/* <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} /> */}
                    </TouchableOpacity>
                )}

                {showCancel && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onCancelOrder}
                        className="flex-row flex-1 items-center justify-center"
                        style={{
                            backgroundColor: COLORS.dangerBackgroundColor,
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <CancelCircleIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.dangerTextColor} strokeWidth={1.8} />

                        <Text
                            className="font-medium ml-2 mr-1"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.dangerTextColor
                            }}
                        >
                            Cancel Order
                        </Text>
                    </TouchableOpacity>
                )}

                {!showCancel && showContactRider && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onContactRider}
                        className="flex-row flex-1 items-center justify-center"
                        style={{
                            backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(16)
                        }}
                    >
                        <CustomerServiceIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryTextColor} strokeWidth={2} />

                        <Text
                            className="font-medium ml-2 mr-1"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Contact Rider
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default React.memo(ActiveOrderCard)