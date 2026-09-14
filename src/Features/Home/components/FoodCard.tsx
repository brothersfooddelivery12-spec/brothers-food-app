import PlusIcon from "@/assets/icon/PlusIcon.svg"
import TradeUpIcon from "@/assets/icon/TradeUpIcon.svg"
import { Image } from "expo-image"
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface MenuItemRestaurant {
    id: string
    name: string
    LogoUrl?: string | null
    isOpen: boolean
}

export interface MenuItem {
    id: string
    restaurant: MenuItemRestaurant
    
    name: string
    imageUrl?: string | null
    description: string
    price: number
    deliveryTime?: number
    deliveryFee?: string
    isHot?: boolean
    isAvailable: boolean
    isVeg: boolean
}

interface FoodCardProps {
    item: MenuItem
    onPress?: () => void
    onAddPress?: () => void
}

const FoodTypeIndicator = ({ isVeg, isInactive }: {
    isVeg: boolean
    isInactive: boolean
}) => {
    const color = isVeg ? "#22C55E" : "#C44512"

    return (
        <View
            className="flex-row items-center self-start"
            style={{
                gap: moderateScale(4),
                borderRadius: moderateScale(9)
            }}
        >
            <View
                className="items-center justify-center"
                style={{
                    width: moderateScale(13),
                    height: moderateScale(13),

                    borderWidth: moderateScale(1.2),
                    borderColor: isInactive ? "rgba(31,31,31,0.40)" : color,
                    borderRadius: moderateScale(3)
                }}
            >
                <View
                    style={{
                        width: moderateScale(6),
                        height: moderateScale(6),
                        borderRadius: moderateScale(4),
                        backgroundColor: isInactive ? "rgba(31,31,31,0.40)" : color
                    }}
                />
            </View>

            <Text
                className="font-semibold tracking-wide"
                style={{
                    fontSize: moderateScale(10),
                    color: isInactive ? "rgba(31,31,31,0.45)" : color
                }}
            >
                {isVeg ? "Veg" : "Non-Veg"}
            </Text>
        </View>
    )
}

const FoodCard = ({
    item,
    onPress,
    onAddPress
}: FoodCardProps) => {
    const isInactive = !item.isAvailable
    
    const [imageError, setImageError] = useState(false)
    
    const DefaultFoodImage = require("../../../../assets/images/Default_Food_image.png")
    
    useEffect(() => {
        setImageError(true)
    }, [item.imageUrl])

    const hasImage = !!item.imageUrl && !imageError

    return (
        <TouchableOpacity
            activeOpacity={item.isAvailable ? 0.95 : 1}
            onPress={item.isAvailable ? onPress : undefined}
            disabled={isInactive}
            className="overflow-hidden border"
            style={{
                width: moderateScale(150),
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
                        overflow: "hidden",
                        borderWidth: !hasImage && !isInactive ? 1 : 0,
                        borderColor: "rgba(31,31,31,0.08)"
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

                {item.isHot && !isInactive && (
                    <View
                        className="absolute flex-row items-center justify-center gap-1 bg-white border border-[#1F1F1F]/10"
                        style={{
                            right: moderateScale(13),
                            top: moderateScale(13),
                            paddingHorizontal: moderateScale(5),
                            paddingVertical: moderateScale(2),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <TradeUpIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color="#3F2516"
                            strokeWidth={2}
                        />

                        <Text
                            className="mr-px font-bold uppercase text-[#3F2516]"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            Hot
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
                            backgroundColor: "rgba(31,31,31,0.82)",
                            paddingVertical: verticalScale(5),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="text-white font-bold uppercase"
                            style={{ fontSize: moderateScale(7.5) }}
                        >
                            Currently Unavailable
                        </Text>
                    </View>
                )}
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(95),
                    paddingTop: moderateScale(1)
                }}
            >
                <Text
                    numberOfLines={1}
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(14),
                        color: isInactive ? "rgba(31,31,31,0.50)" : "#1F1F1F"
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
                            ? "rgba(31,31,31,0.38)"
                            : "rgba(31,31,31,0.75)"
                    }}
                >
                    {item.description}
                </Text>

                <View
                    style={{
                        marginTop: verticalScale(5)
                    }}
                >
                    <FoodTypeIndicator
                        isVeg={item.isVeg}
                        isInactive={isInactive}
                    />
                </View>

                <View className="flex-row items-center mt-auto">
                    <View
                        className="items-center mt-1 justify-center self-start"
                        style={{
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                            backgroundColor: isInactive
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <Text
                            className="font-bold tracking-wide"
                            style={{
                                fontSize: moderateScale(13),
                                color: isInactive ? "rgba(31,31,31,0.45)" : "#5C4639"
                            }}
                        >
                            ₹{item.price}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={isInactive}
                        onPress={(event) => {
                            event.stopPropagation()

                            if (!item.isAvailable) return

                            onAddPress?.()
                        }}
                        className="items-center justify-center ml-auto"
                        style={{
                            width: moderateScale(28),
                            height: moderateScale(28),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive ? "#B8B8B8" : "#3F2516"
                        }}
                    >
                        <PlusIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color={isInactive ? "#E8E8E8" : "#FFFFFF"}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(FoodCard)