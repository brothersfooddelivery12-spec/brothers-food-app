import PlusIcon from "@/assets/icon/PlusIcon.svg"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface RecommendedCard {
    id: string
    name: string
    imageUri: string
    restaurantName: string
    deliveryTime: string
    price: number
    rating: number
    isActive: boolean
}

interface RecommendedCardProps {
    item: RecommendedCard
    onPress?: () => void
    onAddPress?: () => void
}

const RecommendedCard = ({
    item,
    onPress,
    onAddPress
}: RecommendedCardProps) => {
    const isInactive = !item.isActive

    return (
        <TouchableOpacity
            activeOpacity={item.isActive ? 0.95 : 1}
            onPress={item.isActive ? onPress : undefined}
            disabled={isInactive}
            className="overflow-hidden border"
            style={{
                width: moderateScale(160),
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

                {!isInactive && (
                    <View
                        className="absolute top-4 right-4 flex-row items-center bg-[#F8D56A]"
                        style={{
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <RatingIcon
                            width={moderateScale(13)}
                            height={moderateScale(13)}
                            color="#3F2516"
                        />

                        <Text
                            className="font-bold text-[#3F2516]"
                            style={{
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
                            backgroundColor: "rgba(31,31,31,0.82)"
                        }}
                    >
                        <Text
                            className="text-white font-bold uppercase"
                            style={{ fontSize: moderateScale(8.5) }}
                        >
                            Currently Unavailable
                        </Text>
                    </View>
                )}
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(82),
                    paddingTop: moderateScale(2)
                }}
            >
                <Text
                    numberOfLines={1}
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(14),
                        color: isInactive
                            ? "rgba(31,31,31,0.50)"
                            : "#1F1F1F"
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
                        color: isInactive
                            ? "rgba(31,31,31,0.38)"
                            : "rgba(31,31,31,0.75)"
                    }}
                >
                    {item.restaurantName}
                    {" • "}
                    {isInactive
                        ? "Unavailable"
                        : item.deliveryTime}
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
                                color: isInactive
                                    ? "rgba(31,31,31,0.45)"
                                    : "#5C4639"
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

export default React.memo(RecommendedCard)