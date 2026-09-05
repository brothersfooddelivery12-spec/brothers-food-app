import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRight from '@/assets/icon/ArrowRight.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import GiftIcon from '@/assets/icon/GiftIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import InfoIcon from '@/assets/icon/InfoIcon.svg'
import { RESTAURANTS } from '@/constant/RESTAURANTS'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FoodCard from "../Home/components/FoodCard"
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import { useCartStore } from '../Stores/useCartStore'
import OrderPriceRow from "./Components/OrderPriceRow"
import RestaurantCartCard from "./Components/RestaurantCartCard"

export const FREQUENTLY_ADDED_TOGETHER = [
    {
        id: "restaurant-1-french-fries",
        restaurantId: "restaurant-1",

        name: "French Fries",
        category: "Sides",
        price: 99,
        imageUri:
            "https://i.pinimg.com/736x/73/7e/d9/737ed93987aae98a76fc2e5f12fc0ecc.jpg",
        isActive: true
    },
    {
        id: "restaurant-2-coke",
        restaurantId: "restaurant-1",

        name: "Coke",
        category: "Beverages",
        price: 59,
        imageUri:
            "https://i.pinimg.com/1200x/60/70/9b/60709bf9dee58b89448c04a6a518b45b.jpg",
        isActive: false
    },
    {
        id: "restaurant-3-garlic-bread",
        restaurantId: "restaurant-1",

        name: "Garlic Bread",
        category: "Sides",
        price: 129,
        imageUri:
            "https://i.pinimg.com/1200x/89/52/62/8952620f20999169e06c97f10a5eb24b.jpg",
        isActive: true
    },
    {
        id: "restaurant-4-brownie",
        restaurantId: "restaurant-1",

        name: "Brownie",
        category: "Desserts",
        price: 99,
        imageUri:
            "https://i.pinimg.com/736x/18/39/b5/1839b51798c581c9219f3d7ccd62cbda.jpg",
        isActive: true
    }
]

export default function CartScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const [couponSavings, setCouponSavings] = useState(100)
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

    useEffect(() => {
        updateRestaurantAvailability(
            "restaurant-1",
            true
        )
    }, [updateRestaurantAvailability])

    useEffect(() => {
        updateItemAvailability(
            "restaurant-1",
            "restaurant-1-paneer-tikka",
            true
        )
    }, [updateItemAvailability])

    const getRestaurantById = (restaurantId: string) => {
        return RESTAURANTS.find(
            (restaurant) => restaurant.id === restaurantId
        )
    }

    const activeCart = useMemo(() => {
        if (!activeRestaurantId) {
            return null
        }

        return (
            carts.find(
                (restaurant) =>
                    restaurant.id ===
                    activeRestaurantId
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
                    restaurant.items.reduce(
                        (count, item) =>
                            count +
                            item.quantity,
                        0
                    )
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
            (total, item) =>
                total +
                item.price *
                    item.quantity,
            0
        )
    }, [activeCart])

    const deliveryFee = activeCart?.deliveryFee ?? 0

    const platformFee = activeCart ? 5 : 0

    const packingFee = activeCart ? 20 : 0

    const gstRate = 0.05

    const gstAndTaxes = useMemo(() => {
        return Math.round(itemsTotal * gstRate)
    }, [itemsTotal])

    const totalToPay = useMemo(() => {
        const total =
            itemsTotal +
            deliveryFee +
            platformFee +
            packingFee +
            gstAndTaxes -
            couponSavings

        return Math.max(0, total)
    }, [
        itemsTotal,
        deliveryFee,
        platformFee,
        packingFee,
        gstAndTaxes,
        couponSavings
    ])

    const hasUnavailableItems = useMemo(() => {
        if (!activeCart) {
            return false
        }

        return activeCart.items.some(
            (item) => !item.isActive
        )
    }, [activeCart])

    const canCheckout =
        !!activeCart && activeCart.isActive &&
        !hasUnavailableItems && activeCart.items.length > 0

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

            if (
                !restaurant.isActive
            ) {
                return
            }

            router.push({
                pathname: "/restaurant-details",
                params: {
                    restaurantId
                }
            })
        },[carts]
    )

    const handleIncrease = useCallback(
        (restaurantId: string, item: any) => {
            increaseQuantity(
                restaurantId,
                item.id
            )
        },[increaseQuantity]
    )

    const handleDecrease = useCallback(
        (restaurantId: string, item: any) => {
            decreaseQuantity(
                restaurantId,
                item.id
            )
        },[decreaseQuantity]
    )

    const handleRemove = useCallback(
        (restaurantId: string, item: any) => {
            removeItem(
                restaurantId,
                item.id
            )
        },[removeItem]
    )

    const handleFrequentlyAddedItem = useCallback(
        (item: any) => {
            if (!item.isActive) {
                showToast("This item is currently unavailable", "warning")

                return
            }

            const cartRestaurant = carts.find((cart) => cart.id === item.restaurantId)

            if (cartRestaurant && !cartRestaurant.isActive) {
                showToast("Restaurant is currently closed", "warning")

                return
            }

            const restaurant = getRestaurantById(item.restaurantId)

            if (!restaurant) {
                showToast("Restaurant not found", "warning")

                return
            }

            if (!cartRestaurant && !restaurant.isActive) {
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
                    isActive:
                        cartRestaurant
                            ?.isActive ??
                        restaurant.isActive
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

            showToast("added to cart","success")
        },[addToCart, carts]
    )

    const handleCheckout = useCallback(() => {
        if (!activeCart) {
            return
        }

        if (!activeCart.isActive) {
            return
        }

        if (hasUnavailableItems) {
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
        preventDoublePress
    ])

    const renderRestaurantCart = useCallback(
        ({ item }: { item: any }) => (
            <RestaurantCartCard
                restaurantId={item.id}
                restaurantName={item.restaurantName}
                restaurantImage={item.restaurantImage}
                deliveryFee={item.deliveryFee}
                deliveryTime={item.deliveryTime}

                isActiveCart={item.id === activeRestaurantId}
                isRestaurantActive={item.isActive}

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
            <View className="flex-1 bg-[#F5F5F5] items-center justify-center">
                <ActivityIndicator
                    size="small"
                    color="#3F2516"
                />

                <Text
                    className="text-[#1F1F1F]/65 font-medium"
                    style={{
                        fontSize:
                            moderateScale(11),

                        marginTop:
                            verticalScale(10)
                    }}
                >
                    Loading your cart...
                </Text>
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
            ) : (
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
                                        onAddPress={() => handleFrequentlyAddedItem(item)
                                    }
                                    />
                                )}
                            />

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="p-4 items-center flex-row gap-3 bg-white border border-[#1F1F1F]/10"
                                style={{
                                    borderRadius: moderateScale(18),
                                    marginTop: verticalScale(18)
                                }}
                            >
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                                    style={{
                                        width: moderateScale(40),
                                        height: moderateScale(40)
                                    }}
                                >
                                    <GiftIcon width={moderateScale(23)} height={moderateScale(23)} color="#3F2516" strokeWidth={1.5} />
                                </View>

                                <View className="items-start gap-1 flex-1">
                                    <Text
                                        className="text-[#1F1F1F] font-bold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Apply Coupon
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Save up to ₹150 on this order
                                    </Text>
                                </View>

                                <ArrowRight width={moderateScale(18)} height={moderateScale(18)} color={"#1F1F1F"} strokeWidth={1.8} />
                            </TouchableOpacity>

                            <View
                                className="p-4 items-center flex-row gap-3 bg-white border border-[#1F1F1F]/10"
                                style={{
                                    borderRadius: moderateScale(18),
                                    marginTop: verticalScale(12)
                                }}
                            >
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                                    style={{
                                        width: moderateScale(40),
                                        height: moderateScale(40)
                                    }}
                                >
                                    <HomeIcon width={moderateScale(23)} height={moderateScale(23)} color="#3F2516" strokeWidth={1.5} />
                                </View>

                                <View className="items-start gap-1 flex-1">
                                    <Text
                                        className="text-[#1F1F1F] font-bold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Home
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        123 MG Road, Sumerpur
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className="items-center justify-center bg-[#3F2516]"
                                    style={{
                                        paddingHorizontal: moderateScale(10),
                                        paddingVertical: moderateScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <Text
                                        className="font-medium text-white"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Change
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                className="p-5 bg-white border border-[#1F1F1F]/10"
                                style={{
                                    borderRadius: moderateScale(18),
                                    marginTop: verticalScale(14)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginBottom: verticalScale(8)
                                    }}
                                >
                                    Order Summary
                                </Text>

                                <OrderPriceRow
                                    label="Item Total"
                                    value={itemsTotal}
                                />

                                <OrderPriceRow
                                    label="Delivery Fee"
                                    value={deliveryFee === 0 ? "FREE" : deliveryFee}
                                />

                                <OrderPriceRow
                                    label="Platform Fee"
                                    value={platformFee}
                                />

                                <OrderPriceRow
                                    label="Restaurant Packing"
                                    value={packingFee}
                                />

                                <OrderPriceRow
                                    label="GST and Taxes"
                                    value={gstAndTaxes}
                                />

                                {couponSavings > 0 && (
                                    <View
                                        className="items-center flex-row justify-center bg-[#E3F2E8] mt-3"
                                        style={{
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(8),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <Text
                                            className="text-[#4D9151] font-semibold flex-1"
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            Coupon Savings
                                        </Text>

                                        <Text
                                            className="text-[#4D9151] font-bold"
                                            style={{ fontSize: moderateScale(14) }}
                                        >
                                            -₹{couponSavings.toLocaleString("en-IN")}
                                        </Text>
                                    </View>
                                )}

                                <View
                                    className="rounded-full bg-[#E8DDD3]/65"
                                    style={{
                                        height: verticalScale(0.7),
                                        marginVertical: verticalScale(12),
                                        marginHorizontal: verticalScale(2)
                                    }}
                                />

                                <View className="flex-row justify-between items-center">
                                    <Text
                                        className="text-[#1F1F1F]/85 font-extrabold"
                                        style={{ fontSize: moderateScale(15) }}
                                    >
                                        Grand Total
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F] font-black tracking-wide"
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        ₹{totalToPay.toLocaleString("en-IN")}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                />
            )}

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
                        backgroundColor: canCheckout ? "#3F2516" : "#4D4D4D"
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
                            ₹{totalToPay.toLocaleString("en-IN")}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={!canCheckout}
                        onPress={handleCheckout}
                        className="flex-row ml-auto items-center justify-center border"
                        style={{
                            gap: moderateScale(5),
                            borderRadius: moderateScale(24),
                            paddingLeft: scale(12),
                            paddingRight: scale(8),
                            paddingVertical: verticalScale(8),
                            backgroundColor: canCheckout ? "#FFFFFF" : "#D1D1D1",
                            borderColor: "rgba(31,31,31,0.15)"
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(14),
                                color: canCheckout ? "#3F2516" : "#777777"
                            }}
                        >
                            {!activeCart.isActive
                                ? "Restaurant Closed"
                                : hasUnavailableItems
                                ? "Items Unavailable"
                                : "Proceed to Checkout"}
                        </Text>

                        {canCheckout && (
                            <ArrowRight width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.8} />
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}