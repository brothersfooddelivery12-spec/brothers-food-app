import { TouchableOpacity, View, Text } from "react-native"
import { Image } from "expo-image"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon.svg'
import { moderateScale, verticalScale } from "react-native-size-matters"
import React from "react"

interface SimilarRestaurantCardProps {
    id: string
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
        onPress?: (id: string) => void
}

const SimilarRestaurantCard = ({
    id,
    name,
    image,
    rating,
    deliveryTime,
    onPress,
}: SimilarRestaurantCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(id)}
            className="overflow-hidden bg-white border border-[#1F1F1F]/10"
            style={{
                width: moderateScale(165),
                borderRadius: moderateScale(22),
            }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(100) }}
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
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(52),
                    marginTop: moderateScale(2),
                }}
            >
                <Text
                    numberOfLines={2}
                    className="font-bold text-[#1F1F1F]"
                    style={{ fontSize: moderateScale(13) }}
                >
                    {name}
                </Text>

                <View className="flex-row gap-2 items-center mt-auto">
                    <View
                        className="self-start flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                        style={{
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12),
                        }}
                    >
                        <RatingIcon width={moderateScale(15)} height={moderateScale(15)} color="#5C4639" />

                        <Text
                            className="font-bold text-[#5C4639]"
                            style={{
                                fontSize: moderateScale(11.5),
                                marginRight: moderateScale(2),
                            }}
                        >
                            {rating.toFixed(1)}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-1">
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(22),
                                height: moderateScale(22),
                            }}
                        >
                            <ClockIcon width={moderateScale(15)} height={moderateScale(15)} color="#5C4639" />
                        </View>

                        <Text
                            className="font-medium text-[#1F1F1F]/75"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            {deliveryTime}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(SimilarRestaurantCard)