import ClockIcon from "@/assets/icon/ClockIcon.svg"
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

interface RestaurantCardProps {
    name: string
    imageUri: string
    rating: number
    cuisines: string[]
    deliveryFee: number
    deliveryTime: string
    priceForTwo: number
    isActive?: boolean

    onPress?: () => void
    onFavouritePress?: () => void
    isFavourite?: boolean
}

const RestaurantCard = ({
    name,
    imageUri,
    rating,
    cuisines,
    deliveryFee,
    deliveryTime,
    priceForTwo,
    onPress,
    onFavouritePress,
    isFavourite = false,
    isActive = true
}: RestaurantCardProps) => {
    const isInactive = !isActive

    return (
        <TouchableOpacity
            activeOpacity={isActive ? 0.95 : 1}
            onPress={isActive ? onPress : undefined}
            disabled={isInactive}
            className="w-full overflow-hidden border"
            style={{
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
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
                        overflow: "hidden"
                    }}
                >
                    <Image
                        source={{
                            uri: imageUri
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
                            style={{ backgroundColor: "rgba(31,31,31,0.35)" }}
                        />
                    )}
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={isInactive}
                    onPress={(event) => {
                        event.stopPropagation()

                        if (isInactive) return

                        onFavouritePress?.()
                    }}
                    hitSlop={8}
                    className="absolute items-center justify-center rounded-full border"
                    style={{
                        right: moderateScale(14),
                        top: moderateScale(14),
                        width: moderateScale(32),
                        height: moderateScale(32),
                        backgroundColor: isInactive
                            ? "rgba(255,255,255,0.75)"
                            : "#FFFFFF",
                        borderColor: "rgba(31,31,31,0.10)"
                    }}
                >
                    {isFavourite ? (
                        <FavouriteIconFilled
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={isInactive ? "#777777" : "#3F2516"}
                            style={{ marginTop: moderateScale(1.5) }}
                        />
                    ) : (
                        <FavouriteIcon
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={isInactive ? "#777777" : "#3F2516"}
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
                            backgroundColor: "rgba(31,31,31,0.85)"
                        }}
                    >
                        <Text
                            className="font-bold text-white uppercase"
                            style={{ fontSize: moderateScale(9) }}
                        >
                            Currently Closed
                        </Text>
                    </View>
                )}
            </View>

            <View className="px-3 py-3 -mt-2">
                <View className="flex-row items-center gap-3">
                    <Text
                        numberOfLines={1}
                        className="flex-1 font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            color: isInactive ? "rgba(31,31,31,0.52)" : "#1F1F1F"
                        }}
                    >
                        {name}
                    </Text>

                    <View
                        className="flex-row items-center justify-center gap-1"
                        style={{
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <RatingIcon
                            width={moderateScale(15)}
                            height={moderateScale(15)}
                            color={isInactive ? "#858585" : "#5C4639"}
                        />

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(11),
                                marginRight: moderateScale(2),
                                color: isInactive ? "#858585" : "#5C4639"
                            }}
                        >
                            {rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={1}
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1),
                        color: isInactive
                            ? "rgba(31,31,31,0.38)"
                            : "rgba(31,31,31,0.75)"
                    }}
                >
                    {cuisines.join(" • ")}
                </Text>

                <View
                    style={{
                        height: verticalScale(0.7),
                        marginVertical: verticalScale(8),
                        marginHorizontal: verticalScale(2),
                        backgroundColor: isInactive
                            ? "rgba(31,31,31,0.10)"
                            : "rgba(232,221,211,0.65)"
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
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <DeliveryIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color={isInactive ? "#858585" : "#5C4639"}
                        />

                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(11),
                                color: isInactive ? "#858585" : "#5C4639"
                            }}
                        >
                            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                        <View
                            className="items-center justify-center rounded-full"
                            style={{
                                width: moderateScale(22),
                                height: moderateScale(22),
                                backgroundColor: isInactive
                                    ? "rgba(31,31,31,0.07)"
                                    : "rgba(232,185,63,0.15)"
                            }}
                        >
                            <ClockIcon
                                width={moderateScale(15)}
                                height={moderateScale(15)}
                                color={isInactive ? "#858585" : "#5C4639"}
                            />
                        </View>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                color: isInactive
                                    ? "rgba(31,31,31,0.45)"
                                    : "rgba(31,31,31,0.75)"
                            }}
                        >
                            {isInactive ? "Closed" : deliveryTime}
                        </Text>
                    </View>

                    <View
                        className="ml-auto items-center justify-center"
                        style={{
                            paddingHorizontal: moderateScale(9),
                            paddingVertical: moderateScale(5),
                            borderRadius: moderateScale(10),
                            backgroundColor: isInactive ? "#B5B5B5" : "#3F2516"
                        }}
                    >
                        <Text
                            className="font-medium text-white"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            ₹{priceForTwo} for two
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(RestaurantCard)