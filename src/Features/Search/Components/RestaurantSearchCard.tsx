import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { Image } from "expo-image"
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import LocationIcon from "@/assets/icon/LocationIcon3.svg"
import RestaurantFoodCard, { SignatureItem } from "./RestaurantFoodCard"
import React from "react"

interface RestaurantCardProps {
    name: string
    imageUri: string
    rating: number
    ratingCount?: string
    distance: string
    deliveryFee: number
    isFavourite?: boolean
    signatureSelection: SignatureItem[]
    onPress?: () => void
    onFavouritePress?: () => void
    onFoodPress?: (item: SignatureItem) => void
    onAddPress?: (item: SignatureItem) => void
}

const RestaurantSearchCard = ({
    name,
    imageUri,
    rating,
    ratingCount = "5K+",
    distance,
    deliveryFee,
    isFavourite = false,
    signatureSelection,
    onPress,
    onFavouritePress,
    onFoodPress,
    onAddPress,
}: RestaurantCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="mt-5 w-full overflow-hidden bg-white border border-[#1F1F1F]/10"
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

                <View
                    className="absolute flex-row items-center gap-2"
                    style={{
                        left: moderateScale(14),
                        top: moderateScale(14)
                    }}
                >
                    <View
                        className="flex-row items-center bg-[#F8D56A]"
                        style={{
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4.5),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="font-bold text-[#3F2516]"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            30% OFF
                        </Text>
                    </View>

                    <View
                        className="flex-row items-center justify-center bg-[#F8D56A]"
                        style={{
                            gap: moderateScale(5),
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(3.5),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <DeliveryIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" />

                        <Text
                            className="font-semibold text-[#3F2516]"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            {deliveryFee === 0
                                ? "FREE"
                                : `₹${deliveryFee}`}
                        </Text>
                    </View>
                </View>

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
                <Text
                    numberOfLines={1}
                    className="font-bold text-[#1F1F1F]"
                    style={{ fontSize: moderateScale(16) }}
                >
                    {name}
                </Text>

                <View className="flex-row items-center gap-2 mt-3">
                    <View
                        className="flex-row items-center justify-center self-start bg-[#E8B93F]/15"
                        style={{
                            gap: moderateScale(4),
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <RatingIcon width={moderateScale(15)} height={moderateScale(15)} color="#5C4639" />

                        <Text
                            className="font-semibold text-[#5C4639]"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            {rating}
                        </Text>

                        <Text
                            className="font-medium text-[#5C4639]/85"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            ({ratingCount})
                        </Text>
                    </View>

                    <View
                        className="flex-row items-center justify-center self-start bg-[#E8B93F]/15"
                        style={{
                            gap: moderateScale(4),
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <LocationIcon width={moderateScale(15)} height={moderateScale(15)} color="#5C4639" />

                        <Text
                            className="font-semibold text-[#5C4639]"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            {distance}
                        </Text>
                    </View>
                </View>

                <Text
                    className="text-[#3F2516] font-semibold mt-4 uppercase"
                    style={{
                        fontSize: moderateScale(12),
                        letterSpacing: moderateScale(1)
                    }}
                >
                    Signature Selection
                </Text>

                <FlatList
                    data={signatureSelection}
                    horizontal
                    nestedScrollEnabled
                    directionalLockEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    className="-mx-5 mt-2"
                    contentContainerStyle={{
                        paddingHorizontal: scale(14),
                        gap: moderateScale(12)
                    }}
                    renderItem={({ item }) => (
                        <RestaurantFoodCard
                            item={item}
                            onPress={() => onFoodPress?.(item)}
                            onAddPress={() => onAddPress?.(item)}
                        />
                    )}
                />
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(RestaurantSearchCard)