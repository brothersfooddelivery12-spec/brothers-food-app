import SearchBar from "@/components/SearchBar"
import { activeorders } from "@/constant/ActiveOrdersData"
import { pastOrders } from "@/constant/PastOrdersData"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { StatusBar, Text, useWindowDimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import ActiveOrdersCard from "./Components/ActiveOrdersCard"
import OrdersTabs from "./Components/OrdersTab"
import PastOrdersCard from "./Components/PastOrdersCard"

const TITLE_HEIGHT = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(46)

export default function OrdersScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()
    const [titleHeight, setTitleHeight] = useState(TITLE_HEIGHT)
    const [activeTab, setActiveTab] = useState<"active orders" | "past orders">("active orders")
    const { width: SCREEN_WIDTH } = useWindowDimensions()

    const horizontalPadding = scale(42)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 3

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

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

    const handleTrackOrder = useCallback((orderId: string) => {
        console.log("Track order:", orderId)

        preventDoublePress(() => {
            router.push('/order-tracking')
        })
    }, [])

    const handleContactRider = useCallback((orderId: string) => {
        console.log("Contact rider:", orderId)

        preventDoublePress(() => {
            router.push('/rider-profile')
        })
    }, [])

    const handleReorder = useCallback((orderId: string) => {
        console.log("Reorder:", orderId)
    }, [])

    const handleInvoice = useCallback((orderId: string) => {
        console.log("Invoice:", orderId)

        preventDoublePress(() => {
            router.push('/order-invoice')
        })
    }, [])

    const renderActiveOrders = useCallback(
        ({ item }: { item: any }) => (
            <ActiveOrdersCard
                restaurantName={item.restaurantName}
                restaurantImage={item.restaurantImage}
                orderId={item.orderId}
                status={item.status}
                eta={item.eta}
                activeStep={item.activeStep}
                items={item.items}
                onTrackOrder={() => handleTrackOrder(item.id)}
                onContactRider={() => handleContactRider(item.id)}
            />
        ),
        [handleTrackOrder, handleContactRider]
    )

    const renderPastOrders = useCallback(
        ({ item }: { item: any }) => (
            <PastOrdersCard
                restaurantName={item.restaurantName}
                restaurantImage={item.restaurantImage}
                orderId={item.orderId}
                status={item.status}
                orderDate={item.orderDate}
                orderTime={item.orderTime}
                deliveryTime={item.deliveryTime}
                items={item.items}
                onReorder={() => handleReorder(item.id)}
                onInvoice={() => handleInvoice(item.id)}
            />
        ),
        [handleReorder, handleInvoice]
    )

    return(
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
                        zIndex: 10,
                    },
                    headerContainerStyle,
                ]}
            >
                <Animated.View
                    className="flex-row gap-2"
                    style={headerTitleStyle}
                    onLayout={(e) => {
                        const h = e.nativeEvent.layout.height
                        if (h > 0 && Math.abs(h - titleHeight) > 1) {
                            setTitleHeight(h)
                        }
                    }}
                >
                    <View className="items-start gap-1">
                        <Text
                            className="text-[#1F1F1F] font-extrabold"
                            style={{
                                fontSize: moderateScale(18),
                                marginTop: verticalScale(10),
                            }}
                        >
                            My Orders
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/65 font-medium"
                            style={{
                                fontSize: moderateScale(12)
                            }}
                        >
                            {`Track your active orders and revisit your\nprevious meals.`}
                        </Text>
                    </View>
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
                        placeholder="Search by restaurant, food or order ID"
                        onRightPress={() => {}}
                    />
                </View>
            </Animated.View>

            <Animated.FlatList
                ref={animatedRef}
                data={activeTab === "active orders" ? activeorders : pastOrders}
                renderItem={activeTab === "active orders" ? renderActiveOrders : renderPastOrders}
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
                    <View style={{ marginTop: verticalScale(78) }}>
                        <View className="flex-row items-center justify-center gap-3 mb-5">
                            <View
                                className="bg-white justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/85 font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Active
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(17) }}
                                >
                                    02
                                </Text>
                            </View>

                            <View
                                className="bg-white justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/85 font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Completed
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(17) }}
                                >
                                    48
                                </Text>
                            </View>

                            <View
                                className="bg-white justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/85 font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Total Saved
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(17) }}
                                >
                                    ₹4580
                                </Text>
                            </View>
                        </View>

                        <OrdersTabs activeTab={activeTab} onChange={setActiveTab} />
                    </View>
                }
            />
        </SafeAreaView>
    )
}