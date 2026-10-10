import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import OfferIcon from '@/assets/icon/OfferIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import RatingIcon2 from '@/assets/icon/RatingIcon2.svg'
import RatingIcon3 from '@/assets/icon/RatingIcon3.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import StoreIcon from '@/assets/icon/StoreIcon.svg'
import FoodIcon from '@/assets/icon/UtensilIcon2.svg'
import VerifiedIcon from '@/assets/icon/VerifiedIcon.svg'
import WalletIcon from '@/assets/icon/WalletIcon.svg'
import { COLORS } from '@/constant/colors'
import { popularitems } from "@/constant/PopularItemData"
import { restaurantsOffers } from "@/constant/restaurantOfferCardData"
import { addRestaurantToFavorites, removeRestaurantFromFavorites } from '@/Services/favorite-service'
import { useFavouriteStore } from '@/Stores/favourite-store'
import { useLocationStore } from '@/Stores/locationStore'
import { hexToRgba } from '@/utils/hexToRgba'
import { getRatingStars } from "@/utils/rating"
import { formatRestaurantTime } from '@/utils/time-utils'
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useState } from "react"
import { FlatList, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { getMenuByCategory, getRestaurantById, getRestaurantCategories, getRestaurantMenu, PopularMenu, RestaurantCategory, RestaurantDetails } from '../../Services/api-service'
import { useCartStore } from '../../Stores/useCartStore'
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import ImageGrid from "./components/ImageGrid"
import RatingDistribution from "./components/RatingDistribution"
import RestaurantMenuItemCard, { RestaurantMenuItem } from "./components/RestaurantMenuItemCard"
import RestaurantOfferCard from "./components/RestaurantOfferCard"
import ReviewCard from "./components/ReviewCard"
import SimilarRestaurantCard from "./components/SimilarRestaurantCard"

const TABS = ["Popular", "Recommended", "Main Course"]

const TAB_TITLES = {
    Popular: "Popular Items",
    Recommended: "Recommended Items",
    "Main Course": "Main Course",
}

const FODD_IMAGES = [
    "https://i.pinimg.com/736x/7f/d5/bb/7fd5bb5cdc861b4b044b6e9770d66fb8.jpg",
    "https://i.pinimg.com/736x/81/87/48/8187485c2f76c5bca3e7e98e0f90254a.jpg",
    "https://i.pinimg.com/1200x/4a/f2/05/4af205d49fed2c4c9d8da12e97ba439f.jpg",
    "https://i.pinimg.com/736x/8f/b0/4f/8fb04fb82290f6b61a73c304f5137432.jpg",
]

const USER_RATINGS = [
    5,
    5,
    5,
    5,
    5,
    4,
    3,
    4,
    4,
    5,
]

const REVIEWS = [
    {
        id: "1",
        name: "Rohan Sharma",
        badge: "Certified Foodie",
        rating: 3.8,
        comment:
            "Absolutely phenomenal taste! The Paneer Butter Masala Heritage is a must-try. The packaging was top-notch and arrived before time. Brothers Delivery never disappoints with their premium selection.",
    },
    {
        id: "2",
        name: "Amit Kumar",
        badge: "Food Explorer",
        rating: 4.5,
        comment:
            "Amazing food quality and excellent packaging. Everything arrived fresh and perfectly packed.",
    },
    {
        id: "3",
        name: "Priya Mehta",
        badge: "Foodie",
        rating: 5,
        comment:
            "Absolutely loved the food! Great taste, fast delivery and excellent overall experience.",
    },
]

const SimialrRestaurants = [
    {
        id: "1",
        name: "Currey Culture",
        image: "https://i.pinimg.com/1200x/54/92/2d/54922dd7b732dc69b31b001fd2bac63b.jpg",
        rating: 4.2,
        deliveryTime: "20-25 mins",
        isActive: true,
    },
    {
        id: "2",
        name: "The Spice Kitchen",
        image: "https://i.pinimg.com/736x/d6/35/a1/d635a1a04a3bed4443b62b2a03406904.jpg",
        rating: 4.6,
        deliveryTime: "25-30 mins",
        isActive: false
    },
    {
        id: "3",
        name: "Royal Tadka",
        image: "https://i.pinimg.com/1200x/b9/6f/3e/b96f3e7efa9d0f47147266fac5416bb3.jpg",
        rating: 4.8,
        deliveryTime: "15-20 mins",
        isActive: true,
    },
]

export default function RestaurantDetailsScreen() {
    const { restaurantId } = useLocalSearchParams<{restaurantId: string}>()
    const preventDoublePress = usePreventDoublePress()
    const {showToast} = useToast()
    const location = useLocationStore(state => state.location)

    const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null)
    const [loadingRestaurant, setLoadingRestaurant] = useState(false)

    const fetchRestaurant = useCallback(async () => {
        if (!restaurantId) return

        if (location?.latitude == null || location?.longitude == null) {
            return
        }

        try {
            setLoadingRestaurant(true)

            const res = await getRestaurantById(
                restaurantId,
                location.latitude,
                location.longitude
            )

            console.log("Restaurant response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch restaurant details", "warning")

                return
            }

            setRestaurant(res.data.data ?? null)
        } catch (error: any) {
            console.log("Restaurant error:", error)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to fetch restaurant details",
                "warning"
            )
        } finally {
            setLoadingRestaurant(false)
        }
    }, [restaurantId, location?.latitude, location?.longitude])

    useEffect(() => {
        fetchRestaurant()
    }, [fetchRestaurant])

    const [categories, setCategories] = useState<RestaurantCategory[]>([])
    const [activeCategoryId, setActiveCategoryId] = useState<string>("all")
    const [menuItems, setMenuItems] = useState<RestaurantMenuItem[]>([])
    const [loadingMenu, setLoadingMenu] = useState(false)

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

    const fetchRestaurantCategories = useCallback(async (restaurantId: string) => {
        try {
            const res = await getRestaurantCategories(restaurantId)

            console.log("Restaurant categories response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch restaurant categories", "warning")

                return
            }

            const data = res.data.data ?? []

            setCategories(data)
        } catch (error: any) {
            console.log("Restaurant categories error:", error)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to fetch restaurant categories",
                "warning"
            )
        }
    },[])

    useEffect(() => {
        if (!restaurantId) return

        fetchRestaurantCategories(
            restaurantId
        )
    }, [restaurantId, fetchRestaurantCategories])

    const fetchMenu = useCallback(async (
        restaurantId: string,
        categoryId: string,
        latitude: number,
        longitude: number
    ) => {
        try {
            setLoadingMenu(true)
            let res

            if (categoryId === "all") {
                res = await getRestaurantMenu(
                    restaurantId,
                    latitude,
                    longitude
                )
            } else {
                res = await getMenuByCategory(
                    categoryId,
                    latitude,
                    longitude
                )
            }

            console.log("Menu response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch menu", "warning")

                return
            }

            const RestaurantMenuData: PopularMenu[] = res.data.data ?? []
            
            const mappedRestaurantMenu: RestaurantMenuItem[] = RestaurantMenuData.map((item) => ({
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

            setMenuItems(mappedRestaurantMenu)
        } catch (error: any) {
            console.log("Menu fetch error:", error)

            showToast(error?.response?.data?.message || error?.message || "Unable to fetch menu", "warning")
        } finally {
            setLoadingMenu(false)
        }
    },[])

    useEffect(() => {
        if (
            !restaurantId ||
            !activeCategoryId ||
            !location
        ) {
            return
        }

        fetchMenu(
            restaurantId,
            activeCategoryId,
            location.latitude,
            location.longitude
        )
    }, [
        restaurantId,
        activeCategoryId,
        location?.latitude,
        location?.longitude,
        fetchMenu
    ])

    const [coverImageError, setCoverImageError] = useState(false)
    const [logoImageError, setLogoImageError] = useState(false)

    const DefaultRestaurantCoverImage = require("../../../assets/images/Default_Restaurant_Cover_Image.png")
    const DefaultRestaurantLogo = require("../../../assets/images/Default_Restaurant_Logo.png")

    useEffect(() => {
        setCoverImageError(false)
    }, [restaurant?.cover_image_url])

    useEffect(() => {
        setLogoImageError(false)
    }, [restaurant?.logo_url])

    const hasCoverImage = !!restaurant?.cover_image_url && !coverImageError
    const hasLogoImage = !!restaurant?.logo_url && !logoImageError

    const openingTime = formatRestaurantTime(restaurant?.opening_time)
    const closingTime = formatRestaurantTime(restaurant?.closing_time)

    const addRestaurant = useFavouriteStore(state => state.addRestaurant)
    const removeRestaurant = useFavouriteStore(state => state.removeRestaurant)
    
    const isFavourite = useFavouriteStore(
        state => !!restaurantId && state.restaurantIds.includes(restaurantId)
    )

    const handleFavouritePress = useCallback(async () => {
        if (!restaurantId) {
            return
        }

        const wasFavourite = useFavouriteStore.getState().restaurantIds.includes(restaurantId)

        // Optimistic UI update
        if (wasFavourite) {
            removeRestaurant(restaurantId)
        } else {
            addRestaurant(restaurantId)
        }

        try {
            const res = wasFavourite
                ? await removeRestaurantFromFavorites(restaurantId)
                : await addRestaurantToFavorites(restaurantId)

            if (!res.data.success) {
                // rollback
                if (wasFavourite) {
                    addRestaurant(restaurantId)
                } else {
                    removeRestaurant(restaurantId)
                }

                showToast(res.data.message || "Unable to update favourite.", "info")

                return
            }

            showToast(wasFavourite
                    ? "Removed from favourites."
                    : "Added to favourites.",
                "success"
            )
        } catch (error: any) {
            // rollback
            if (wasFavourite) {
                addRestaurant(restaurantId)
            } else {
                removeRestaurant(restaurantId)
            }

            showToast(error?.message || "Unable to update favourite.", "info")
        }
    }, [restaurantId, addRestaurant, removeRestaurant])

    const [activeTab, setActiveTab] = useState("Popular")

    const addToCart = useCartStore((state) => state.addToCart)
    
    const ratingStar = 4.8
    const stars = getRatingStars(ratingStar)

    const handleBack = useCallback(() => {
        router.back()
    }, [])

    const handleShare = useCallback(() => {
        // share restaurant
    }, [])

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab)
    }, [])

    const handleOfferPress = useCallback((id: string) => {
        console.log("Selected offer:", id)
    }, [])

    const handleSimilarRestaurantPress = useCallback((id: string) => {
        console.log("Selected restaurant:", id)
    }, [])

    const renderOffer = useCallback(
        ({ item }: { item: any }) => {
            return(
                <RestaurantOfferCard
                    restaurantOffer={item}
                    icon={OfferIcon}
                    onPress={handleOfferPress}
                />
            )
        },[handleOfferPress]
    )

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

    const handleAddToCart = useCallback((item: RestaurantMenuItem) => {
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

    const renderPopularitems = useCallback(
        ({ item }: { item: any }) => {
            return(
                <View
                    style={{
                        marginTop: moderateScale(12),
                        gap: moderateScale(15),
                        marginHorizontal: scale(12)
                    }}
                >
                    <RestaurantMenuItemCard
                        item={item}
                        onPress={() => {}}
                        onAddPress={() => {}}
                    />
                </View>
            )
        },[handleFoodPress, handleAddToCart]
    )

    const renderSimilarRestaurants = useCallback(
        ({ item }: { item: any }) => {
            return(
                <SimilarRestaurantCard
                    {...item}
                    onPress={handleSimilarRestaurantPress}
                />
            )
        },[handleSimilarRestaurantPress]
    )

    const rating = Number(restaurant?.rating ?? 0)
    const reviewCount = Number(restaurant?.review_count ?? 0)
    const isVerified = restaurant?.approval_status === "APPROVED"
    const isRestaurantOpen =
        restaurant?.is_active === true &&
        restaurant?.is_open === true
    const preparationTime = restaurant?.average_preparation_time ?? null
    const restaurantStatus =
        !restaurant?.is_active
            ? "UNAVAILABLE"
            : restaurant?.is_open
                ? "OPEN NOW"
                : "CLOSED"

    return(
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}
        >
            <StatusBar
                translucent
                backgroundColor={COLORS.primaryBackgroundColor}
                barStyle="dark-content"
            />

            {loadingRestaurant ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        source={require("../../../assets/animations/Food_Loading2.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(125),
                            height: moderateScale(125)
                        }}
                    />
                </View>
            ) :(
                <FlatList
                    className="flex-1"
                    style={{ backgroundColor: COLORS.primaryBackgroundColor }}
                    data={popularitems}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: verticalScale(25)
                    }}
                    ListHeaderComponent={
                        <View>
                            <View
                                className="absolute left-0 right-0 top-0"
                                style={{ height: verticalScale(200) }}
                            >
                                <Image
                                    source={
                                        hasCoverImage
                                            ? {
                                                uri: restaurant.cover_image_url!
                                            }
                                            : DefaultRestaurantCoverImage
                                    }
                                    onError={() => {
                                        setCoverImageError(true)
                                    }}
                                    contentFit="cover"
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                />
    
                                <View className="absolute inset-0 bg-black/10" />
                                
                                <View
                                    className="absolute left-0 right-0 top-0 flex-row items-center justify-between"
                                    style={{
                                        marginTop: moderateScale(16),
                                        marginHorizontal: scale(12)
                                    }}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={handleBack}
                                        className="items-center self-start justify-center rounded-full"
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            width: moderateScale(38),
                                            height: moderateScale(38)
                                        }}
                                    >
                                        <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: scale(3) }} />
                                    </TouchableOpacity>
    
                                    <View
                                        className="flex-row items-center"
                                        style={{ gap: moderateScale(10) }}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={handleFavouritePress}
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: COLORS.secondaryBackgroundColor,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderWidth: moderateScale(0.5),
                                                width: moderateScale(38),
                                                height: moderateScale(38)
                                            }}
                                        >
                                            {isFavourite ? (
                                                <FavouriteFilledIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} style={{ marginTop: moderateScale(2) }} />
                                            ): (
                                                <FavouriteOutlineIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={1.5} style={{ marginTop: moderateScale(2) }} />
                                            )}
                                        </TouchableOpacity>
    
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={handleShare}
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: COLORS.secondaryBackgroundColor,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderWidth: moderateScale(0.5),
                                                width: moderateScale(38),
                                                height: moderateScale(38)
                                            }}
                                        >
                                            <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} style={{ marginRight: moderateScale(2)} } />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
    
                            <View
                                className="w-full"
                                style={{
                                    backgroundColor: COLORS.primaryBackgroundColor,
                                    marginTop: verticalScale(180),
                                    borderTopLeftRadius: moderateScale(22),
                                    borderTopRightRadius: moderateScale(22),
                                    paddingHorizontal: moderateScale(14)
                                }}
                            >
                                <View
                                    className="p-4 pb-5"
                                    style={{
                                        backgroundColor: COLORS.secondaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                        borderWidth: moderateScale(0.5),
                                        borderRadius: moderateScale(22),
                                        marginTop: moderateScale(15)
                                    }}
                                >
                                    <View className="w-full flex-row gap-3 items-center">
                                        <View
                                            className="overflow-hidden rounded-full"
                                            style={{
                                                borderColor: COLORS.primaryBackgroundColor,
                                                borderWidth: moderateScale(3),
                                                width: moderateScale(68),
                                                height: moderateScale(68),
                                                marginLeft: -moderateScale(4)
                                            }}
                                        >
                                            <Image
                                                source={
                                                    hasLogoImage
                                                        ? {
                                                            uri: restaurant.logo_url!
                                                        }
                                                        : DefaultRestaurantLogo
                                                }
                                                onError={() => {
                                                    setLogoImageError(true)
                                                }}
                                                contentFit="cover"
                                                style={{
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                            />
                                        </View>
    
                                        <View
                                            className="flex-1 gap-1"
                                            style={{ minWidth: 0 }}
                                        >
                                            <Text
                                                ellipsizeMode="tail"
                                                className="self-start font-extrabold"
                                                style={{
                                                    fontSize: moderateScale(18),
                                                    color: COLORS.primaryTextColor
                                                }}
                                            >
                                                {restaurant?.name || "Restaurant"}
                                            </Text>
    
                                            <Text
                                                numberOfLines={2}
                                                ellipsizeMode="tail"
                                                className="font-medium"
                                                style={{
                                                    color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                    fontSize: moderateScale(11),
                                                    marginTop: moderateScale(2),
                                                    lineHeight: moderateScale(15)
                                                }}
                                            >
                                                {restaurant?.description || "Restaurant information unavailable"}
                                            </Text>
                                        </View>
                                    </View>
    
                                    <View className="flex-row gap-2 items-center mt-3">
                                        {isVerified && (
                                            <View
                                                className="self-start flex-row items-center"
                                                style={{
                                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                    paddingHorizontal: moderateScale(7),
                                                    paddingVertical: moderateScale(3.5),
                                                    borderRadius: moderateScale(14)
                                                }}
                                            >
                                                <VerifiedIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />
                            
                                                <Text
                                                    className="font-bold"
                                                    style={{
                                                        color: COLORS.primaryColor,
                                                        fontSize: moderateScale(10.5),
                                                        marginLeft: moderateScale(2),
                                                        marginRight: moderateScale(2)
                                                    }}
                                                >
                                                    Verified
                                                </Text>
                                            </View>
                                        )}
    
                                        <View
                                            className="self-start flex-row items-center justify-center gap-1"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                paddingHorizontal: moderateScale(9),
                                                paddingVertical: moderateScale(5),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryColor} />
    
                                            <Text
                                                className="font-bold"
                                                style={{
                                                    color: COLORS.primaryColor,
                                                    fontSize: moderateScale(12),
                                                    marginRight: moderateScale(2)
                                                }}
                                            >
                                                {rating.toFixed(1)}
                                            </Text>
    
                                            <Text
                                                className="font-medium"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    color: COLORS.primaryColor
                                                }}
                                            >
                                                {reviewCount > 0
                                                    ? `(${reviewCount.toLocaleString(
                                                        "en-IN"
                                                    )} Ratings)`
                                                    : "(No Ratings)"
                                                }
                                            </Text>
                                        </View>
                                    </View>

                                    {/* {restaurant?.opening_time && restaurant.closing_time && (
                                        <View
                                            className="flex-row items-center"
                                            style={{
                                                gap: moderateScale(5),
                                                marginTop: moderateScale(6)
                                            }}
                                        >
                                            <ClockIcon
                                                width={moderateScale(16)}
                                                height={moderateScale(16)}
                                                color={"#5C4639"}
                                                strokeWidth={1.8}
                                            />

                                            <Text
                                                className="font-medium"
                                                style={{
                                                    fontSize: moderateScale(10.5),
                                                    color: "rgba(31,31,31,0.65)"
                                                }}
                                            >
                                                {!restaurant.is_open
                                                    ? openingTime
                                                        ? `Opens at ${openingTime}`
                                                        : "Currently closed"
                                                    : openingTime && closingTime
                                                        ? `${openingTime} – ${closingTime}`
                                                        : "Hours unavailable"
                                                }
                                            </Text>
                                        </View>
                                    )} */}
    
                                    <View
                                        className="rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                                            height: verticalScale(0.7),
                                            marginVertical: verticalScale(12),
                                            marginHorizontal: verticalScale(2)
                                        }}
                                    />
    
                                    <View className="flex-row items-center">
                                        <View className="gap-4 flex-1 ml-2">
                                            <View className="flex-row items-center gap-2">
                                                <View
                                                    className="items-center justify-center rounded-full"
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                        width: moderateScale(36),
                                                        height: moderateScale(36)
                                                    }}
                                                >
                                                    <ClockIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                                                </View>
    
                                                <View className="justify-center">
                                                    <Text
                                                        className="font-medium uppercase"
                                                        style={{
                                                            fontSize: moderateScale(11),
                                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                                        }}
                                                    >
                                                        Delivery
                                                    </Text>
    
                                                    <Text
                                                        className="font-bold"
                                                        style={{
                                                            fontSize: moderateScale(12),
                                                            color: COLORS.primaryTextColor
                                                        }}
                                                    >
                                                        {restaurant?.average_preparation_time
                                                            ? `${restaurant.average_preparation_time} min`
                                                            : "-- min"
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
    
                                            <View className="flex-row items-center gap-2">
                                                <View
                                                    className="items-center justify-center rounded-full"
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                        width: moderateScale(36),
                                                        height: moderateScale(36)
                                                    }}
                                                >
                                                    <LocationIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                                                </View>
    
                                                <View className="justify-center">
                                                    <Text
                                                        className="font-medium uppercase"
                                                        style={{
                                                            fontSize: moderateScale(11),
                                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                                        }}
                                                    >
                                                        Distance
                                                    </Text>
    
                                                    <Text
                                                        className="font-bold"
                                                        style={{
                                                            fontSize: moderateScale(12),
                                                            color: COLORS.primaryTextColor
                                                        }}
                                                    >
                                                        {restaurant?.distance != null
                                                            ? Number(restaurant?.distance) < 1
                                                                ? `${Math.round(Number(restaurant?.distance) * 1000)} m`
                                                                : `${Number(restaurant?.distance).toFixed(1)} km`
                                                            : null
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
    
                                        <View className="gap-4 mr-4">
                                            <View className="flex-row items-center gap-2">
                                                <View
                                                    className="items-center justify-center rounded-full"
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                        width: moderateScale(36),
                                                        height: moderateScale(36)
                                                    }}
                                                >
                                                    <WalletIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                                                </View>
    
                                                <View className="justify-center">
                                                    <Text
                                                        className="font-medium uppercase"
                                                        style={{
                                                            fontSize: moderateScale(11),
                                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                                        }}
                                                    >
                                                        Cost
                                                    </Text>
    
                                                    <Text
                                                        className="font-bold"
                                                        style={{
                                                            fontSize: moderateScale(12),
                                                            color: COLORS.primaryTextColor
                                                        }}
                                                    >
                                                         {restaurant?.price_for_two != null
                                                            ? `₹${Number(
                                                                restaurant.price_for_two
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )} for two`
                                                            : "Not available"
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
    
                                            <View className="flex-row items-center gap-2">
                                                <View
                                                    className="items-center justify-center rounded-full"
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                        width: moderateScale(36),
                                                        height: moderateScale(36)
                                                    }}
                                                >
                                                    <StoreIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                                                </View>
    
                                                <View className="justify-center">
                                                    <Text
                                                        className="font-medium uppercase"
                                                        style={{
                                                            fontSize: moderateScale(11),
                                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                                        }}
                                                    >
                                                        Status
                                                    </Text>
    
                                                    <Text
                                                        className="font-bold"
                                                        style={{ 
                                                            fontSize: moderateScale(12),
                                                            color: restaurantStatus === "OPEN NOW"
                                                                ? COLORS.activeStatusTextColor
                                                                : COLORS.dangerTextColor
                                                        }}
                                                    >
                                                        {restaurantStatus}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
    
                                <FlatList
                                    data={restaurantsOffers}
                                    horizontal
                                    nestedScrollEnabled
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    className="-mx-5 mt-3"
                                    style={{
                                        marginTop: verticalScale(28)
                                    }}
                                    contentContainerStyle={{
                                        paddingHorizontal: scale(14),
                                        gap: scale(16)
                                    }}
                                    renderItem={renderOffer}
                                />
    
                                <View
                                    className="w-full"
                                    style={{ marginTop: verticalScale(12) }}
                                >
                                    <View className="flex-row items-end">
                                        {TABS.map((tab) => {
                                            const isActive = activeTab === tab
    
                                            return (
                                                <TouchableOpacity
                                                    key={tab}
                                                    activeOpacity={0.95}
                                                    onPress={() => handleTabChange(tab)}
                                                    className="items-center justify-center"
                                                    style={{
                                                        paddingHorizontal: scale(10),
                                                        height: verticalScale(38)
                                                    }}
                                                >
                                                    <View className="items-center">
                                                        <Text
                                                            className={isActive ? "font-bold" : "font-medium"}
                                                            style={{
                                                                color: isActive
                                                                    ? COLORS.primaryColor
                                                                    : hexToRgba(COLORS.primaryTextColor, 0.65),
                                                                fontSize: moderateScale(14),
                                                                marginBottom: verticalScale(6)
                                                            }}
                                                        >
                                                            {tab}
                                                        </Text>
    
                                                        {isActive && (
                                                            <Animated.View
                                                                entering={ZoomIn.duration(340)}
                                                                exiting={ZoomOut.duration(360)}
                                                                className="absolute bottom-0"
                                                                style={{
                                                                    backgroundColor: COLORS.primaryColor,
                                                                    left: -scale(3),
                                                                    right: -scale(3),
                                                                    height: verticalScale(2.5),
                                                                    borderRadius: scale(28)
                                                                }}
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
    
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            color: COLORS.primaryTextColor,
                                            fontSize: moderateScale(16),
                                            marginTop: verticalScale(6)
                                        }}
                                    >   
                                        {TAB_TITLES[activeTab as keyof typeof TAB_TITLES]}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                    ListFooterComponent={
                        <View
                            style={{
                                paddingHorizontal: scale(14),
                                marginTop: verticalScale(16)
                            }}
                        >
                            <ScrollView
                                horizontal
                                nestedScrollEnabled
                                directionalLockEnabled
                                showsHorizontalScrollIndicator={false}
                                className="-mx-5 mb-3"
                                contentContainerStyle={{
                                    paddingHorizontal: scale(14),
                                    gap: scale(10)
                                }}
                            >
                                {categoriesWithAll.map((category) => {
                                    const isActive = activeCategoryId === category.id

                                    return (
                                        <TouchableOpacity
                                            key={category.id}
                                            activeOpacity={0.85}
                                            onPress={() => {
                                                setActiveCategoryId(category.id)
                                            }}
                                            className="items-center justify-center"
                                            style={{
                                                backgroundColor: isActive
                                                    ? COLORS.primaryColor
                                                    : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                                borderRadius: moderateScale(18),
                                                paddingHorizontal: category.name === "All" ? scale(18) : scale(14),
                                                paddingVertical: verticalScale(7),
                                                borderWidth: 0.7,
                                                borderColor: isActive ? COLORS.primaryColor : COLORS.softBackgroundColor
                                            }}
                                        >
                                            <Text
                                                className="font-semibold"
                                                style={{
                                                    fontSize: moderateScale(13),
                                                    color: isActive ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                                }}
                                            >
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>

                            {loadingMenu ? (
                                <View
                                    className="items-center justify-center"
                                    style={{ height: verticalScale(180) }}
                                >
                                    <LottieView
                                        source={require(
                                            "../../../assets/animations/Loading3.json"
                                        )}
                                        autoPlay
                                        loop
                                        style={{
                                            width: moderateScale(50),
                                            height: moderateScale(50)
                                        }}
                                    />
                                </View>
                            ) : menuItems.length > 0 ? (
                                <View
                                    style={{
                                        gap: verticalScale(12),
                                        marginTop: moderateScale(6),
                                        marginBottom: moderateScale(16)
                                    }}
                                >
                                    {menuItems.map((item) => (
                                        <RestaurantMenuItemCard
                                            key={item.id}
                                            item={item}
                                            onPress={() => handleFoodPress(item.id)}
                                            onAddPress={() => handleAddToCart(item)}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <View
                                    className=" w-full items-center justify-center mx-2 mt-3 mb-6"
                                    style={{
                                        backgroundColor: COLORS.secondaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                        borderWidth: moderateScale(0.5),
                                        paddingHorizontal: scale(20),
                                        paddingVertical: verticalScale(24),
                                        borderRadius: moderateScale(20)
                                    }}
                                >
                                    <View
                                        className='rounded-full items-center justify-center'
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                            width: moderateScale(46),
                                            height: moderateScale(46)
                                        }}
                                    >
                                        <FoodIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.secondaryColor} />
                                    </View>

                                    <Text
                                        className="font-semibold text-center"
                                        style={{
                                            fontSize: moderateScale(14),
                                            marginTop: moderateScale(8),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        {activeCategoryId === "all"
                                            ? "No menu items available"
                                            : "No items in this category"
                                        }
                                    </Text>

                                    <Text
                                        className="font-medium text-center"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        {activeCategoryId === "all"
                                            ? "This restaurant currently has no menu items available."
                                            : "There are currently no menu items available in this category."
                                        }
                                    </Text>
                                </View>
                            )}

                            <View
                                className="flex-row items-center w-full"
                                style={{ marginBottom: verticalScale(16) }}
                            >
                                <Text
                                    className="font-semibold flex-1"
                                    style={{
                                        fontSize: moderateScale(15),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Ambience & Kitchen
                                </Text>
    
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => 
                                        preventDoublePress(() => {
                                            router.push('/restaurant-gallery')
                                        })
                                    }
                                    className="items-center"
                                >
                                    <Text
                                        className="font-bold"
                                        style={{
                                            fontSize: moderateScale(14),
                                            color: COLORS.primaryColor
                                        }}
                                    >
                                        See All
                                    </Text>
                                </TouchableOpacity>
                            </View>
    
                            <ImageGrid
                                images={restaurant?.gallery ?? []}
                                gap={moderateScale(15)}
                                size={moderateScale(160)}
                                borderRadius={moderateScale(22)}
                            />
    
                            <View
                                className="p-4 pb-2"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(22),
                                    marginTop: moderateScale(15)
                                }}
                            >
                                <Text
                                    className="font-black text-center mt-3"
                                    style={{
                                        fontSize: moderateScale(38),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    {ratingStar}
                                </Text>
    
                                <View
                                    className="flex-row gap-1 items-center justify-center"
                                    style={{ marginTop: moderateScale(4) }}
                                >
                                    {stars.map((type, index) => {
                                        if (type === "full") {
                                            return (
                                                <RatingIcon key={index} width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                            )
                                        }
    
                                        if (type === "half") {
                                            return (
                                                <RatingIcon2 key={index} width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                            )
                                        }
    
                                        return (
                                            <RatingIcon3 key={index} width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                        )
                                    })}
                                </View>
    
                                <Text
                                    className="font-semibold text-center"
                                    style={{
                                        color: hexToRgba(COLORS.secondaryColor, 0.85),
                                        fontSize: moderateScale(12),
                                        marginTop: moderateScale(4)
                                    }}
                                >
                                    5,200 + Reviews
                                </Text>
    
                                <RatingDistribution ratings={USER_RATINGS} ratingLevels={[5, 4, 3]} />
    
                                <View
                                    className="rounded-full"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                                        height: verticalScale(0.7),
                                        marginVertical: verticalScale(14),
                                        marginHorizontal: verticalScale(2)
                                    }}
                                />
    
                                <View>
                                    {REVIEWS.map((item) => (
                                        <ReviewCard
                                            key={item.id}
                                            review={item}
                                        />
                                    ))}
                                </View>
                            </View>
    
                            <Pressable
                                onPress={() =>
                                    preventDoublePress(() => {
                                        router.push("/restaurant-review")
                                    })
                                }
                                className="items-center justify-center mt-5"
                            >
                                <Text
                                    className="font-semibold text-center"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                        fontSize: moderateScale(13)
                                    }}
                                >
                                    See All Reviews
                                </Text>
                            </Pressable>
    
                            <Text
                                className="font-semibold"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(15),
                                    marginTop: verticalScale(18)
                                }}
                            >
                                Similar Restaurants
                            </Text>
    
                            <FlatList
                                data={SimialrRestaurants}
                                horizontal
                                nestedScrollEnabled
                                directionalLockEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                className="-mx-5 mt-4"
                                contentContainerStyle={{
                                    paddingLeft: scale(16),
                                    paddingRight: scale(20),
                                    gap: scale(12)
                                }}
                                renderItem={renderSimilarRestaurants}
                            />
                        </View>
                    }
                    renderItem={renderPopularitems}
                />
            )}
        </SafeAreaView>
    )
}