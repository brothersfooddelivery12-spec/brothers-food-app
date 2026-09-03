import ClockIcon from '@/assets/icon/ClockIcon.svg'
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface FoodSearchCardProps {
    id: string
    name: string
    restaurant: string
    rating: number
    deliveryTime: string
    price: number
    discount?: string
    image: string
    isFavourite?: boolean
    isActive?: boolean

    onPress?: () => void
    onFavouritePress?: () => void
    onAddPress?: () => void
}

const FoodSearchCard = ({
    name,
    restaurant,
    rating,
    deliveryTime,
    price,
    discount,
    image,
    isFavourite = false,
    isActive = true,
    onPress,
    onFavouritePress,
    onAddPress
}: FoodSearchCardProps) => {
    const isInactive = !isActive

    return (
        <TouchableOpacity
            activeOpacity={isActive ? 0.95 : 1}
            onPress={isActive ? onPress : undefined}
            disabled={isInactive}
            className="w-full mt-4 overflow-hidden border"
            style={{
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
            }}
        >
            <View
                className="relative w-full p-2"
                style={{ height: verticalScale(120) }}
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
                        source={{ uri: image }}
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

                {discount && !isInactive && (
                    <View
                        className="absolute top-4 left-4 flex-row items-center bg-[#F8D56A]"
                        style={{
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="font-bold text-[#3F2516]"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            {discount}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    activeOpacity={0.95}
                    disabled={isInactive}
                    onPress={(event) => {
                        event.stopPropagation()

                        if (isInactive) return

                        onFavouritePress?.()
                    }}
                    hitSlop={8}
                    className="absolute items-center justify-center rounded-full border"
                    style={{
                        right: moderateScale(12),
                        top: moderateScale(12),
                        width: moderateScale(32),
                        height: moderateScale(32),
                        backgroundColor: isInactive ? "rgba(255,255,255,0.75)" : "#FFFFFF",
                        borderColor: "rgba(31,31,31,0.10)"
                    }}
                >
                    {isFavourite ? (
                        <FavouriteIconFilled
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={ isInactive ? "#777777" : "#3F2516" }
                        />
                    ) : (
                        <FavouriteIcon
                            width={moderateScale(20)}
                            height={moderateScale(20)}
                            color={ isInactive ? "#777777" : "#3F2516" }
                            strokeWidth={1.5}
                        />
                    )}
                </TouchableOpacity>

                {isInactive && (
                    <View
                        className="absolute items-center justify-center"
                        style={{
                            left: moderateScale(16),
                            bottom: moderateScale(14),
                            paddingHorizontal: moderateScale(10),
                            paddingVertical: verticalScale(5),
                            borderRadius: moderateScale(10),
                            backgroundColor: "rgba(31,31,31,0.85)"
                        }}
                    >
                        <Text
                            className="text-white font-bold uppercase"
                            style={{ fontSize: moderateScale(9) }}
                        >
                            Currently Unavailable
                        </Text>
                    </View>
                )}
            </View>

            <View
                className="px-3 pb-3"
                style={{
                    height: verticalScale(80),
                    paddingTop: moderateScale(2)
                }}
            >
                <View className="flex-row items-center gap-3">
                    <Text
                        numberOfLines={1}
                        className="flex-1 font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            color: isInactive ? "rgba(31,31,31,0.50)" : "#1F1F1F"
                        }}
                    >
                        {name}
                    </Text>

                    <View
                        className="flex-row items-center justify-center gap-1"
                        style={{
                            paddingHorizontal: moderateScale(6),
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
                                fontSize: moderateScale(12),
                                marginRight: moderateScale(2),
                                color: isInactive ? "#858585" : "#5C4639"
                            }}
                        >
                            {rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                <Text
                    numberOfLines={2}
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: moderateScale(1),
                        color: isInactive
                            ? "rgba(31,31,31,0.38)"
                            : "rgba(31,31,31,0.75)"
                    }}
                >
                    by {restaurant}
                </Text>

                <View className="flex-row items-center mt-auto gap-1">
                    <View
                        className="items-center mt-2 justify-center self-start"
                        style={{
                            paddingHorizontal: moderateScale(10),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                            backgroundColor: isInactive
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <Text
                            className="font-semibold tracking-wide"
                            style={{
                                fontSize: moderateScale(14),
                                color: isInactive
                                    ? "rgba(31,31,31,0.45)"
                                    : "#5C4639"
                            }}
                        >
                            ₹{price}
                        </Text>
                    </View>

                    <View
                        className="items-center mt-1 ml-1 justify-center rounded-full"
                        style={{
                            width: moderateScale(24),
                            height: moderateScale(24),
                            backgroundColor: isInactive
                                ? "rgba(31,31,31,0.07)"
                                : "rgba(232,185,63,0.15)"
                        }}
                    >
                        <ClockIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color={isInactive ? "#858585" : "#5C4639"}
                        />
                    </View>

                    <Text
                        className="font-medium mt-1"
                        style={{
                            fontSize: moderateScale(12),
                            color: isInactive
                                ? "rgba(31,31,31,0.45)"
                                : "rgba(31,31,31,0.75)"
                        }}
                    >
                        {isInactive ? "Unavailable" : deliveryTime}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={isInactive}
                        onPress={(event) => {
                            event.stopPropagation()

                            if (isInactive) return

                            onAddPress?.()
                        }}
                        className="items-center justify-center ml-auto"
                        style={{
                            width: moderateScale(34),
                            height: moderateScale(34),
                            borderRadius: moderateScale(12),
                            backgroundColor: isInactive ? "#B8B8B8" : "#3F2516"
                        }}
                    >
                        <PlusIcon
                            width={moderateScale(18)}
                            height={moderateScale(18)}
                            color={isInactive ? "#E8E8E8" : "#FFFFFF"}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(FoodSearchCard)