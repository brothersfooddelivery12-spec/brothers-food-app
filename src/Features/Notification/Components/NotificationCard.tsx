import CallIcon from "@/assets/icon/CallFilledIcon.svg"
import RiderIcon from "@/assets/icon/DeliveryIcon.svg"
import NotificationIcon from '@/assets/icon/NotificationIcon.svg'
import TagIcon from '@/assets/icon/OfferIcon.svg'
import ReceiptIcon from "@/assets/icon/OrderIcon.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
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
                className="overflow-hidden"
                style={{
                    borderRadius: moderateScale(20),
                    borderWidth: moderateScale(0.5),
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                }}
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
                            className="flex-1 font-bold"
                            style={{
                                color: COLORS.primaryTextColor,
                                fontSize: moderateScale(15),
                                lineHeight: moderateScale(18),
                                paddingRight: scale(12),
                            }}
                        >
                            {item.title}
                        </Text>

                        <View className="flex-row items-center justify-center">
                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                }}
                            >
                                {formatNotificationTime(item.createdAt)}
                            </Text>

                            {item.unread && (
                                <View
                                    style={{
                                        backgroundColor: COLORS.errorTextColor,
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
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                            fontSize: moderateScale(11),
                            lineHeight: moderateScale(16),
                            marginTop: verticalScale(5)
                        }}
                    >
                        {item.description}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => onExploreRestaurant?.(item)}
                        className="items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            borderRadius: moderateScale(28),
                            paddingVertical: verticalScale(12),
                            marginTop: verticalScale(13)
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(12),
                                color: COLORS.primaryBackgroundColor
                            }}
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
                style={{
                    backgroundColor: COLORS.primaryColor,
                    borderRadius: moderateScale(20),
                    paddingHorizontal: scale(18),
                    paddingVertical: verticalScale(16)
                }}
            >
                <View className="flex-row items-start">
                    <View
                        className="items-center justify-center"
                        style={{
                            backgroundColor: COLORS.accentLightColor,
                            width: moderateScale(40),
                            height: moderateScale(40),
                            borderRadius: moderateScale(50),
                            marginRight: scale(12)
                        }}
                    >
                        <TagIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-start justify-between">
                            <Text
                                numberOfLines={1}
                                className="flex-1 font-black uppercase"
                                style={{
                                    color: COLORS.accentLightColor,
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
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.65)
                                    }}
                                >
                                    {formatNotificationTime(item.createdAt)}
                                </Text>

                                {item.unread === true && (
                                    <View
                                        style={{
                                            backgroundColor: COLORS.errorTextColor,
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
                            className="font-bold"
                            style={{
                                color: COLORS.primaryBackgroundColor,
                                fontSize: moderateScale(16),
                                lineHeight: moderateScale(18),
                                marginTop: verticalScale(5)
                            }}
                        >
                            {item.title}
                        </Text>

                        <Text
                            className="font-medium"
                            style={{
                                color: hexToRgba(COLORS.primaryBackgroundColor, 0.65),
                                fontSize: moderateScale(10.5),
                                lineHeight: moderateScale(13),
                                marginTop: verticalScale(6)
                            }}
                        >
                            {item.description}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => onClaimOffer?.(item)}
                            className="self-start items-center justify-center"
                            style={{
                                backgroundColor: COLORS.accentLightColor,
                                borderRadius: moderateScale(24),
                                paddingHorizontal: scale(18),
                                paddingVertical: verticalScale(6),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <Text
                                className="font-black"
                                style={{
                                    fontSize: moderateScale(11),
                                    color: COLORS.primaryColor
                                }}
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
                style={{
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    borderWidth: moderateScale(0.5),
                    borderRadius: moderateScale(20),
                    padding: moderateScale(14),
                    overflow: "hidden",
                    borderLeftWidth: isOrder ? 4 : 1,
                    borderLeftColor: isOrder ? COLORS.primaryColor : hexToRgba(COLORS.primaryTextColor, 0.1),
                }}
            >
                <View className="flex-row items-start">
                    <View
                        className="items-center justify-center"
                        style={{
                            backgroundColor: isOrder
                                ? COLORS.primaryColor
                                : hexToRgba(COLORS.disabledBackgroundColor, 0.2),
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderRadius: moderateScale(23),
                            marginRight: scale(12)
                        }}
                    >
                        <Icon
                            width={moderateScale(22)}
                            height={moderateScale(22)}
                            color={isOrder ? COLORS.primaryBackgroundColor : COLORS.primaryColor}
                        />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-start">
                            <Text
                                className="flex-1 font-bold"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(15),
                                    lineHeight: moderateScale(18),
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
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                    }}
                                >
                                    {formatNotificationTime(item.createdAt)}
                                </Text>

                                {item.unread && (
                                    <View
                                        style={{
                                            backgroundColor: COLORS.errorTextColor,
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
                            className="font-medium"
                            style={{
                                color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                fontSize: moderateScale(11),
                                lineHeight: moderateScale(16),
                                marginTop: verticalScale(5)
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
                                    className="flex-1 items-center justify-center"
                                    style={{
                                        backgroundColor: COLORS.primaryColor,
                                        paddingVertical: verticalScale(8),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(12),
                                            color: COLORS.primaryBackgroundColor
                                        }}
                                    >
                                        Track Order
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={onCallRider}
                                    className="flex-1 flex-row items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                        paddingVertical: verticalScale(8),
                                        borderRadius: moderateScale(18),
                                        gap: scale(7)
                                    }}
                                >
                                    <CallIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />

                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryColor
                                        }}
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
                                className="self-start flex-row items-center"
                                style={{
                                    backgroundColor: COLORS.primaryColor,
                                    paddingVertical: verticalScale(8),
                                    paddingLeft: scale(14),
                                    paddingRight: scale(14),
                                    borderRadius: moderateScale(18),
                                    marginTop: verticalScale(14),
                                    gap: scale(4)
                                }}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    View Invoice
                                </Text>
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
                style={{
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    borderWidth: moderateScale(0.5),
                    borderRadius: moderateScale(20),
                    padding: moderateScale(14)
                }}
            >
                <View className="flex-row items-start">
                    <View
                        className="items-center justify-center"
                        style={{
                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderRadius: moderateScale(23),
                            marginRight: scale(12)
                        }}
                    >
                        <NotificationIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                    </View>

                    <View className="flex-1">
                        <View className="flex-row items-start mt-1">
                            <Text
                                className="flex-1 font-bold"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(15),
                                    lineHeight: moderateScale(18),
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
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                    }}
                                >
                                    {formatNotificationTime(item.createdAt)}
                                </Text>

                                {item.unread && (
                                    <View
                                        style={{
                                            backgroundColor: COLORS.errorTextColor,
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
                            className="font-medium"
                            style={{
                                color: hexToRgba(COLORS.primaryTextColor, 0.75),
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