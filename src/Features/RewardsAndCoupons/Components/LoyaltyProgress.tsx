import CircleStarIcon from "@/assets/icon/CircleStarIcon.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
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
            className="mx-2"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(18),
                paddingHorizontal: scale(14),
                paddingTop: verticalScale(14),
                paddingBottom: verticalScale(12),
                marginTop: verticalScale(16)
            }}
        >
            <View className="flex-row items-start justify-between">
                <Text
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(14),
                        color: COLORS.primaryTextColor
                    }}
                >
                    Loyalty Progress
                </Text>

                <View className="items-end">
                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(15),
                            color: COLORS.accentColor
                        }}
                    >
                        {remainingPoints} pts
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
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
                    className="absolute w-full"
                    style={{
                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        height: moderateScale(6),
                        borderRadius: moderateScale(18)
                    }}
                />

                <View
                    className="absolute"
                    style={{
                        backgroundColor: COLORS.accentColor,
                        width: `${safeProgress}%`,
                        height: moderateScale(6),
                        borderRadius: moderateScale(18)
                    }}
                />

                <View
                    className="absolute"
                    style={{
                        backgroundColor: COLORS.accentColor,
                        borderColor: COLORS.primaryBackgroundColor,
                        borderWidth: moderateScale(0.7),
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
                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.accentColor} />

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {currentTier}{" "}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(9.5),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        ({currentTierPoints.toLocaleString()})
                    </Text>
                </View>

                <View className="flex-row items-center">
                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color="#B889E8" />

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {nextTier}{" "}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(9.5),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        ({nextTierPoints.toLocaleString()})
                    </Text>
                </View>
            </View>
        </View>
    )
}