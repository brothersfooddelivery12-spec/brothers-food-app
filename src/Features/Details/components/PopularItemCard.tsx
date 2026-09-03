import PlusIcon from "@/assets/icon/PlusIcon.svg"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { Image } from "expo-image"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export interface PopularItem {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    price: number;
    tag?: string;
    isActive: boolean
}

interface PopularItemCardProps {
    item: PopularItem;
    onPress?: (item: PopularItem) => void;
    onAdd?: (item: PopularItem) => void;
}

const PopularItemCard = ({
    item,
    onPress,
    onAdd
}: PopularItemCardProps) => {
    const isInactive = !item.isActive

    return (
        <TouchableOpacity
            activeOpacity={item.isActive ? 0.95 : 1}
            onPress={() => {
                if (isInactive) return
                onPress?.(item)
            }}
            className="w-full p-2 overflow-hidden border"
            style={{
                borderRadius: moderateScale(22),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
            }}
        >
            <View className="flex-row gap-3 items-center">
                <View
                    className="items-center justify-center overflow-hidden relative"
                    style={{
                        borderRadius: moderateScale(18),
                        width: moderateScale(88),
                        height: moderateScale(88)
                    }}
                >
                    <Image
                        source={{
                            uri: item.image
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

                    {isInactive && (
                        <View
                            className="absolute items-center justify-center"
                            style={{
                                left: moderateScale(5),
                                right: moderateScale(5),
                                bottom: moderateScale(5),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(8),
                                backgroundColor: "rgba(31,31,31,0.82)"
                            }}
                        >
                            <Text
                                className="text-white font-bold uppercase"
                                style={{ fontSize: moderateScale(7.5) }}
                            >
                                Unavailable
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-1 justify-center mr-4 -mt-1">
                    {item.tag && !isInactive && (
                        <View
                            className="self-start flex-row items-center bg-[#F8D56A]"
                            style={{
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(10),
                                marginBottom: moderateScale(6)
                            }}
                        >
                            <Text
                                className="font-semibold text-[#3F2516] uppercase"
                                style={{ fontSize: moderateScale(9) }}
                            >
                                {item.tag}
                            </Text>
                        </View>
                    )}

                    <Text
                        numberOfLines={1}
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(16),
                            color: isInactive ? "rgba(31,31,31,0.50)" : "#1F1F1F"
                        }}
                    >
                        {item.name}
                    </Text>

                    <Text
                        numberOfLines={2}
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11.5),
                            marginTop: moderateScale(2),
                            color: isInactive
                                ? "rgba(31,31,31,0.38)"
                                : "rgba(31,31,31,0.75)"
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
                            ? "rgba(31,31,31,0.07)"
                            : "rgba(232,185,63,0.15)"
                    }}
                >
                    <RatingIcon
                        width={moderateScale(16)}
                        height={moderateScale(16)}
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
                        {item.rating}
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
                            ? "rgba(31,31,31,0.07)"
                            : "rgba(232,185,63,0.15)"
                    }}
                >
                    <Text
                        className="font-bold"
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

                        if (isInactive) return

                        onAdd?.(item)
                    }}
                    className="items-center justify-center ml-auto"
                    style={{
                        marginBottom: moderateScale(2),
                        width: moderateScale(32),
                        height: moderateScale(32),
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
        </TouchableOpacity>
    )
}

export default React.memo(PopularItemCard)