import { View, Text } from "react-native"
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import { moderateScale, verticalScale } from "react-native-size-matters"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated"
import { useCallback} from "react"
import { useFocusEffect } from "expo-router"

const STEPS = [
    "Placed",
    "Confirmed",
    "On the way",
    "Delivered",
]

type OrderStatusProps = {
    activeStep?: number
}

export default function OrderStatus({
    activeStep = 2,
}: OrderStatusProps) {
    const progress = activeStep / (STEPS.length - 1)
    const animatedProgress = useSharedValue(0)

    useFocusEffect(
        useCallback(() => {
            animatedProgress.value = 0

            animatedProgress.value = withTiming(progress, {
                duration: 1200,
                easing: Easing.out(Easing.cubic),
            })
        }, [progress])
    )

    const progressStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value * 100}%`
    }))

    const indicatorStyle = useAnimatedStyle(() => ({
        left: `${animatedProgress.value * 100}%`
    }))

    return (
        <View
            style={{
                paddingHorizontal: moderateScale(15),
                paddingTop: verticalScale(14),
                paddingBottom: verticalScale(8)
            }}
        >
            <View
                style={{
                    height: moderateScale(32),
                    justifyContent: "center",
                    position: "relative"
                }}
            >
                <View
                    className="rounded-full"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: verticalScale(8),
                        backgroundColor: "#F3EDE5"
                    }}
                />

                <Animated.View
                    className="rounded-full"
                    style={[
                        {
                            position: "absolute",
                            left: 0,
                            height: verticalScale(9),
                            backgroundColor: "#FBB52B"
                        },
                        progressStyle
                    ]}
                />

                <Animated.View
                    className="rounded-full"
                    style={[
                        {
                            position: "absolute",
                            width: moderateScale(32),
                            height: moderateScale(32),
                            borderRadius: moderateScale(16),
                            backgroundColor: "#FBB52B",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: -moderateScale(18)
                        },
                        indicatorStyle
                    ]}
                >
                    <DeliveryIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" />
                </Animated.View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: verticalScale(10)
                }}
            >
                {STEPS.map((step, index) => {
                    const isActive = index === activeStep
                    const isCompleted = index < activeStep

                    return (
                        <Text
                            key={step}
                            style={{
                                textAlign:
                                    index === 0
                                        ? "left"
                                        : index === STEPS.length - 1
                                        ? "right"
                                        : "center",
                                fontSize: moderateScale(12),
                                fontWeight: isActive ? "600" : "500",
                                color: isActive
                                    ? "#24170F"
                                    : isCompleted
                                    ? "#756A63"
                                    : "#8F8984"
                            }}
                        >
                            {step}
                        </Text>
                    )
                })}
            </View>
        </View>
    )
}