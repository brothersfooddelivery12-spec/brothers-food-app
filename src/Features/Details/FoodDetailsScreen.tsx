import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CheckIcon from '@/assets/icon/CheckIcon.svg'
import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import FireIcon from '@/assets/icon/FireIcon.svg'
import MinusIcon from '@/assets/icon/MinusSignIcon.svg'
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import StopWatchIcon from '@/assets/icon/StopWatchIcon.svg'
import UsersIcon from '@/assets/icon/UsersIcon.svg'
import UtensilIcon from '@/assets/icon/UtensilIcon.svg'
import VegIcon from "@/assets/icon/VeganIcon.svg"
import { addons } from "@/constant/addons"
import { COLORS } from '@/constant/colors'
import { getMenuById, MenuDetails } from '@/Services/api-service'
import { addMenuItemToFavorites, removeMenuItemFromFavorites } from '@/Services/favorite-service'
import { useFavouriteStore } from '@/Stores/favourite-store'
import { useCartStore } from '@/Stores/useCartStore'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useState } from "react"
import { StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'

const DONENENSSOPTIONS = [
    "Medium Rare",
    "Medium",
    "Medium Well",
]

export default function FoodDetailsScreen() {
    const { menuId } = useLocalSearchParams<{ menuId?: string }>()
    const insets = useSafeAreaInsets()
    const {showToast} = useToast()

    const [menu, setMenu] = useState<MenuDetails | null>(null)
    const [loadingMenu, setLoadingMenu] = useState(false)

    const fetchMenu = useCallback(async () => {
        if (!menuId) return

        try {
            setLoadingMenu(true)

            const res = await getMenuById(menuId)

            console.log("Menu response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch Menu details","warning")

                return
            }

            setMenu(res.data.data ?? null)
        } catch (error: any) {
            console.log("Restaurant error:", error)

            showToast("Unable to fetch Menu details", "warning")
        } finally {
            setLoadingMenu(false)
        }
    }, [menuId])

    useEffect(() => {
        fetchMenu()
    }, [fetchMenu])

    const [imageError, setImageError] = useState(false)
        
    const DefaultFoodImage = require("../../../assets/images/Default_Food_Cover_Image.png")
    
    useEffect(() => {
        setImageError(false)
    }, [menu?.image_url])

    const hasImage = !!menu?.image_url && !imageError

    const addMenuItem = useFavouriteStore(state => state.addMenuItem)
    const removeMenuItem = useFavouriteStore(state => state.removeMenuItem)
    
    const isFavourite = useFavouriteStore(
        state => !!menuId && state.menuItemIds.includes(menuId)
    )

    const handleFavouritePress = useCallback(async () => {
        if (!menuId) {
            return
        }

        const wasFavourite = useFavouriteStore.getState().menuItemIds.includes(menuId)

        // Optimistic UI update
        if (wasFavourite) {
            removeMenuItem(menuId)
        } else {
            addMenuItem(menuId)
        }

        try {
            const res = wasFavourite
                ? await removeMenuItemFromFavorites(menuId)
                : await addMenuItemToFavorites(menuId)

            if (!res.data.success) {
                // rollback
                if (wasFavourite) {
                    addMenuItem(menuId)
                } else {
                    removeMenuItem(menuId)
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
                addMenuItem(menuId)
            } else {
                removeMenuItem(menuId)
            }

            showToast(error?.message || "Unable to update favourite.", "info")
        }
    }, [menuId, addMenuItem, removeMenuItem])

    const [quantity, setQuantity] = useState(1)
    const [selectedAddons, setSelectedAddons] = useState<number[]>([])
    const [selectedDoneness, setSelectedDoneness] = useState("Medium Rare")

    const rating = Number(menu?.rating ?? 0)
    const reviewCount = Number(menu?.review_count ?? 0)
    const calories = menu?.calories != null
        ? Number(menu.calories)
        : null

    const itemPrice = Number(menu?.price ?? 0)
    const addonTotal = addons
        .filter((addon) => selectedAddons.includes(addon.id))
        .reduce((total, addon) => total + addon.price, 0)

    const totalAmount = (itemPrice + addonTotal) * quantity

    const increaseQuantity = useCallback(() => {
        setQuantity((prev) => prev + 1)
    }, [])

    const decreaseQuantity = useCallback(() => {
        setQuantity((prev) => Math.max(1, prev - 1))
    }, [])

    const handleAddonPress = useCallback((addonId: number) => {
        setSelectedAddons((prev) => {
            if (prev.includes(addonId)) {
                return prev.filter((id) => id !== addonId)
            }

            return [...prev, addonId]
        })
    }, [])

    const addToCart = useCartStore((state) => state.addToCart)

    const handleAddToCart = useCallback(() => {
        if (!menu) {
            return
        }

        if (!menu.is_available) {
            showToast(
                "This menu is currently unavailable",
                "info"
            )

            return
        }

        // if (!menu.restaurant) {
        //     showToast(
        //         "Restaurant details unavailable",
        //         "info"
        //     )

        //     return
        // }

        // if (!menu.restaurant.is_open) {
        //     showToast(
        //         "Restaurant is currently closed",
        //         "info"
        //     )

        //     return
        // }

        // addToCart({
        //     restaurant: {
        //         id: menu.restaurant.id,
        //         restaurantName: menu.restaurant.name,
        //         restaurantLogoUrl: menu.restaurant.LogoUrl,
        //         deliveryFee: Number(menu.deliveryFee) || 0,
        //         deliveryTime: menu.deliveryTime,
        //         isOpen: menu.restaurant.isOpen
        //     },

        //     item: {
        //         id: menu.id,
        //         imageUrl: menu.image_url,
        //         name: menu.name,
        //         description: menu.description,
        //         price: Number(menu.price),
        //         quantity,
        //         isAvailable: menu.is_available
        //     }
        // })

        // showToast(
        //     quantity > 1
        //         ? `${quantity} items added to cart`
        //         : "Added to cart",
        //     "success"
        // )

        setQuantity(1)
    }, [menu, quantity, addToCart])

    const isAvailable = menu?.is_available ?? false

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

            {loadingMenu ? (
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
            ) : (
                <>
                    <KeyboardAwareScrollView
                        className="flex-1"
                        style={{ backgroundColor: COLORS.primaryBackgroundColor }}
                        contentContainerStyle={{
                            paddingBottom: verticalScale(85)
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        bottomOffset={30}
                        extraKeyboardSpace={20}
                    >
                        <View
                            className="absolute left-0 right-0 top-0"
                            style={{ height: verticalScale(220) }}
                        >
                            <Image
                                source={
                                    hasImage
                                        ? {
                                            uri: menu.image_url!
                                        }
                                        : DefaultFoodImage
                                }
                                onError={() => {
                                    setImageError(true)
                                }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
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
                                    onPress={() => router.back()}
                                    className="items-center self-start justify-center rounded-full"
                                    style={{
                                        backgroundColor: COLORS.secondaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                        borderWidth: moderateScale(0.5),
                                        width: moderateScale(38),
                                        height: moderateScale(38)
                                    }}
                                >
                                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(3) }} />
                                </TouchableOpacity>

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
                            </View>
                        </View>

                        <View
                            className="w-full"
                            style={{
                                backgroundColor: COLORS.primaryBackgroundColor,
                                marginTop: verticalScale(200),
                                minHeight: verticalScale(600),
                                borderTopLeftRadius: moderateScale(22),
                                borderTopRightRadius: moderateScale(22),
                                paddingHorizontal: moderateScale(14)
                            }}
                        >
                            {menu && (
                                !menu.is_available ? (
                                    <View
                                        className="absolute items-center justify-center"
                                        style={{
                                            left: moderateScale(14),
                                            bottom: moderateScale(13),
                                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.8),
                                            paddingHorizontal: scale(8),
                                            paddingVertical: verticalScale(5),
                                            borderRadius: moderateScale(10)
                                        }}
                                    >
                                        <Text
                                            className="font-bold uppercase"
                                            style={{
                                                fontSize: moderateScale(7.5),
                                                color: COLORS.primaryBackgroundColor
                                            }}
                                        >
                                            Currently Unavailable
                                        </Text>
                                    </View>
                                ) : (
                                    <View
                                        className="self-start flex-row items-center"
                                        style={{
                                            backgroundColor: COLORS.accentLightColor,
                                            marginTop: moderateScale(14),
                                            paddingHorizontal: moderateScale(7),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(10)
                                        }}
                                    >
                                        <Text
                                            className="font-semibold uppercase"
                                            style={{
                                                fontSize: moderateScale(10),
                                                color: COLORS.primaryColor
                                            }}
                                        >
                                            BestSeller
                                        </Text>
                                    </View>
                                )
                            )}

                            <Text
                                className="font-extrabold"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    marginTop: moderateScale(8),
                                    fontSize: moderateScale(20)
                                }}
                            >
                                {menu?.name || "Food Item"}
                            </Text>

                            <Text
                                className="font-medium"
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                    fontSize: moderateScale(12),
                                    marginTop: moderateScale(8),
                                    lineHeight: moderateScale(16)
                                }}
                            >
                                {menu?.description || "No description available."}
                            </Text>

                            <Text
                                className="font-black"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(28),
                                    marginTop: moderateScale(12)
                                }}
                            >
                                ₹{Number(menu?.price ?? 0).toLocaleString("en-IN")}
                            </Text>

                            <View
                                className="flex-row gap-2 items-center"
                                style={{ marginTop: moderateScale(8) }}
                            >
                                <View
                                    className="self-start flex-row items-center justify-center gap-1"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        paddingHorizontal: moderateScale(8),
                                        paddingVertical: moderateScale(4),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.secondaryColor} />

                                    <Text
                                        className="font-bold"
                                        style={{
                                            color: COLORS.secondaryColor,
                                            fontSize: moderateScale(12),
                                            marginRight: moderateScale(2)
                                        }}
                                    >
                                        {rating.toFixed(1)}
                                    </Text>
                                </View>

                                <View
                                    className="self-start flex-row items-center justify-center gap-1"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        paddingHorizontal: moderateScale(6),
                                        paddingVertical: moderateScale(4),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <UsersIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.secondaryColor} />

                                    <Text
                                        className="font-bold"
                                        style={{
                                            color: COLORS.secondaryColor,
                                            fontSize: moderateScale(12),
                                            marginRight: moderateScale(2)
                                        }}
                                    >
                                        {reviewCount > 0
                                            ? `${reviewCount.toLocaleString("en-IN")} ${
                                                reviewCount === 1
                                                    ? "Review"
                                                    : "Reviews"
                                            }`
                                            : "No Reviews"
                                        }
                                    </Text>
                                </View>
                            </View>
                                
                            <View
                                className="rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.borderColor, 0.65),
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(14),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View className="flex-row gap-8 items-center justify-center">
                                <View className="items-center">
                                    <View
                                        className="items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                            width: moderateScale(48),
                                            height: moderateScale(48)
                                        }}
                                    >
                                        <StopWatchIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} strokeWidth={2} />
                                    </View>

                                    <Text
                                        className="font-medium"
                                        style={{
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                            fontSize: moderateScale(12),
                                            marginTop: moderateScale(5)
                                        }}
                                    >
                                        {menu?.preparation_time
                                            ? `${menu.preparation_time} min`
                                            : "--"
                                        }
                                    </Text>
                                </View>

                                <View
                                    className="rounded-full"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.borderColor, 0.65),
                                        width: scale(1),
                                        height: verticalScale(26),
                                        marginHorizontal: verticalScale(2)
                                    }}
                                />

                                <View className="items-center">
                                    <View
                                        className="items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                            width: moderateScale(48),
                                            height: moderateScale(48)
                                        }}
                                    >
                                        <FireIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} strokeWidth={2} />
                                    </View>

                                    <Text
                                        className="font-medium"
                                        style={{
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                            fontSize: moderateScale(12),
                                            marginTop: moderateScale(5)
                                        }}
                                    >
                                        {calories !== null
                                            ? `${calories} kcal`
                                            : "-- kcal"
                                        }
                                    </Text>
                                </View>

                                <View
                                    className="rounded-full"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.borderColor, 0.65),
                                        width: scale(1),
                                        height: verticalScale(26),
                                        marginHorizontal: verticalScale(2)
                                    }}
                                />

                                <View className="items-center">
                                    <View
                                        className="items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                            width: moderateScale(48),
                                            height: moderateScale(48)
                                        }}
                                    >
                                        {menu?.is_vegetarian ? (
                                            <VegIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} strokeWidth={2} />
                                        ) : (
                                            <UtensilIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryTextColor} strokeWidth={2} />
                                        )}
                                    </View>

                                    <Text
                                        className="font-medium"
                                        style={{
                                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                            fontSize: moderateScale(12),
                                            marginTop: moderateScale(5)
                                        }}
                                    >
                                        {menu?.is_vegetarian ? "Veg" : "Non-Veg"}
                                    </Text>
                                </View>
                            </View>

                            <View
                                className="p-4"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.7),
                                    borderRadius: moderateScale(20),
                                    marginTop: moderateScale(25)
                                }}
                            >
                                <Text
                                    className="mt-1 font-extrabold"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(15),
                                        marginLeft: moderateScale(5)
                                    }}
                                >
                                    Enhance Your Experience
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.55),
                                        fontSize: moderateScale(11),
                                        marginVertical: verticalScale(4),
                                        marginLeft: moderateScale(5)
                                    }}
                                >
                                    Add premium extras to make it perfect
                                </Text>

                                {addons.map((addon) => {
                                    const isSelected = selectedAddons.includes(addon.id)

                                    return (
                                        <TouchableOpacity
                                            key={addon.id}
                                            activeOpacity={0.95}
                                            onPress={() => handleAddonPress(addon.id)}
                                            className="mt-3 flex-row gap-4 items-center"
                                            style={{
                                                backgroundColor: COLORS.primaryBackgroundColor,
                                                borderColor: isSelected
                                                    ? hexToRgba(COLORS.secondaryColor, 0.45)
                                                    : hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderWidth: moderateScale(0.7),
                                                paddingHorizontal: scale(14),
                                                paddingVertical: verticalScale(15),
                                                borderRadius: moderateScale(18)
                                            }}
                                        >
                                            <View
                                                className="self-center items-center justify-center border"
                                                style={{
                                                    backgroundColor: isSelected
                                                        ? COLORS.secondaryColor
                                                        : "transparent",
                                                    borderColor: isSelected
                                                        ? COLORS.secondaryColor
                                                        : hexToRgba(COLORS.primaryTextColor, 0.15),
                                                    marginStart: moderateScale(4),
                                                    borderRadius: moderateScale(8),
                                                    width: moderateScale(24),
                                                    height: moderateScale(24)
                                                }}
                                            >
                                                {isSelected && (
                                                    <CheckIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryBackgroundColor} strokeWidth={2.5} />
                                                )}
                                            </View>

                                            <View className="flex-1 gap-1">
                                                <Text
                                                    className="font-semibold"
                                                    style={{
                                                        fontSize: moderateScale(14),
                                                        color: COLORS.primaryTextColor
                                                    }}
                                                >
                                                    {addon.title}
                                                </Text>

                                                <Text
                                                    className="font-medium"
                                                    style={{
                                                        fontSize: moderateScale(11),
                                                        color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                                    }}
                                                >
                                                    {addon.description}
                                                </Text>
                                            </View>

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(16),
                                                    color: COLORS.primaryColor
                                                }}
                                            >
                                                +₹{addon.price}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>

                            <View
                                className="p-4"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.7),
                                    borderRadius: moderateScale(20),
                                    marginTop: moderateScale(25)
                                }}
                            >
                                <Text
                                    className="mt-1 font-extrabold"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(16),
                                        marginLeft: moderateScale(5)
                                    }}
                                >
                                    Chef's Notes
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.55),
                                        fontSize: moderateScale(11),
                                        marginVertical: verticalScale(4),
                                        marginLeft: moderateScale(5)
                                    }}
                                >
                                    Customize your order just the way you like it
                                </Text>

                                <Text
                                    className="mt-4 font-bold"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(14),
                                        marginLeft: moderateScale(5)
                                    }}
                                >
                                    DONENESS
                                </Text>

                                <View
                                    className="flex-row flex-wrap gap-3"
                                    style={{ marginTop: verticalScale(6) }}
                                >
                                    {DONENENSSOPTIONS.map((doneness) => {
                                        const isSelected = selectedDoneness === doneness

                                        return (
                                            <TouchableOpacity
                                                key={doneness}
                                                activeOpacity={0.85}
                                                onPress={() => setSelectedDoneness(doneness)}
                                                className="items-center justify-center"
                                                style={{
                                                    backgroundColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor,
                                                    borderRadius: moderateScale(18),
                                                    paddingHorizontal: scale(14),
                                                    paddingVertical: verticalScale(6),
                                                    borderWidth: 1,
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
                                                    {doneness}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>

                                <Text
                                    className="font-semibold"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(14),
                                        marginLeft: moderateScale(5),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    Special Requests
                                </Text>

                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    placeholder="e.g. No onions, extra aioli on the side..."
                                    placeholderTextColor={COLORS.placeholderTextColor}
                                    className="w-full mt-3"
                                    style={{
                                        backgroundColor: COLORS.primaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                        borderWidth: moderateScale(0.7),
                                        color: COLORS.inputTextColor,
                                        height: verticalScale(120),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: moderateScale(16),
                                        paddingVertical: moderateScale(16),
                                        fontSize: moderateScale(14),
                                        lineHeight: moderateScale(26)
                                    }}
                                    selectionColor={COLORS.secondaryColor}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    <View
                        className="flex-row items-center absolute left-0 right-0 bottom-0"
                        style={{
                            paddingHorizontal: scale(16),
                            paddingTop: verticalScale(16),
                            paddingBottom: verticalScale(12) + insets.bottom,
                            borderTopRightRadius: moderateScale(22),
                            borderTopLeftRadius: moderateScale(22),
                            zIndex: 100, 
                            backgroundColor: isAvailable
                                ? COLORS.primaryColor
                                : COLORS.inactiveContentColor
                        }}
                    >
                        <View
                            className="flex-row items-center"
                            style={{ gap: moderateScale(3) }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={decreaseQuantity}
                                className="items-center justify-center border"
                                style={{
                                    width: moderateScale(35),
                                    height: moderateScale(34),
                                    borderTopLeftRadius: moderateScale(24),
                                    borderBottomLeftRadius: moderateScale(24),
                                    backgroundColor: isAvailable
                                        ? COLORS.primaryBackgroundColor
                                        : hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                    borderColor: isAvailable
                                        ? hexToRgba(COLORS.primaryColor, 0.85)
                                        : hexToRgba(COLORS.primaryTextColor, 0.15),
                                    opacity: quantity === 1 ? 0.75 : 1
                                }}
                            >
                                <MinusIcon
                                    width={moderateScale(16)}
                                    height={moderateScale(18)}
                                    color={isAvailable ? COLORS.primaryColor : COLORS.inactiveContentColor}
                                    strokeWidth={3}
                                    style={{ marginLeft: moderateScale(2) }}
                                />
                            </TouchableOpacity>

                            <View
                                className="items-center justify-center border"
                                style={{
                                    width: moderateScale(35),
                                    height: moderateScale(34),
                                    backgroundColor: isAvailable
                                        ? COLORS.primaryBackgroundColor
                                        : hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                    borderColor: isAvailable
                                        ? hexToRgba(COLORS.primaryColor, 0.85)
                                        : hexToRgba(COLORS.primaryTextColor, 0.15),
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(16),
                                        color: isAvailable ? COLORS.primaryColor : COLORS.inactiveContentColor
                                    }}
                                >
                                    {quantity}
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={increaseQuantity}
                                disabled={!isAvailable}
                                className="items-center justify-center border"
                                style={{
                                    width: moderateScale(35),
                                    height: moderateScale(34),
                                    borderTopRightRadius: moderateScale(24),
                                    borderBottomRightRadius: moderateScale(24),
                                    backgroundColor: isAvailable
                                        ? COLORS.primaryBackgroundColor
                                        : hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                    borderColor: isAvailable
                                        ? hexToRgba(COLORS.primaryColor, 0.85)
                                        : hexToRgba(COLORS.primaryTextColor, 0.15),
                                }}
                            >
                                <PlusIcon
                                    width={moderateScale(18)}
                                    height={moderateScale(18)}
                                    color={isAvailable ? COLORS.primaryColor : COLORS.inactiveContentColor}
                                    strokeWidth={2.5}
                                    style={{ marginRight: moderateScale(2) }}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={handleAddToCart}
                            disabled={!isAvailable}
                            className="flex-row ml-auto items-center justify-center border"
                            style={{
                                gap: moderateScale(5),
                                borderRadius: moderateScale(24),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(8),
                                backgroundColor: isAvailable
                                    ? COLORS.primaryBackgroundColor
                                    : hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                borderColor: isAvailable
                                    ? hexToRgba(COLORS.primaryColor, 0.85)
                                    : hexToRgba(COLORS.primaryTextColor, 0.15),
                            }}
                        >
                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: isAvailable ? COLORS.primaryColor : COLORS.inactiveContentColor
                                }}
                            >
                                {isAvailable ? "Add To Cart" : "Unavailable"}
                            </Text>

                            <View
                                style={{
                                    width: scale(1),
                                    height: verticalScale(10),
                                    marginHorizontal: verticalScale(2),
                                    backgroundColor: isAvailable
                                        ? hexToRgba(COLORS.borderColor, 0.85)
                                        : hexToRgba(COLORS.primaryTextColor, 0.15),
                                }}
                            />

                            <Text
                                className="font-semibold tracking-wide"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: isAvailable 
                                        ? hexToRgba(COLORS.primaryColor, 0.85)
                                        : hexToRgba(COLORS.primaryTextColor, 0.15),
                                }}
                            >
                                ₹{totalAmount.toLocaleString("en-IN")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}