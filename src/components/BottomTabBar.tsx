import { View, Pressable, Text } from "react-native"
import { router } from "expo-router"
import HomeOutlineIcon from '@/assets/icon/HomeOutline.svg'
import HomeFilledIcon from '@/assets/icon/HomeFilled.svg'
import SearchOulineIcon from '@/assets/icon/SearchOutline.svg'
import SearchFilledIcon from '@/assets/icon/SearchFilledIcon.svg'
import ProfileOutlineIcon from '@/assets/icon/ProfileOutlineIcon.svg'
import ProfileFilledIcon from '@/assets/icon/ProfileFilledIcon.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import ShoppingBagIcon from '@/assets/icon/ShoppingBagIcon.svg'
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs"
import { moderateScale, verticalScale } from "react-native-size-matters"

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const getIcon = (routeName: string, focused: boolean) => {
        const color = focused ? "#1F1F1F" : "#929292"
        const size = moderateScale(24)

        switch (routeName) {
            case "home":
                return focused ? (
                    <HomeFilledIcon width={size} height={size} color={color} />
                ) : (
                    <HomeOutlineIcon width={size} height={size} color={color} />
                )

            case "search":
                return focused ? (
                    <SearchFilledIcon width={size} height={size} color={color} />
                ) : (
                    <SearchOulineIcon width={size} height={size} color={color} />
                )

            case "favourite":
                return focused ? (
                    <FavouriteFilledIcon width={size} height={size} color={color} />
                ) : (
                    <FavouriteOutlineIcon width={size} height={size} color={color} />
                )

            case "profile":
                return focused ? (
                    <ProfileFilledIcon width={size} height={size} color={color} />
                ) : (
                    <ProfileOutlineIcon width={size} height={size} color={color} />
                )

            default: return null
        }
    }

    const renderTab = (route: any, index: number) => {
        const focused = state.index === index
        const { options } = descriptors[route.key]

        const label =
            typeof options.title === "string"
                ? options.title
                : route.name

        const onPress = () => {
            const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            })

            if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name)
            }
        }

        return (
            <Pressable
                key={route.key}
                onPress={onPress}
                className="flex-1 items-center justify-center"
                style={{
                    gap: moderateScale(4),
                }}
            >
                {getIcon(route.name, focused)}

                <Text
                    className={`font-medium ${
                        focused
                            ? "text-[#1F1F1F]"
                            : "text-[#929292]"
                    }`}
                    style={{
                        fontSize: moderateScale(12),
                    }}
                >
                    {label}
                </Text>
            </Pressable>
        )
    }

    return (
        <View
            className="absolute left-4 right-4 bottom-7"
            style={{
                height: verticalScale(60),
            }}
        >
            <View
                className="flex-1 flex-row items-center bg-white"
                style={{
                    borderRadius: moderateScale(24),
                    paddingHorizontal: moderateScale(8),

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 6,
                }}
            >
                {state.routes[0] &&
                    renderTab(state.routes[0], 0)
                }

                {state.routes[1] &&
                    renderTab(state.routes[1], 1)
                }

                <View style={{ width: moderateScale(55) }} />

                {state.routes[2] &&
                    renderTab(state.routes[2], 2)
                }

                {state.routes[3] &&
                    renderTab(state.routes[3], 3)
                }
            </View>

            <Pressable
                onPress={() => router.push("/")}
                className="absolute items-center justify-center rounded-full"
                style={{
                    width: moderateScale(70),
                    height: moderateScale(70),
                    left: "50%",
                    marginLeft: -moderateScale(35),
                    top: -moderateScale(20),
                    paddingRight: moderateScale(3.5),
                    backgroundColor: "#3F2516",
                    borderWidth: moderateScale(3.5),
                    borderColor: "#FFFFFF",
                    shadowColor: "#79665C",
                    shadowOffset: { width: 0, height: 7 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 8,
                    zIndex: 100,
                }}
            >
                <ShoppingBagIcon width={moderateScale(36)} height={moderateScale(36)} color="#FFFFFF" />
            </Pressable>
        </View>
    )
}