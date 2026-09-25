import ArrowRight from '@/assets/icon/ArrowRight.svg'
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
            return "Cancelled by You"

        case "CANCELLED_BY_RESTAURANT":
            return "Cancelled by Restaurant"

        case "REJECTED_BY_RESTAURANT":
            return "Rejected by Restaurant"

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
        setImageError(true)
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
                value: "Cancelled by you."
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
                        className="flex-row items-center justify-center bg-[#E3F2E8]"
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
                    onPress={isPendingPayment ? onPayNow : onReorder}
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
                        <ReorderIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={1.8} />
                    )}

                    <Text
                        className="text-[#FFFFFF] font-medium ml-2 mr-1"
                        style={{ fontSize: moderateScale(13) }}
                    >
                        {isPendingPayment ? "Pay now" : "Reorder"}
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={isPendingPayment ? onCancelOrder : onInvoice}
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
                        <InvoiceIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.8} />
                    )}

                    <Text
                        className="font-medium ml-2 mr-1"
                        style={{
                            fontSize: moderateScale(13),
                            color: isPendingPayment ? "rgba(220, 38, 38, 0.80)" : "#3F2516"
                        }}
                    >
                        {isPendingPayment ? "Cancel Order" : "Invoice"}
                    </Text>

                    <ArrowRight
                        width={moderateScale(16)}
                        height={moderateScale(16)}
                        color={isPendingPayment ? "rgba(220, 38, 38, 0.80)" : "#3F2516"}
                        strokeWidth={2}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default React.memo(PastOrdersCard)