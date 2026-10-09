import ArrowDownIcon from "@/assets/icon/ArrowDown.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { memo, useCallback, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type FAQItem = {
    id: string
    question: string
    answer: string
}

type FAQCardProps = {
    item: FAQItem
}

const FAQCard = memo(({ item }: FAQCardProps) => {
    const [expanded, setExpanded] = useState(false)

    const progress = useSharedValue(0)
    const contentHeight = useSharedValue(0)

    useEffect(() => {
        progress.value = withTiming(expanded ? 1 : 0, {
            duration: 280,
        })
    }, [expanded, progress])

    const toggleExpanded = useCallback(() => {
        setExpanded(previous => !previous)
    }, [])

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        height: contentHeight.value * progress.value,
        opacity: progress.value,
        overflow: "hidden"
    }))

    const arrowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(
                    progress.value,
                    [0, 1],
                    [0, 180]
                )}deg`
            }
        ]
    }))

    return (
        <View
            className="overflow-hidden"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(18),
                marginBottom: verticalScale(10)
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={toggleExpanded}
                className="flex-row items-center"
                style={{
                    paddingHorizontal: scale(16),
                    paddingVertical: verticalScale(14),
                    gap: scale(12)
                }}
            >
                <Text
                    className="flex-1 font-bold"
                    style={{
                        color: COLORS.primaryTextColor,
                        fontSize: moderateScale(14),
                        lineHeight: moderateScale(20)
                    }}
                >
                    {item.question}
                </Text>

                <Animated.View
                    style={[
                        arrowAnimatedStyle,
                        {
                            width: moderateScale(28),
                            height: moderateScale(28),
                            backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65)
                        }
                    ]}
                    className="items-center justify-center rounded-full"
                >
                    <ArrowDownIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryTextColor} />
                </Animated.View>
            </TouchableOpacity>

            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    left: scale(20),
                    right: scale(20),
                    opacity: 0,
                    zIndex: -1
                }}
                onLayout={event => {
                    const height = event.nativeEvent.layout.height

                    if (height > 0 && height !== contentHeight.value) {
                        contentHeight.value = height
                    }
                }}
            >
                <View>
                    <View
                        style={{
                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            height: 1,
                            marginBottom: verticalScale(12)
                        }}
                    />

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                            fontSize: moderateScale(12),
                            lineHeight: moderateScale(18),
                            paddingBottom: verticalScale(18)
                        }}
                    >
                        {item.answer}
                    </Text>
                </View>
            </View>

            <Animated.View
                style={[
                    contentAnimatedStyle,
                    {
                        paddingHorizontal: scale(20)
                    }
                ]}
            >
                <View
                    style={{
                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        height: 1,
                        marginBottom: verticalScale(12)
                    }}
                />

                <Text
                    className="font-medium"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(18),
                        paddingBottom: verticalScale(18)
                    }}
                >
                    {item.answer}
                </Text>
            </Animated.View>
        </View>
    )
})

FAQCard.displayName = "FAQCard"

export default FAQCard