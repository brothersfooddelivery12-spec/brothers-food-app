import FoodIcon from '@/assets/icon/FoodIcon.svg'
import RestaurantIcon from '@/assets/icon/StoreIcon.svg'
import { memo, useEffect } from "react"
import { Pressable, View } from "react-native"
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { moderateScale, verticalScale } from "react-native-size-matters"

type FavouriteTab = "restaurants" | "food"

interface FavouriteTabsProps {
    activeTab: FavouriteTab
    onChange: (tab: FavouriteTab) => void
}

const FavouriteTabs = memo(
    ({ activeTab, onChange }: FavouriteTabsProps) => {
        const isRestaurant = activeTab === "restaurants"
        
        const progress = useSharedValue(isRestaurant ? 0 : 1)
        const tabWidth = useSharedValue(0)
        const tabPadding = moderateScale(4)
        const tabHeight = verticalScale(38)

        useEffect(() => {
            progress.value =
                withSpring(
                    isRestaurant ? 0 : 1,
                    {
                        damping: 18,
                        stiffness: 180,
                        mass: 0.7
                    }
                )
        }, [isRestaurant, progress])

        const indicatorStyle = useAnimatedStyle(() => {
            return {
                width: tabWidth.value,
                transform: [
                    {
                        translateX: progress.value * tabWidth.value
                    }
                ]
            }
        })

        const restaurantTextStyle = useAnimatedStyle(() => ({
            color:
                interpolateColor(
                    progress.value,
                    [0, 1],
                    ["#FFFFFF", "rgba(31,31,31,0.65)"]
                )
        }))

        const foodTextStyle = useAnimatedStyle(() => ({
            color:
                interpolateColor(
                    progress.value,
                    [0, 1],
                    ["rgba(31,31,31,0.65)", "#FFFFFF"]
                )
        }))

        const restaurantActiveIconStyle =
            useAnimatedStyle(() => ({
                opacity: 1 - progress.value
            }))

        const restaurantInactiveIconStyle =
            useAnimatedStyle(() => ({
                opacity: progress.value
            }))

        const foodInactiveIconStyle =
            useAnimatedStyle(() => ({
                opacity: 1 - progress.value
            }))

        const foodActiveIconStyle =
            useAnimatedStyle(() => ({
                opacity: progress.value
            }))

        return (
            <View
                onLayout={(event) => {
                    const width =event.nativeEvent.layout.width
                    tabWidth.value = (width - tabPadding * 2) / 2
                }}
                className="flex-row bg-[#E5E4E2]/55 mx-2 overflow-hidden"
                style={{
                    padding: tabPadding,
                    borderRadius: moderateScale(28),
                    borderWidth: moderateScale(1),
                    borderColor: "rgba(31,31,31,0.05)"
                }}
            >
                <Animated.View
                    pointerEvents="none"
                    style={[
                        {
                            position: "absolute",
                            left: tabPadding,
                            top: tabPadding,
                            height: tabHeight,
                            borderRadius: moderateScale(24),
                            backgroundColor: "#3F2516"
                        },
                        indicatorStyle
                    ]}
                />

                <Pressable
                    onPress={() => {
                        if (activeTab !== "restaurants") {
                            onChange("restaurants")
                        }
                    }}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: tabHeight,
                        gap: moderateScale(4),
                        zIndex: 1
                    }}
                >
                    <View
                        style={{
                            width: moderateScale(20),
                            height: moderateScale(20)
                        }}
                    >
                        <Animated.View
                            style={[
                                {
                                    position: "absolute",
                                    left: 0,
                                    top: 0
                                },
                                restaurantActiveIconStyle
                            ]}
                        >
                            <RestaurantIcon width={moderateScale(20)} height={moderateScale(20)} color="#FFFFFF" />
                        </Animated.View>

                        <Animated.View
                            style={[
                                {
                                    position: "absolute",
                                    left: 0,
                                    top: 0
                                },
                                restaurantInactiveIconStyle
                            ]}
                        >
                            <RestaurantIcon width={moderateScale(20)} height={moderateScale(20)} color="rgba(31,31,31,0.65)" />
                        </Animated.View>
                    </View>

                    <Animated.Text
                        numberOfLines={1}
                        className={
                            isRestaurant
                                ? "font-semibold"
                                : "font-medium"
                        }
                        style={[
                            {
                                fontSize: moderateScale(14)
                            },
                            restaurantTextStyle
                        ]}
                    >
                        Restaurants
                    </Animated.Text>
                </Pressable>

                <Pressable
                    onPress={() => {
                        if (activeTab !== "food") {
                            onChange("food")
                        }
                    }}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: tabHeight,
                        gap: moderateScale(4),
                        zIndex: 1
                    }}
                >
                    <View
                        style={{
                            width: moderateScale(20),
                            height: moderateScale(20)
                        }}
                    >
                        <Animated.View
                            style={[
                                {
                                    position: "absolute",
                                    left: 0,
                                    top: 0
                                },
                                foodInactiveIconStyle
                            ]}
                        >
                            <FoodIcon width={moderateScale(20)} height={moderateScale(20)} color="rgba(31,31,31,0.65)" />
                        </Animated.View>

                        <Animated.View
                            style={[
                                {
                                    position: "absolute",
                                    left: 0,
                                    top: 0
                                },
                                foodActiveIconStyle
                            ]}
                        >
                            <FoodIcon width={moderateScale(20)} height={moderateScale(20)} color="#FFFFFF" />
                        </Animated.View>
                    </View>

                    <Animated.Text
                        numberOfLines={1}
                        className={
                            !isRestaurant
                                ? "font-semibold"
                                : "font-medium"
                        }
                        style={[
                            {
                                fontSize: moderateScale(14)
                            },
                            foodTextStyle
                        ]}
                    >
                        Food Items
                    </Animated.Text>
                </Pressable>
            </View>
        )
    }
)

export default FavouriteTabs