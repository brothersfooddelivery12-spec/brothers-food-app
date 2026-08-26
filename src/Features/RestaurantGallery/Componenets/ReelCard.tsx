import PlayIcon from '@/assets/icon/PlayIcon.svg'
import { Image } from "expo-image"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type ReelItem = {
    id: string
    title: string
    category: string
    duration: string
    thumbnail: string
}

type ReelCardProps = {
    item: ReelItem
    onPress?: (item: ReelItem) => void
}

function ReelCard({ item, onPress }: ReelCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="relative overflow-hidden"
            style={{
                width: moderateScale(120),
                height: moderateScale(160),
                borderRadius: moderateScale(16)
            }}
        >
            <Image
                source={{ uri: item.thumbnail }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={100}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />

            <View className="absolute inset-0 bg-black/25" />

            <View
                pointerEvents="none"
                className="absolute inset-0 items-center justify-center"
            >
                <View
                    className="items-center justify-center border border-white bg-black/20"
                    style={{
                        width: moderateScale(34),
                        height: moderateScale(34),
                        borderRadius: moderateScale(18)
                    }}
                >
                    <PlayIcon width={moderateScale(25)} height={moderateScale(25)} color="#FFFFFF" />
                </View>
            </View>

            <View
                className="absolute left-0 right-0 bottom-0"
                style={{
                    paddingHorizontal: scale(10),
                    paddingBottom: verticalScale(8)
                }}
            >
                <Text
                    numberOfLines={1}
                    className="text-white font-bold"
                    style={{ fontSize: moderateScale(11) }}
                >
                    {item.title}
                </Text>

                <View
                    className="flex-row items-center"
                    style={{ marginTop: verticalScale(3) }}
                >
                    <Text
                        className="text-white/90 font-medium flex-1"
                        style={{ fontSize: moderateScale(9) }}
                    >
                        {item.category}
                    </Text>

                    <Text
                        className="text-white/90 font-medium"
                        style={{ fontSize: moderateScale(9) }}
                    >
                        {item.duration}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(ReelCard)