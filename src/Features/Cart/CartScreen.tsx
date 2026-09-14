import AddLocationIcon from '@/assets/icon/AddLocationIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRight from '@/assets/icon/ArrowRight.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import InfoIcon from '@/assets/icon/InfoIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import { Image } from 'expo-image'
import { router, useFocusEffect } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useMemo, useRef, useState } from "react"
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FoodCard, { MenuItem } from "../Home/components/FoodCard"
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import { Address, getAllAddresses } from '../Services/address-service'
import { useAddressRefreshStore } from '../Stores/address-refresh-store'
import { useCartStore } from '../Stores/useCartStore'
import RestaurantCartCard from "./Components/RestaurantCartCard"

export const FREQUENTLY_ADDED_TOGETHER: MenuItem[] = [
    {
        id: "restaurant-1-french-fries",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "French Fries",
        description: "Crispy golden french fries",
        imageUrl:
            "https://i.pinimg.com/736x/73/7e/d9/737ed93987aae98a76fc2e5f12fc0ecc.jpg",

        isAvailable: true,
        isVeg: true,

        price: 99.00,

        deliveryTime: 15,
        deliveryFee: "25"
    },

    {
        id: "restaurant-1-coke",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "Coke",
        description: "Chilled soft drink",
        imageUrl:
            "https://i.pinimg.com/1200x/60/70/9b/60709bf9dee58b89448c04a6a518b45b.jpg",

        isAvailable: false,
        isVeg: true,

        price: 59.00,

        deliveryTime: 5,
        deliveryFee: "25"
    },

    {
        id: "restaurant-1-garlic-bread",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "Garlic Bread",
        description: "Crispy garlic bread with herbs",
        imageUrl:
            "https://i.pinimg.com/1200x/89/52/62/8952620f20999169e06c97f10a5eb24b.jpg",

        isAvailable: true,
        isVeg: true,

        price: 129.00,

        deliveryTime: 12,
        deliveryFee: "25"
    },

    {
        id: "restaurant-1-brownie",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "Brownie",
        description: "Rich chocolate brownie",
        imageUrl:
            "https://i.pinimg.com/736x/18/39/b5/1839b51798c581c9219f3d7ccd62cbda.jpg",

        isAvailable: true,
        isVeg: true,

        price: 99.00,

        deliveryTime: 10,
        deliveryFee: "25"
    }
]

export default function CartScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const {showToast} = useToast()

    const carts = useCartStore((state) => state.carts)
    const addToCart = useCartStore((state) => state.addToCart)
    const activeRestaurantId = useCartStore((state) => state.activeRestaurantId)
    const hasHydrated = useCartStore((state) => state.hasHydrated)
    const selectRestaurant = useCartStore((state) => state.selectRestaurant)
    const increaseQuantity = useCartStore((state) => state.increaseQuantity)
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateRestaurantAvailability = useCartStore((state) => state.updateRestaurantAvailability)
    const updateItemAvailability = useCartStore((state) => state.updateItemAvailability)

    const [addresses, setAddresses] = useState<Address[]>([])
    const [loadingAddresses, setLoadingAddresses] = useState(true)
    const hasFetchedAddresses = useRef(false)
    const addressesDirty = useAddressRefreshStore((state) => state.addressesDirty)
    const clearAddressesDirty = useAddressRefreshStore((state) => state.clearAddressesDirty)

    const fetchAddresses = useCallback(async () => {
        try {
            setLoadingAddresses(true)

            const res = await getAllAddresses()

            console.log("Addresses response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch addresses", "warning")

                return
            }

            const fetchedAddresses = res.data.data ?? []

            setAddresses(fetchedAddresses)
        } catch (error: any) {
            console.log("Fetch addresses error:", error)

            showToast(error?.message || "Unable to fetch addresses", "warning")
        } finally {
            setLoadingAddresses(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            const shouldFetch = !hasFetchedAddresses.current || addressesDirty

            if (!shouldFetch) {
                return
            }

            const loadAddresses = async () => {
                await fetchAddresses()

                hasFetchedAddresses.current = true

                if (addressesDirty) {
                    clearAddressesDirty()
                }
            }

            loadAddresses()

        }, [addressesDirty, clearAddressesDirty, fetchAddresses])
    )

    const activeCart = useMemo(() => {
        if (!activeRestaurantId) {
            return null
        }

        return (
            carts.find(
                (restaurant) => restaurant.id === activeRestaurantId
            ) ?? null
        )
    }, [
        carts,
        activeRestaurantId
    ])

    const totalRestaurants = carts.length

    const totalCartItems = useMemo(() => {
        return carts.reduce(
            (total, restaurant) => {
                return (
                    total +
                    restaurant.items.reduce((count, item) => count + item.quantity, 0)
                )
            },
            0
        )
    }, [carts])

    const itemsTotal = useMemo(() => {
        if (!activeCart) {
            return 0
        }

        return activeCart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    }, [activeCart])

    const hasUnavailableItems = useMemo(() => {
        if (!activeCart) {
            return false
        }

        return activeCart.items.some(
            (item) => !item.isAvailable
        )
    }, [activeCart])

    const handleSelectRestaurant = useCallback(
        (restaurantId: string) => {
            selectRestaurant(restaurantId)
        },[selectRestaurant]
    )

    const handleAddItem = useCallback(
        (restaurantId: string) => {
            const restaurant = carts.find((item) => item.id === restaurantId)

            if (!restaurant) {
                return
            }

            if (!restaurant.isOpen) {
                return
            }

            router.push({
                pathname: "/restaurant-menu",
                params: {
                    restaurantId
                }
            })
        },[carts]
    )

    const handleIncrease = useCallback(
        (restaurantId: string, item: any) => {
            increaseQuantity(restaurantId, item.id)
        },[increaseQuantity]
    )

    const handleDecrease = useCallback(
        (restaurantId: string, item: any) => {
            decreaseQuantity(restaurantId, item.id)
        },[decreaseQuantity]
    )

    const handleRemove = useCallback(
        (restaurantId: string, item: any) => {
            removeItem(restaurantId, item.id)
        },[removeItem]
    )

    const handleFrequentlyAddedItem = useCallback(
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
                    deliveryFee: Number(item.deliveryFee),
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

            showToast("added to cart", "success")
        },[addToCart]
    )

    const hasSavedAddress = addresses.length > 0

    const handleCheckout = useCallback(() => {
        if (!activeCart) return

        if (!activeCart.isOpen) {
            showToast("This restaurant is currently unavailable", "info")

            return
        }

        if (hasUnavailableItems) {
            showToast("Remove unavailable items before checkout", "info")

            return
        }

        if (loadingAddresses) {
            return
        }

        if (!hasSavedAddress) {
            showToast("Add a delivery address before checkout", "info")

            return
        }

        preventDoublePress(() => {
            router.push({
                pathname: "/checkout",
                params: {
                    restaurantId: activeCart.id
                }
            })
        })
    }, [
        activeCart,
        hasUnavailableItems,
        loadingAddresses,
        hasSavedAddress,
        preventDoublePress
    ])

    const renderRestaurantCart = useCallback(
        ({ item }: { item: any }) => (
            <RestaurantCartCard
                restaurantId={item.id}
                restaurantName={item.restaurantName}
                restaurantLogoUrl={item.restaurantImage}
                deliveryFee={item.deliveryFee}
                deliveryTime={item.deliveryTime}

                isActiveCart={item.id === activeRestaurantId}
                isRestaurantOpen={item.isOpen}

                items={item.items}

                onSelectRestaurant={handleSelectRestaurant}
                onAddItem={handleAddItem}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
            />
        ),
        [
            activeRestaurantId,
            handleSelectRestaurant,
            handleAddItem,
            handleIncrease,
            handleDecrease,
            handleRemove
        ]
    )

    if (!hasHydrated) {
        return (
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
        )
    }

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(10),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        My Cart
                    </Text>
                    
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        {totalRestaurants}{" "}
                        {totalRestaurants === 1 ? "restaurant" : "restaurants"}{" "}
                        •{" "}{totalCartItems}{" "}{totalCartItems === 1 ? "item" : "items"}
                    </Text>
                </View>

                <View
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <CartIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={1.5} />
                </View>
            </View>

            {carts.length === 0 ? (
                <View
                    className="flex-1 items-center justify-center"
                    style={{
                        paddingHorizontal: scale(30),
                        paddingBottom: verticalScale(24)
                    }}
                >
                    <Image
                        source={require("@/assets/images/EmptyCartIllustration.png")}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        style={{
                            width: moderateScale(175),
                            height: moderateScale(175)
                        }}
                    />

                    <Text
                        className="text-[#1F1F1F] font-extrabold text-center"
                        style={{ fontSize: moderateScale(17) }}
                    >
                        Your cart is empty
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/75 font-medium text-center"
                        style={{
                            fontSize: moderateScale(11),
                            marginTop: verticalScale(4),
                            lineHeight: moderateScale(14),
                            paddingHorizontal: scale(20)
                        }}
                    >
                        Looks like you haven't added anything yet.
                        Discover delicious food and add your favourites.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() =>
                            router.back()
                        }
                        className="flex-row items-center justify-center bg-[#3F2516]"
                        style={{
                            gap: moderateScale(6),
                            marginTop: verticalScale(20),
                            paddingHorizontal: scale(22),
                            paddingVertical: verticalScale(10),
                            borderRadius: moderateScale(24)
                        }}
                    >
                        <Text
                            className="text-white font-semibold"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Browse Food
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : loadingAddresses ? (
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
                    <FlatList
                        data={carts}
                        keyExtractor={(item) => item.id}
                        renderItem={renderRestaurantCart}
                        ListHeaderComponent={() => (
                            <View>
                                <View
                                    className="flex-row gap-2 p-3 items-center bg-[#E8B93F]/15 border border-[#E8B93F]/25"
                                    style={{
                                        borderRadius: moderateScale(16),
                                        marginTop: verticalScale(10),
                                        marginBottom: verticalScale(8)
                                    }}
                                >
                                    <InfoIcon width={moderateScale(28)} height={moderateScale(28)} />

                                    <View className="flex-1 gap-1 items-start">
                                        <Text
                                            className="text-[#1F1F1F] font-semibold"
                                            style={{ fontSize: moderateScale(12)}}
                                        >
                                            {`You can checkout items from one restaurant\nat a time`} 
                                        </Text>

                                        <Text
                                            className="text-[#1F1F1F]/65 font-medium"
                                            style={{ fontSize: moderateScale(10) }}
                                        >
                                            Switch restaurant to checkout their items
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="none"
                        contentContainerStyle={{
                            paddingHorizontal: scale(14),
                            paddingBottom: verticalScale(85)
                        }}
                        ListFooterComponent={
                            <View className="mt-5">
                                <Text
                                    className="text-[#1F1F1F] font-bold flex-1"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Frequently Added Together
                                </Text>

                                <FlatList
                                    data={FREQUENTLY_ADDED_TOGETHER}
                                    horizontal
                                    nestedScrollEnabled
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    className="-mx-5 mt-3"
                                    contentContainerStyle={{
                                        paddingHorizontal: scale(14),
                                        gap: moderateScale(10)
                                    }}
                                    renderItem={({ item }) => (
                                        <FoodCard
                                            item={item}
                                            onPress={() => {}}
                                            onAddPress={() => {}}
                                        />
                                    )}
                                />

                                {addresses.length === 0 && (
                                    <>
                                        <View
                                            className="items-center justify-center mx-2 bg-white border border-[#1F1F1F]/10"
                                            style={{
                                                marginTop: verticalScale(18),
                                                paddingHorizontal: scale(20),
                                                paddingVertical: verticalScale(20),
                                                borderRadius: moderateScale(20)
                                            }}
                                        >
                                            <View
                                                className='bg-[#E8B93F]/15 rounded-full items-center justify-center'
                                                style={{
                                                    width: moderateScale(44),
                                                    height: moderateScale(44)
                                                }}
                                            >
                                                <LocationIcon width={moderateScale(24)} height={moderateScale(24)} color="#5A3825" strokeWidth={1.5} />
                                            </View>
            
                                            <Text
                                                className="text-[#1F1F1F] font-semibold"
                                                style={{
                                                    fontSize: moderateScale(14),
                                                    marginTop: verticalScale(8)
                                                }}
                                            >
                                                Add Delivery Address
                                            </Text>
            
                                            <Text
                                                className="text-[#1F1F1F]/75 font-medium text-center"
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    marginTop: verticalScale(3)
                                                }}
                                            >
                                                Add a delivery address before proceeding to checkout.
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={() => preventDoublePress(() => {
                                                router.push("/add-address")
                                            })}
                                            className="flex-row gap-2 items-center justify-center p-4 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                                            style={{
                                                borderRadius: moderateScale(18),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            <AddLocationIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.8} />
                
                                            <Text
                                                className="text-[#1F1F1F] font-semibold"
                                                style={{ fontSize: moderateScale(14) }}
                                            >
                                                Add Address
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        }
                    />
                    {activeCart && (
                        <View
                            className="flex-row items-center absolute left-0 right-0 bottom-0"
                            style={{
                                paddingHorizontal: scale(16),
                                paddingTop: verticalScale(16),
                                paddingBottom: verticalScale(12) + insets.bottom,
                                borderTopRightRadius: moderateScale(22),
                                borderTopLeftRadius: moderateScale(22),
                                zIndex: 100,
                                backgroundColor: "#3F2516"
                            }}
                        >
                            <View className="items-start gap-1 ml-4">
                                <Text
                                    className="text-white/75 font-normal"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Total to pay
                                </Text>

                                <Text
                                    className="text-white font-extrabold"
                                    style={{ fontSize: moderateScale(18) }}
                                >
                                    ₹{itemsTotal.toLocaleString("en-IN")}
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={handleCheckout}
                                className="flex-row ml-auto items-center justify-center border"
                                style={{
                                    gap: moderateScale(5),
                                    borderRadius: moderateScale(24),
                                    paddingLeft: scale(12),
                                    paddingRight: scale(8),
                                    paddingVertical: verticalScale(8),
                                    backgroundColor: "#FFFFFF",
                                    borderColor: "rgba(31,31,31,0.15)"
                                }}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: "#3F2516"
                                    }}
                                >
                                    {!activeCart.isOpen
                                        ? "Restaurant Closed"
                                        : hasUnavailableItems
                                        ? "Items Unavailable"
                                        : "Proceed to Checkout"}
                                </Text>

                                <ArrowRight width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.8} />
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}

        </SafeAreaView>
    )
}