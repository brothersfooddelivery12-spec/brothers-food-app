import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Image } from "expo-image"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import ClockIcon from "@/assets/icon/ClockIcon.svg"

interface FavRestaurantCard {
    name: string
    imageUri: string
    rating: number
    cuisines: string[]
    deliveryFee: number
    deliveryTime: string
    priceForTwo: number
    isFavourite?: boolean
}

interface FavRestaurantCardProps {
    item: FavRestaurantCard
    onPress?: () => void
    onFavouritePress?: () => void
}

const FavRestaurantCard = ({ item, onPress, onFavouritePress }: FavRestaurantCardProps) => {
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
                        uri: item.imageUri
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
                    {item.isFavourite ? (
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
                        {item.name}
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
                            {item.rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={1}
                    className="font-medium text-[#1F1F1F]/75"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1)
                    }}
                >
                    {item.cuisines.join(" • ")}
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
                            {item.deliveryFee === 0
                                ? "FREE"
                                : `₹${item.deliveryFee}`}
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
                            {item.deliveryTime}
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
                            ₹{item.priceForTwo} for two
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center mt-4 gap-3">
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={(event) => {
                            event.stopPropagation()
                        }}
                        className="bg-[#3F2516] items-center justify-center"
                        style={{
                            paddingHorizontal: scale(18),
                            paddingVertical: verticalScale(8),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <Text
                            className="text-[#FFFFFF] font-semibold"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Order Now
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={(event) => {
                            event.stopPropagation()
                        }}
                        className="bg-[#E5E4E2]/85 items-center justify-center"
                        style={{
                            paddingHorizontal: scale(18),
                            paddingVertical: verticalScale(8),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <Text
                            className="text-[#3F2516] font-semibold"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            View Menu
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(FavRestaurantCard)