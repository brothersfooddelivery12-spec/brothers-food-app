import PlusIcon from "@/assets/icon/PlusIcon.svg"
import { ComboItem } from "@/constant/ComboData"
import { Image } from "expo-image"
import { memo } from "react"
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

    return (
        <TouchableOpacity
            activeOpacity={item.isActive ? 0.95 : 1}
            onPress={() => {
                if (isInactive) return

                onPress?.(item)
            }}
            className="border p-2"
            style={{
                borderRadius: moderateScale(18),
                width: moderateScale(225),
                height: moderateScale(135),
                backgroundColor: isInactive ? "#EFEFEF" : "#FFFFFF",
                borderColor: isInactive
                    ? "rgba(31,31,31,0.08)"
                    : "rgba(31,31,31,0.10)"
            }}
        >
            <View className="flex-row h-full gap-3">
                <View
                    className="relative overflow-hidden"
                    style={{
                        width: "40%",
                        height: "100%",
                        borderRadius: moderateScale(14)
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

                    {!isInactive && (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={(event) => {
                                event.stopPropagation()
                                onAdd?.(item)
                            }}
                            className="absolute items-center justify-center bg-white"
                            style={{
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
                                color="#3F2516"
                                strokeWidth={3}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View className="flex-1 mb-1">
                    {item.badge && !isInactive && (
                        <View
                            className="self-start flex-row items-center bg-[#F8D56A]"
                            style={{
                                marginTop: moderateScale(8),
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(3),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <Text
                                className="font-semibold text-[#3F2516] uppercase"
                                style={{ fontSize: moderateScale(9) }}
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
                                backgroundColor: "rgba(31,31,31,0.08)"
                            }}
                        >
                            <Text
                                className="font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(8),
                                    color: "rgba(31,31,31,0.50)"
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
                            color: isInactive ? "rgba(31,31,31,0.50)" : "#1F1F1F"
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
                                ? "rgba(31,31,31,0.38)"
                                : "rgba(31,31,31,0.75)"
                        }}
                    >
                        {item.description}
                    </Text>

                    <View className="flex-row items-center gap-2 mt-auto">
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                color: isInactive ? "rgba(31,31,31,0.45)" : "#1F1F1F"
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
                                        ? "rgba(31,31,31,0.28)"
                                        : "rgba(31,31,31,0.45)"
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