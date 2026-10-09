import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import HomeFilledIcon from '@/assets/icon/HomeFilled.svg'
import HomeOutlineIcon from '@/assets/icon/HomeOutline.svg'
import ProfileFilledIcon from '@/assets/icon/ProfileFilledIcon.svg'
import ProfileOutlineIcon from '@/assets/icon/ProfileOutlineIcon.svg'
import SearchFilledIcon from '@/assets/icon/SearchFilledIcon.svg'
import SearchOulineIcon from '@/assets/icon/SearchOutline.svg'
import ShoppingBagIcon from '@/assets/icon/ShoppingBagIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, verticalScale } from "react-native-size-matters"

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets()
    const visibleRoutes = state.routes.filter(
        (route) => route.name !== "order"
    )

    const getIcon = (routeName: string, focused: boolean) => {
        const color = focused ? COLORS.primaryTextColor : COLORS.placeholderTextColor
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
                    <FavouriteOutlineIcon width={size} height={size} color={color} strokeWidth={1.5} />
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
                style={{ gap: moderateScale(4) }}
            >
                {getIcon(route.name, focused)}

                <Text
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(11),
                        color: focused ? COLORS.primaryTextColor : COLORS.placeholderTextColor
                    }}
                >
                    {label}
                </Text>
            </Pressable>
        )
    }

    return (
        <View
            className="absolute left-4 right-4"
            style={{
                bottom: insets.bottom + 8,
                height: verticalScale(56)
            }}
        >
            <View
                className="flex-1 flex-row items-center shadow-md"
                style={{
                    backgroundColor: COLORS.primaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    borderWidth: moderateScale(0.5),
                    borderRadius: moderateScale(22),
                    paddingHorizontal: moderateScale(8)
                }}
            >
                {visibleRoutes.slice(0, 2).map((route, index) =>
                    renderTab(route, state.routes.indexOf(route))
                )}

                <View style={{ width: moderateScale(55) }} />

                {visibleRoutes.slice(2, 4).map((route, index) =>
                    renderTab(route, state.routes.indexOf(route))
                )}
            </View>

            <Pressable
                onPress={() => navigation.navigate("order")}
                className="absolute items-center justify-center rounded-full"
                style={{
                    width: moderateScale(68),
                    height: moderateScale(68),
                    left: "50%",
                    marginLeft: -moderateScale(33),
                    top: -moderateScale(20),
                    paddingRight: moderateScale(3.5),
                    backgroundColor: COLORS.primaryColor,
                    borderWidth: moderateScale(3.5),
                    borderColor: COLORS.primaryBackgroundColor,
                    shadowColor: COLORS.primaryColor,
                    shadowOffset: { width: 0, height: 7 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 4,
                    zIndex: 100
                }}
            >
                <ShoppingBagIcon width={moderateScale(36)} height={moderateScale(36)} color={COLORS.primaryBackgroundColor} />
            </Pressable>
        </View>
    )
}