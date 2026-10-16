import CircleStarIcon from "@/assets/icon/CircleStarIcon.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type LoyaltyProgressProps = {
    currentPoints: number
    highestPoints: number
}

const LOYALTY_TIERS = [
    {
        name: "Bronze",
        points: 1000
    },
    {
        name: "Silver",
        points: 2500
    },
    {
        name: "Gold",
        points: 5000
    },
    {
        name: "Platinum",
        points: 8000
    }
] as const

const getLoyaltyProgress = (
    currentPoints: number,
    highestPoints: number
) => {
    const safeHighestPoints = Math.max(highestPoints, 0)

    let currentTier:
        | (typeof LOYALTY_TIERS)[number]
        | null = null

    let nextTier:
        | (typeof LOYALTY_TIERS)[number]
        | null = null

    // Tier is based ONLY on highestPoints
    for (let i = 0; i < LOYALTY_TIERS.length; i++) {
        const tier = LOYALTY_TIERS[i]

        if (safeHighestPoints >= tier.points) {
            currentTier = tier
        } else {
            nextTier = tier
            break
        }
    }

    const currentTierPoints =
        currentTier?.points ?? 0

    const nextTierPoints =
        nextTier?.points ?? currentTierPoints

    const remainingPoints = nextTier
        ? Math.max(
            nextTier.points - safeHighestPoints,
            0
        )
        : 0

    const range =
        nextTierPoints - currentTierPoints

    const progress = nextTier
        ? range > 0
            ? (
                (safeHighestPoints - currentTierPoints) /
                range
            ) * 100
            : 0
        : 100

    return {
        currentPoints,
        highestPoints: safeHighestPoints,

        currentTier,
        nextTier,

        currentTierPoints,
        nextTierPoints,

        remainingPoints,

        progress: Math.min(
            Math.max(progress, 0),
            100
        ),

        isHighestTier:
            currentTier?.name === "Platinum"
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

    const indicatorSize = moderateScale(14)

    const [progressWidth, setProgressWidth] = useState(0)

    const animatedProgress = useSharedValue(0)

    const safeProgress = Math.min(Math.max(progress || 0, 0), 100)

    useEffect(() => {
        if (progressWidth <= 0) {
            return
        }

        animatedProgress.value = withTiming(
            safeProgress,
            {
                duration: 900,
                easing: Easing.out(Easing.cubic)
            }
        )
    }, [safeProgress, progressWidth])

    const animatedFillStyle = useAnimatedStyle(() => {
        return {
            width: progressWidth * (animatedProgress.value / 100)
        }
    })

    const animatedIndicatorStyle = useAnimatedStyle(() => {
        const position = progressWidth * (animatedProgress.value / 100)

        const maxPosition = Math.max(progressWidth - indicatorSize, 0)

        const x = Math.min(
            Math.max(position - indicatorSize / 2, 0),
            maxPosition
        )

        return {
            transform: [
                {
                    translateX: x
                }
            ]
        }
    })

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
                <View className="items-start">
                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Loyalty Progress
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(10),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            marginTop: verticalScale(4)
                        }}
                    >
                        Highest Points {" "}
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(11),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {highestPoints.toLocaleString()}
                        </Text>
                    </Text>
                </View>

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
                onLayout={(event) => {
                    const width = event.nativeEvent.layout.width
                    setProgressWidth(width)
                }}
                style={{
                    marginTop: verticalScale(10),
                    height: moderateScale(14)
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        height: moderateScale(6),
                        borderRadius: moderateScale(18)
                    }}
                />

                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            left: 0,
                            backgroundColor: COLORS.accentColor,
                            height: moderateScale(6),
                            borderRadius: moderateScale(18)
                        },
                        animatedFillStyle
                    ]}
                />

                {safeProgress > 0 && (
                    <Animated.View
                        style={[
                            {
                                position: "absolute",
                                left: 0,
                                backgroundColor: COLORS.accentColor,
                                borderColor: COLORS.primaryBackgroundColor,
                                borderWidth: moderateScale(1),
                                width: indicatorSize,
                                height: indicatorSize,
                                borderRadius: indicatorSize / 2
                            },
                            animatedIndicatorStyle
                        ]}
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
                        {currentTier?.name ?? "No Tier"}{" "}
                    </Text>

                    {currentTier && (
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(9.5),
                                color: hexToRgba(COLORS.primaryTextColor, 0.65)
                            }}
                        >
                            ({currentTier.points.toLocaleString()})
                        </Text>
                    )}
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