import PlusIcon from "@/assets/icon/PlusIcon.svg"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { COLORS } from "@/constant/colors"
import { MenuItemRestaurant } from "@/Features/Home/components/FoodCard"
import { hexToRgba } from "@/utils/hexToRgba"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface RestaurantMenuItem {
    id: string
    restaurant: MenuItemRestaurant
    
    name: string
    imageUrl?: string | null
    description: string
    price: number
    preparationTime?: number
    deliveryFee?: string
    isHot?: boolean
    isAvailable: boolean
    isVeg: boolean
    tag?: string
    rating?: number | null
}

interface RestaurantMenuItemCardProps {
    item: RestaurantMenuItem;
    onPress?: () => void
    onAddPress?: () => void
}

const RestaurantMenuItemCard = ({
    item,
    onPress,
    onAddPress
}: RestaurantMenuItemCardProps) => {
    const isInactive = !item.isAvailable

    const [imageError, setImageError] = useState(false)
        
    const DefaultFoodImage = require("../../../../assets/images/Default_Food_Image.png")
    
    useEffect(() => {
        setImageError(false)
    }, [item.imageUrl])

    const hasImage = !!item.imageUrl && !imageError

    return (
        <TouchableOpacity
            activeOpacity={item.isAvailable ? 0.95 : 1}
            onPress={item.isAvailable ? onPress : undefined}
            className="w-full p-2 overflow-hidden"
            style={{
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? COLORS.inactiveBackgroundColor : COLORS.secondaryBackgroundColor,
                borderColor: isInactive 
                    ? hexToRgba(COLORS.primaryTextColor, 0.08)
                    : hexToRgba(COLORS.primaryTextColor, 0.10)
            }}
        >
            <View className="flex-row gap-3 items-center">
                <View
                    className="items-center justify-center overflow-hidden relative"
                    style={{
                        borderRadius: moderateScale(18),
                        width: moderateScale(88),
                        height: moderateScale(88),
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
                                left: moderateScale(5),
                                right: moderateScale(5),
                                bottom: moderateScale(5),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(14),
                                backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.82),
                            }}
                        >
                            <Text
                                className="font-bold uppercase"
                                style={{
                                    fontSize: moderateScale(7.5),
                                    color: COLORS.primaryBackgroundColor
                                }}
                            >
                                Unavailable
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-1 justify-center mr-4 -mt-1">
                    {item.tag && !isInactive && (
                        <View
                            className="self-start flex-row items-center"
                            style={{
                                backgroundColor: COLORS.accentLightColor,
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(10),
                                marginBottom: moderateScale(6)
                            }}
                        >
                            <Text
                                className="font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(9),
                                    color: COLORS.primaryColor
                                }}
                            >
                                {item.tag}
                            </Text>
                        </View>
                    )}

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
                            marginTop: moderateScale(2),
                            color: isInactive
                                ? hexToRgba(COLORS.primaryTextColor, 0.38)
                                : hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        {item.description}
                    </Text>
                </View>
            </View>

            <View
                className="flex-row gap-2 items-center"
                style={{
                    marginLeft: moderateScale(4),
                    marginTop: moderateScale(6),
                    marginRight: moderateScale(4)
                }}
            >
                <View
                    className="self-start flex-row items-center justify-center gap-1"
                    style={{
                        marginTop: moderateScale(6),
                        paddingHorizontal: moderateScale(8),
                        paddingVertical: moderateScale(4),
                        borderRadius: moderateScale(12),
                        backgroundColor: isInactive
                            ? hexToRgba(COLORS.primaryTextColor, 0.1)
                            : hexToRgba(COLORS.accentColor, 0.15)
                    }}
                >
                    <RatingIcon
                        width={moderateScale(16)}
                        height={moderateScale(16)}
                        color={isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor}
                    />

                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(12),
                            marginRight: moderateScale(2),
                            color: isInactive ? COLORS.inactiveContentColor : COLORS.secondaryColor
                        }}
                    >
                        {(item.rating ?? 0).toFixed(1)}
                    </Text>
                </View>

                <View
                    className="self-start items-center justify-center"
                    style={{
                        marginTop: moderateScale(6),
                        paddingHorizontal: moderateScale(10),
                        paddingVertical: moderateScale(4),
                        borderRadius: moderateScale(12),
                        backgroundColor: isInactive
                            ? hexToRgba(COLORS.primaryTextColor, 0.1)
                            : hexToRgba(COLORS.accentColor, 0.15)
                    }}
                >
                    <Text
                        className="font-bold"
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
                        marginBottom: moderateScale(2),
                        width: moderateScale(32),
                        height: moderateScale(32),
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
        </TouchableOpacity>
    )
}

export default React.memo(RestaurantMenuItemCard)