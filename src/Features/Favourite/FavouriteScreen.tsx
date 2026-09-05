import FilterIcon from '@/assets/icon/FIlterIcon.svg'
import SearchBar from "@/components/SearchBar"
import { recommendedItems } from "@/constant/RecommendedData"
import { restaurants } from "@/constant/RestaurantData"
import { RESTAURANTS } from '@/constant/RESTAURANTS'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from "react"
import { StatusBar, Text, useWindowDimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import { useCartStore } from '../Stores/useCartStore'
import FavFoodCard from "./Components/FavFoodCard"
import FavouriteTabs from "./Components/FavouriteTabs"
import FavRestaurantCard from "./Components/FavRestaurantCard"

const TITLE_HEIGHT_FALLBACK  = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(92) 

export default function FavouritesScreen() {
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const insets = useSafeAreaInsets()
    const params = useLocalSearchParams<{tab?: "restaurants" | "food"}>()
    const {showToast} = useToast()

    const addToCart = useCartStore((state) => state.addToCart)

    const getRestaurantById = (restaurantId: string) => {
        return RESTAURANTS.find(
            (restaurant) => restaurant.id === restaurantId
        )
    }

    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"restaurants" | "food">("restaurants")
    const [favFoods, setFavFoods] = useState(
        recommendedItems.map((item) => ({
            ...item, isFavourite: true
        }))
    )
    const [favRestaurants, setFavRestaurants] = useState(
        restaurants.map((item) => ({
            ...item, isFavourite: true
        }))
    )

    useEffect(() => {
        if(
            params.tab === "restaurants" || params.tab === "food"
        ) {
            setActiveTab(params.tab)
        }
    },[params.tab])

    const horizontalPadding = scale(28)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 2

    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()
    const [titleHeight, setTitleHeight] = useState(TITLE_HEIGHT_FALLBACK)
    const [headerHeight, setHeaderHeight] = useState(SEARCH_BAR_HEIGHT + verticalScale(68))
    const scrollY = useSharedValue(0)

    const headerOffset = useSharedValue(0)
    const previousScrollY = useSharedValue(0)

    useEffect(() => {
        headerOffset.value = 0
        previousScrollY.value = 0
        scrollY.value = 0
    }, [
        activeTab,
        headerOffset,
        previousScrollY,
        scrollY
    ])

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const currentY = Math.max(
                event.contentOffset.y,
                0
            )

            scrollY.value = currentY

            if (currentY <= 1) {
                headerOffset.value = withTiming(
                    0,
                    {
                        duration: 180
                    }
                )

                return
            }

            headerOffset.value = withTiming(
                titleHeight,
                {
                    duration: 180
                }
            )
        }
    })

    const headerContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: -headerOffset.value
                }
            ]
        }
    })

    const headerTitleStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            headerOffset.value,
            [
                0,
                titleHeight * 0.7
            ],
            [1, 0],
            Extrapolation.CLAMP
        )
    }))

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

    const handleRestaurantPress = useCallback((id: string) => {
        console.log("Restaurant:", id)
    }, [])

    const handleFavRestaurantPress = useCallback((id: string) => {
       setFavRestaurants(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        isFavourite: !item.isFavourite,
                    }
                    : item
            )
        )
    }, [])

    const handleFoodPress = useCallback((id: string) => {
        console.log("Restaurant:", id)
    }, [])

    const handleFavFoodPress = useCallback((id: string) => {
        setFavFoods(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        isFavourite: !item.isFavourite,
                    }
                    : item
            )
        )
    }, [])

    const handleFoodAdd = useCallback(
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

            addToCart({
                restaurant: {
                    id: restaurant.id,
                    restaurantName: restaurant.name,
                    restaurantImage: restaurant.imageUri,
                    deliveryTime: restaurant.deliveryTime,
                    deliveryFee: restaurant.deliveryFee,
                    isActive: restaurant.isActive
                },

                item: {
                    id: item.id,
                    name: item.name,
                    image: item.imageUri,
                    price: item.price,
                    description: item.category,
                    isActive: item.isActive
                }
            })

            showToast("added to cart", "success")
        },[addToCart]
    )

    const renderRestaurant = useCallback(
        ({ item }: { item: any }) => (
            <View style={{ marginTop: moderateScale(14) }}>
                <FavRestaurantCard
                    item={item}
                    onPress={() => handleRestaurantPress(item.id)}
                    onFavouritePress={() => handleFavRestaurantPress(item.id)}
                />
            </View>
        ),
        [handleRestaurantPress, handleFavRestaurantPress]
    )

    const renderFood = useCallback(
        ({ item }: { item: any }) => (
            <View style={{ marginTop: moderateScale(14), width: cardWidth }}>
                <FavFoodCard
                    item={item}
                    onPress={() => handleFoodPress(item.id)}
                    onAddPress={() => {}}
                    onFavouritePress={() => handleFavFoodPress(item.id)}
                />
            </View>
        ),
        [handleFavFoodPress, handleFoodAdd, handleFoodPress]
    )

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <Animated.View
                onLayout={(event) => {
                    const height = event.nativeEvent.layout.height

                    if (height > 0 && Math.abs(height - headerHeight) > 1) {
                        setHeaderHeight(height)
                    }
                }}
                className="w-full bg-[#F5F5F5] absolute left-0 right-0"
                style={[
                    {
                        paddingHorizontal: scale(14),
                        top: insets.top,
                        zIndex: 10
                    },
                    headerContainerStyle
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
                    <View className="gap-1">
                        <Text
                            className="text-[#1F1F1F] font-extrabold self-start"
                            style={{
                                fontSize: moderateScale(18),
                                marginTop: verticalScale(10)
                            }}
                        >
                            Favourites
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/65 font-medium self-start"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Your favourite restaurants & foods
                        </Text>
                    </View>
                </Animated.View>

                <View
                    style={{ marginTop: verticalScale(8) }}
                >
                    <SearchBar
                        value={search}
                        onChangeText={setsearch}
                        placeholder="Search favourites"
                        RightIcon={FilterIcon}
                        rightIconColor="#1F1F1F"
                        onRightPress={() => {}}
                    />
                </View>

                <View
                    style={{
                        paddingHorizontal: scale(8),
                        paddingTop: verticalScale(12),
                        paddingBottom: verticalScale(6)
                    }}
                >
                    <FavouriteTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                </View>
            </Animated.View>

            <Animated.FlatList
                ref={animatedRef}
                key={activeTab}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                data={activeTab === "restaurants" ? favRestaurants : favFoods}
                numColumns={activeTab === "restaurants" ? 1 : 2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={activeTab === "restaurants" ? renderRestaurant : renderFood}
                columnWrapperStyle={activeTab === "food" ? { gap } : undefined}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingTop: headerHeight,
                    paddingBottom: verticalScale(88)
                }}
                ListHeaderComponent={
                   <View style={{ marginTop: verticalScale(8) }}>
                        <View className="flex-row items-center gap-3">
                            <View
                                className="bg-white justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-1"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(95),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-medium"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Saved
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(18) }}
                                >
                                    18
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/85 font-semibold"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    {activeTab == "food" ? "Foods" : "Restaurants"}
                                </Text>
                            </View>

                            <View
                                className="bg-[#3F2516] py-4 px-5 gap-1 justify-center"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(95),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#FFFFFF]/95 font-medium"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Ordered
                                </Text>

                                <Text
                                    className="text-[#FFFFFF] font-bold"
                                    style={{ fontSize: moderateScale(18) }}
                                >
                                    124
                                </Text>

                                <Text
                                    className="text-[#FFFFFF]/75 font-semibold"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Times Again
                                </Text>
                            </View>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    )
}