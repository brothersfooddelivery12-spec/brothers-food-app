import LocationIcon from "@/assets/icon/LocationIcon3.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export interface NearByRestaurants {
    id: string
    name: string

    imageUrl?: string | null
    cuisines?: string

    rating?: number | null

    distance?: string | null
    discount?: string | null
    priceForTwo?: number | null

    isOpen: boolean
}

interface RestaurantListCardProps {
    restaurant: NearByRestaurants
    onPress?: () => void
}

const NearByRestaurantsList = ({ restaurant, onPress}: RestaurantListCardProps) => {
    const isInactive = !restaurant.isOpen

    const [imageError, setImageError] = useState(false)

    const DefaultRestaurantImage = require("../../../../assets/images/Default_Restaurant_Image.png")

    useEffect(() => {
        setImageError(true)
    }, [restaurant.imageUrl])

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
            className="w-full flex-row overflow-hidden border p-2"
            style={{
                borderRadius: moderateScale(22),
                gap: moderateScale(8),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
            }}
        >
            <View
                style={{
                    width: moderateScale(78),
                    height: moderateScale(78),
                    borderRadius: moderateScale(18),
                    overflow: "hidden",
                    position: "relative",
                    borderWidth: !hasImage && !isInactive ? 1 : 0,
                    borderColor: "rgba(31,31,31,0.08)"
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
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    style={{
                        width: "100%",
                        height: "100%",
                        opacity: isInactive ? 0.45 : 1
                    }}
                />

                {isInactive && (
                    <View
                        pointerEvents="none"
                        className="absolute inset-0 bg-black/25"
                    />
                )}

                {isInactive && (
                    <View
                        className="absolute items-center justify-center"
                        style={{
                            left: scale(6),
                            right: scale(6),
                            bottom: verticalScale(6),
                            paddingVertical: verticalScale(3),
                            borderRadius: moderateScale(10),
                            backgroundColor: "rgba(31,31,31,0.80)"
                        }}
                    >
                        <Text
                            className="text-white font-bold uppercase text-center"
                            style={{ fontSize: moderateScale(7.5) }}
                        >
                            Currently Closed
                        </Text>
                    </View>
                )}
            </View>

            <View className="flex-1 justify-center mt-1">
                <Text
                    numberOfLines={1}
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(14),
                        color: isInactive ? "rgba(31,31,31,0.55)" : "#1F1F1F" }}
                >
                    {restaurant.name}
                </Text>

                <Text
                    numberOfLines={1}
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1),
                        color: isInactive
                            ? "rgba(31,31,31,0.40)"
                            : "rgba(31,31,31,0.65)"
                    }}
                >
                    {restaurant.cuisines}
                </Text>

                <View className="flex-row items-center gap-1">
                    <View
                        className="flex-row items-center justify-center gap-1 self-start"
                        style={{
                            marginTop: moderateScale(8),
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <RatingIcon
                            width={moderateScale(14)}
                            height={moderateScale(14)}
                            color={isInactive ? "#8A8A8A" : "#5C4639"}
                        />

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(10),
                                marginRight: moderateScale(2),
                                color: isInactive ? "#8A8A8A" : "#5C4639"
                            }}
                        >
                            {(rating ?? 0).toFixed(1)}
                        </Text>
                    </View>

                    <View
                        className="flex-row items-center justify-center gap-1 self-start"
                        style={{
                            marginTop: moderateScale(8),
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <LocationIcon
                            width={moderateScale(14)}
                            height={moderateScale(14)}
                            color={isInactive ? "#8A8A8A" : "#5C4639"}
                        />

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(10),
                                marginRight: moderateScale(2),
                                color: isInactive ? "#8A8A8A" : "#5C4639"
                            }}
                        >
                            {distance} km
                        </Text>
                    </View>
                </View>
            </View>

            <View className="ml-auto items-end justify-between">
                {!isInactive && hasDiscount && (
                    <View
                        className="self-end flex-row items-center justify-center bg-[#E8B93F]/15"
                        style={{
                            marginTop: moderateScale(3),
                            marginRight: moderateScale(3),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4.5),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className="font-bold text-[#5C4639]"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            {restaurant.discount}
                        </Text>
                    </View>
                )}

                {isInactive && (
                    <View
                        style={{
                            marginTop: moderateScale(3),
                            marginRight: moderateScale(3),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                            backgroundColor: "rgba(31,31,31,0.08)"
                        }}
                    >
                        <Text
                            className="font-semibold uppercase"
                            style={{
                                fontSize: moderateScale(9),
                                color: "rgba(31,31,31,0.50)"
                            }}
                        >
                            Unavailable
                        </Text>
                    </View>
                )}

                {hasPriceForTwo && (
                    <View
                        className="self-end items-center justify-center"
                        style={{
                            marginBottom: moderateScale(3),
                            marginRight: moderateScale(3),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4.5),
                            borderRadius: moderateScale(10),
                            backgroundColor: isInactive ? "#B7B7B7" : "#3F2516"
                        }}
                    >
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(11),
                                color: isInactive ? "#FFFFFF" : "#FFFFFF"
                            }}
                        >
                            ₹{restaurant.priceForTwo} for two
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(NearByRestaurantsList)