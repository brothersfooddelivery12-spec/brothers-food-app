import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import PlusIcon from "@/assets/icon/PlusIcon.svg"
import { COLORS } from "@/constant/colors"
import { FoodTypeIndicator, MenuItem } from "@/Features/Home/components/FoodCard"
import { hexToRgba } from "@/utils/hexToRgba"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export interface FavFood extends MenuItem {
    category?: string | null
    isFavourite: boolean
}

interface FavFoodCardProps {
    item: FavFood
    isFavourite?: boolean
    onPress?: () => void
    onAddPress?: () => void
    onFavouritePress?: () => void
}

const FavFoodCard = ({ item, isFavourite, onPress, onAddPress, onFavouritePress }: FavFoodCardProps) => {
    const isInactive = !item.isAvailable
        
    const [imageError, setImageError] = useState(false)
    
    const DefaultFoodImage = require("../../../../assets/images/Default_Food_Image.png")
    
    useEffect(() => {
        setImageError(false)
    }, [item.imageUrl])

    const hasImage = !!item.imageUrl && !imageError

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={item.isAvailable ? onPress : undefined}
            disabled={isInactive}
            className="overflow-hidden"
            style={{
                borderWidth: moderateScale(0.5),
                width: "100%",
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
                        source={
                            hasImage
                                ? {
                                    uri: item.imageUrl!
                                }
                                : DefaultFoodImage
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

                    {isInactive && (
                        <View
                            className="absolute items-center justify-center"
                            style={{
                                left: moderateScale(6),
                                bottom: moderateScale(6),
                                backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.82),
                                paddingVertical: verticalScale(5),
                                paddingHorizontal: scale(10),
                                borderRadius: moderateScale(10)
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

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={(event) => {
                        event.stopPropagation()
                        onFavouritePress?.()
                    }}
                    hitSlop={8}
                    className="absolute items-center justify-center rounded-full bg-[#FFFFFF] border-[#1F1F1F]/10"
                    style={{
                        borderWidth: moderateScale(0.7),
                        right: moderateScale(12),
                        top: moderateScale(12),
                        width: moderateScale(32),
                        height: moderateScale(32),
                        backgroundColor: isInactive ? hexToRgba(COLORS.primaryBackgroundColor, 0.75) : COLORS.primaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.10)
                    }}
                >
                    {isFavourite ? (
                        <FavouriteIconFilled
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={isInactive ? COLORS.inactiveContentColor : COLORS.primaryColor}
                            style={{ marginTop: moderateScale(1.5) }}
                        />
                    ) : (
                        <FavouriteIcon
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={isInactive ? COLORS.inactiveContentColor : COLORS.primaryColor}
                            strokeWidth={1.5}
                            style={{ marginTop: moderateScale(1.5) }}
                        />
                    )}
                </TouchableOpacity>
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(98),
                    paddingTop: moderateScale(1)
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
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(3),
                        lineHeight: moderateScale(14),
                        color: isInactive
                            ? hexToRgba(COLORS.primaryTextColor, 0.38)
                            : hexToRgba(COLORS.primaryTextColor, 0.65)
                    }}
                >
                    {item.description}
                </Text>

                <View
                    style={{ marginTop: verticalScale(6) }}
                >
                    <FoodTypeIndicator
                        isVeg={item.isVeg}
                        isInactive={isInactive}
                    />
                </View>

                <View className="flex-row items-center mt-auto">
                    <View
                        className="items-center justify-center self-start"
                        style={{
                            marginTop: verticalScale(3),
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

                            if (!item.isAvailable) return

                            onAddPress?.()
                        }}
                        className="items-center justify-center ml-auto"
                        style={{
                            width: moderateScale(30),
                            height: moderateScale(30),
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

export default React.memo(FavFoodCard)