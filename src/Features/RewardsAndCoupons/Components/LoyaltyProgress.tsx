import CircleStarIcon from "@/assets/icon/CircleStarIcon.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type LoyaltyProgressProps = {
    currentPoints: number
    highestPoints: number
}

const LOYALTY_TIERS = [
    {
        name: "Bronze",
        percentage: 0
    },
    {
        name: "Silver",
        percentage: 10
    },
    {
        name: "Gold",
        percentage: 20
    },
    {
        name: "Platinum",
        percentage: 30
    },
    {
        name: "Diamond",
        percentage: 50
    },
    {
        name: "Elite",
        percentage: 75
    },
    {
        name: "Legend",
        percentage: 100
    }
] as const

const getLoyaltyProgress = (
    currentPoints: number,
    highestPoints: number
) => {
    const safeHighestPoints = Math.max(highestPoints, 0)
    const safeCurrentPoints = Math.min(Math.max(currentPoints, 0), safeHighestPoints)

    const tiers = LOYALTY_TIERS.map((tier) => ({
        ...tier,

        points: Math.round((safeHighestPoints * tier.percentage) / 100)
    }))

    let currentTierIndex = 0

    for (let i = 0; i < tiers.length; i++) {
        if (safeCurrentPoints >= tiers[i].points) {
            currentTierIndex = i
        } else {
            break
        }
    }

    const currentTier = tiers[currentTierIndex]
    const nextTier = tiers[currentTierIndex + 1] ?? null

    const remainingPoints = nextTier
        ? Math.max(nextTier.points - safeCurrentPoints, 0)
        : 0

    const overallProgress = safeHighestPoints > 0
        ? (safeCurrentPoints / safeHighestPoints) * 100
        : 0

    return {
        currentTier,
        nextTier,
        remainingPoints,
        progress: Math.min(Math.max(overallProgress, 0), 100),
        isHighestTier: !nextTier
    }
}

export default function LoyaltyProgress({
    currentPoints,
    highestPoints
}: LoyaltyProgressProps) {
    const {
        currentTier,
        nextTier,
        remainingPoints,
        progress,
        isHighestTier
    } = getLoyaltyProgress(
        currentPoints,
        highestPoints
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
                        {isHighestTier
                            ? "MAX"
                            : `${remainingPoints.toLocaleString()} pts`
                        }
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            fontSize: moderateScale(10),
                            marginTop: verticalScale(1)
                        }}
                    >
                        {nextTier
                            ? `to ${nextTier.name}`
                            : "Highest tier reached"
                        }
                    </Text>
                </View>
            </View>

            <View
                className="w-full justify-center"
                style={{
                    marginTop: verticalScale(10),
                    height: moderateScale(14)
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
                        width: `${progress}%`,
                        height: moderateScale(6),
                        borderRadius: moderateScale(18)
                    }}
                />

                {progress > 0 && progress < 100 && (
                    <View
                        className="absolute"
                        style={{
                            backgroundColor: COLORS.accentColor,
                            borderColor: COLORS.primaryBackgroundColor,
                            borderWidth: moderateScale(1),
                            width: moderateScale(14),
                            height: moderateScale(14),
                            borderRadius: moderateScale(7),
                            left: `${progress}%`,
                            transform: [
                                {
                                    translateX: -moderateScale(7)
                                }
                            ]
                        }}
                    />
                )}
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
                        {currentTier.name}{" "}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(9.5),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        ({currentTier.points.toLocaleString()})
                    </Text>
                </View>

                {nextTier && (
                    <View className="flex-row items-center">
                        <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color="#B889E8" />

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {nextTier.name}{" "}
                        </Text>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(9.5),
                                color: hexToRgba(COLORS.primaryTextColor, 0.65)
                            }}
                        >
                            ({nextTier.points.toLocaleString()})
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}