import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import SearchBar from "@/components/SearchBar"
import { getUserOrders, OrderListItem } from "@/Services/api-service"
import { router, useFocusEffect } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useMemo, useState } from "react"
import { StatusBar, Text, useWindowDimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from "../hook/ToastContext"
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import ActiveOrdersCard from "./Components/ActiveOrdersCard"
import OrdersTabs from "./Components/OrdersTab"
import PastOrdersCard from "./Components/PastOrdersCard"

const TITLE_HEIGHT = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(46)

export default function OrdersScreen() {
    const insets = useSafeAreaInsets()
    const {showToast} = useToast()
    const preventDoublePress = usePreventDoublePress()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()

    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"active orders" | "past orders">("active orders")

    type OrderListStatus = "ACTIVE" | "PAST"

    const [activeOrders, setActiveOrders] = useState<OrderListItem[]>([])
    const [pastOrders, setPastOrders] = useState<OrderListItem[]>([])
    const [loadingActiveOrders, setLoadingActiveOrders] = useState(false)
    const [loadingPastOrders, setLoadingPastOrders] = useState(false)

    const fetchOrders = useCallback(async (status: OrderListStatus) => {
        const setLoading = status === "ACTIVE"
            ? setLoadingActiveOrders
            : setLoadingPastOrders

        try {
            setLoading(true)

            const res = await getUserOrders({
                status,
                offset: 0,
                limit: 20
            })

            console.log(`${status} orders:`, res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch orders", "warning")

                return
            }

            const data = res.data.data ?? []

            if (status === "ACTIVE") {
                setActiveOrders(data)
            } else {
                setPastOrders(data)
            }
        } catch (error: any) {
            console.log(`Fetch ${status} orders error:`, error)

            showToast(error?.message || "Unable to fetch orders", "warning")
        } finally {
            setLoading(false)
        }
    },[])

    const [loadingOrders, setLoadingOrders] = useState(false)
    
    useFocusEffect(
        useCallback(() => {
            let isMounted = true

            const loadOrders = async () => {
                try {
                    if (isMounted) {
                        setLoadingOrders(true)
                    }

                    await Promise.allSettled([
                        fetchOrders("ACTIVE"),
                        fetchOrders("PAST")
                    ])
                } finally {
                    if (isMounted) {
                        setLoadingOrders(false)
                    }
                }
            }

            loadOrders()

            return () => {
                isMounted = false
            }
        }, [fetchOrders])
    )

    const horizontalPadding = scale(42)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 3

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

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

    const ordersData = activeTab === "active orders"
        ? activeOrders
        : pastOrders

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

    const orderStats = useMemo(() => {
        const active = activeOrders.length

        const completed = pastOrders.filter(
            order => order.status === "DELIVERED"
        ).length

        return {
            active,
            completed
        }
    }, [activeOrders, pastOrders])

    const getOrderEta = (estimatedDeliveryAt?: string | null) => {
        if (!estimatedDeliveryAt) {
            return "Not available"
        }

        const estimatedTime = new Date(estimatedDeliveryAt).getTime()

        const now = new Date().getTime()

        const diffMinutes = Math.ceil((estimatedTime - now) / (1000 * 60))

        if (diffMinutes <= 0) {
            return "Arriving soon"
        }

        if (diffMinutes < 60) {
            return `${diffMinutes} mins`
        }

        const hours = Math.floor(diffMinutes / 60)

        const minutes = diffMinutes % 60

        if (hours < 24) {
            return minutes > 0
                ? `${hours}h ${minutes}m`
                : `${hours}h`
        }

        return new Date(estimatedDeliveryAt).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short"
            }
        )
    }

    const renderOrder = useCallback(({ item }: { item: OrderListItem }) => {
        if (activeTab === "active orders") {
            return (
                <ActiveOrdersCard
                    restaurantName={item.restaurant_name}
                    restaurantImage={item.restaurant_logo}
                    orderId={item.id}
                    status={item.status}
                    eta={getOrderEta(item.estimated_delivery_at)}
                    items={item.items}
                    onTrackOrder={() => handleTrackOrder(item.id)}
                    onContactRider={() => handleContactRider(item.id)}
                />
            )
        }

        return (
            <PastOrdersCard
                restaurantName={item.restaurant_name}
                restaurantImage={item.restaurant_logo}
                orderId={item.id}
                status={item.status}
                estimatedDeliveryAt={item.estimated_delivery_at}
                items={item.items}
                onReorder={() => handleReorder(item.id)}
                onInvoice={() => handleInvoice(item.id)}
        />
        )
    }, [activeTab, handleReorder, handleInvoice, handleTrackOrder, handleContactRider])

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
                            marginTop: verticalScale(10),
                        }}
                    >
                        My Orders
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{
                            fontSize: moderateScale(12),
                            marginTop: verticalScale(2)
                        }}
                    >
                        Track your active orders and revisit your previous meals.
                    </Text>
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
                        placeholder="Search by restaurant, food or order ID"
                    />
                </View>
            </Animated.View>

            {loadingOrders ? (
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
                    data={ordersData}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: scale(14),
                        paddingTop: titleHeight + searchBarHeight,
                        paddingBottom: verticalScale(88),
                        flexGrow: ordersData.length === 0 ? 1 : undefined
                    }}
                    ListEmptyComponent={
                        <View
                            className="flex-1 w-full items-center justify-center"
                            style={{ paddingVertical: verticalScale(20) }}
                        >
                            <View
                                className=" w-full items-center justify-center mx-2 bg-white border border-[#1F1F1F]/10"
                                style={{
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
                                    <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color="#5A3825" />
                                </View>
    
                                <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    {activeTab === "active orders"
                                        ? "No Active Orders"
                                        : "No Past Orders"
                                    }
                                </Text>
    
                                <Text
                                    className="text-[#1F1F1F]/75 font-medium text-center"
                                    style={{
                                        fontSize: moderateScale(11),
                                        marginTop: verticalScale(3)
                                    }}
                                >
                                    {activeTab === "active orders"
                                        ? "You don't have any active orders right now."
                                        : "Your completed and cancelled orders will appear here."
                                    }
                                </Text>
                            </View>
                        </View>
                    }
                    ListHeaderComponent={
                        <View style={{ marginTop: verticalScale(4) }}>
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
                                        {orderStats.active}
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
                                        {orderStats.completed}
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
                                        ₹0
                                    </Text>
                                </View>
                            </View>
    
                            <OrdersTabs activeTab={activeTab} onChange={setActiveTab} />
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    )
}