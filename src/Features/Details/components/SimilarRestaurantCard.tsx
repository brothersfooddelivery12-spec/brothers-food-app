import RatingIcon from '@/assets/icon/RatingIcon.svg'
import ClockIcon from '@/assets/icon/TimerIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
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

    const [imageError, setImageError] = useState(false)

    const DefaultRestaurantImage = require("../../../../assets/images/Default_Restaurant_Cover_Image.png")

    useEffect(() => {
        setImageError(false)
    }, [image])
    
    const hasImage = !!image && !imageError

    return (
        <TouchableOpacity
            activeOpacity={isActive ? 0.95 : 1}
            onPress={() => {
                if (isInactive) return

                onPress?.(id)
            }}
            className="overflow-hidden"
            style={{
                width: moderateScale(165),
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? COLORS.inactiveBackgroundColor : COLORS.secondaryBackgroundColor,
                borderWidth: moderateScale(0.5),
                borderColor: isInactive 
                    ? hexToRgba(COLORS.primaryTextColor, 0.08)
                    : hexToRgba(COLORS.primaryTextColor, 0.10)
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
                        overflow: "hidden",
                        borderWidth: !hasImage && !isInactive ? 0.7 : 0,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.08)
                    }}
                >
                    <Image
                        source={
                            hasImage
                                ? {
                                    uri: image!
                                }
                                : DefaultRestaurantImage
                        }
                        onError={() => {
                            setImageError(true)
                        }}
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
                            style={{ backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.25) }}
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
                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.85)
                        }}
                    >
                        <Text
                            className="font-bold uppercase"
                            style={{
                                fontSize: moderateScale(8.5),
                                color: COLORS.primaryBackgroundColor
                            }}
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
                        color: isInactive ? hexToRgba(COLORS.primaryTextColor, 0.52) : COLORS.primaryTextColor
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
                                ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                : hexToRgba(COLORS.accentColor, 0.15)
                        }}
                    >
                        <RatingIcon
                            width={moderateScale(15)}
                            height={moderateScale(15)}
                            color={isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor}
                        />

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(11.5),
                                marginRight: moderateScale(2),
                                color: isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor
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
                                    ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                    : hexToRgba(COLORS.accentColor, 0.15)
                            }}
                        >
                            <ClockIcon
                                width={moderateScale(15)}
                                height={moderateScale(15)}
                                color={isInactive ? COLORS.inactiveContentColor : hexToRgba(COLORS.primaryTextColor, 0.65)}
                                strokeWidth={1.8}
                            />
                        </View>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                color: isInactive
                                    ? hexToRgba(COLORS.primaryTextColor, 0.45)
                                    : hexToRgba(COLORS.primaryTextColor, 0.65)
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