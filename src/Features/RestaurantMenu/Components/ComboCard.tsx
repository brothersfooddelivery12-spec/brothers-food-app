import PlusIcon from "@/assets/icon/PlusIcon.svg"
import { ComboItem } from "@/constant/ComboData"
import { Image } from "expo-image"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale } from "react-native-size-matters"

type ComboCardProps = {
    item: ComboItem
    onAdd?: (item: ComboItem) => void
    onPress?: (item: ComboItem) => void
}

function ComboCard({
    item,
    onAdd,
    onPress,
}: ComboCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="bg-white border border-[#1F1F1F]/10 p-2"
            style={{
                borderRadius: moderateScale(18),
                width: moderateScale(225),
                height: moderateScale(135)
            }}
        >
            <View className="flex-row h-full gap-3">
                <View
                    className="relative"
                    style={{
                        width: "40%",
                        height: "100%"
                    }}
                >
                    <Image
                        source={{ uri: item.imageUri }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: moderateScale(14)
                        }}
                    />

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
                        <PlusIcon width={moderateScale(14)} height={moderateScale(14)} color="#3F2516" strokeWidth={3} />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 mb-1">
                    {item.badge && (
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

                    <Text
                        numberOfLines={1}
                        className="text-[#1F1F1F] font-bold mt-3"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        {item.name}
                    </Text>

                    <Text
                        numberOfLines={3}
                        className="text-[#1F1F1F]/75 font-medium mt-1"
                        style={{ fontSize: moderateScale(10) }}
                    >
                        {item.description}
                    </Text>

                    <View className="flex-row items-center gap-2 mt-auto">
                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            ₹{item.price}
                        </Text>

                        {item.originalPrice && (
                            <Text
                                className="text-[#1F1F1F]/45 font-medium"
                                style={{
                                    fontSize: moderateScale(11),
                                    textDecorationLine: "line-through"
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