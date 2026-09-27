import HeartFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import SearchBar from "@/components/SearchBar"
import { FavoriteMenuItemResponse, FavoriteRestaurantResponse, getFavoriteMenuItems, getFavoriteRestaurants, removeMenuItemFromFavorites, removeRestaurantFromFavorites } from '@/Services/favorite-service'
import { useFavouriteStore } from '@/Stores/favourite-store'
import { useLocationStore } from '@/Stores/locationStore'
import { measureApi } from '@/utils/measureApiRes'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useState } from "react"
import { StatusBar, Text, useWindowDimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useCartStore } from '../../Stores/useCartStore'
import { MenuItem } from '../Home/components/FoodCard'
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import FavFoodCard, { FavFood } from "./Components/FavFoodCard"
import FavouriteTabs from './Components/FavouriteTabs'
import FavRestaurantCard, { FavRestaurant } from "./Components/FavRestaurantCard"

const TITLE_HEIGHT = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(46) 

export default function FavouritesScreen() {
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const params = useLocalSearchParams<{tab?: "restaurants" | "food"}>()
    const {showToast} = useToast()
    const location = useLocationStore(state => state.location)

    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"restaurants" | "food">("restaurants")
    const [favRestaurants, setFavRestaurants] = useState<FavRestaurant[]>([])
    const [favFoods, setFavFoods] = useState<FavFood[]>([])
    const [loadingFavourites, setLoadingFavourites] = useState(true)

    type FavouriteItem = FavRestaurant | FavFood

    const favouriteData = useMemo<FavouriteItem[]>(() => {
        return activeTab === "restaurants" ? favRestaurants : favFoods
    }, [activeTab, favRestaurants, favFoods])

    const fetchAllFavourites = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingFavourites(true)

            const [restaurantResult, foodResult] = await Promise.allSettled([
                measureApi(
                    "Favourite Restaurants",
                    () =>
                        getFavoriteRestaurants(
                            latitude,
                            longitude
                        )
                ),

                measureApi(
                    "Favourite Foods",
                    () =>
                        getFavoriteMenuItems(
                            latitude,
                            longitude
                        )
                )
            ])

            if (restaurantResult.status === "fulfilled" && restaurantResult.value.data.success) {
                const restaurantData = restaurantResult.value.data.data ?? []

                console.log("FAVOURITE RESTAURANTS:", restaurantData)

                const mappedRestaurants = restaurantData.map((item: FavoriteRestaurantResponse) => mapFavoriteRestaurant(item))

                setFavRestaurants(mappedRestaurants)
            }

            if (foodResult.status === "fulfilled" && foodResult.value.data.success) {
                const foodData = foodResult.value.data.data ?? []

                console.log("FAVOURITE FOODS:", foodData)

                const mappedFoods = foodData.map((item: FavoriteMenuItemResponse) => mapFavoriteMenuItem(item))

                setFavFoods(mappedFoods)
            }

            if (restaurantResult.status === "rejected") {
                console.log("Favourite restaurants error:", restaurantResult.reason)
            }

            if (foodResult.status === "rejected") {
                console.log("Favourite foods error:", foodResult.reason)
            }
        } finally {
            setLoadingFavourites(false)
        }
    },[])

    const mapFavoriteRestaurant = (item: FavoriteRestaurantResponse): FavRestaurant => ({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        imageUrl: item.cover_image_url ?? item.logo_url ?? null,
        rating: Number(item.rating ?? 0),
        deliveryFee: item.delivery_fee != null ? Number(item.delivery_fee) : null,
        deliveryTime: item.estimated_time_minutes ?? null,
        openingTime: item.opening_time,
        closingTime: item.closing_time,
        isOpen: item.is_open,
        isFavourite: true
    })

    const mapFavoriteMenuItem = (item: FavoriteMenuItemResponse): FavFood => {
        return {
            id: item.id,

            restaurant: {
                id: item.restaurant.id,
                name: item.restaurant.name,
                LogoUrl: item.restaurant.logo_url,
                isOpen: item.restaurant.is_open
            },
            name: item.name,
            imageUrl: item.image_url,
            description: item.description ?? "",
            category: item.category_name,
            price: Number(item.price ?? 0),
            preparationTime:
                item.estimated_time_minutes ??
                undefined,
            deliveryFee: item.delivery_fee != null
                ? String(item.delivery_fee)
                : undefined,
            isAvailable: item.is_available, 
            isVeg: item.is_veg,
            isFavourite: true
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (!location) {
                return
            }

            fetchAllFavourites(
                25.149131,
                73.083126
            )
        }, [location, fetchAllFavourites])
    )

    const {addRestaurant, removeRestaurant} = useFavouriteStore()

    const handleFavRestaurantPress = useCallback(async (id: string) => {
        const removedItem = favRestaurants.find(item => item.id === id)

        // Optimistically remove from screen
        setFavRestaurants(prev => prev.filter(item => item.id !== id))

        // Keep Zustand in sync
        removeRestaurant(id)

        try {
            const res = await removeRestaurantFromFavorites(id)

            console.log("Remove restaurant favourite:", res.data)

            if (!res.data.success) {
                throw new Error(res.data.message || "Unable to remove favourite.")
            }

            showToast("Removed from favourites.", "success")
        } catch (error: any) {
            console.log("Remove restaurant favourite error:", error)

            // Rollback Zustand
            addRestaurant(id)

            // Rollback UI
            if (removedItem) {
                setFavRestaurants(
                    prev => {
                        const alreadyExists = prev.some(item => item.id === id)

                        if (alreadyExists) {
                            return prev
                        }

                        return [
                            removedItem,
                            ...prev
                        ]
                    }
                )
            }

            showToast(error?.message || "Unable to remove favourite.","info")
        }
    },[
        favRestaurants,
        removeRestaurant,
        addRestaurant
    ])

    const handleRestaurantPress = useCallback((restaurantId: string, isOpen: boolean) => {
        // if (!isOpen) {
        //     showToast("Restaurant is currently closed", "info")

        //     return
        // }

        preventDoublePress(() => {
            router.push({
                pathname: "/restaurant-details",
                params: {
                    restaurantId: restaurantId
                }
            })
        })
    }, [preventDoublePress, router])

    const addToCart = useCartStore((state) => state.addToCart)

    const {addMenuItem, removeMenuItem} = useFavouriteStore() 
    
    const handleMenuFavouritePress = useCallback(async (id: string) => {
        const removedItem = favFoods.find(item => item.id === id)

        // Optimistically remove from screen
        setFavFoods(prev => prev.filter(item => item.id !== id))

        // Keep global favourite store in sync
        removeMenuItem(id)

        try {
            const res = await removeMenuItemFromFavorites(id)

            console.log("Remove menu favourite:", res.data)

            if (!res.data.success) {
                throw new Error(res.data.message || "Unable to remove favourite.")
            }

            showToast("Removed from favourites.", "success")
        } catch (error: any) {
            console.log("Remove menu favourite error:", error)

            // Rollback Zustand
            addMenuItem(id)

            // Rollback UI
            if (removedItem) {
                setFavFoods(prev => {
                    const alreadyExists = prev.some(item => item.id === id)

                    if (alreadyExists) {
                        return prev
                    }

                    return [
                        removedItem,
                        ...prev
                    ]
                })
            }

            showToast(error?.message || "Unable to remove favourite.", "info")
        }
    },[
        favFoods,
        removeMenuItem,
        addMenuItem
    ])

    const handleAddToCart = useCallback((item: MenuItem) => {
        if (!item.isAvailable) {
            showToast("This menu is currently unavailable", "info")

            return
        }

        if (!item.restaurant) {
            showToast("Restaurant not found", "info")

            return
        }

        if (!item.restaurant.isOpen) {
            showToast("Restaurant is currently closed", "info")

            return
        }

        addToCart({
            restaurant: {
                id: item.restaurant.id,
                restaurantName: item.restaurant.name,
                restaurantLogoUrl: item.restaurant.LogoUrl,
                deliveryFee: Number(item.deliveryFee) || 0,
                isOpen: item.restaurant.isOpen
            },

            item: {
                id: item.id,
                imageUrl: item.imageUrl,
                name: item.name,
                description: item.description,
                price: item.price,
                preparationTime: item.preparationTime,
                isAvailable: item.isAvailable
            }
        })

        showToast("Menu added to cart", "success")
    },[addToCart])

    const handleFoodPress = useCallback(
        (menuId: string) => {
            preventDoublePress(() => {
                router.push({
                    pathname: "/food-details",
                    params: {
                        menuId
                    }
                })
            })
        },
        [preventDoublePress, router]
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

    const renderFavouriteItem = useCallback(({ item }: {item: FavouriteItem}) => {
        if (activeTab === "restaurants") {
            const restaurant = item as FavRestaurant

            return (
                <View style={{ marginTop: moderateScale(14) }} >
                    <FavRestaurantCard
                        restaurant={restaurant}
                        isFavourite={true}
                        onPress={() => handleRestaurantPress(restaurant.id, restaurant.isOpen)}
                        onFavouritePress={() => handleFavRestaurantPress(restaurant.id)}
                    />
                </View>
            )
        }

        const food = item as FavFood

        return (
            <View style={{ marginTop: moderateScale(14), width: cardWidth }}>
                <FavFoodCard
                    item={food}
                    isFavourite={true}
                    onPress={() => handleFoodPress(food.id)}
                    onAddPress={() => handleAddToCart(food)}
                    onFavouritePress={() => handleMenuFavouritePress(food.id)}
                />
            </View>
        )
    },[
        activeTab, cardWidth,
        handleRestaurantPress,
        handleFavRestaurantPress,
        handleFoodPress,
        handleAddToCart,
        handleMenuFavouritePress
    ])

    const savedCount = activeTab === "restaurants"
        ? favRestaurants.length
        : favFoods.length

    const availableCount = activeTab === "restaurants"
        ? favRestaurants.filter(restaurant => restaurant.isOpen).length
        : favFoods.filter(food => food.isAvailable && food.restaurant.isOpen).length

    return (
        <SafeAreaView className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <Animated.View
                className="w-full bg-[#FFFFFF] absolute left-0 right-0"
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
                        placeholder="Search favourites..."
                    />
                </View>
            </Animated.View>

            {loadingFavourites ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        source={require(
                            "../../../assets/animations/Food_Loading2.json"
                        )}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(125),
                            height: moderateScale(125)
                        }}
                    />
                </View>
            ) : (
                <Animated.FlatList
                    ref={animatedRef}
                    key={activeTab}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    data={favouriteData}
                    numColumns={activeTab === "restaurants" ? 1 : 2}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFavouriteItem}
                    columnWrapperStyle={activeTab === "food" ? { gap } : undefined}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    contentContainerStyle={{
                        paddingHorizontal: scale(14),
                        paddingTop: titleHeight + searchBarHeight,
                        paddingBottom: verticalScale(88),
                        flexGrow: favouriteData.length === 0 ? 1 : undefined
                    }}
                    ListEmptyComponent={
                        <View
                            className="flex-1 w-full items-center justify-center"
                            style={{ paddingVertical: verticalScale(20) }}
                        >
                            <View
                                className=" w-full items-center justify-center mx-2 bg-[#FAFAFA] border-[#1F1F1F]/10"
                                style={{
                                    borderWidth: moderateScale(0.5),
                                    paddingHorizontal: scale(20),
                                    paddingVertical: verticalScale(24),
                                    borderRadius: moderateScale(20)
                                }}
                            >
                                <View
                                    className='bg-[#E8B93F]/15 rounded-full items-center justify-center'
                                    style={{
                                        width: moderateScale(46),
                                        height: moderateScale(46)
                                    }}
                                >
                                    <HeartFilledIcon width={moderateScale(24)} height={moderateScale(24)} color="#5A3825" />
                                </View>

                                <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    {activeTab === "restaurants"
                                        ? "No Favourite Restaurants"
                                        : "No Favourite Foods"}
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium text-center"
                                    style={{
                                        fontSize: moderateScale(11),
                                        marginTop: verticalScale(3)
                                    }}
                                >
                                    {activeTab === "restaurants"
                                        ? "Restaurants you save will appear here."
                                        : "Food items you save will appear here."}
                                </Text>
                            </View>
                        </View>
                    }
                    ListHeaderComponent={
                        <View style={{ marginTop: verticalScale(4) }}>
                            <View
                                style={{
                                    paddingHorizontal: scale(8),
                                    paddingBottom: verticalScale(12)
                                }}
                            >
                                <FavouriteTabs
                                    activeTab={activeTab}
                                    onChange={setActiveTab}
                                />
                            </View>
                    
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="bg-[#FAFAFA] justify-center border-[#1F1F1F]/10 py-4 px-5 gap-1"
                                    style={{
                                        borderWidth: moderateScale(0.5),
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
                                        {savedCount}
                                    </Text>
    
                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium"
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
                                        Available
                                    </Text>
    
                                    <Text
                                        className="text-[#FFFFFF] font-bold"
                                        style={{ fontSize: moderateScale(18) }}
                                    >
                                        {availableCount}
                                    </Text>
    
                                    <Text
                                        className="text-[#FFFFFF]/75 font-medium"
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        {activeTab === "food" ? "Foods Now" : "Restaurants Now"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    )
}