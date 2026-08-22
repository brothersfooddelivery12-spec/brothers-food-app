import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Image } from "expo-image"
import { moderateScale, verticalScale } from "react-native-size-matters"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import ClockIcon from "@/assets/icon/ClockIcon.svg"

interface RestaurantCardProps {
    name: string
    imageUri: string
    rating: number
    cuisines: string[]
    deliveryFee: number
    deliveryTime: string
    priceForTwo: number

    onPress?: () => void
    onFavouritePress?: () => void
    isFavourite?: boolean
}

const RestaurantCard = ({
    name, imageUri, rating, cuisines, deliveryFee,
    deliveryTime, priceForTwo, onPress, onFavouritePress,
    isFavourite = false,
}: RestaurantCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="w-full overflow-hidden bg-white border border-[#1F1F1F]/10"
            style={{ borderRadius: moderateScale(22) }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(120) }}
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
                        borderRadius: moderateScale(18)
                    }}
                />

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={(event) => {
                        event.stopPropagation()
                        onFavouritePress?.()
                    }}
                    hitSlop={8}
                    className="absolute items-center justify-center rounded-full bg-white border border-[#1F1F1F]/10"
                    style={{
                        right: moderateScale(14),
                        top: moderateScale(14),
                        width: moderateScale(32),
                        height: moderateScale(32)
                    }}
                >
                    {isFavourite ? (
                        <FavouriteIconFilled width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" style={{ marginTop: moderateScale(1.5) }} />
                    ) : (
                        <FavouriteIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" style={{ marginTop: moderateScale(1.5) }} />
                    )}
                </TouchableOpacity>
            </View>

            <View className="px-3 py-3 -mt-2">
                <View className="flex-row items-center gap-3">
                    <Text
                        numberOfLines={1}
                        className="flex-1 font-bold text-[#1F1F1F]"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        {name}
                    </Text>

                    <View
                        className="flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                        style={{
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <RatingIcon width={moderateScale(15)} height={moderateScale(15)} color="#5c4639" />

                        <Text
                            className="font-bold text-[#5c4639]"
                            style={{ fontSize: moderateScale(11), marginRight: moderateScale(2) }}
                        >
                            {rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={1}
                    className="font-medium text-[#1F1F1F]/75"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1),
                    }}
                >
                    {cuisines.join(" • ")}
                </Text>

                <View
                    className="rounded-full bg-[#E8DDD3]/65"
                    style={{
                        height: verticalScale(0.7),
                        marginVertical: verticalScale(8),
                        marginHorizontal: verticalScale(2)
                    }}
                />

                <View className="flex-row items-center gap-2">
                    <View
                        className="flex-row items-center justify-center bg-[#E8B93F]/15"
                        style={{
                            gap: moderateScale(5),
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <DeliveryIcon width={moderateScale(16)} height={moderateScale(16)} color="#5c4639" />

                        <Text
                            className="font-semibold text-[#5c4639]"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            {deliveryFee === 0
                                ? "FREE"
                                : `₹${deliveryFee}`}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(22),
                                height: moderateScale(22)
                            }}
                        >
                            <ClockIcon width={moderateScale(15)} height={moderateScale(15)} color ="#5c4639" style={{ marginLeft: moderateScale(0.5) }} />
                        </View>

                        <Text
                            className="font-medium text-[#1F1F1F]/75"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            {deliveryTime}
                        </Text>
                    </View>

                    <View
                        className="ml-auto items-center justify-center bg-[#3F2516]"
                        style={{
                            paddingHorizontal: moderateScale(9),
                            paddingVertical: moderateScale(5),
                            borderRadius: moderateScale(10)
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