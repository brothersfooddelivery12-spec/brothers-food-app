import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import RestaurantCard from "@/components/RestaurantCard"
import SearchBar from "@/components/SearchBar"
import { RESTAURANTS } from '@/constant/RESTAURANTS'
import { recommendedItems } from "@/constant/RecommendedData"
import { restaurants } from "@/constant/RestaurantData"
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useCartStore } from '../../Stores/useCartStore'
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import RecommendedCard from "./Components/RecommendedCard"

const SEARCH_CATEGORIES = [
    "All",
    "Restaurants",
    "Food",
    "Offers",
    "Chinese",
    "South Indian",
    "Desserts",
]

const TRENDING_ITEMS = [
    { id: "1", title: "Biryani" },
    { id: "2", title: "Pizza" },
    { id: "3", title: "Burger" },
    { id: "4", title: "Paneer" },
    { id: "5", title: "Momos" },
    { id: "6", title: "Dosa" },
    { id: "7", title: "Thali" },
    { id: "8", title: "Chole Bhature" },
    { id: "9", title: "Noodles" },
    { id: "10", title: "Gulab Jamun" },
]

const RECENT_SEARCHES = [
    { id: "2", title: "Domino's Pizza" },
    { id: "3", title: "Paneer Tikka" },
    { id: "4", title: "Burger" },
    { id: "5", title: "South Indian" },
]

const TITLE_HEIGHT = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(46) 

export default function SearchScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()
    const {showToast} = useToast()
    const addToCart = useCartStore((state) => state.addToCart)

    const getRestaurantById = (restaurantId: string) => {
        return RESTAURANTS.find(
            (restaurant) => restaurant.id === restaurantId
        )
    }

    const [selectedCategory, setSelectedCategory] = useState("All")
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedTrending, setSelectedTrending] = useState("Trending")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)
        
        return () => clearTimeout(timer)
    }, [search])
    
    const handleRecommendedPress = useCallback(
        (item: any) => {
            console.log("Open:", item.name)
        }, []
    )

    const handleRecommendedAdd = useCallback(
        (item: any) => {
            if (!item.isActive) {
                showToast("This item is currently unavailable", "warning")

                return
            }

            const restaurant = getRestaurantById(item.restaurantId)

            if (!restaurant) {
                showToast("Restaurant not found", "warning")

                return
            }

            if (!restaurant.isActive) {
                showToast("Restaurant is currently closed", "warning")

                return
            }

            // addToCart({
            //     restaurant: {
            //         id: restaurant.id,
            //         restaurantName: restaurant.name,
            //         restaurantLogoUrl: restaurant.imageUri,
            //         deliveryTime: restaurant.deliveryTime,
            //         deliveryFee: restaurant.deliveryFee,
            //         isOpen: restaurant.isActive
            //     },

            //     item: {
            //         id: item.id,
            //         name: item.name,
            //         imageUrl: item.imageUri,
            //         price: item.price,
            //         description: item.category,
            //         isAvailable: item.isActive
            //     }
            // })

            showToast("added to cart", "success")
        },[addToCart]
    )

    const handleRestaurantPress = useCallback((id: string) => {
        console.log("Restaurant:", id)
    }, [])
    
    const handleFavouritePress = useCallback((id: string) => {
        console.log("Favourite:", id)
    }, [])

    const renderRestaurant = useCallback(({ item }: { item: any }) => (
        <View style={{ marginTop: moderateScale(12) }} >
            <RestaurantCard
                restaurant={item}
                onPress={() => handleRestaurantPress(item.id)}
                onFavouritePress={() => handleFavouritePress(item.id)}
            />
        </View>
    ),[handleRestaurantPress, handleFavouritePress])

    const renderRecommended = useCallback(({ item }: { item: any }) => (
        <RecommendedCard
            item={item}
            onPress={() => handleRecommendedPress(item)}
            onAddPress={() => {}}
        />
    ),[handleRecommendedPress, handleRecommendedAdd])

    const [titleHeight, setTitleHeight] = useState(TITLE_HEIGHT)
    const [searchBarHeight, setSearchBarHeight] = useState(SEARCH_BAR_HEIGHT)
    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y
        },
        onMomentumEnd: (event) => {
            const y = event.contentOffset.y
            if (y > 0 && y < titleHeight) {
                const shouldOpen = y < titleHeight / 2
                scrollTo(animatedRef, 0, shouldOpen ? 0 : titleHeight, true)
            }
        },
    })

    const headerContainerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, titleHeight],
            [0, -titleHeight],
            Extrapolation.CLAMP
        )
        return { transform: [{ translateY }] }
    })

    const headerTitleStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [0, titleHeight * 0.6],
            [1, 0],
            Extrapolation.CLAMP
        ),
    }))

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}
        >
            <StatusBar
                translucent
                backgroundColor={COLORS.primaryBackgroundColor}
                barStyle="dark-content"
            />

            <Animated.View
                className="w-full absolute left-0 right-0"
                style={[
                    {
                        top: insets.top,
                        paddingHorizontal: moderateScale(14),
                        zIndex: 10,
                        backgroundColor: COLORS.primaryBackgroundColor
                    },
                    headerContainerStyle,
                ]}
            >
                <Animated.View
                    style={headerTitleStyle}
                    onLayout={(e) => {
                        const h = e.nativeEvent.layout.height
                        if (h > 0 && Math.abs(h - titleHeight) > 1) {
                            setTitleHeight(h)
                        }
                    }}
                >
                    <Text
                        className="font-extrabold"
                        style={{
                            color: COLORS.primaryTextColor,
                            fontSize: moderateScale(18),
                            marginTop: verticalScale(10)
                        }}
                    >
                        Search
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            fontSize: moderateScale(12),
                            marginTop: verticalScale(2)
                        }}
                    >
                        Discover restaurants & cuisines
                    </Text>
                </Animated.View>

                <View
                    onLayout={(e) => {
                        const h = e.nativeEvent.layout.height
                        if (h > 0 && Math.abs(h - searchBarHeight) > 1) {
                            setSearchBarHeight(h)
                        }
                    }}
                    style={{
                        paddingTop: verticalScale(8),
                        paddingBottom: verticalScale(8)
                    }}
                >
                    <SearchBar
                        value={search}
                        onChangeText={setsearch}
                        showClear
                        placeholder="Search food, restaurants..."
                        onRightPress={() => {}}
                    />
                </View>
            </Animated.View>

            <Animated.FlatList
                ref={animatedRef}
                data={restaurants}
                keyExtractor={(item) => item.id}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingTop: titleHeight + searchBarHeight,
                    paddingBottom: verticalScale(88)
                }}
                ListHeaderComponent={
                    <View>
                        <View style={{ marginTop: verticalScale(4) }}>
                            <ScrollView
                                horizontal
                                nestedScrollEnabled
                                directionalLockEnabled
                                showsHorizontalScrollIndicator={false}
                                className="-mx-5"
                                contentContainerStyle={{
                                    paddingHorizontal: scale(14),
                                    gap: scale(10)
                                }}
                            >
                                {SEARCH_CATEGORIES.map((category) => {
                                    const isSelected = selectedCategory === category

                                    return (
                                        <TouchableOpacity
                                            key={category}
                                            activeOpacity={0.85}
                                            onPress={() => {
                                                setSelectedCategory(category)

                                                if (category === "Food") {
                                                    preventDoublePress(() => {
                                                        router.push({
                                                            pathname: "/food-search",
                                                            params: { category: "Food" }
                                                        })
                                                    })
                                                }

                                                if (category === "Restaurants") {
                                                    preventDoublePress(() => {
                                                        router.push({
                                                            pathname: "/restaurant-search",
                                                            params: { category: "Restaurants" }
                                                        })
                                                    })
                                                }
                                            }}
                                            className="items-center justify-center"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? COLORS.primaryColor
                                                    : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                                borderRadius: moderateScale(18),
                                                paddingHorizontal: scale(16),
                                                paddingVertical: verticalScale(7),
                                                borderWidth: 0.7,
                                                borderColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor
                                            }}
                                        >
                                            <Text
                                                className="font-semibold"
                                                style={{
                                                    fontSize: moderateScale(13),
                                                    color: isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                                }}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Trending Searches
                        </Text>

                        <FlatList
                            data={TRENDING_ITEMS}
                            keyExtractor={(item) => item.id}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-2"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(10),
                                paddingVertical: verticalScale(4)
                            }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => setSelectedTrending(item.title)}
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.55),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(16),
                                        paddingVertical: verticalScale(7)
                                    }}
                                >
                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <View style={{ marginTop: verticalScale(10) }}>
                            <View className="flex-row items-center">
                                <Text
                                    className="font-bold flex-1"
                                    style={{
                                        fontSize: moderateScale(15),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Recent Searches
                                </Text>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.primaryColor
                                        }}
                                    >
                                        Clear All
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                className="flex-row flex-wrap"
                                style={{ gap: scale(8), marginTop: verticalScale(10) }}
                            >
                                {RECENT_SEARCHES.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.85}
                                        onPress={() => setSelectedTrending(item.title)}
                                        className="flex-row items-center"
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            gap: moderateScale(5),
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(7)
                                        }}
                                    >
                                        <ClockIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryTextColor} strokeWidth={2} />

                                        <Text
                                            className="font-medium"
                                            style={{
                                                fontSize: moderateScale(12),
                                                color: COLORS.primaryTextColor
                                            }}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(18),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Recommended For You
                        </Text>

                        <FlatList
                            data={recommendedItems}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            className="-mx-5 mt-3"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: moderateScale(12)
                            }}
                            renderItem={renderRecommended}
                        />

                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(20),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Top Restaurants Near You
                        </Text>
                    </View>
                }
                renderItem={renderRestaurant}
            />
        </SafeAreaView>
    )
}