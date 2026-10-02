import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import ArrowUpIcon from '@/assets/icon/ArrowUpIcon.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import LocateFixedIcon from '@/assets/icon/LocateFixedIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import NotificationIcon from '@/assets/icon/NotificationIcon.svg'
import RestaurantIcon from '@/assets/icon/RestaurantFilledIcon.svg'
import SearchIcon from '@/assets/icon/SearchOutline.svg'
import FloatingCartBar from '@/components/FloatingCartBar'
import { LoadingDots } from '@/components/LoadingDots'
import RestaurantCard, { Restaurants } from "@/components/RestaurantCard"
import VegNonVegToggle, { FoodType } from '@/components/VegNonVegToggle'
import { offers } from "@/constant/OffersCardData"
import BannerCarousel from "@/Features/Home/components/BannerCarousel"
import FoodCard, { MenuItem } from "@/Features/Home/components/FoodCard"
import NearByRestaurantsList, { NearByRestaurants } from "@/Features/Home/components/NearByRestaurants"
import OfferCard from "@/Features/Home/components/OffersCard"
import { getCurrentLocationDetails } from '@/utils/getCurrentLocation'
import { measureApi } from '@/utils/measureApiRes'
import { Image } from "expo-image"
import * as Location from "expo-location"
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, FlatList, Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Animated, { FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { Advertisement, Category, getAdvertisements, getCategories, getNearbyRestaurants, getPopularMenu, getPopularRestaurants, getUserProfile, NearbyRestaurant, PopularMenu, PopularRestaurant } from '../../Services/api-service'
import { addMenuItemToFavorites, addRestaurantToFavorites, getFavoriteMenuItems, getFavoriteRestaurants, removeMenuItemFromFavorites, removeRestaurantFromFavorites } from '../../Services/favorite-service'
import { useAuthStore } from '../../Stores/auth-store'
import { useFavouriteStore } from '../../Stores/favourite-store'
import { useLocationStore } from '../../Stores/locationStore'
import { useCartStore } from '../../Stores/useCartStore'
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'

const DEFAULT_BOTTOM_PADDING = verticalScale(88)
const FLOATING_CART_SPACE = verticalScale(75)

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export type LocationPermissionState = "checking" | "granted" | "denied" | "services-disabled"

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const { height: screenHeight } = useWindowDimensions()
    const preventDoublePress = usePreventDoublePress()
    const {showToast} = useToast()

    // const checkAccessToken = async () => {
    //     const token = await tokenStorage.getAccessToken()

    //     console.log("Token:", token)
    // }

    // checkAccessToken()

    // const userId = useAuthStore(
    //     state => state.user?.id
    // )
    // console.log("User ID:", userId)

    const carts = useCartStore(state => state.carts)

    const hasCartItems = useMemo(() => {
        return carts.some(cart => cart.items.length > 0)
    }, [carts])
    
    const [headerHeight, setHeaderHeight] = useState(0)
    const [showBackToTop, setShowBackToTop] = useState(false)

    const listRef = useRef<FlatList>(null)
    const previousScrollY = useRef(0)
    const backToTopVisibleRef = useRef(false)
    const hideBackToTopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const setBackToTopVisible = useCallback((visible: boolean) => {
        if (backToTopVisibleRef.current === visible) {
            return
        }

        backToTopVisibleRef.current = visible

        setShowBackToTop(visible)
    },[])

    const scheduleBackToTopHide = useCallback(() => {
        if (hideBackToTopTimer.current) {
            clearTimeout(hideBackToTopTimer.current)
        }

        hideBackToTopTimer.current = setTimeout(() => {
            setBackToTopVisible(false)
        }, 1200)
    }, [setBackToTopVisible])

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentY = Math.max(event.nativeEvent.contentOffset.y, 0)
        const previousY = previousScrollY.current
        const difference = currentY - previousY

        const SHOW_AFTER = 400
        const DIRECTION_THRESHOLD = 2

        // Near top → always hide
        if (currentY < SHOW_AFTER) {
            if (hideBackToTopTimer.current) {
                clearTimeout(hideBackToTopTimer.current)
            }

            setBackToTopVisible(false)

            previousScrollY.current = currentY

            return
        }

        // Scrolling DOWN → show
        if (difference > DIRECTION_THRESHOLD) {
            setBackToTopVisible(true)

            // Keep resetting while scrolling
            scheduleBackToTopHide()
        }

        // Scrolling UP → hide immediately
        if (difference < -DIRECTION_THRESHOLD) {
            if (hideBackToTopTimer.current) {
                clearTimeout(hideBackToTopTimer.current)
            }

            setBackToTopVisible(false)
        }

        previousScrollY.current = currentY
    },[scheduleBackToTopHide, setBackToTopVisible])

    useEffect(() => {
        return () => {
            if (hideBackToTopTimer.current) {
                clearTimeout(hideBackToTopTimer.current)
            }
        }
    }, [])

    const fetchUserProfile = useCallback(async () => {
        try {
           const res = await getUserProfile()

            if (!res.data.success) {
                return
            }

            const profile = res.data.data
            const currentUser = useAuthStore.getState().user

            useAuthStore
                .getState()
                .updateUser({
                    ...(profile.id && {
                        id: profile.id
                    }),

                    name: profile.name ?? currentUser?.name ?? "",
                    email: profile.email ?? currentUser?.email ?? "",
                    phone: profile.phone ?? currentUser?.phone ?? null,
                    profileImage: profile.image_url ?? currentUser?.profileImage,
                    isActive: profile.is_active ?? currentUser?.isActive ?? true,
                    role: profile.role ?? currentUser?.role ?? "USER"
                })
        } catch (error: any) {
            console.log("Fetch profile error:", error)
        }
    }, [])

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const syncFavourites = async () => {
        try {
            const [restaurantRes, menuItemRes] = await Promise.allSettled([
                getFavoriteRestaurants(25.149131,73.083126), 
                getFavoriteMenuItems(25.149131,73.083126)
            ])

            const {setRestaurantIds, setMenuItemIds} = useFavouriteStore.getState()

            if (restaurantRes.status === "fulfilled" && restaurantRes.value.data.success) {
                console.log("Favorite restaurants response:", restaurantRes.value.data)

                const ids = restaurantRes.value.data.data.map((item: any) => item.id)

                console.log("Favorite restaurant IDs:", ids)

                setRestaurantIds(ids)
            }

            if (menuItemRes.status === "fulfilled" && menuItemRes.value.data.success) {
                console.log("Favorite menus response:", menuItemRes.value.data)

                const ids = menuItemRes.value.data.data.map((item: any) => item.id)
                
                console.log("Favorite menu IDs:", ids)

                setMenuItemIds(ids)
            }
        } catch (error) {
            console.log("Sync favourites error:", error)
        }
    }

    useEffect(() => {
        syncFavourites()
    },[])

    const [locationLoading, setLocationLoading] = useState(false)
    const [locationPermission, setLocationPermission] = useState<LocationPermissionState>("checking")
    
    const location = useLocationStore(state => state.location)
    const setLocation = useLocationStore(state => state.setLocation)
    const hasHydrated = useLocationStore(state => state.hasHydrated)

    const handleUseCurrentLocation = useCallback(async (showSuccessToast = true) => {
        if (locationLoading) return

        try {
            setLocationLoading(true)

            const currentLocation = await getCurrentLocationDetails()

            console.log("Location Details:", currentLocation)

            setLocation({
                latitude: currentLocation.latitude, 
                longitude: currentLocation.longitude,
                name: currentLocation.addressLine ||
                    currentLocation.area ||
                    currentLocation.city,
                source: "CURRENT"
            })

            setLocationPermission("granted")

            if (showSuccessToast) {
                //showToast("Current location detected successfully.", "success")
            }
        } catch (error) {
            console.log("Location Error:", error)

            const servicesEnabled = await Location.hasServicesEnabledAsync()

            if (!servicesEnabled) {
                setLocationPermission("services-disabled")

                return
            }

            const permission = await Location.getForegroundPermissionsAsync()

            if (permission.status !== "granted") {
                setLocationPermission("denied")

                return
            }

            showToast(error instanceof Error ? error.message : "Unable to get your location.", "info")
        } finally {
            setLocationLoading(false)
        }
    },[locationLoading, setLocation])

    const handleLocationAccess = useCallback(async () => {
        try {
            let permission = await Location.getForegroundPermissionsAsync()

            if (permission.status !== "granted") {
                if (permission.canAskAgain) {
                    permission = await Location.requestForegroundPermissionsAsync()
                } else {
                    setLocationPermission("denied")

                    Alert.alert(
                        "Location Permission Required",
                        "Allow location access from Settings to find restaurants near you.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings()
                            }
                        ]
                    )

                    return
                }
            }

            if (permission.status !== "granted") {
                setLocationPermission("denied")

                return
            }

            if (Platform.OS === "android") {
                try {
                    await Location.enableNetworkProviderAsync()

                    // Important:
                    // let Android location provider
                    // start after user taps "Turn on"
                    await sleep(400)
                } catch (error) {
                    console.log("Location enable cancelled:", error)

                    return
                }
            }

            const servicesEnabled = await Location.hasServicesEnabledAsync()

            if (!servicesEnabled) {
                setLocationPermission("services-disabled")

                if (Platform.OS === "ios") {
                    Alert.alert(
                        "Turn On Location",
                        "Please turn on Location Services to find restaurants near you.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings()
                            }
                        ]
                    )
                }

                return
            }

            await handleUseCurrentLocation()
        } catch (error) {
            console.log("Location access error:", error)
        }
    }, [handleUseCurrentLocation])

    const openLocationSelector = useCallback(() => {
        preventDoublePress(() => {
            router.push(
                "/select-location"
            )
        })
    }, [preventDoublePress, router])

    const handleLocationPress = useCallback(() => {
        if (location) {
            openLocationSelector()
            return
        }

        handleLocationAccess()
    }, [location, openLocationSelector, handleLocationAccess])

    const getLocationTitle = () => {
        if (!hasHydrated) {
            return "Loading location"
        }

        if (locationLoading) {
            return "Detecting location"
        }

        if (location?.name) {
            return location.name
        }

        return "Select location"
    }

    const locationTitle = getLocationTitle()
    const showLoadingDots = !hasHydrated || locationLoading

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
    const [categories, setCategories] = useState<Category[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)

    const fetchCategories = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingCategories(true)

            const res = await getCategories(latitude, longitude)

            console.log("Categories response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch categories", "warning")

                return
            }

            setCategories(res.data.data ?? [])
        } catch (error: any) {
            console.log("Fetch categories error:", error)

            showToast(error?.message || "Unable to fetch categories", "warning")
        } finally {
            setLoadingCategories(false)
        }
    }, [])

    const categoriesWithAll = useMemo(() => {
        return [
            {
                id: "all",
                name: "All",
                restaurant_id: "",
                description: "",
                is_active: true,
                created_at: "",
                updated_at: ""
            },
            ...categories
        ]
    }, [categories])

    const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
    const [loadingAdvertisements, setLoadingAdvertisements] = useState(false)

    const fetchAdvertisements = useCallback(async () => {
        try {
            setLoadingAdvertisements(true)

            const res = await getAdvertisements()

            console.log("Advertisements response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch advertisements", "warning")

                return
            }

            setAdvertisements(res.data.data ?? [])
        } catch (error: any) {
            console.log("Fetch advertisements error:", error)

            showToast(error?.message || "Unable to fetch advertisements", "warning")
        } finally {
            setLoadingAdvertisements(false)
        }
    }, [])

    const [popularRestaurants, setPopularRestaurants] = useState<Restaurants[]>([])
    const [loadingPopularRestaurants, setLoadingPopularRestaurants] = useState(false)

    const fetchPopularRestaurants = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingPopularRestaurants(true)

            const res = await getPopularRestaurants(latitude, longitude)

            console.log("Popular restaurants response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch popular restaurants", "warning")

                return
            }

            const restaurantData: PopularRestaurant[] = res.data.data ?? []

            const mappedRestaurants: Restaurants[] = restaurantData.map((item) => ({
                    id: item.id,
                    name: item.name,
                    imageUrl: item.cover_image_url ||
                        item.logo_url || null,
                    cuisines: item.description ?? "",
                    rating: Number(item.rating) || 0,
                    deliveryFee: item.delivery_fee != null
                        ? Number(item.delivery_fee)
                        : null,
                    deliveryTime: item.estimated_time_minutes ?? null,
                    distance: item.distance != null
                        ? `${item.distance} km`
                        : null,
                    discount: item.discount ?? null,
                    priceForTwo: item.price_for_two ?? null,
                    openingTime: item.opening_time,
                    closingTime: item.closing_time,
                    isOpen: item.is_open
                })
            )

            setPopularRestaurants(mappedRestaurants)
        } catch (error: any) {
            console.log("Popular restaurants error:", error)

            showToast(error?.message || "Unable to fetch popular restaurants", "warning")
        } finally {
            setLoadingPopularRestaurants(false)
        }
    }, [])

    const [popularMenu, setPopularMenu] = useState<MenuItem[]>([])
    const [loadingPopularMenu, setLoadingPopularMenu] = useState(false)

    const fetchPopularMenu = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingPopularMenu(true)

            const res = await getPopularMenu(latitude, longitude)

            console.log("Popular menu response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch popular menu", "warning")

                return
            }

            const PopularMenuData: PopularMenu[] = res.data.data ?? []

            const mappedPopularMenu: MenuItem[] = PopularMenuData.map((item) => ({
                    id: item.id,
                    restaurant: {
                        id: item.restaurant.id,
                        name: item.restaurant.name,
                        LogoUrl: item.restaurant.logo_url ?? null,
                        isOpen: item.restaurant.is_open
                    },
                    name: item.name,
                    description: item.description ?? "",
                    imageUrl: item.image_url || null,
                    price: Number(item.price),
                    preparationTime: item.estimated_time_minutes,
                    deliveryFee: item.delivery_fee,
                    isAvailable: item.is_available,
                    isVeg: item.is_veg
                })
            )

            setPopularMenu(mappedPopularMenu)
        } catch (error: any) {
            console.log("Popular menu error:", error)

            showToast(error?.message || "Unable to fetch popular menu", "warning")
        } finally {
            setLoadingPopularMenu(false)
        }
    }, [])

    const [nearbyRestaurants, setNearbyRestaurants] = useState<NearByRestaurants[]>([])
    const [loadingNearby, setLoadingNearby] = useState(false)

    const fetchNearbyRestaurants = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingNearby(true)

            const res = await getNearbyRestaurants(latitude, longitude)

            console.log("Nearby restaurants response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch nearby restaurants", "warning")

                return
            }

            const restaurantData: NearbyRestaurant[] = res.data.data ?? []

            const mappedRestaurants: NearByRestaurants[] = restaurantData.map((item) => ({
                    id: item.id,
                    name: item.name,
                    imageUrl: item.logo_url || null,
                    cuisines: item.description ?? "",
                    rating: Number(item.rating) || 0,
                    distance: item.distance != null
                        ? `${item.distance} km`
                        : null,
                    discount: item.discount ?? null,
                    priceForTwo: item.price_for_two ?? null,
                    isOpen: item.is_open
                })
            )

            setNearbyRestaurants(mappedRestaurants)
        } catch (error: any) {
            console.log("Nearby restaurants error:", error)

            showToast(error?.message || "Unable to fetch nearby restaurants", "warning")
        } finally {
            setLoadingNearby(false)
        }
    },[])

    const [loadingHome, setLoadingHome] = useState(true)

    const fetchHomeData = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingHome(true)

            setAdvertisements([])
            setCategories([])
            setPopularRestaurants([])
            setPopularMenu([])
            setNearbyRestaurants([])

            await Promise.allSettled([
                measureApi(
                    "Categories",
                    () =>
                        fetchCategories(
                            latitude,
                            longitude
                        )
                ),
                measureApi(
                    "Advertisements",
                    fetchAdvertisements
                ),
                measureApi(
                    "Popular Restaurants",
                    () =>
                        fetchPopularRestaurants(
                            latitude,
                            longitude
                        )
                ),
                measureApi(
                    "Popular Menu",
                    () =>
                        fetchPopularMenu(
                            latitude,
                            longitude
                        )
                ),
            ])

            setLoadingHome(false)

            Promise.allSettled([
                measureApi(
                    "Nearby Restaurants",
                    () =>
                        fetchNearbyRestaurants(
                            latitude,
                            longitude
                        )
                )
            ])
        } catch (error) {
            console.log("Home fetch error:", error)

            setLoadingHome(false)
        }
    },
    [
        fetchAdvertisements,
        fetchCategories,
        fetchNearbyRestaurants,
        fetchPopularMenu,
        fetchPopularRestaurants
    ])

    useEffect(() => {
        if (!hasHydrated || !location) {
            return
        }

        void fetchHomeData(
            location.latitude,
            location.longitude
        )
    },[
        hasHydrated,
        location?.latitude,
        location?.longitude,
        fetchHomeData
    ])

    const hasHomeData =
        categories.length > 0 ||
        popularRestaurants.length > 0 ||
        popularMenu.length > 0

    const showEmptyHome = !loadingHome && !hasHomeData
        
    // useFocusEffect(
    //     useCallback(() => {
            
    //     }, [
    //         hasHydrated,
    //         location?.latitude,
    //         location?.longitude,
    //         fetchHomeData
    //     ])
    // )

    const user = useAuthStore((state) => state.user)

    const getGreeting = () => {
        const hour = new Date().getHours()

        if (hour < 12) {
            return "Good Morning"
        }

        if (hour < 17) {
            return "Good Afternoon"
        }

        return "Good Evening"
    }

    const firstName = user?.name?.trim().split(/\s+/)[0] || "User"

    const vegMode = useAuthStore((state) => state.user?.vegMode ?? false)
    const updateUser = useAuthStore((state) => state.updateUser)

    const foodType: FoodType = vegMode ? "veg" : "nonveg"

    const handleFoodTypeChange = (value: FoodType) => {
        updateUser({ vegMode: value === "veg" })
    }

    const addToCart = useCartStore((state) => state.addToCart)

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

    const {restaurantIds, addRestaurant, removeRestaurant} = useFavouriteStore()

    const handleFavouritePress = useCallback(async (id: string) => {
        const isFavourite = useFavouriteStore.getState().restaurantIds.includes(id)

        if (isFavourite) {
            removeRestaurant(id)
        } else {
            addRestaurant(id)
        }

        try {
            const res = isFavourite
                ? await removeRestaurantFromFavorites(id)
                : await addRestaurantToFavorites(id)

            console.log("Favourite response:", res.data)

            if (!res.data.success) {
                if (isFavourite) {
                    addRestaurant(id)
                } else {
                    removeRestaurant(id)
                }

                showToast(res.data.message || "Unable to update favourite.", "info")

                return
            }

            showToast(isFavourite
                ? "Removed from favourites."
                : "Added to favourites.", "success"
            )
        } catch (error: any) {
            console.log("Favourite error:", error)

            if (isFavourite) {
                addRestaurant(id)
            } else {
                removeRestaurant(id)
            }

            showToast(error?.message || "Unable to update favourite.", "info")
        }
    }, [addRestaurant, removeRestaurant])
 
    const {menuItemIds, addMenuItem, removeMenuItem} = useFavouriteStore() 

    const handleMenuFavouritePress = useCallback(async (id: string) => {
        const isFavourite = useFavouriteStore.getState().menuItemIds.includes(id)

        if (isFavourite) {
            removeMenuItem(id)
        } else {
            addMenuItem(id)
        }

        try {
            const res = isFavourite
                ? await removeMenuItemFromFavorites(id)
                : await addMenuItemToFavorites(id)

            console.log("Menu favourite response:", res.data)

            if (!res.data.success) {
                if (isFavourite) {
                    addMenuItem(id)
                } else {
                    removeMenuItem(id)
                }

                showToast(res.data.message || "Unable to update favourite.", "info")

                return
            }

            showToast(isFavourite
                ? "Removed from favourites."
                : "Added to favourites.", "success"
            )
        } catch (error: any) {
            console.log("Menu favourite error:", error)

            if (isFavourite) {
                addMenuItem(id)
            } else {
                removeMenuItem(id)
            }

            showToast(error?.message || "Unable to update favourite.", "info")
        }
    }, [addMenuItem, removeMenuItem])

    const handleAddToCart = useCallback((item: MenuItem) => {
        console.log("Menu item:", item)
        console.log("Preparation time:", item.preparationTime)

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

    const renderPopularFood = useCallback(({ item }: { item: MenuItem }) => {
        const isFavourite = menuItemIds.includes(item.id)

        return (
            <FoodCard
                item={item}
                isFavourite={isFavourite}
                onPress={() => handleFoodPress(item.id)}
                onAddPress={() => handleAddToCart(item)}
                onFavouritePress={() => handleMenuFavouritePress(item.id)}
            />
        )
    },[
        menuItemIds,
        handleFoodPress,
        handleAddToCart,
        handleMenuFavouritePress
    ])

    const renderNearbyRestaurant = useCallback(({ item }: { item: NearByRestaurants }) => {
        return (
            <NearByRestaurantsList
                restaurant={item}
                onPress={() => {
                    handleRestaurantPress(item.id, item.isOpen)
                }}
            />
        )
    },[handleRestaurantPress])

    const renderLocationRequired = () => (
        <View
            className="items-center justify-center"
            style={{
                minHeight: screenHeight - headerHeight - verticalScale(100),
                paddingHorizontal: scale(25)
            }}
        >
            <LocationIcon width={moderateScale(50)} height={moderateScale(50)} color="#3F2516" />

            <Text
                className="font-extrabold text-[#1F1F1F] text-center"
                style={{
                    fontSize: moderateScale(17),
                    marginTop: verticalScale(8)
                }}
            >
                Select Your Location
            </Text>

            <Text
                className="font-medium text-[#1F1F1F]/65 text-center"
                style={{
                    fontSize: moderateScale(11),
                    lineHeight: moderateScale(16),
                    marginTop: verticalScale(4)
                }}
            >
                Choose your location to discover restaurants
                and food available near you.
            </Text>

            <TouchableOpacity
                activeOpacity={0.95} 
                onPress={handleLocationAccess}
                disabled={locationLoading}
                className="w-full flex-row gap-2 bg-[#3F2516] items-center justify-center"
                style={{
                    marginTop: verticalScale(10),
                    height: verticalScale(40),
                    borderRadius: moderateScale(22)
                }}
            >
                {locationLoading ? (
                    <LottieView
                        source={require("../../../assets/animations/Loading.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(52),
                            height: moderateScale(52)
                        }}
                    />
                ) : (
                    <>
                        <LocateFixedIcon width={moderateScale(22)} height={moderateScale(22)} color="#FFFFFF" strokeWidth={1.5} />

                        <Text
                            className="tracking-wide font-semibold text-[#FFFFFF]"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Use Current Location
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.95}
                onPress={openLocationSelector}
                className='w-full bg-[#FAFAFA] border-[#1F1F1F]/10 items-center justify-center'
                style={{
                    borderWidth: moderateScale(0.5),
                    marginTop: verticalScale(14),
                    height: verticalScale(40),
                    borderRadius: moderateScale(22)
                }}
            >
                <Text
                    className="font-bold text-[#1F1F1F]"
                    style={{ fontSize: moderateScale(14) }}
                >
                    Select Manually
                </Text>
            </TouchableOpacity>
        </View>
    )

    return(
        <SafeAreaView className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            {!hasHydrated ? (
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
                <>
                    <FlatList
                        ref={listRef}
                        data={location && !loadingHome ? nearbyRestaurants : []}
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled
                        onScroll={handleScroll}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: scale(14),
                            paddingBottom: DEFAULT_BOTTOM_PADDING + (hasCartItems ? FLOATING_CART_SPACE : 0),
                            gap: verticalScale(10)
                        }}
                        ListHeaderComponent={
                            <>
                                <View
                                    onLayout={(event) => {
                                        setHeaderHeight(event.nativeEvent.layout.height)
                                    }}
                                >
                                    <View
                                        className="flex-row items-center w-full"
                                        style={{ marginTop: verticalScale(10),gap: scale(8) }}
                                    >
                                        <View className="flex-1 min-w-0">
                                            <Text
                                                className="text-[#1F1F1F]/65 font-medium"
                                                style={{ fontSize: moderateScale(13) }}
                                            >
                                                {getGreeting()}, {firstName}
                                            </Text>
            
                                            <TouchableOpacity
                                                activeOpacity={0.95}
                                                className="flex-row items-center"
                                                style={{
                                                    marginTop: verticalScale(2),
                                                    marginLeft: -verticalScale(4),
                                                    minWidth: 0
                                                }}
                                                onPress={handleLocationPress}
                                            >
                                                <View style={{ flexShrink: 0 }}>
                                                    <LocationIcon width={moderateScale(23)} height={moderateScale(23)} color="#3F2516" />
                                                </View>
            
                                                <Animated.View
                                                    key={locationTitle}
                                                    entering={
                                                        FadeInDown
                                                            .duration(200)
                                                            .withInitialValues({
                                                                opacity: 0,
                                                                transform: [
                                                                    { translateY: -4 }
                                                                ]
                                                            })
                                                    }
                                                    exiting={
                                                        FadeOutUp.duration(250)
                                                    }
                                                    className="flex-row items-center"
                                                    style={{
                                                        flexShrink: 1,
                                                        minWidth: 0
                                                    }}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        className="text-[#3F2516] font-extrabold"
                                                        style={{
                                                            fontSize: moderateScale(15.5),
                                                            flexShrink: 1,
                                                            marginLeft: scale(2)
                                                        }}
                                                    >
                                                        {locationTitle}
                                                    </Text>
                                                    
                                                    {showLoadingDots && (
                                                        <LoadingDots />
                                                    )}
                                                    
                                                    {!locationLoading && (
                                                        <View
                                                            style={{
                                                                flexShrink: 0,
                                                                marginLeft: scale(1)
                                                            }}
                                                        >
                                                            <ArrowDownIcon
                                                                width={moderateScale(21)}
                                                                height={moderateScale(21)}
                                                                color="#3F2516"
                                                                strokeWidth={2}
                                                            />
                                                        </View>
                                                    )}
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
            
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={() => 
                                                preventDoublePress(() => {
                                                    router.push('/notification')
                                                })
                                            }
                                            className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10 rounded-full"
                                            style={{
                                                borderWidth: moderateScale(0.5),
                                                width: moderateScale(44),
                                                height: moderateScale(44),
                                                flexShrink: 0
                                            }}
                                        >
                                            <NotificationIcon width={moderateScale(23)} height={moderateScale(23)} color="#1F1F1F" strokeWidth={1.5} />
                                        </TouchableOpacity>
            
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={() => {
                                                preventDoublePress(() => {
                                                    router.push('/cart')
                                                })
                                            }}
                                            className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10 rounded-full"
                                            style={{
                                                borderWidth: moderateScale(0.5),
                                                width: moderateScale(44),
                                                height: moderateScale(44),
                                                flexShrink: 0
                                            }}
                                        >
                                            <CartIcon width={moderateScale(23)} height={moderateScale(23)} color="#1F1F1F" strokeWidth={1.5} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {showEmptyHome ? (
                                    <View
                                        className="items-center justify-center"
                                        style={{
                                            minHeight: screenHeight - headerHeight - verticalScale(100),
                                            paddingHorizontal: scale(25)
                                        }}
                                    >
                                        <RestaurantIcon width={moderateScale(46)} height={moderateScale(46)} color="#3F2516" />

                                        <Text
                                            className="font-extrabold text-[#1F1F1F] text-center"
                                            style={{
                                                fontSize: moderateScale(17),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            Nothing available nearby
                                        </Text>

                                        <Text
                                            className="font-medium text-[#1F1F1F]/75 text-center"
                                            style={{
                                                fontSize: moderateScale(11),
                                                lineHeight: moderateScale(16),
                                                marginTop: verticalScale(4)
                                            }}
                                        >
                                            There are currently no restaurants or food items available in this area.
                                        </Text>

                                        <TouchableOpacity
                                            activeOpacity={0.95} 
                                            onPress={handleLocationAccess}
                                            disabled={locationLoading}
                                            className="w-full flex-row gap-2 bg-[#3F2516] items-center justify-center"
                                            style={{
                                                marginTop: verticalScale(10),
                                                height: verticalScale(40),
                                                borderRadius: moderateScale(22)
                                            }}
                                        >
                                            {locationLoading ? (
                                                <LottieView
                                                    source={require("../../../assets/animations/Loading.json")}
                                                    autoPlay
                                                    loop
                                                    style={{
                                                        width: moderateScale(52),
                                                        height: moderateScale(52)
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <LocateFixedIcon width={moderateScale(22)} height={moderateScale(22)} color="#FFFFFF" strokeWidth={1.5} />

                                                    <Text
                                                        className="tracking-wide font-semibold text-[#FFFFFF]"
                                                        style={{ fontSize: moderateScale(14) }}
                                                    >
                                                        Use Current Location
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={openLocationSelector}
                                            className='w-full bg-[#FAFAFA] border-[#1F1F1F]/10 items-center justify-center'
                                            style={{
                                                borderWidth: moderateScale(0.5),
                                                marginTop: verticalScale(14),
                                                height: verticalScale(40),
                                                borderRadius: moderateScale(22)
                                            }}
                                        >
                                            <Text
                                                className="font-bold text-[#1F1F1F]"
                                                style={{ fontSize: moderateScale(14) }}
                                            >
                                                Choose Another Location
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        {location && !loadingHome && (
                                            <>
                                                <View
                                                    className="items-start"
                                                    style={{ marginTop: verticalScale(5) }}
                                                >
                                                    <VegNonVegToggle
                                                        value={foodType}
                                                        onChange={handleFoodTypeChange}
                                                    />
                                                </View>
                        
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => 
                                                        preventDoublePress(() => {
                                                            router.push('/(tabs)/search')
                                                        })
                                                    }
                                                    className="flex-row gap-3 w-full items-center mt-3 bg-[#FAFAFA] border-[#1F1F1F]/10"
                                                    style={{
                                                        borderWidth: moderateScale(0.5),
                                                        borderRadius: moderateScale(22),
                                                        paddingHorizontal: scale(13),
                                                        height: verticalScale(46)
                                                    }}
                                                >
                                                    <SearchIcon height={moderateScale(24)} width={moderateScale(24)} color="#3F2516" strokeWidth={2} />
                        
                                                    <Text
                                                        className="font-medium text-[#1F1F1F]/65"
                                                        style={{ fontSize: moderateScale(14) }}
                                                    >
                                                        What are you craving today?
                                                    </Text>
                                                </TouchableOpacity>
                        
                                                {/* <FlatList
                                                    data={categories}
                                                    horizontal
                                                    nestedScrollEnabled
                                                    directionalLockEnabled
                                                    showsHorizontalScrollIndicator={false}
                                                    keyExtractor={(item) => item.id}
                                                    className="mt-5 -mx-4"
                                                    contentContainerStyle={{
                                                        paddingHorizontal: scale(14),
                                                        gap: moderateScale(10)
                                                    }}
                                                    renderItem={({ item: category }) => {
                                                        const isActive = activeCategory === category.id
                        
                                                        return(
                                                            <View className="items-center">
                                                                <TouchableOpacity
                                                                    activeOpacity={0.95}
                                                                    onPress={() => setActiveCategory(category.id)}
                                                                    className="items-center justify-center rounded-full bg-[#E5E4E2]/85"
                                                                    style={{
                                                                        borderColor: isActive ? "rgba(92, 70, 57, 0.7)" : "#FFFFFF",
                                                                        borderWidth: moderateScale( isActive ? 2 : 1.5),
                                                                        width: moderateScale(65),
                                                                        height: moderateScale(65),
                        
                                                                        shadowColor: "#5C4639",
                                                                        shadowOffset: {
                                                                            width: 0,
                                                                            height: 0
                                                                        },
                                                                        shadowOpacity: isActive ? 0.75 : 0,
                                                                        shadowRadius: isActive ? 10 : 0,
                                                                        elevation: isActive ? 8 : 0
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={{
                                                                            uri: category.imageUri
                                                                        }}
                                                                        contentFit="cover"
                                                                        cachePolicy={'memory-disk'}
                                                                        style={{
                                                                            width: "70%",
                                                                            height: "70%"
                                                                        }}
                                                                    />
                                                                </TouchableOpacity>
                        
                                                                <Text
                                                                    className="text-[#1F1F1F] font-semibold mt-1 mb-2"
                                                                    style={{ fontSize: moderateScale(12) }}
                                                                >
                                                                    {category.title}
                                                                </Text>
                                                            </View>
                                                        )
                                                    }}
                                                /> */}
                        
                                                <ScrollView
                                                    horizontal
                                                    nestedScrollEnabled
                                                    directionalLockEnabled
                                                    showsHorizontalScrollIndicator={false}
                                                    className="-mx-5 mt-4 mb-0"
                                                    contentContainerStyle={{
                                                        paddingHorizontal: scale(14),
                                                        gap: scale(8)
                                                    }}
                                                >
                                                    {categoriesWithAll.map((category) => {
                                                        const isSelected = selectedCategoryId === category.id
                        
                                                        return (
                                                            <TouchableOpacity
                                                                key={category.id}
                                                                activeOpacity={0.85}
                                                                onPress={() => {
                                                                    setSelectedCategoryId(category.id)
                                                                }}
                                                                className={`items-center justify-center ${
                                                                    isSelected ? "bg-[#3F2516]" : "bg-[#FAFAFA]"
                                                                }`}
                                                                style={{
                                                                    borderRadius: moderateScale(18),
                                                                    paddingHorizontal: scale(17),
                                                                    paddingVertical: verticalScale(7),
                                                                    borderWidth: moderateScale(0.7),
                                                                    borderColor: "rgba(31, 31, 31, 0.10)"
                                                                }}
                                                            >
                                                                <Text
                                                                    className={`font-medium ${
                                                                        isSelected ? "text-[#FFFFFF]" : "text-[#1F1F1F]"
                                                                    }`}
                                                                    style={{ fontSize: moderateScale(13.5) }}
                                                                >
                                                                    {category.name}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                                </ScrollView>
                        
                                                <BannerCarousel
                                                    advertisements={advertisements}
                                                    loading={loadingAdvertisements}
                                                />
                        
                                                <View
                                                    className="flex-row items-center w-full"
                                                    style={{ marginTop: verticalScale(14) }}
                                                >
                                                    <Text
                                                        className="text-[#1F1F1F] font-bold flex-1"
                                                        style={{ fontSize: moderateScale(16) }}
                                                    >
                                                        Popular Near You
                                                    </Text>
                        
                                                    {/* <TouchableOpacity
                                                        activeOpacity={0.95}
                                                        onPress={() => {}}
                                                        className="items-center"
                                                    >
                                                        <Text
                                                            className="text-[#3F2516] font-bold"
                                                            style={{ fontSize: moderateScale(14) }}
                                                        >
                                                            View All
                                                        </Text>
                                                    </TouchableOpacity> */}
                                                </View>
                        
                                                <View
                                                    style={{
                                                        marginTop: moderateScale(12),
                                                        gap: moderateScale(15)
                                                    }}
                                                >
                                                    {popularRestaurants.map((restaurant) => {
                                                        const isFavourite = restaurantIds.includes(restaurant.id)
            
                                                        return (
                                                            <RestaurantCard
                                                                key={restaurant.id}
                                                                restaurant={restaurant} 
                                                                isFavourite={isFavourite}
                                                                onPress={() =>
                                                                    handleRestaurantPress(restaurant.id, restaurant.isOpen)
                                                                }
                                                                onFavouritePress={() =>
                                                                    handleFavouritePress(restaurant.id)
                                                                }
                                                            />
                                                        )
                                                    })}
                                                </View>
                        
                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{
                                                        fontSize: moderateScale(16),
                                                        marginTop: verticalScale(18)
                                                    }}
                                                >
                                                    Today's Special Offers
                                                </Text>
                        
                                                <FlatList
                                                    data={offers}
                                                    horizontal
                                                    nestedScrollEnabled
                                                    directionalLockEnabled
                                                    showsHorizontalScrollIndicator={false}
                                                    keyExtractor={(item) => item.id}
                                                    className="-mx-5"
                                                    contentContainerStyle={{
                                                        paddingHorizontal: moderateScale(15),
                                                        gap: moderateScale(12),
                                                        marginTop: moderateScale(12)
                                                    }}
                                                    renderItem={({ item }) => (
                                                        <OfferCard
                                                            offer={item}
                                                            onPress={() => {
                                                                console.log("Selected offer:", item.id)
                                                            }}
                                                        />
                                                    )}
                                                />
                        
                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{
                                                        fontSize: moderateScale(16),
                                                        marginTop: verticalScale(18)
                                                    }}
                                                >
                                                    Continue Ordering
                                                </Text>
                        
                                                <View
                                                    className="flex-row items-center gap-2 mt-3 bg-[#FAFAFA] border-[#1F1F1F]/10"
                                                    style={{
                                                        borderWidth: moderateScale(0.7),
                                                        borderRadius: moderateScale(18),
                                                        paddingHorizontal: moderateScale(9),
                                                        paddingVertical: moderateScale(9)
                                                    }}
                                                >
                                                    <View
                                                        className="items-center justify-center overflow-hidden"
                                                        style={{
                                                            width: moderateScale(62),
                                                            height: moderateScale(62),
                                                            borderRadius: moderateScale(15)
                                                        }}
                                                    >
                                                        <Image
                                                            source={{
                                                                uri: "https://i.pinimg.com/736x/c9/c5/01/c9c5013a47c78dde12d22a8659cdb945.jpg"
                                                            }}
                                                            contentFit="cover"
                                                            transition={100}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                            }}
                                                        />
                                                    </View>
                        
                                                    <View className="justify-center flex-1">
                                                        <Text
                                                            numberOfLines={1}
                                                            className="text-[#1F1F1F] font-bold"
                                                            style={{ fontSize: moderateScale(14) }}
                                                        >
                                                            The Big Burger Theory
                                                        </Text>
                        
                                                        <Text
                                                            numberOfLines={2}
                                                            className="text-[#1F1F1F]/65 font-medium mt-1"
                                                            style={{ fontSize: moderateScale(11.5) }}
                                                        >
                                                            Double Patty Cheese Burger + Fries
                                                        </Text>
                        
                                                    </View>
                        
                                                    <TouchableOpacity
                                                        activeOpacity={0.95}
                                                        onPress={() => {}}
                                                        className="items-center justify-center flex-row bg-[#3F2516]"
                                                        style={{
                                                            gap: moderateScale(5),
                                                            borderRadius: moderateScale(10),
                                                            paddingHorizontal: moderateScale(9),
                                                            paddingVertical: moderateScale(7)
                                                        }}
                                                    >
                                                        <ClockIcon width={moderateScale(14)} height={moderateScale(14)} color="#FFFFFF" strokeWidth={2.2} />
                        
                                                        <Text
                                                            className="text-[#FFFFFF] font-medium"
                                                            style={{ fontSize: moderateScale(13) }}
                                                        >
                                                            Reorder
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                        
                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{
                                                        fontSize: moderateScale(16),
                                                        marginTop: verticalScale(18)
                                                    }}
                                                >
                                                    Trending Foods
                                                </Text>
                        
                                                <FlatList
                                                    data={popularMenu}
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
                                                    renderItem={renderPopularFood}
                                                />
                        
                                                {nearbyRestaurants.length > 0 && (
                                                    <Text
                                                        className="text-[#1F1F1F] font-bold"
                                                        style={{
                                                            fontSize: moderateScale(16),
                                                            marginTop: verticalScale(18)
                                                        }}
                                                    >
                                                        Nearby Restaurants
                                                    </Text>      
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        }
                        ListEmptyComponent={!location ? (renderLocationRequired()) : loadingHome ? (
                            <View
                                className="items-center justify-center"
                                style={{ minHeight: screenHeight - headerHeight - verticalScale(88) }}
                            >
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
                        ) : null}
                        renderItem={renderNearbyRestaurant}
                    />
    
                    {showBackToTop && (
                        <Animated.View
                            entering={FadeInUp.duration(220)}
                            exiting={FadeOutUp.duration(180)}
                            pointerEvents="box-none"
                            className="absolute left-0 right-0 items-center"
                            style={{
                                top: insets.top + verticalScale(8),
                                zIndex: 100
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    setBackToTopVisible(false)

                                    listRef.current
                                        ?.scrollToOffset({
                                            offset: 0,
                                            animated: true
                                        })
                                }}
                                className="flex-row items-center justify-center bg-[#3F2516]"
                                style={{
                                    paddingVertical: verticalScale(8),
                                    paddingRight: scale(14),
                                    paddingLeft: scale(10),
                                    borderRadius: moderateScale(22),
                                    gap: moderateScale(5),
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 3
                                    },
                                    shadowOpacity: 0.16,
                                    shadowRadius: 5,
    
                                    elevation: 5
                                }}
                            >
                                <ArrowUpIcon width={moderateScale(17)} height={moderateScale(17)} color="#FFFFFF" strokeWidth={2} />
    
                                <Text
                                    className="text-[#FFFFFF] font-semibold"
                                    style={{ fontSize: moderateScale(11.5) }}
                                >
                                    Back to Top
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </>
            )}

            {hasCartItems && !showEmptyHome && !loadingHome && (
                <FloatingCartBar />
            )}
        </SafeAreaView>
    )
}