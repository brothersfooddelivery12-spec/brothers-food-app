import ArrowRightIcon from "@/assets/icon/ArrowRight.svg"
import CallIcon from "@/assets/icon/CallFilledIcon.svg"
import RiderIcon from "@/assets/icon/DeliveryIcon.svg"
import NotificationIcon from '@/assets/icon/NotificationIcon.svg'
import TagIcon from '@/assets/icon/OfferIcon.svg'
import ReceiptIcon from "@/assets/icon/OrderIcon.svg"
import { formatNotificationTime } from "@/utils/notificationUtils"
import { Image } from "expo-image"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type NotificationItem = {
    id: string
    type:
        | "default"
        | "order"
        | "payment"
        | "restaurant"
        | "flash_sale"

    title: string
    description: string

    createdAt: string

    unread?: boolean

    // optional fields
    badge?: string
    offerId?: string
    restaurantId?: string
    image?: string
}

type NotificationCardProps = {
    item: NotificationItem

    onTrackOrder?: () => void
    onCallRider?: () => void
    onViewInvoice?: () => void

    onExploreRestaurant?: (
        item: NotificationItem
    ) => void

    onClaimOffer?: (
        item: NotificationItem
    ) => void
}

function NotificationCard({
    item,
    onTrackOrder,
    onCallRider,
    onViewInvoice,
    onClaimOffer,
    onExploreRestaurant
}: NotificationCardProps) {
    if (item.type === "restaurant") {
        return (
            <View
                className="bg-white border border-[#1F1F1F]/10 overflow-hidden"
                style={{ borderRadius: moderateScale(20) }}
            >
                <View
                    className="relative w-full p-2"
                    style={{ height: verticalScale(120) }}
                >
                    <Image
                        source={{ uri: item.image }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: moderateScale(18)
                        }}
                    />
                </View>

                <View
                    style={{
                        paddingHorizontal: scale(14),
                        paddingTop: verticalScale(6),
                        paddingBottom: verticalScale(12)
                    }}
                >
                    <View className="flex-row items-start">
                        <Text
                            className="flex-1 text-[#1F1F1F] font-black"
                            style={{
                                fontSize: moderateScale(15),
                                lineHeight: moderateScale(16),
                                paddingRight: scale(12),
                            }}
                        >
                            {item.title}
                        </Text>

                        <View className="flex-row items-center justify-center">
                            <Text
                                className="text-[#1F1F1F]/75 font-medium"
                                style={{ fontSize: moderateScale(10) }}
                            >
                                {formatNotificationTime(item.createdAt)}
                            </Text>

                            {item.unread && (
                                <View
                                    className="bg-[#EF4444]"
                                    style={{
                                        width: moderateScale(8),
                                        height: moderateScale(8),
                                        borderRadius: moderateScale(5),
                                        marginLeft: scale(6)
                                    }}
                                />
                            )}
                        </View>
                    </View>

                    <Text
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            lineHeight: moderateScale(16),
                            marginTop: verticalScale(6)
                        }}
                    >
                        {item.description}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => onExploreRestaurant?.(item)}
                        className="items-center justify-center bg-[#3F2516]"
                        style={{
                            borderRadius: moderateScale(28),
                            paddingVertical: verticalScale(12),
                            marginTop: verticalScale(13)
                        }}
                    >
                        <Text
                            className="text-white font-semibold"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Explore Menu
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    if (item.type === "flash_sale") {
        console.log(item.type, item.unread)
        return (
            <View
                className="bg-[#3F1C0E]"
                style={{
                    borderRadius: moderateScale(20),
                    paddingHorizontal: scale(18),
                    paddingVertical: verticalScale(16)
                }}
            >
                <View className="flex-row items-start">
                    <View
                        className="items-center justify-center bg-[#FFD54F]"
                        style={{
                            width: moderateScale(42),
                            height: moderateScale(42),
                            borderRadius: moderateScale(50),
                            marginRight: scale(12)
                        }}
                    >
                        <TagIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-start justify-between">
                            <Text
                                numberOfLines={1}
                                className="flex-1 text-[#F8D56A] font-black uppercase"
                                style={{
                                    fontSize: moderateScale(10),
                                    lineHeight: moderateScale(16),
                                    paddingRight: scale(8)
                                }}
                            >
                                {item.badge}
                            </Text>

                            <View
                                className="flex-row items-center"
                                style={{ flexShrink: 0 }}
                            >
                                <Text
                                    className="text-[#FFFFFF]/75 font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    {formatNotificationTime(item.createdAt)}
                                </Text>

                                {item.unread === true && (
                                    <View
                                        className="bg-[#EF4444]"
                                        style={{
                                            width: moderateScale(8),
                                            height: moderateScale(8),
                                            borderRadius: moderateScale(5),
                                            marginLeft: scale(6)
                                        }}
                                    />
                                )}
                            </View>
                        </View>

                        <Text
                            className="text-white font-black"
                            style={{
                                fontSize: moderateScale(16),
                                lineHeight: moderateScale(22),
                                marginTop: verticalScale(5)
                            }}
                        >
                            {item.title}
                        </Text>

                        <Text
                            className="text-white/65 font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                lineHeight: moderateScale(13),
                                marginTop: verticalScale(3)
                            }}
                        >
                            {item.description}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => onClaimOffer?.(item)}
                            className="self-start items-center justify-center bg-[#F8D56A]"
                            style={{
                                borderRadius: moderateScale(24),
                                paddingHorizontal: scale(18),
                                paddingVertical: verticalScale(6),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <Text
                                className="text-[#3F2516] font-black"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                Claim Offer
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    if (item.type === "order" || item.type === "payment") {
        const isOrder = item.type === "order"
        const Icon = isOrder ? RiderIcon : ReceiptIcon

        return (
            <View
                className="bg-white border border-[#1F1F1F]/10"
                style={{
                    borderRadius: moderateScale(20),
                    padding: moderateScale(14),
                    overflow: "hidden",
                    borderLeftWidth: isOrder ? 4 : 1,
                    borderLeftColor: isOrder ? "#3F2516" : "rgba(31,31,31,0.10)"
                }}
            >
                <View className="flex-row items-start">
                    <View
                        className={
                            isOrder
                                ? "items-center justify-center bg-[#3F2516]"
                                : "items-center justify-center bg-[#F5F5F5]"
                        }
                        style={{
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderRadius: moderateScale(23),
                            marginRight: scale(12)
                        }}
                    >
                        <Icon
                            width={moderateScale(22)}
                            height={moderateScale(22)}
                            color={isOrder ? "#FFFFFF" : "#3F2516"}
                        />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-start mt-1">
                            <Text
                                className="flex-1 text-[#1F1F1F] font-black"
                                style={{
                                    fontSize: moderateScale(15),
                                    lineHeight: moderateScale(24),
                                    paddingRight: scale(8)
                                }}
                            >
                                {item.title}
                            </Text>

                            <View
                                className="flex-row items-center"
                                style={{ flexShrink: 0 }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    {formatNotificationTime(item.createdAt)}
                                </Text>

                                {item.unread && (
                                    <View
                                        className="bg-[#EF4444]"
                                        style={{
                                            width: moderateScale(8),
                                            height: moderateScale(8),
                                            borderRadius: moderateScale(4),
                                            marginLeft: scale(6)
                                        }}
                                    />
                                )}
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                lineHeight: moderateScale(16),
                                marginTop: verticalScale(6)
                            }}
                        >
                            {item.description}
                        </Text>

                        {item.type === "order" && (
                            <View
                                className="flex-row"
                                style={{
                                    gap: scale(10),
                                    marginTop: verticalScale(16)
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={onTrackOrder}
                                    className="flex-1 items-center justify-center bg-[#3F2516]"
                                    style={{
                                        paddingVertical: verticalScale(8),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <Text
                                        className="text-white font-semibold"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Track Order
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={onCallRider}
                                    className="flex-1 flex-row items-center justify-center bg-[#E5E4E2]/75"
                                    style={{
                                        paddingVertical: verticalScale(8),
                                        borderRadius: moderateScale(18),
                                        gap: scale(7)
                                    }}
                                >
                                    <CallIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" />

                                    <Text
                                        className="text-[#3F2516] font-semibold"
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Call Rider
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {item.type === "payment" && (
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={onViewInvoice}
                                className="self-start flex-row items-center bg-[#3F2516]"
                                style={{
                                    paddingVertical: verticalScale(8),
                                    paddingLeft: scale(14),
                                    paddingRight: scale(8),
                                    borderRadius: moderateScale(18),
                                    marginTop: verticalScale(14),
                                    gap: scale(4)
                                }}
                            >
                                <Text
                                    className="text-white font-semibold"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    View Invoice
                                </Text>

                                <ArrowRightIcon width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={1.8} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        )
    }

    if (item.type === "default") {
        return (
            <View
                className="bg-white border border-[#1F1F1F]/10"
                style={{
                    borderRadius: moderateScale(20),
                    padding: moderateScale(14)
                }}
            >
                <View className="flex-row items-start">
                    <View
                        className="items-center justify-center bg-[#E8B93F]/15"
                        style={{
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderRadius: moderateScale(23),
                            marginRight: scale(12)
                        }}
                    >
                        <NotificationIcon width={moderateScale(22)} height={moderateScale(22)} color="#5C4639" strokeWidth={1.8} />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-start mt-1">
                            <Text
                                className="flex-1 text-[#1F1F1F] font-black"
                                style={{
                                    fontSize: moderateScale(15),
                                    lineHeight: moderateScale(21),
                                    paddingRight: scale(8)
                                }}
                            >
                                {item.title}
                            </Text>

                            <View
                                className="flex-row items-center"
                                style={{ flexShrink: 0 }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    {formatNotificationTime(item.createdAt)}
                                </Text>

                                {item.unread && (
                                    <View
                                        className="bg-[#EF4444]"
                                        style={{
                                            width: moderateScale(8),
                                            height: moderateScale(8),
                                            borderRadius: moderateScale(4),
                                            marginLeft: scale(6)
                                        }}
                                    />
                                )}
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                lineHeight: moderateScale(16),
                                marginTop: verticalScale(6)
                            }}
                        >
                            {item.description}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return null
}

export default memo(NotificationCard)