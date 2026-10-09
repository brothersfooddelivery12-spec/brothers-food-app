import PlusIcon from "@/assets/icon/PlusIcon.svg"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface SignatureItem {
    id: string
    name: string
    imageUri: string
    category: string
    price: number
    rating: number
    isActive: boolean
}

interface RestaurantFoodCardProps {
    item: SignatureItem
    onPress?: () => void
    onAddPress?: () => void
}

const RestaurantFoodCard = ({
    item,
    onPress,
    onAddPress
}: RestaurantFoodCardProps) => {
    const isInactive = !item.isActive

    const [imageError, setImageError] = useState(false)
        
    const DefaultFoodImage = require("../../../../assets/images/Default_Food_Image.png")
    
    useEffect(() => {
        setImageError(false)
    }, [item.imageUri])

    const hasImage = !!item.imageUri && !imageError

    return (
        <TouchableOpacity
            activeOpacity={item.isActive ? 0.95 : 1}
            onPress={() => {
                if (isInactive) return

                onPress?.()
            }}
            className="overflow-hidden"
            style={{
                borderWidth: moderateScale(0.5),
                width: moderateScale(140),
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? COLORS.inactiveBackgroundColor : COLORS.secondaryBackgroundColor,
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
                        source={{
                            uri: item.imageUri
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

                {!isInactive && (
                    <View
                        className="absolute top-4 right-4 flex-row items-center"
                        style={{
                            backgroundColor: COLORS.accentLightColor,
                            paddingHorizontal: moderateScale(6),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <RatingIcon
                            width={moderateScale(13)}
                            height={moderateScale(13)}
                            color={COLORS.primaryColor}
                        />

                        <Text
                            className="font-bold"
                            style={{
                                color: COLORS.primaryColor,
                                fontSize: moderateScale(10),
                                marginLeft: moderateScale(3)
                            }}
                        >
                            {item.rating.toFixed(1)}
                        </Text>
                    </View>
                )}

                {isInactive && (
                    <View
                        className="absolute items-center justify-center"
                        style={{
                            left: moderateScale(14),
                            right: moderateScale(14),
                            bottom: moderateScale(13),
                            paddingVertical: verticalScale(5),
                            borderRadius: moderateScale(10),
                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.82)
                        }}
                    >
                        <Text
                            className="font-bold uppercase"
                            style={{
                                fontSize: moderateScale(7.5),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Currently Unavailable
                        </Text>
                    </View>
                )}
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(75),
                    paddingTop: moderateScale(2)
                }}
            >
                <Text
                    numberOfLines={1}
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(14),
                        color: isInactive ? hexToRgba(COLORS.primaryTextColor, 0.52) : COLORS.primaryTextColor
                    }}
                >
                    {item.name}
                </Text>

                <Text
                    numberOfLines={2}
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(10.5),
                        marginTop: moderateScale(3),
                        color: isInactive
                            ? hexToRgba(COLORS.primaryTextColor, 0.38)
                            : hexToRgba(COLORS.primaryTextColor, 0.65)
                    }}
                >
                    {item.category}
                </Text>

                <View className="flex-row items-center mt-auto">
                    <View
                        className="items-center mt-1 justify-center self-start"
                        style={{
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                            backgroundColor: isInactive
                                ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                : hexToRgba(COLORS.accentColor, 0.15)
                        }}
                    >
                        <Text
                            className="font-bold tracking-wide"
                            style={{
                                fontSize: moderateScale(13),
                                color: isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor
                            }}
                        >
                            ₹{item.price}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={isInactive}
                        onPress={(event) => {
                            event.stopPropagation()

                            if (isInactive) return

                            onAddPress?.()
                        }}
                        className="items-center justify-center ml-auto"
                        style={{
                            width: moderateScale(28),
                            height: moderateScale(28),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive ? COLORS.disabledBackgroundColor : COLORS.primaryColor
                        }}
                    >
                        <PlusIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color={isInactive ? hexToRgba(COLORS.primaryBackgroundColor, 0.65) : COLORS.primaryBackgroundColor}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(RestaurantFoodCard)