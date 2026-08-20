import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"
import PlusIcon from "@/assets/icon/PlusIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import React from "react"

export interface FavFoodCard {
    id: string
    name: string
    imageUri: string
    restaurantName: string
    deliveryTime: string
    isFavourite?: boolean
    price: number
    rating: number
}

interface FavFoodCardProps {
    item: FavFoodCard
    onPress?: () => void
    onAddPress?: () => void
    onFavouritePress?: () => void
}

const FavFoodCard = ({ item, onPress, onAddPress, onFavouritePress }: FavFoodCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="overflow-hidden bg-white border border-[#1F1F1F]/10"
            style={{
                width: "100%",
                borderRadius: moderateScale(22)
            }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(100) }}
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

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(82),
                    paddingTop: moderateScale(2)
                }}
            >
                <Text
                    numberOfLines={1}
                    className="font-bold text-[#1F1F1F]"
                    style={{ fontSize: moderateScale(14) }}
                >
                    {item.name}
                </Text>

                <Text
                    numberOfLines={2}
                    className="font-medium text-[#1F1F1F]/75"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(3)
                    }}
                >
                    {item.restaurantName} • {item.deliveryTime}
                </Text>

                <View className="flex-row items-center mt-auto">
                    <View
                        className="items-center mt-1 justify-center self-start bg-[#E8B93F]/15"
                        style={{
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="font-bold tracking-wide text-[#5c4639]"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            ₹{item.price}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={(event) => {
                            event.stopPropagation()
                            onAddPress?.()
                        }}
                        className="items-center justify-center ml-auto bg-[#3F2516]"
                        style={{
                            width: moderateScale(28),
                            height: moderateScale(28),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <PlusIcon width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(FavFoodCard)