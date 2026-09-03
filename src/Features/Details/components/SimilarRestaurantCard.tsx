import ClockIcon from '@/assets/icon/ClockIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

interface SimilarRestaurantCardProps {
    id: string
    name: string;
    image: string;
    rating: number;
    isActive?: boolean
    deliveryTime: string;
    onPress?: (id: string) => void
}

const SimilarRestaurantCard = ({
    id,
    name,
    image,
    rating,
    deliveryTime,
    isActive = true,
    onPress
}: SimilarRestaurantCardProps) => {
    const isInactive = !isActive

    return (
        <TouchableOpacity
            activeOpacity={isActive ? 0.95 : 1}
            onPress={() => {
                if (isInactive) return

                onPress?.(id)
            }}
            className="overflow-hidden border"
            style={{
                width: moderateScale(165),
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
            }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(100) }}
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
                        source={image}
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
                            className="absolute inset-0"
                            style={{ backgroundColor: "rgba(31,31,31,0.35)" }}
                        />
                    )}
                </View>

                {isInactive && (
                    <View
                        className="absolute items-center justify-center"
                        style={{
                            left: moderateScale(14),
                            bottom: moderateScale(13),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: verticalScale(5),
                            borderRadius: moderateScale(9),
                            backgroundColor: "rgba(31,31,31,0.82)"
                        }}
                    >
                        <Text
                            className="font-bold text-white uppercase"
                            style={{ fontSize: moderateScale(8.5) }}
                        >
                            Currently Closed
                        </Text>
                    </View>
                )}
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(52),
                    marginTop: moderateScale(2)
                }}
            >
                <Text
                    numberOfLines={2}
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(13),
                        color: isInactive ? "rgba(31,31,31,0.50)" : "#1F1F1F"
                    }}
                >
                    {name}
                </Text>

                <View className="flex-row gap-2 items-center mt-auto">
                    <View
                        className="self-start flex-row items-center justify-center gap-1"
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
                                fontSize: moderateScale(11.5),
                                marginRight: moderateScale(2),
                                color: isInactive ? "#858585" : "#5C4639"
                            }}
                        >
                            {rating.toFixed(1)}
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
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(SimilarRestaurantCard)