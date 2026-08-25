import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import MicIcon from '@/assets/icon/MicIcon.svg'
import RestaurantCard from "@/components/RestaurantCard"
import SearchBar from "@/components/SearchBar"
import { recommendedItems } from "@/constant/RecommendedData"
import { restaurants } from "@/constant/RestaurantData"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
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
            console.log("Add:", item.name)
        }, []
    )

    const handleRestaurantPress = useCallback((id: string) => {
        console.log("Restaurant:", id)
    }, [])
    
    const handleFavouritePress = useCallback((id: string) => {
        console.log("Favourite:", id)
    }, [])

    const renderRestaurant = useCallback(
        ({ item }: { item: any }) => (
            <View
                style={{ marginTop: moderateScale(12) }}
            >
                <RestaurantCard
                    {...item}
                    onPress={() =>
                        handleRestaurantPress(item.id)
                    }
                    onFavouritePress={() =>
                        handleFavouritePress(item.id)
                    }
                />
            </View>
        ),
        [
            handleRestaurantPress,
            handleFavouritePress,
        ]
    )

    const renderRecommended = useCallback(
        ({ item }: { item: any }) => (
            <RecommendedCard
                item={item}
                onPress={() => handleRecommendedPress(item)}
                onAddPress={() => handleRecommendedAdd(item)}
            />
        ),
        [
            handleRecommendedPress,
            handleRecommendedAdd,
        ]
    )

    const [titleHeight, setTitleHeight] = useState(TITLE_HEIGHT)
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <Animated.View
                className="w-full bg-[#F5F5F5] absolute left-0 right-0"
                style={[
                    {
                        top: insets.top,
                        paddingHorizontal: moderateScale(14),
                        zIndex: 10
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
                        className="text-[#1F1F1F] font-extrabold"
                        style={{
                            fontSize: moderateScale(18),
                            marginTop: verticalScale(10)
                        }}
                    >
                        Search
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{
                            fontSize: moderateScale(12),
                            marginTop: verticalScale(2)
                        }}
                    >
                        Discover restaurants & cuisines
                    </Text>
                </Animated.View>

                <View
                    style={{
                        marginTop: verticalScale(8),
                        marginBottom: verticalScale(10)
                    }}
                >
                    <SearchBar
                        value={search}
                        onChangeText={setsearch}
                        placeholder="Search food, restaurants..."
                        RightIcon={MicIcon}
                        rightIconColor="#3F2516"
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
                    paddingTop: SEARCH_BAR_HEIGHT,
                    paddingBottom: insets.bottom + verticalScale(75)
                }}
                ListHeaderComponent={
                    <View>
                        <View style={{ marginTop: verticalScale(65) }}>
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
                                            className={`items-center justify-center ${
                                                isSelected ? "bg-[#3F2516]" : "bg-[#faf5ef]"
                                            }`}
                                            style={{
                                                borderRadius: moderateScale(18),
                                                paddingHorizontal: scale(16),
                                                paddingVertical: verticalScale(7),
                                                borderWidth: isSelected ? 0 : 1,
                                                borderColor: "#E8DDD3"
                                            }}
                                        >
                                            <Text
                                                className={`font-semibold ${
                                                    isSelected ? "text-white" : "text-[#5A3825]"
                                                }`}
                                                style={{ fontSize: moderateScale(13) }}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(16), marginTop: verticalScale(15) }}
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
                            className="-mx-5 mt-3"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(10),
                                paddingVertical: verticalScale(4)
                            }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => setSelectedTrending(item.title)}
                                    className="items-center justify-center bg-[#E5E4E2]/85"
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(16),
                                        paddingVertical: verticalScale(7)
                                    }}
                                >
                                    <Text
                                        className="font-medium text-[#1F1F1F]"
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <View style={{ marginTop: verticalScale(10) }}>
                            <View className="flex-row items-center">
                                <Text
                                    className="text-[#1F1F1F] font-bold flex-1"
                                    style={{ fontSize: moderateScale(16) }}
                                >
                                    Recent Searches
                                </Text>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                                    <Text
                                        className="text-[#3F2516] font-bold"
                                        style={{ fontSize: moderateScale(14) }}
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
                                        className="flex-row items-center bg-white border border-[#1F1F1F]/10"
                                        style={{
                                            gap: moderateScale(5),
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(7)
                                        }}
                                    >
                                        <ClockIcon width={moderateScale(16)} height={moderateScale(16)} color="#1F1F1F" strokeWidth={2} />

                                        <Text
                                            className="font-medium text-[#1F1F1F]"
                                            style={{ fontSize: moderateScale(12) }}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(16), marginTop: verticalScale(20) }}
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
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(16), marginTop: verticalScale(20) }}
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