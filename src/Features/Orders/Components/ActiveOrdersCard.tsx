import ArrowRight from '@/assets/icon/ArrowRight.svg'
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
import { OrderStatusType } from '@/Services/api-service'
import { formatOrderId } from '@/utils/formatOrderID'
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
    eta?: string

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
    eta,
    items,
    onPayNow,
    onCancelOrder,
    onTrackOrder,
    onContactRider
}: ActiveOrderCardProps) => {
    const StatusIcon = STATUS_ICONS[status]
    const statusLabel = getStatusLabel(status)
    const isPendingPayment = status === "PENDING_PAYMENT"

    const [imageError, setImageError] = useState(false)
        
    const DefaultRestaurantImage = require("../../../../assets/images/Default_Restaurant_Logo.png")
    
    useEffect(() => {
        setImageError(true)
    }, [restaurantImage])

    const hasImage = !!restaurantImage && !imageError

    return (
        <View
            className="bg-white border border-[#1F1F1F]/10 p-4"
            style={{
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
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>

                <View className="justify-center gap-1 flex-1 ml-2">
                    <Text
                        numberOfLines={2}
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(15) }}
                    >
                        {restaurantName}
                    </Text>

                    <Text
                        numberOfLines={2}
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        OrderID {formatOrderId(orderId)}
                    </Text>
                </View>

                <View className="items-end justify-between my-1">
                    <View
                        className="flex-row items-center justify-center bg-[#F8D56A]"
                        style={{
                            gap: moderateScale(3),
                            paddingLeft: moderateScale(6),
                            paddingRight: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >   
                        <StatusIcon width={moderateScale(15)} height={moderateScale(15)} color="#3F2516" strokeWidth={1.5} />

                        <Text
                            className="font-medium text-[#3F2516]"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            {statusLabel}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1 mr-1">
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(21),
                                height: moderateScale(21)
                            }}
                        >
                            <TimerIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" strokeWidth={1.8} />
                        </View>

                        <Text
                            className="font-medium text-[#1F1F1F]/75"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            ETA: {eta}
                        </Text>
                    </View>
                </View>
            </View>

            <OrderStatus status={status} />

            <View
                className="items-start bg-[#F5F5F5] py-4 px-5"
                style={{
                    borderRadius: moderateScale(16),
                    marginTop: verticalScale(12),
                    marginHorizontal: scale(4)
                }}
            >
                {items.map((item, index) => (
                    <React.Fragment key={`${item.name}-${index}`}>
                        <Text
                            numberOfLines={1}
                            className="text-[#1F1F1F] font-medium"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            {item.name} x{item.quantity}
                        </Text>

                        {index < items.length - 1 && (
                            <View
                                className="rounded-full bg-[#1F1F1F]/15 w-full"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(8)
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>

            <View className="flex-row items-center justify-center gap-6 mt-5">
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={isPendingPayment ? onPayNow : onTrackOrder}
                    className="flex-row items-center justify-center bg-[#3F2516]"
                    style={{
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(14)
                    }}
                >
                    {isPendingPayment ? (
                        <MoneyIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.8} />
                    ) : (
                        <LocationIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" />
                    )}

                    <Text
                        className="text-[#FFFFFF] font-medium ml-2 mr-1"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        {isPendingPayment ? "Pay now" : "Track Order"}
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={isPendingPayment ? onCancelOrder : onContactRider}
                    className={`flex-row items-center justify-center ${
                        isPendingPayment
                            ? "bg-[#FEE2E2]/85"
                            : "bg-[#E5E4E2]/75"
                    }`}
                    style={{
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(14)
                    }}
                >
                    {isPendingPayment ? (
                        <CancelCircleIcon width={moderateScale(18)} height={moderateScale(18)} color="rgba(220, 38, 38, 0.80)" strokeWidth={1.8} />
                    ) : (
                        <CustomerServiceIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={2} />
                    )}

                    <Text
                        className="text-[#3F2516] font-medium ml-2 mr-1"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        {isPendingPayment ? "Cancel Order" : "Contact Rider"}
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" strokeWidth={2} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default React.memo(ActiveOrderCard)