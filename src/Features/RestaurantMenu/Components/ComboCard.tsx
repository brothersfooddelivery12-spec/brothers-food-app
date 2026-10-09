import PlusIcon from "@/assets/icon/PlusIcon.svg"
import { COLORS } from "@/constant/colors"
import { ComboItem } from "@/constant/ComboData"
import { hexToRgba } from "@/utils/hexToRgba"
import { Image } from "expo-image"
import { memo, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

type ComboCardProps = {
    item: ComboItem
    onAdd?: (item: ComboItem) => void
    onPress?: (item: ComboItem) => void
}

function ComboCard({
    item,
    onAdd,
    onPress
}: ComboCardProps) {
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

                onPress?.(item)
            }}
            className="p-2"
            style={{
                borderRadius: moderateScale(18),
                width: moderateScale(225),
                height: moderateScale(135),
                backgroundColor: isInactive ? COLORS.inactiveBackgroundColor : COLORS.secondaryBackgroundColor,
                borderWidth: moderateScale(0.5),
                borderColor: isInactive 
                    ? hexToRgba(COLORS.primaryTextColor, 0.08)
                    : hexToRgba(COLORS.primaryTextColor, 0.10)
            }}
        >
            <View className="flex-row h-full gap-3">
                <View
                    className="relative overflow-hidden"
                    style={{
                        width: "40%",
                        height: "100%",
                        borderRadius: moderateScale(14),
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
                        transition={200}
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
                                borderRadius: moderateScale(8), 
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
                                Unavailable
                            </Text>
                        </View>
                    )}

                    {!isInactive && (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={(event) => {
                                event.stopPropagation()
                                onAdd?.(item)
                            }}
                            className="absolute items-center justify-center"
                            style={{
                                backgroundColor: COLORS.primaryBackgroundColor,
                                right: moderateScale(5),
                                bottom: moderateScale(5),
                                width: moderateScale(28),
                                height: moderateScale(28),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <PlusIcon
                                width={moderateScale(14)}
                                height={moderateScale(14)}
                                color={COLORS.primaryColor}
                                strokeWidth={3}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View className="flex-1 mb-1">
                    {item.badge && !isInactive && (
                        <View
                            className="self-start flex-row items-center"
                            style={{
                                backgroundColor: COLORS.accentLightColor,
                                marginTop: moderateScale(8),
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(3),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <Text
                                className="font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(9),
                                    color: COLORS.primaryColor
                                }}
                            >
                                {item.badge}
                            </Text>
                        </View>
                    )}

                    {isInactive && (
                        <View
                            className="self-start"
                            style={{
                                marginTop: moderateScale(8),
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(3),
                                borderRadius: moderateScale(10),
                                backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                            }}
                        >
                            <Text
                                className="font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(8),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.5)
                                }}
                            >
                                Currently Unavailable
                            </Text>
                        </View>
                    )}

                    <Text
                        numberOfLines={1}
                        className="font-bold mt-3"
                        style={{
                            fontSize: moderateScale(12),
                            color: isInactive ? hexToRgba(COLORS.primaryTextColor, 0.52) : COLORS.primaryTextColor
                        }}
                    >
                        {item.name}
                    </Text>

                    <Text
                        numberOfLines={3}
                        className="font-medium mt-1"
                        style={{
                            fontSize: moderateScale(10),
                            color: isInactive
                                ? hexToRgba(COLORS.primaryTextColor, 0.38)
                                : hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        {item.description}
                    </Text>

                    <View className="flex-row items-center gap-2 mt-auto">
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                color: isInactive ? hexToRgba(COLORS.primaryTextColor, 0.52) : COLORS.primaryTextColor
                            }}
                        >
                            ₹{item.price}
                        </Text>

                        {item.originalPrice && (
                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(11),
                                    textDecorationLine: "line-through",
                                    color: isInactive
                                        ? hexToRgba(COLORS.primaryTextColor, 0.35)
                                        : hexToRgba(COLORS.primaryTextColor, 0.45)
                                }}
                            >
                                ₹{item.originalPrice}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(ComboCard)