import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale } from "react-native-size-matters"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import LocationIcon from "@/assets/icon/LocationIcon3.svg"
import React from "react"

export interface NearByRestaurants {
    id: string
    name: string
    imageUri: string
    cuisines: string
    rating: number
    distance: string
    discount: string
    priceForTwo: number
}

interface RestaurantListCardProps {
    restaurant: NearByRestaurants
    onPress?: () => void
}

const NearByRestaurantsList = ({ restaurant, onPress }: RestaurantListCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="w-full flex-row overflow-hidden bg-white border border-[#1F1F1F]/10 p-2"
            style={{
                borderRadius: moderateScale(22),
                gap: moderateScale(8)
            }}
        >
            <Image
                source={{
                    uri: restaurant.imageUri
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
                style={{
                    width: moderateScale(78),
                    height: moderateScale(78),
                    borderRadius: moderateScale(18)
                }}
            />

            <View className="flex-1 justify-center mt-1">
                <Text
                    numberOfLines={1}
                    className="font-bold text-[#1F1F1F]"
                    style={{ fontSize: moderateScale(14) }}
                >
                    {restaurant.name}
                </Text>

                <Text
                    numberOfLines={1}
                    className="font-medium text-[#1F1F1F]/75"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1)
                    }}
                >
                    {restaurant.cuisines}
                </Text>

                <View className="flex-row items-center gap-1">
                    <View
                        className="flex-row items-center justify-center gap-1 self-start bg-[#E8B93F]/15"
                        style={{
                            marginTop: moderateScale(8),
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                        <Text
                            className="font-bold text-[#5c4639]"
                            style={{
                                fontSize: moderateScale(10),
                                marginRight: moderateScale(2)
                            }}
                        >
                            {restaurant.rating.toFixed(1)}
                        </Text>
                    </View>

                    <View
                        className="flex-row items-center justify-center gap-1 self-start bg-[#E8B93F]/15"
                        style={{
                            marginTop: moderateScale(8),
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <LocationIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                        <Text
                            className="font-bold text-[#5c4639]"
                            style={{
                                fontSize: moderateScale(10),
                                marginRight: moderateScale(2)
                            }}
                        >
                            {restaurant.distance}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="ml-auto items-end justify-between">
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
                        className="font-bold text-[#5c4639]"
                        style={{ fontSize: moderateScale(10) }}
                    >
                        {restaurant.discount}
                    </Text>
                </View>

                <View
                    className="self-end items-center justify-center bg-[#3F2516]"
                    style={{
                        marginBottom: moderateScale(3),
                        marginRight: moderateScale(3),
                        paddingHorizontal: moderateScale(8),
                        paddingVertical: moderateScale(4.5),
                        borderRadius: moderateScale(10)
                    }}
                >
                    <Text
                        className="font-bold text-white"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        ₹{restaurant.priceForTwo} for two
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(NearByRestaurantsList)