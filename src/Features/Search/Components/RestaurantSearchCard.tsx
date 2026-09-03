import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import FavouriteIconFilled from "@/assets/icon/FavouriteFilledIcon.svg"
import FavouriteIcon from "@/assets/icon/FavouriteIconOutline.svg"
import LocationIcon from "@/assets/icon/LocationIcon3.svg"
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import { Image } from "expo-image"
import React from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import RestaurantFoodCard, { SignatureItem } from "./RestaurantFoodCard"

interface RestaurantCardProps {
    name: string
    imageUri: string
    rating: number
    ratingCount?: string
    distance: string
    deliveryFee: number
    isFavourite?: boolean
    isActive?: boolean

    signatureSelection: SignatureItem[]

    onPress?: () => void
    onFavouritePress?: () => void
    onFoodPress?: (item: SignatureItem) => void
    onAddPress?: (item: SignatureItem) => void
}

const RestaurantSearchCard = ({
    name,
    imageUri,
    rating,
    ratingCount = "5K+",
    distance,
    deliveryFee,
    isFavourite = false,
    isActive = true,
    signatureSelection,
    onPress,
    onFavouritePress,
    onFoodPress,
    onAddPress
}: RestaurantCardProps) => {

    const isInactive = !isActive

    return (
        <View
            className="mt-5 w-full overflow-hidden border"
            style={{
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
            }}
        >
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={onPress}
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
                            source={{
                                uri: imageUri
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
                                style={{ backgroundColor: "rgba(31,31,31,0.38)" }}
                            />
                        )}
                    </View>

                    {!isInactive && (
                        <View
                            className="absolute flex-row items-center gap-2"
                            style={{
                                left: moderateScale(14),
                                top: moderateScale(14)
                            }}
                        >
                            <View
                                className="flex-row items-center bg-[#F8D56A]"
                                style={{
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4.5),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <Text
                                    className="font-bold text-[#3F2516]"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    30% OFF
                                </Text>
                            </View>

                            <View
                                className="flex-row items-center justify-center bg-[#F8D56A]"
                                style={{
                                    gap: moderateScale(5),
                                    paddingHorizontal: moderateScale(7), 
                                    paddingVertical: moderateScale(3.5),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <DeliveryIcon
                                    width={moderateScale(16)}
                                    height={moderateScale(16)}
                                    color="#3F2516"
                                />

                                <Text
                                    className="font-semibold text-[#3F2516]"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                                </Text>
                            </View>
                        </View>
                    )}

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
                                className="font-bold text-white uppercase"
                                style={{ fontSize: moderateScale(9) }}
                            >
                                Currently Closed
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={(event) => {
                            event.stopPropagation()
                            onFavouritePress?.()
                        }}
                        hitSlop={8}
                        className="absolute items-center justify-center rounded-full border"
                        style={{
                            right: moderateScale(14),
                            top: moderateScale(14),
                            width: moderateScale(32),
                            height: moderateScale(32),
                            backgroundColor: isInactive
                                ? "rgba(255,255,255,0.80)"
                                : "#FFFFFF",
                            borderColor: "rgba(31,31,31,0.10)"
                        }}
                    >
                        {isFavourite ? (
                            <FavouriteIconFilled
                                width={moderateScale(20)}
                                height={moderateScale(20)}
                                color={ isInactive ? "#737373" : "#3F2516" }
                            />
                        ) : (
                            <FavouriteIcon
                                width={moderateScale(20)}
                                height={moderateScale(20)}
                                color={ isInactive ? "#737373" : "#3F2516" }
                                strokeWidth={1.5}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View className="px-3 pt-3">
                    <Text
                        numberOfLines={1}
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(16),
                            color: isInactive ? "rgba(31,31,31,0.52)" : "#1F1F1F"
                        }}
                    >
                        {name}
                    </Text>

                    <View className="flex-row items-center gap-2 mt-3">
                        <View
                            className="flex-row items-center justify-center self-start"
                            style={{
                                gap: moderateScale(4),
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
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(12),
                                    color: isInactive ? "#858585" : "#5C4639"
                                }}
                            >
                                {rating}
                            </Text>

                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(11),
                                    color: isInactive
                                        ? "rgba(31,31,31,0.42)"
                                        : "rgba(92,70,57,0.85)"
                                }}
                            >
                                ({ratingCount})
                            </Text>
                        </View>

                        <View
                            className="flex-row items-center justify-center self-start"
                            style={{
                                gap: moderateScale(4),
                                paddingHorizontal: moderateScale(6),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(12),
                                backgroundColor: isInactive
                                    ? "rgba(31,31,31,0.07)"
                                    : "rgba(232,185,63,0.15)"
                            }}
                        >
                            <LocationIcon
                                width={moderateScale(15)}
                                height={moderateScale(15)}
                                color={isInactive ? "#858585" : "#5C4639"}
                            />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(12),
                                    color: isInactive ? "#858585" : "#5C4639"
                                }}
                            >
                                {distance}
                            </Text>
                        </View>

                        {isInactive && (
                            <View
                                className="ml-auto"
                                style={{
                                    paddingHorizontal: scale(8),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(10),
                                    backgroundColor: "rgba(31,31,31,0.08)"
                                }}
                            >
                                <Text
                                    className="font-semibold uppercase"
                                    style={{
                                        fontSize: moderateScale(8.5),
                                        color: "rgba(31,31,31,0.50)"
                                    }}
                                >
                                    Unavailable
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            <View
                style={{ paddingBottom: verticalScale(12) }}
            >
                <Text
                    className="font-semibold uppercase"
                    style={{
                        marginHorizontal: scale(12),
                        marginTop: verticalScale(14),
                        fontSize: moderateScale(12),
                        letterSpacing: moderateScale(1),
                        color: isInactive
                            ? "rgba(31,31,31,0.45)"
                            : "#3F2516"
                    }}
                >
                    Signature Selection
                </Text>

                <FlatList
                    data={signatureSelection}
                    horizontal
                    nestedScrollEnabled
                    directionalLockEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    className="mt-2"
                    contentContainerStyle={{
                        paddingHorizontal: scale(12),
                        gap: moderateScale(12)
                    }}
                    renderItem={({ item }) => (
                        <RestaurantFoodCard
                            item={{
                                ...item,
                                isActive: isActive && item.isActive
                            }}
                            onPress={() => {
                                if (!isActive) return

                                onFoodPress?.(item)
                            }}
                            onAddPress={() => {
                                if (!isActive) return

                                onAddPress?.(item)
                            }}
                        />
                    )}
                />
            </View>
        </View>
    )
}
export default React.memo(RestaurantSearchCard)