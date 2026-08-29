import ArrowRight from '@/assets/icon/ArrowRight.svg'
import CancelCircleIcon from '@/assets/icon/CancelCircleIcon.svg'
import InvoiceIcon from "@/assets/icon/InvoiceIcon.svg"
import ReorderIcon from '@/assets/icon/ReorderIcon.svg'
import SuccessIcon from '@/assets/icon/SuccessIcon2.svg'
import { PastOrderItem } from "@/constant/PastOrdersData"
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type PastOrderCardProps = {
    restaurantName: string
    restaurantImage: string
    orderId: string
    status?: "Delivered" | "Cancelled"
    orderDate: string
    orderTime: string
    deliveryTime: string
    items: PastOrderItem[]
    onReorder?: () => void
    onInvoice?: () => void
}

const PastOrdersCard = ({
    restaurantName,
    restaurantImage,
    orderId,
    status = "Delivered",
    orderDate,
    orderTime,
    deliveryTime,
    items,
    onReorder,
    onInvoice,
}: PastOrderCardProps) => {
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
                        className="flex-row items-center justify-center bg-[#E3F2E8]"
                        style={{
                            gap: moderateScale(5),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                            backgroundColor: status === "Delivered" ? "#E3F2E8" : "#FEE2E2"
                        }}
                    >
                        {status === "Delivered" ? (
                            <SuccessIcon width={moderateScale(16)} height={moderateScale(16)} color="#4d9151" strokeWidth={1.5} />
                        ) : (
                            <CancelCircleIcon width={moderateScale(16)} height={moderateScale(16)} color="#DC2626" strokeWidth={1.5} />
                        )}

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(10),
                                color: status === "Delivered" ? "#4d9151" : "#DC2626"
                            }}
                        >
                            {status}
                        </Text>
                    </View>
                </View>
            </View>

            <View
                className="flex-row gap-2 py-3 px-4 items-center bg-[#E8B93F]/10"
                style={{
                    borderRadius: moderateScale(14),
                    marginTop: verticalScale(12),
                    marginHorizontal: scale(4)
                }}
            >
                <Text
                    numberOfLines={2}
                    className="text-[#1F1F1F]/75 font-medium"
                    style={{ fontSize: moderateScale(11) }}
                >
                    {status === "Delivered" ? (
                        <>
                            Delivered in{" "}

                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                {deliveryTime}
                            </Text>

                            {" • "}
                            {orderDate} at {orderTime}
                        </>
                    ) : (
                        <>
                            Cancelled{" • "}
                            {orderDate} at {orderTime}
                        </>
                    )}
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

            <View className="flex-row items-center justify-center gap-8 mt-5">
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={onReorder}
                    className="flex-row gap-2 items-center justify-center bg-[#3F2516]"
                    style={{
                        paddingHorizontal: scale(14),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <ReorderIcon width={moderateScale(20)} height={moderateScale(20)} color="#FFFFFF" strokeWidth={1.8} />

                    <Text
                        className="text-[#FFFFFF] font-semibold"
                        style={{ fontSize: moderateScale(13) }}
                    >
                        Reorder
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={onInvoice}
                    className="flex-row gap-2 items-center justify-center bg-[#E5E4E2]/75"
                    style={{
                        paddingHorizontal: scale(14),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <InvoiceIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" strokeWidth={1.8} />

                    <Text
                        className="text-[#3F2516] font-semibold"
                        style={{ fontSize: moderateScale(13) }}
                    >
                        Invoice
                    </Text>

                    <ArrowRight width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" strokeWidth={2} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default React.memo(PastOrdersCard)