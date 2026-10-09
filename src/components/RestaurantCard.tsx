import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import TimerIcon from "@/assets/icon/TimerIcon.svg"
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { formatRestaurantTime } from "@/utils/time-utils"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface Restaurants {
    id: string
    name: string

    imageUrl?: string | null
    cuisines?: string

    rating?: number | null
    deliveryFee: number | null
    deliveryTime: number | null

    openingTime?: string | null
    closingTime?: string | null

    distance?: string | null
    discount?: string | null
    priceForTwo?: number | null

    isOpen: boolean
}

interface RestaurantCardProps {
    restaurant: Restaurants

    onPress?: () => void
    onFavouritePress?: () => void
    isFavourite?: boolean
}

const RestaurantCard = ({
    restaurant,
    onPress,
    onFavouritePress,
    isFavourite = false
}: RestaurantCardProps) => {
    const isInactive = !restaurant.isOpen
    
    const [imageError, setImageError] = useState(false)

    const DefaultRestaurantImage = require("../../assets/images/Default_Restaurant_Cover_Image.png")

    useEffect(() => {
        setImageError(false)
    }, [restaurant.imageUrl])

    const openingTime = formatRestaurantTime(restaurant.openingTime)
    const closingTime = formatRestaurantTime(restaurant.closingTime)

    const hasImage = !!restaurant.imageUrl && !imageError
    const rating = restaurant.rating ?? 0
    const distance = restaurant.distance ?? "0.0"
    const hasDiscount = !!restaurant.discount
    const hasPriceForTwo =
        restaurant.priceForTwo !== null &&
        restaurant.priceForTwo !== undefined &&
        restaurant.priceForTwo > 0

    return (
        <TouchableOpacity
            activeOpacity={restaurant.isOpen ? 0.95 : 1}
            onPress={onPress}
            className="w-full overflow-hidden border"
            style={{
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? COLORS.inactiveBackgroundColor : COLORS.secondaryBackgroundColor,
                borderWidth: moderateScale(0.5),
                borderColor: isInactive 
                    ? hexToRgba(COLORS.primaryTextColor, 0.08)
                    : hexToRgba(COLORS.primaryTextColor, 0.10)
            }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(120) }}
            >
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: moderateScale(18),
                        overflow: "hidden",
                        borderWidth: !hasImage && !isInactive ? 0.7 : 0,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.08)
                    }}
                >
                    <Image
                        source={
                            hasImage
                                ? {
                                    uri: restaurant.imageUrl!
                                }
                                : DefaultRestaurantImage
                        }
                        onError={() => {
                            setImageError(true)
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        style={{
                            width: "100%",
                            height: "100%",
                            opacity: isInactive ? 0.48 : 1
                        }}
                    />

                    {isInactive && (
                        <View
                            pointerEvents="none"
                            className="absolute inset-0"
                            style={{ backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.25) }}
                        />
                    )}
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={(event) => {
                        event.stopPropagation()

                        onFavouritePress?.()
                    }}
                    hitSlop={8}
                    className="absolute items-center justify-center rounded-full border"
                    style={{
                        right: moderateScale(14),
                        top: moderateScale(14),
                        width: moderateScale(34),
                        height: moderateScale(34),
                        backgroundColor: isInactive ? hexToRgba(COLORS.primaryBackgroundColor, 0.75) : COLORS.primaryBackgroundColor,
                        borderWidth: moderateScale(0.7),
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.10)
                    }}
                >
                    {isFavourite ? (
                        <FavouriteIconFilled
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={isInactive ? COLORS.inactiveContentColor : COLORS.primaryColor}
                            style={{ marginTop: moderateScale(1.5) }}
                        />
                    ) : (
                        <FavouriteIcon
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={isInactive ? COLORS.inactiveContentColor : COLORS.primaryColor}
                            strokeWidth={1.5}
                            style={{ marginTop: moderateScale(1.5) }}
                        />
                    )}
                </TouchableOpacity>

                {isInactive && (
                    <View
                        className="absolute items-center justify-center"
                        style={{
                            left: moderateScale(16),
                            bottom: moderateScale(14),
                            paddingHorizontal: moderateScale(9),
                            paddingVertical: verticalScale(5),
                            borderRadius: moderateScale(10),
                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.85)
                        }}
                    >
                        <Text
                            className="font-bold uppercase"
                            style={{
                                fontSize: moderateScale(9),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Currently Closed
                        </Text>
                    </View>
                )}
            </View>

            <View className="px-3 py-3 -mt-2">
                <View className="flex-row items-start gap-3">
                    <View
                        className="flex-1"
                        style={{ minWidth: 0 }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="font-extrabold"
                            style={{
                                fontSize: moderateScale(15),
                                color: isInactive ? hexToRgba(COLORS.primaryTextColor, 0.52) : COLORS.primaryTextColor
                            }}
                        >
                            {restaurant.name}
                        </Text>

                        <Text
                            numberOfLines={2}
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(11.5),
                                marginTop: moderateScale(4),
                                lineHeight: moderateScale(14),
                                color: isInactive
                                    ? hexToRgba(COLORS.primaryTextColor, 0.38)
                                    : hexToRgba(COLORS.primaryTextColor, 0.65)
                            }}
                        >
                            {restaurant.cuisines}
                        </Text>

                        {restaurant.openingTime && restaurant.closingTime && (
                            <View
                                className="flex-row items-center"
                                style={{
                                    gap: moderateScale(5),
                                    marginTop: moderateScale(6)
                                }}
                            >
                                <ClockIcon
                                    width={moderateScale(16)}
                                    height={moderateScale(16)}
                                    color={isInactive ? COLORS.inactiveContentColor : hexToRgba(COLORS.primaryTextColor, 0.65)}
                                    strokeWidth={1.8}
                                />

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10.5),
                                        color: isInactive
                                            ? hexToRgba(COLORS.primaryTextColor, 0.45)
                                            : hexToRgba(COLORS.primaryTextColor, 0.65)
                                    }}
                                >
                                    {isInactive
                                        ? openingTime
                                            ? `Opens at ${openingTime}`
                                            : "Currently closed"
                                        : openingTime && closingTime
                                            ? `${openingTime} – ${closingTime}`
                                            : "Hours unavailable"
                                    }
                                </Text>
                            </View>
                        )}
                    </View>

                    <View
                        className="flex-row items-center justify-center gap-1"
                        style={{
                            flexShrink: 0,
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive
                                ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                : hexToRgba(COLORS.accentColor, 0.15)
                        }}
                    >
                        <RatingIcon width={moderateScale(15)} height={moderateScale(15)} color={isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor} />

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(11),
                                marginRight: moderateScale(2),
                                color: isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor
                            }}
                        >
                            {(rating ?? 0).toFixed(1)}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        height: verticalScale(0.7),
                        marginVertical: verticalScale(8),
                        marginHorizontal: verticalScale(2),
                        backgroundColor: isInactive
                            ? hexToRgba(COLORS.primaryTextColor, 0.1)
                            : hexToRgba(COLORS.borderColor, 0.6)
                    }}
                />

                <View className="flex-row items-center gap-2">
                    <View
                        className="flex-row items-center justify-center"
                        style={{
                            gap: moderateScale(5),
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                            backgroundColor: isInactive
                                ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                : hexToRgba(COLORS.accentColor, 0.15)
                        }}
                    >
                        <DeliveryIcon width={moderateScale(16)} height={moderateScale(16)} color={isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor} />

                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(11),
                                color: isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor
                            }}
                        >
                            {restaurant.deliveryFee === 0 ? "FREE" : `₹${restaurant.deliveryFee}`}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                        <View
                            className="items-center justify-center rounded-full"
                            style={{
                                width: moderateScale(22),
                                height: moderateScale(22),
                                backgroundColor: isInactive
                                    ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                    : hexToRgba(COLORS.accentColor, 0.15)
                            }}
                        >
                            <TimerIcon
                                width={moderateScale(15)}
                                height={moderateScale(15)}
                                color={isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor} strokeWidth={1.8}
                            />
                        </View>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                color: isInactive
                                    ? hexToRgba(COLORS.primaryTextColor, 0.45)
                                    : hexToRgba(COLORS.primaryTextColor, 0.75)
                            }}
                        >
                            {isInactive ? "Closed"
                                : restaurant.deliveryTime
                                    ? `${restaurant.deliveryTime} min`
                                    : "-- min"
                            }
                        </Text>
                    </View>

                    {hasPriceForTwo && (
                        <View
                            className="ml-auto items-center justify-center"
                            style={{
                                paddingHorizontal: moderateScale(9),
                                paddingVertical: moderateScale(5),
                                borderRadius: moderateScale(10),
                                backgroundColor: isInactive ? COLORS.disabledBackgroundColor : COLORS.primaryColor
                            }}
                        >
                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(11),
                                    color: isInactive ? hexToRgba(COLORS.primaryBackgroundColor, 0.65) : COLORS.primaryBackgroundColor
                                }}
                            >
                                ₹{restaurant.priceForTwo} for two
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(RestaurantCard)