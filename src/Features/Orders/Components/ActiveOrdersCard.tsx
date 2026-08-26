import ArrowRight from '@/assets/icon/ArrowRight.svg'
import BoxIcon from '@/assets/icon/BoxIcon.svg'
import BoxTimeIcon from '@/assets/icon/BoxTimeIcon.svg'
import ClockIcon from "@/assets/icon/ClockIcon.svg"
import CustomerServiceIcon from "@/assets/icon/CustomerServiceIcon.svg"
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import OrderStatus from "./OrderStatus"

type OrderItem = {
    name: string
    quantity: number
}

type ActiveOrderCardProps = {
    restaurantName: string
    restaurantImage: string
    orderId: string
    status?: "Picked Up" | "Preparing" | "Out of Delivery"
    eta?: string
    activeStep?: number
    items: OrderItem[]
    onTrackOrder?: () => void
    onContactRider?: () => void
}

const ActiveOrderCard = ({
    restaurantName,
    restaurantImage,
    orderId,
    status = "Picked Up",
    eta = "18 mins",
    activeStep = 2,
    items,
    onTrackOrder,
    onContactRider,
}: ActiveOrderCardProps) => {
    const StatusIcon = {
        "Preparing": BoxTimeIcon,
        "Picked Up": BoxIcon,
        "Out of Delivery": DeliveryIcon,
    }[status]

    return (
        <View
            className="bg-white border border-[#1F1F1F]/10 p-3"
            style={{
                borderRadius: moderateScale(18),
                marginTop: verticalScale(14)
            }}
        >
            <View className="flex-row gap-3">
                <View
                    className="items-center justify-center overflow-hidden"
                    style={{
                        width: moderateScale(58),
                        height: moderateScale(58),
                        borderRadius: moderateScale(16)
                    }}
                >
                    <Image
                        source={{ uri: restaurantImage }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>

                <View className="justify-center gap-1 flex-1">
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
                        Order #{orderId}
                    </Text>
                </View>

                <View className="items-end justify-between my-1">
                    <View
                        className="flex-row items-center justify-center bg-[#F8D56A]"
                        style={{
                            gap: moderateScale(5),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >   
                        {StatusIcon && (
                            <StatusIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" />
                        )}

                        <Text
                            className="font-semibold text-[#3F2516]"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            {status}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1 mr-1">
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(22),
                                height: moderateScale(22)
                            }}
                        >
                            <ClockIcon width={moderateScale(15)} height={moderateScale(15)} color="#5c4639" />
                        </View>

                        <Text
                            className="font-medium text-[#1F1F1F]/75"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            ETA: {eta}
                        </Text>
                    </View>
                </View>
            </View>

            <OrderStatus activeStep={activeStep} />

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
                    onPress={onTrackOrder}
                    className="flex-row gap-2 items-center justify-center bg-[#3F2516]"
                    style={{
                        paddingHorizontal: scale(9),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <LocationIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" />

                    <Text
                        className="text-[#FFFFFF] font-semibold"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        Track Order
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={1.8} />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={onContactRider}
                    className="flex-row gap-2 items-center justify-center bg-[#E5E4E2]/75"
                    style={{
                        paddingHorizontal: scale(8),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <CustomerServiceIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={2} />

                    <Text
                        className="text-[#3F2516] font-semibold"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        Contact Rider
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" strokeWidth={1.8} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default React.memo(ActiveOrderCard)