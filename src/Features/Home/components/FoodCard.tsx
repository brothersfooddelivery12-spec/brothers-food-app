import PlusIcon from "@/assets/icon/PlusIcon.svg"
import TradeUpIcon from "@/assets/icon/TradeUpIcon.svg"
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface FoodItem {
    id: string
    restaurantId: string
    
    name: string
    imageUri: string
    category: string
    price: number
    isHot?: boolean
    isActive: boolean
}

interface FoodCardProps {
    item: FoodItem
    onPress?: () => void
    onAddPress?: () => void
}

const FoodCard = ({
    item,
    onPress,
    onAddPress
}: FoodCardProps) => {
    const isInactive = !item.isActive

    return (
        <TouchableOpacity
            activeOpacity={item.isActive ? 0.95 : 1}
            onPress={item.isActive ? onPress : undefined}
            disabled={isInactive}
            className="overflow-hidden border"
            style={{
                width: moderateScale(140),
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
                    height: verticalScale(75),
                    paddingTop: moderateScale(2)
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
                        fontSize: moderateScale(10.5),
                        marginTop: moderateScale(3),
                        color: isInactive
                            ? "rgba(31,31,31,0.38)"
                            : "rgba(31,31,31,0.75)"
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
                        activeOpacity={0.9}
                        disabled={isInactive}
                        onPress={(event) => {
                            event.stopPropagation()

                            if (!item.isActive) return

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