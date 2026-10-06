import CancelCircleIcon from '@/assets/icon/CancelCircleIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import InvoiceIcon from "@/assets/icon/InvoiceIcon.svg"
import MoneyIcon from '@/assets/icon/MoneyIcon.svg'
import ReorderIcon from '@/assets/icon/ReorderIcon.svg'
import SuccessIcon from '@/assets/icon/SuccessIcon2.svg'
import { OrderStatusType } from '@/Services/api-service'
import { formatOrderId } from '@/utils/formatOrderID'
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type PastOrderItem = {
    name: string
    quantity: number
}

type PastOrderCardProps = {
    restaurantName: string
    restaurantImage?: string | null
    orderId: string
    status: OrderStatusType
    estimatedDeliveryAt?: string | null
    canPay: boolean
    iscancellable: boolean

    items: PastOrderItem[]

    onPayNow?: () => void
    onCancelOrder?: () => void
    onReorder?: () => void
    onInvoice?: () => void
}

export const getOrderStatusLabel = (status: OrderStatusType) => {
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
        case "CANCELLED_BY_RESTAURANT":
        case "REJECTED_BY_RESTAURANT":
        case "CANCELLED_TIMEOUT":
            return "Cancelled"

        default:
            return "Order"
    }
}

const formatOrderDateTime = (dateString?: string | null) => {
    if (!dateString) {
        return null
    }

    const date = new Date(dateString)

    const formattedDate = date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    )

    const formattedTime = date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    )

    return {
        date: formattedDate,
        time: formattedTime
    }
}

const PastOrdersCard = ({
    restaurantName,
    restaurantImage,
    orderId,
    status,
    estimatedDeliveryAt,
    canPay,
    iscancellable,
    items,
    onPayNow,
    onCancelOrder,
    onReorder,
    onInvoice
}: PastOrderCardProps) => {
    const isDelivered = status === "DELIVERED"

    const isCancelled =
        status === "CANCELLED_BY_CUSTOMER" ||
        status === "CANCELLED_BY_RESTAURANT" ||
        status === "REJECTED_BY_RESTAURANT" ||
        status === "CANCELLED_TIMEOUT"

    const isPendingPayment = status === "PENDING_PAYMENT"
    const showPayNow = canPay && status === "PENDING_PAYMENT"
    const showReorder = !showPayNow
    const showInvoice = status === "DELIVERED"
    const showCancel = iscancellable && !isDelivered && !isCancelled

    const statusBadgeStyle = (() => {
        if (isDelivered) {
            return {
                backgroundColor: "#E3F2E8",
                color: "#20BB59"
            }
        }

        if (isCancelled) {
            return {
                backgroundColor: "#FEE2E2",
                color: "#DC2626"
            }
        }

        if (isPendingPayment) {
            return {
                backgroundColor: "#FFF4D6",
                color: "#C47B00"
            }
        }

        return {
            backgroundColor: "#E8B93F20",
            color: "#3F2516"
        }
    })()

    const [imageError, setImageError] = useState(false)
    
    const DefaultRestaurantImage = require("../../../../assets/images/Default_Restaurant_Logo.png")
    
    useEffect(() => {
        setImageError(false)
    }, [restaurantImage])

    const hasImage = !!restaurantImage && !imageError

    const estimatedDelivery = formatOrderDateTime(estimatedDeliveryAt)

    const statusMessage = (() => {switch (status) {
        case "PENDING_PAYMENT":
            return {
                label: "Payment pending",
                value: "Pay to confirm your order."
            }

        case "PENDING":
            return {
                label: "Order pending",
                value: "Waiting for confirmation."
            }

        case "CONFIRMED":
            return {
                label: "Order confirmed",
                value: estimatedDelivery
                    ? `${estimatedDelivery.date} at ${estimatedDelivery.time}`
                    : "Your order has been confirmed."
            }

        case "PREPARING":
            return {
                label: "Preparing order",
                value: estimatedDelivery
                    ? `${estimatedDelivery.date} at ${estimatedDelivery.time}`
                    : "Your order is being prepared."
            }

        case "READY_FOR_PICKUP":
            return {
                label: "Ready for pickup",
                value: "Waiting for a rider."
            }

        case "RIDER_ASSIGNED":
            return {
                label: "Rider assigned",
                value: estimatedDelivery
                    ? `${estimatedDelivery.date} at ${estimatedDelivery.time}`
                    : "A rider has been assigned."
            }

        case "PICKED_UP":
            return {
                label: "Order picked up",
                value: estimatedDelivery
                    ? `${estimatedDelivery.date} at ${estimatedDelivery.time}`
                    : "Your order is on the way."
            }

        case "OUT_FOR_DELIVERY":
            return {
                label: "Out for delivery",
                value: estimatedDelivery
                    ? `${estimatedDelivery.date} at ${estimatedDelivery.time}`
                    : "Your order is on the way."
            }

        case "DELIVERED":
            return {
                label: "Order delivered",
                value: "Delivered successfully."
            }

        case "CANCELLED_BY_CUSTOMER":
            return {
                label: "Order cancelled",
                value: "You cancelled this order."
            }

        case "CANCELLED_BY_RESTAURANT":
            return {
                label: "Order cancelled",
                value: "Cancelled by restaurant."
            }

        case "REJECTED_BY_RESTAURANT":
            return {
                label: "Order rejected",
                value: "Restaurant couldn't accept it."
            }

        case "CANCELLED_TIMEOUT":
            return {
                label: "Order cancelled",
                value: "Order confirmation timed out."
            }

        default:
            return {
                label: "Order update",
                value: "Check the latest order status."
            }
    }})()

    return (
        <View
            className="bg-[#FAFAFA] border-[#1F1F1F]/10 p-4"
            style={{
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
                        className="flex-row items-center justify-center"
                        style={{
                            gap: moderateScale(3),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                            backgroundColor: statusBadgeStyle.backgroundColor
                        }}
                    >
                        {isDelivered ? (
                            <SuccessIcon
                                width={moderateScale(16)}
                                height={moderateScale(16)}
                                color={statusBadgeStyle.color}
                                strokeWidth={1.5}
                            />
                        ) : isCancelled ? (
                            <CancelCircleIcon
                                width={moderateScale(16)}
                                height={moderateScale(16)}
                                color={statusBadgeStyle.color}
                                strokeWidth={1.5}
                            />
                        ) : isPendingPayment ? (
                            <ClockIcon
                                width={moderateScale(16)}
                                height={moderateScale(16)}
                                color={statusBadgeStyle.color}
                                strokeWidth={1.5}
                            />
                        ) : null}

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(10),
                                color: statusBadgeStyle.color
                            }}
                        >
                            {getOrderStatusLabel(status)}
                        </Text>
                    </View>
                </View>
            </View>

            <View
                className="flex-row gap-2 py-3 px-4 items-center bg-[#E8B93F]/10"
                style={{
                    borderRadius: moderateScale(12),
                    marginTop: verticalScale(12),
                    marginHorizontal: scale(4)
                }}
            >
                <Text
                    numberOfLines={2}
                    className="text-[#1F1F1F]/75 font-medium"
                    style={{ fontSize: moderateScale(11) }}
                >
                    {statusMessage.label}

                    {" • "}

                    <Text
                        className="text-[#1F1F1F] font-semibold"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        {statusMessage.value}
                    </Text>
                </Text>
            </View>

            <View
                className="items-start bg-[#E5E4E2]/45 py-4 px-5"
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

            <View
                className="flex-row items-center justify-center gap-3"
                style={{ marginTop: verticalScale(18) }}
            >
                {showPayNow && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onPayNow}
                        className="flex-row flex-1 items-center justify-center bg-[#3F2516]"
                        style={{
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(14)
                        }}
                    >
                        <MoneyIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.8} />

                        <Text
                            className="text-white font-medium ml-2 mr-1"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Pay Now
                        </Text>

                        {/* <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} /> */}
                    </TouchableOpacity>
                )}

                {showReorder && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onReorder}
                        className="flex-row flex-1 items-center justify-center bg-[#3F2516]"
                        style={{
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(14)
                        }}
                    >
                        <ReorderIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.8} />

                        <Text
                            className="text-white font-medium ml-2 mr-1"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Reorder
                        </Text>

                        {/* <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} /> */}
                    </TouchableOpacity>
                )}

                {showInvoice && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onInvoice}
                        className="flex-row flex-1 items-center justify-center bg-[#E5E4E2]/65"
                        style={{
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(14)
                        }}
                    >
                        <InvoiceIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.8} />

                        <Text
                            className="text-[#3F2516] font-medium ml-2 mr-1"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Invoice
                        </Text>

                        {/* <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" strokeWidth={2} /> */}
                    </TouchableOpacity>
                )}

                {showCancel && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onCancelOrder}
                        className="flex-row flex-1 items-center justify-center bg-[#FEE2E2]/85"
                        style={{
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(14)
                        }}
                    >
                        <CancelCircleIcon width={moderateScale(18)} height={moderateScale(18)} color="rgba(220,38,38,0.80)" strokeWidth={1.8} />

                        <Text
                            className="font-medium ml-2 mr-1"
                            style={{
                                fontSize: moderateScale(13),
                                color: "rgba(220,38,38,0.80)"
                            }}
                        >
                            Cancel Order
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default React.memo(PastOrdersCard)