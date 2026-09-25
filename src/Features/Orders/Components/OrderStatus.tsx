import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import { OrderStatusType } from "@/Services/api-service"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { Text, View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { moderateScale, verticalScale } from "react-native-size-matters"

const STEPS = [
    "Placed",
    "Confirmed",
    "Preparing",
    "On the way",
    "Delivered"
]

const getActiveStep = (status: OrderStatusType) => {
    switch (status) {
        case "PENDING_PAYMENT":
        case "PENDING":
            return 0

        case "CONFIRMED":
            return 1

        case "PREPARING":
        case "READY_FOR_PICKUP":
            return 2

        case "RIDER_ASSIGNED":
        case "PICKED_UP":
        case "OUT_FOR_DELIVERY":
            return 3

        case "DELIVERED":
            return 4

        default:
            return 0
    }
}

const INDICATOR_SIZE = moderateScale(30)
const INDICATOR_HALF = INDICATOR_SIZE / 2

const TRACK_WIDTH_PERCENT =
    100 - 100 / STEPS.length

type OrderStatusProps = {
    status: OrderStatusType
}

export default function OrderStatus({ status }: OrderStatusProps) {
    const activeStep = Math.min(Math.max(getActiveStep(status), 0), STEPS.length - 1)

    const progress = activeStep / (STEPS.length - 1)

    const animatedProgress = useSharedValue(0)

    useFocusEffect(
        useCallback(() => {
            animatedProgress.value = 0

            animatedProgress.value =
                withTiming(progress, {
                    duration: 1200,
                    easing: Easing.out(Easing.cubic)
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
                marginHorizontal: -moderateScale(6),
                paddingTop: verticalScale(14),
                paddingBottom: verticalScale(8)
            }}
        >
            <View
                style={{
                    width: `${TRACK_WIDTH_PERCENT}%`,
                    alignSelf: "center",
                    height: moderateScale(32),
                    justifyContent: "center",
                    position: "relative"
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: verticalScale(8),
                        borderRadius: moderateScale(20),
                        backgroundColor: "#F3EDE5"
                    }}
                />

                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            left: 0,
                            height: verticalScale(9),
                            borderRadius: moderateScale(20),
                            backgroundColor: "#FBB52B"
                        },
                        progressStyle
                    ]}
                />

                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            width: INDICATOR_SIZE,
                            height: INDICATOR_SIZE,
                            borderRadius: INDICATOR_SIZE / 2,
                            backgroundColor: "#FBB52B",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: -INDICATOR_HALF
                        },
                        indicatorStyle
                    ]}
                >
                    <DeliveryIcon width={moderateScale(17)} height={moderateScale(17)} color="#3F2516"/>
                </Animated.View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    marginTop: verticalScale(6)
                }}
            >
                {STEPS.map((step, index) => {
                    const isActive = index === activeStep

                    const isCompleted = index < activeStep

                    return (
                        <View
                            key={step}
                            style={{
                                flex: 1,
                                alignItems: "center"
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    textAlign: "center",
                                    fontSize: moderateScale(11),
                                    fontWeight: isActive ? "600" : "500",
                                    color: isActive
                                        ? "#24170F"
                                        : isCompleted ? "#756A63" : "#8F8984"
                                }}
                            >
                                {step}
                            </Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}