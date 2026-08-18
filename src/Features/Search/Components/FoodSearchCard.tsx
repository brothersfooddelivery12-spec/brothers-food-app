import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon.svg'
import React from "react"

export interface FoodSearchCardProps {
    id: string
    name: string
    restaurant: string
    rating: number
    deliveryTime: string
    price: number
    discount?: string
    image: string | number
    isFavourite?: boolean
    onPress?: () => void
    onFavouritePress?: () => void
    onAddPress?: () => void
}

const FoodSearchCard = ({
    name,
    restaurant,
    rating,
    deliveryTime,
    price,
    discount,
    image,
    isFavourite = false,
    onPress,
    onFavouritePress,
    onAddPress,
}: FoodSearchCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="w-full mt-4 overflow-hidden bg-white border border-[#1F1F1F]/10"
            style={{ borderRadius: moderateScale(22) }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(120) }}
            >
                <Image
                    source={image}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: moderateScale(18),
                    }}
                />

                {discount && (
                    <View
                        className="absolute top-4 left-4 flex-row items-center bg-[#F8D56A]"
                        style={{
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                        }}
                    >
                        <Text
                            className="font-bold text-[#3F2516]"
                            style={{
                                fontSize: moderateScale(10),
                                marginLeft: moderateScale(3),
                            }}
                        >
                            {discount}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={(event) => {
                        event.stopPropagation()
                        onFavouritePress?.()
                    }}
                    hitSlop={8}
                    className="absolute items-center justify-center rounded-full bg-white border border-[#1F1F1F]/10"
                    style={{
                        right: moderateScale(12),
                        top: moderateScale(12),
                        width: moderateScale(32),
                        height: moderateScale(32),
                    }}
                >
                    {isFavourite ? (
                        <FavouriteIconFilled width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" style={{ marginTop: moderateScale(1.5) }} />
                    ) : (
                        <FavouriteIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" style={{ marginTop: moderateScale(1.5) }} />
                    )}
                </TouchableOpacity>
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(80),
                    paddingTop: moderateScale(2),
                }}
            >
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
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                        }}
                    >
                        <RatingIcon width={moderateScale(15)} height={moderateScale(15)} color="#5c4639" />

                        <Text
                            className="font-bold text-[#5c4639]"
                            style={{ fontSize: moderateScale(12), marginRight: moderateScale(2) }}
                        >
                            {rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={2}
                    className="font-medium text-[#1F1F1F]/75"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1),
                    }}
                >
                    by {restaurant}
                </Text>

                <View className="flex-row items-center mt-auto gap-1">
                    <View
                        className="items-center mt-2 justify-center self-start bg-[#E8B93F]/15"
                        style={{
                            paddingHorizontal: moderateScale(10),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                        }}
                    >
                        <Text
                            className="font-semibold tracking-wide text-[#5c4639]"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            ₹{price}
                        </Text>
                    </View>

                    <View
                        className="items-center mt-1 ml-1 justify-center rounded-full bg-[#E8B93F]/15"
                        style={{
                            width: moderateScale(24),
                            height: moderateScale(24),
                        }}
                    >
                        <ClockIcon width={moderateScale(16)} height={moderateScale(16)} color="#5c4639" />
                    </View>

                    <Text
                        className="font-medium text-[#1F1F1F]/75 mt-1"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        {deliveryTime}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={(event) => {
                            event.stopPropagation()
                            onAddPress?.()
                        }}
                        className="items-center justify-center ml-auto bg-[#3F2516]"
                        style={{
                            width: moderateScale(34),
                            height: moderateScale(34),
                            borderRadius: moderateScale(12),
                        }}
                    >
                        <PlusIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(FoodSearchCard)