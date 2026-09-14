import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import LocateFixedIcon from '@/assets/icon/LocateFixedIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import NotificationIcon from '@/assets/icon/NotificationIcon.svg'
import SearchIcon from '@/assets/icon/SearchOutline.svg'
import RestaurantCard, { Restaurants } from "@/components/RestaurantCard"
import VegNonVegToggle, { FoodType } from '@/components/VegNonVegToggle'
import { offers } from "@/constant/OffersCardData"
import BannerCarousel from "@/Features/Home/components/BannerCarousel"
import FoodCard, { MenuItem } from "@/Features/Home/components/FoodCard"
import NearByRestaurantsList, { NearByRestaurants } from "@/Features/Home/components/NearByRestaurants"
import OfferCard from "@/Features/Home/components/OffersCard"
import { getCurrentLocationDetails } from '@/utils/getCurrentLocation'
import { Image } from "expo-image"
import * as Location from "expo-location"
import { router, useFocusEffect } from "expo-router"
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Alert, FlatList, Linking, Platform, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import { Advertisement, Category, getAdvertisements, getCategories, getNearbyRestaurants, getPopularMenu, getPopularRestaurants, getUserProfile, NearbyRestaurant, PopularMenu, PopularRestaurant } from '../Services/api-service'
import { addRestaurantToFavorites, removeRestaurantFromFavorites } from '../Services/favorite-service'
import { useAuthStore } from '../Stores/auth-store'
import { useFavouriteStore } from '../Stores/favourite-store'
import { useLocationStore } from '../Stores/locationStore'
import { useCartStore } from '../Stores/useCartStore'

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const { height: screenHeight } = useWindowDimensions()
    const [headerHeight, setHeaderHeight] = useState(0)
    const preventDoublePress = usePreventDoublePress()
    const {showToast} = useToast()

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

    type LocationPermissionState =
        | "checking"
        | "granted"
        | "denied"
        | "services-disabled"

    const [locationLoading, setLocationLoading] = useState(false)
    const [locationPermission, setLocationPermission] = useState<LocationPermissionState>("checking")
    
    const location = useLocationStore(state => state.location)
    const setLocation = useLocationStore(state => state.setLocation)
    const hasHydrated = useLocationStore(state => state.hasHydrated)

    const handleUseCurrentLocation = useCallback(
        async (showSuccessToast = true) => {
            if (locationLoading) return

            try {
                setLocationLoading(true)

                const currentLocation = await getCurrentLocationDetails()

                console.log("Location Details:", currentLocation)

                setLocation({
                    latitude: currentLocation.latitude, 
                    longitude: currentLocation.longitude,
                    name:
                        currentLocation.addressLine ||
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
        },
        [
            locationLoading,
            setLocation,
            showToast
        ]
    )

    const handleLocationAccess = useCallback(async () => {
        try {
            let servicesEnabled = await Location.hasServicesEnabledAsync()

            if (!servicesEnabled) {
                setLocationPermission("services-disabled")

                if (Platform.OS === "android") {
                    try {
                        await Location.enableNetworkProviderAsync()

                        servicesEnabled = await Location.hasServicesEnabledAsync()

                        if (!servicesEnabled) {
                            return
                        }
                    } catch (error) {
                        console.log("Location enable cancelled:", error)

                        return
                    }
                } else {
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
                                onPress: () =>
                                    Linking.openSettings()
                            }
                        ]
                    )

                    return
                }
            }

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
                                onPress: () =>
                                    Linking.openSettings()
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

            setLocationPermission("granted")

            await handleUseCurrentLocation()
        } catch (error) {
            console.log("Location access error:", error)
        }
    },[handleUseCurrentLocation])

    const openLocationSelector = useCallback(() => {
        // preventDoublePress(() => {
        //     router.push(
        //         "/select-location"
        //     )
        // })
    }, [preventDoublePress, router])

    const handleLocationPress = useCallback(() => {
        if (location) {
            openLocationSelector()
            return
        }

        handleLocationAccess()
    }, [location, openLocationSelector, handleLocationAccess])

    const LoadingDots = React.memo(() => {
        const [count, setCount] = useState(0)

        useEffect(() => {
            const interval = setInterval(() => {
                setCount(prev =>
                    prev === 3 ? 0 : prev + 1
                )
            }, 450)

            return () => {
                clearInterval(interval)
            }
        }, [])

        return (
            <View
                style={{
                    width: moderateScale(16)
                }}
            >
                <Text
                    className="text-[#3F2516] font-extrabold"
                    style={{
                        fontSize: moderateScale(15.5)
                    }}
                >
                    {".".repeat(count)}
                </Text>
            </View>
        )
    })

    const getLocationTitle = () => {
        if (!hasHydrated) {
            return "Loading location"
        }

        if (location?.name) {
            return location.name
        }

        if (locationLoading) {
            return "Detecting location"
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
                    imageUri:
                        item.cover_image_url ||
                        item.logo_url ||
                        null,
                    cuisines: item.description ?? "",
                    rating: Number(item.rating) || 0,
                    deliveryFee:
                        item.delivery_fee != null
                            ? Number(item.delivery_fee)
                            : null,

                    deliveryTime: item.estimated_time_minutes ?? null,
                    distance:
                        item.distance !=
                        null
                            ? `${item.distance} km`
                            : null,
                    discount: item.discount ?? null,
                    priceForTwo: item.price_for_two ?? null,
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
                    deliveryTime: item.estimated_time_minutes,
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
                    imageUri:
                        item.cover_image_url ||
                        item.logo_url ||
                        null,
                    cuisines: item.description ?? "",
                    rating: Number(item.rating) || 0,
                    distance:
                        item.distance !=
                        null
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

    const [loadingHome, setLoadingHome] = useState(false)

    const fetchHomeData = useCallback(
        async (latitude: number, longitude: number) => {
            try {
                setLoadingHome(true)

                await Promise.all([
                    fetchAdvertisements(),
                    fetchCategories(latitude, longitude),
                    fetchPopularMenu(latitude, longitude),
                    fetchPopularRestaurants(latitude, longitude),
                    fetchNearbyRestaurants(latitude, longitude)
                ])
            } catch (error) {
                console.log("Home data fetch error:", error)
            } finally {
                setLoadingHome(false)
            }
        },
        [
            fetchAdvertisements,
            fetchCategories,
            fetchPopularMenu,
            fetchPopularRestaurants,
            fetchNearbyRestaurants
        ]
    )

    useFocusEffect(
        useCallback(() => {
            if (!hasHydrated || !location) {
                return
            }

            void fetchHomeData(
                25.149131,
                73.083126
            )
        }, [
            hasHydrated,
            location?.latitude,
            location?.longitude,
            fetchHomeData
        ])
    )


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
        if (!isOpen) {
            showToast("Restaurant is currently closed", "info")

            return
        }

        preventDoublePress(() => {
            router.push({
                pathname: "/restaurant-details",
                params: {
                    restaurantId: restaurantId
                }
            })
        })
    }, [showToast, preventDoublePress, router])

    const {
        restaurantIds,
        addRestaurant,
        removeRestaurant
    } = useFavouriteStore()

    const handleFavouritePress = useCallback(async (id: string) => {
        const isFavourite = useFavouriteStore
                .getState().restaurantIds.includes(id)

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
            }
        } catch (error: any) {
            console.log("Favourite error:", error)

            if (isFavourite) {
                addRestaurant(id)
            } else {
                removeRestaurant(id)
            }

            showToast("Unable to update favourite.", "info")
        }
    }, [addRestaurant, removeRestaurant])

    const handleAddToCart = useCallback(
        (item: MenuItem) => {
           if (!item.isAvailable) {
                showToast("This item is currently unavailable", "info")

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
                    deliveryTime: item.deliveryTime,
                    isOpen: item.restaurant.isOpen
                },

                item: {
                    id: item.id,
                    imageUrl: item.imageUrl,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    isAvailable: item.isAvailable
                }
            })

            showToast("Item added to cart", "success")
        },[addToCart]
    )

    const handleFoodPress = useCallback(
        (foodId: string) => {
            preventDoublePress(() => {
                router.push({
                    pathname: "/food-details",
                    params: {
                        foodId
                    }
                })
            })
        },
        [preventDoublePress, router]
    )

    const renderPopularFood = useCallback(
        ({ item }: { item: MenuItem }) => (
            <FoodCard
                item={item}
                onPress={() =>
                    handleFoodPress(item.id)
                }
                onAddPress={() =>
                    handleAddToCart(item)
                }
            />
        ),
        [handleFoodPress, handleAddToCart]
    )

    const renderNearbyRestaurant = useCallback(
        ({ item }: { item: NearByRestaurants }) => {
            return (
                <NearByRestaurantsList
                    restaurant={item}
                    onPress={() => {
                        handleRestaurantPress(item.id, item.isOpen)
                    }}
                />
            )
        },
        [handleRestaurantPress]
    )

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
                    fontSize: moderateScale(18),
                    marginTop: verticalScale(8)
                }}
            >
                Select Your Location
            </Text>

            <Text
                className="font-medium text-[#1F1F1F]/60 text-center"
                style={{
                    fontSize: moderateScale(12),
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
                            className="tracking-wide font-semibold text-[#F5F5F5]"
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
                className='w-full bg-[#FFFFFF] bprder border-[#1F1F1F]/10 items-center justify-center'
                style={{
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
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
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
                <FlatList
                    data={location && !loadingHome ? nearbyRestaurants : []}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: scale(14),
                        paddingBottom: verticalScale(88),
                        gap: verticalScale(10)
                    }}
                    ListHeaderComponent={
                        <>
                            <View
                                onLayout={(event) => {
                                    setHeaderHeight(
                                        event.nativeEvent.layout.height
                                    )
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
                                                        .duration(400)
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
                                        className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                        style={{
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
                                        className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                        style={{
                                            width: moderateScale(44),
                                            height: moderateScale(44),
                                            flexShrink: 0
                                        }}
                                    >
                                        <CartIcon width={moderateScale(23)} height={moderateScale(23)} color="#1F1F1F" strokeWidth={1.5} />
                                    </TouchableOpacity>
                                </View>
                            </View>

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
                                        className="flex-row gap-3 w-full items-center mt-3 bg-white border border-[#1F1F1F]/10"
                                        style={{
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
                                                        isSelected ? "bg-[#3F2516]" : "bg-[#FFFFFF]"
                                                    }`}
                                                    style={{
                                                        borderRadius: moderateScale(18),
                                                        paddingHorizontal: scale(17),
                                                        paddingVertical: verticalScale(7),
                                                        borderWidth: 1,
                                                        borderColor: "rgba(31, 31, 31, 0.10)"
                                                    }}
                                                >
                                                    <Text
                                                        className={`font-medium ${
                                                            isSelected ? "text-white" : "text-[#1F1F1F]"
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
                                        className="flex-row items-center gap-2 mt-3 bg-[#E5E4E2]/85"
                                        style={{
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
            
                                    <Text
                                        className="text-[#1F1F1F] font-bold"
                                        style={{
                                            fontSize: moderateScale(16),
                                            marginTop: verticalScale(18)
                                        }}
                                    >
                                        Nearby Restaurants
                                    </Text>      
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
            )}

        </SafeAreaView>
    )
}