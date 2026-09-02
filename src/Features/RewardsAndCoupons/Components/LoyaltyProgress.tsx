import CircleStarIcon from "@/assets/icon/CircleStarIcon.svg"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type LoyaltyProgressProps = {
    currentPoints: number
    currentTierPoints: number
    nextTierPoints: number
    currentTier: string
    nextTier: string
}

export default function LoyaltyProgress({
    currentPoints,
    currentTierPoints,
    nextTierPoints,
    currentTier,
    nextTier,
}: LoyaltyProgressProps) {
    const remainingPoints = Math.max(
        nextTierPoints - currentPoints,
        0
    )

    const progress =
        ((currentPoints - currentTierPoints) /
            (nextTierPoints - currentTierPoints)) *
        100

    const safeProgress = Math.min(
        Math.max(progress, 0),
        100
    )

    return (
        <View
            className="bg-white border border-[#1F1F1F]/10 mx-2"
            style={{
                borderRadius: moderateScale(18),
                paddingHorizontal: scale(14),
                paddingTop: verticalScale(14),
                paddingBottom: verticalScale(12),
                marginTop: verticalScale(16)
            }}
        >
            <View className="flex-row items-start justify-between">
                <Text
                    className="text-[#1F1F1F] font-bold"
                    style={{ fontSize: moderateScale(14) }}
                >
                    Loyalty Progress
                </Text>

                <View className="items-end">
                    <Text
                        className="text-[#D9A000] font-bold"
                        style={{ fontSize: moderateScale(15) }}
                    >
                        {remainingPoints} pts
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{
                            fontSize: moderateScale(10),
                            marginTop: verticalScale(1)
                        }}
                    >
                        to {nextTier}
                    </Text>
                </View>
            </View>

            <View
                className="w-full justify-center"
                style={{
                    marginTop: verticalScale(10),
                    height: moderateScale(8)
                }}
            >
                <View
                    className="absolute w-full bg-[#1F1F1F]/10"
                    style={{
                        height: moderateScale(6),
                        borderRadius: moderateScale(18)
                    }}
                />

                <View
                    className="absolute bg-[#E0A400]"
                    style={{
                        width: `${safeProgress}%`,
                        height: moderateScale(6),
                        borderRadius: moderateScale(18)
                    }}
                />

                <View
                    className="absolute bg-[#E0A400] border border-white"
                    style={{
                        width: moderateScale(14),
                        height: moderateScale(14),
                        borderRadius: moderateScale(14),

                        left: `${safeProgress}%`,

                        transform: [
                            {
                                translateX: -moderateScale(6.5)
                            }
                        ]
                    }}
                />
            </View>

            <View
                className="flex-row items-center justify-between"
                style={{ marginTop: verticalScale(8) }}
            >
                <View className="flex-row items-center">
                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color="#D9A000" />

                    <Text
                        className="text-[#1F1F1F] font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        {currentTier}
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(9.5) }}
                    >
                        ({currentTierPoints.toLocaleString()})
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color="#B889E8" />

                    <Text
                        className="text-[#1F1F1F] font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        {nextTier}
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(9.5) }}
                    >
                        ({nextTierPoints.toLocaleString()})
                    </Text>
                </View>
            </View>
        </View>
    )
}