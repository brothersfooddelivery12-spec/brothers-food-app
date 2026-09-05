import LeafIcon from '@/assets/icon/LeafIcon.svg'
import NonvegIcon from '@/assets/icon/PoultryLeg.svg'
import { memo, useEffect } from "react"
import { TouchableOpacity, View } from "react-native"
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { moderateScale, scale } from "react-native-size-matters"

export type FoodType = "veg" | "nonveg"

type VegNonVegToggleProps = {
    value: FoodType
    onChange: (value: FoodType) => void
}

const VegNonVegToggle = memo(
    ({ value, onChange }: VegNonVegToggleProps) => {
        const isVeg = value === "veg"

        const containerWidth = moderateScale(220)
        const containerHeight = moderateScale(44)
        const containerPadding = moderateScale(3)
        const innerWidth = containerWidth - containerPadding * 2
        const tabWidth = innerWidth / 2

        const progress = useSharedValue(isVeg ? 0 : 1)

        useEffect(() => {
            progress.value = withSpring(isVeg ? 0 : 1,
                    {
                        damping: 18,
                        stiffness: 180,
                        mass: 0.7
                    }
                )
        }, [isVeg, progress])

        const indicatorStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        translateX: progress.value * tabWidth
                    }
                ]
            }
        })

        const vegTextStyle = useAnimatedStyle(() => ({
            color:
                interpolateColor(
                    progress.value,
                    [0, 1],
                    ["#FFFFFF", "#1F1F1F"]
                )
        }))

        const nonVegTextStyle = useAnimatedStyle(() => ({
            color:
                interpolateColor(
                    progress.value,
                    [0, 1],
                    ["#1F1F1F", "#FFFFFF" ]
                )
        }))

        return (
            <View
                className="flex-row items-center bg-white border border-[#1F1F1F]/10 overflow-hidden"
                style={{
                    width: containerWidth,
                    height: containerHeight,
                    borderRadius: moderateScale(24),
                    padding: containerPadding
                }}
            >
                <Animated.View
                    pointerEvents="none"
                    style={[
                        {
                            position: "absolute",
                            left: containerPadding,
                            top: containerPadding,
                            width: tabWidth,
                            height: containerHeight - containerPadding * 2,
                            borderRadius: moderateScale(21),
                            backgroundColor: "#3F2516"
                        },
                        indicatorStyle
                    ]}
                />

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (!isVeg) {
                            onChange("veg")
                        }
                    }}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: "100%",
                        gap: scale(5),
                        paddingHorizontal: scale(6),
                        zIndex: 1
                    }}
                >
                    <LeafIcon width={moderateScale(18)} height={moderateScale(18)} color="#22C55E" />

                    <Animated.Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                        className="font-bold text-center"
                        style={[
                            {
                                fontSize: moderateScale(13),
                                flexShrink: 1
                            },
                            vegTextStyle
                        ]}
                    >
                        Veg
                    </Animated.Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (isVeg) {
                            onChange("nonveg")
                        }
                    }}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: "100%",
                        gap: scale(5),
                        paddingHorizontal: scale(6),
                        zIndex: 1
                    }}
                >
                    <NonvegIcon width={moderateScale(18)} height={moderateScale(18)} color="#C44512" />

                    <Animated.Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.8}
                        className="font-bold text-center"
                        style={[
                            {
                                fontSize: moderateScale(13),
                                flexShrink: 1
                            },
                            nonVegTextStyle
                        ]}
                    >
                        Non Veg
                    </Animated.Text>
                </TouchableOpacity>
            </View>
        )
    }
)

VegNonVegToggle.displayName = "VegNonVegToggle"

export default VegNonVegToggle