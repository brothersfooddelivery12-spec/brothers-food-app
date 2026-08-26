import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRight from '@/assets/icon/ArrowRight.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import GiftIcon from '@/assets/icon/GiftIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import InfoIcon from '@/assets/icon/InfoIcon.svg'
import { CART_DATA } from "@/constant/RestaurantCartData"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FoodCard from "../Home/components/FoodCard"
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import OrderPriceRow from "./Components/OrderPriceRow"
import RestaurantCartCard from "./Components/RestaurantCartCard"

export const FREQUENTLY_ADDED_TOGETHER = [
    {
        id: "1",
        name: "French Fries",
        category: "Sides",
        price: 99,
        imageUri:
            "https://i.pinimg.com/736x/73/7e/d9/737ed93987aae98a76fc2e5f12fc0ecc.jpg",
    },
    {
        id: "2",
        name: "Coke",
        category: "Beverages",
        price: 59,
        imageUri:
            "https://i.pinimg.com/1200x/60/70/9b/60709bf9dee58b89448c04a6a518b45b.jpg",
    },
    {
        id: "3",
        name: "Garlic Bread",
        category: "Sides",
        price: 129,
        imageUri:
            "https://i.pinimg.com/1200x/89/52/62/8952620f20999169e06c97f10a5eb24b.jpg",
    },
    {
        id: "4",
        name: "Brownie",
        category: "Desserts",
        price: 99,
        imageUri:
            "https://i.pinimg.com/736x/18/39/b5/1839b51798c581c9219f3d7ccd62cbda.jpg",
    },
]

export default function CartScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(
        CART_DATA.find((item) => item.isActive)?.id ?? null
    )

    const handleSelectRestaurant = useCallback((restaurantId: string) => {
        setActiveRestaurantId(restaurantId)
    }, [])

    const handleAddItem = useCallback((restaurantId: string) => {
    // ...
    }, [])

    const handleIncrease = useCallback((item: any) => {
        // ...
    }, [])

    const handleDecrease = useCallback((item: any) => {
        // ...
    }, [])

    const handleRemove = useCallback((item: any) => {
        // ...
    }, [])

    const renderRestaurantCart = useCallback(
        ({ item }: { item: any }) => (
            <RestaurantCartCard
                restaurantId={item.id}
                restaurantName={item.restaurantName}
                restaurantImage={item.restaurantImage}
                deliveryFee={item.deliveryFee}
                deliveryTime={item.deliveryTime}
                isActive={item.id === activeRestaurantId}
                onSelectRestaurant={handleSelectRestaurant}
                items={item.items}
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
                        3 restaurants • 6 items 
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

            <FlatList
                data={CART_DATA}
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
                    paddingBottom: insets.bottom + verticalScale(85)
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
                                    onAddPress={() =>
                                        console.log("Add:", item.id)
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

                            <OrderPriceRow label="Item Total" value={747} />

                            <OrderPriceRow label="Delivery Fee" value={"FREE"} />

                            <OrderPriceRow label="Platform Fee" value={5} />

                            <OrderPriceRow label="Restaurant Packing" value={20} />

                            <OrderPriceRow label="GST and Taxes" value={38} />

                            <View
                                className="items-center flex-row justify-center bg-[#E3F2E8] mt-3"
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="text-[#4d9151] font-semibold self-start flex-1"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Coupon Savings
                                </Text>

                                <Text
                                    className="text-[#4d9151] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    -₹100
                                </Text>
                            </View>

                            <View
                                className="rounded-full bg-[#E8DDD3]/65"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View
                                className="flex-row justify-between items-center"
                            >
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
                                    ₹710
                                </Text>
                            </View>
                        </View>
                    </View>
                }
            />

            <View
                className="flex-row items-center absolute left-0 right-0 bottom-0 bg-[#3F2516]"
                style={{
                    paddingHorizontal: scale(16),
                    paddingTop: verticalScale(16),
                    paddingBottom: verticalScale(12) + insets.bottom,
                    borderTopRightRadius: moderateScale(22),
                    borderTopLeftRadius: moderateScale(22),
                    zIndex: 100
                }}
            >
                <View className="items-start gap-1 ml-4">
                    <Text
                        className="text-[#FFFFFF]/75 font-normal"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Total to pay
                    </Text>

                    <Text
                        className="text-[#FFFFFF] font-extrabold"
                        style={{ fontSize: moderateScale(18) }}
                    >
                        ₹710
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => {
                        preventDoublePress(() => {
                            router.push('/checkout')
                        })
                    }}
                    className="flex-row ml-auto items-center justify-center bg-[#FFFFFF] border border-[#1F1F1F]/15"
                    style={{
                        gap: moderateScale(5),
                        borderRadius: moderateScale(24),
                        paddingLeft: scale(12),
                        paddingRight: scale(8),
                        paddingVertical: verticalScale(8)
                    }}  
                >
                    <Text
                        className="text-[#3F2516] font-semibold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Proceed to Checkout
                    </Text>
                    
                    <ArrowRight width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={1.8} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}