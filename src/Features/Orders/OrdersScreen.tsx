import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import SearchBar from "@/components/SearchBar"
import { cancelOrder, getOrderById, getUserOrders, OrderListItem, OrderListStatus } from "@/Services/api-service"
import { hideLoader, showLoader } from '@/Services/loader-service'
import { measureApi } from '@/utils/measureApiRes'
import { router, useFocusEffect } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { StatusBar, Text, useWindowDimensions, View } from "react-native"
import Animated, { Extrapolation, interpolate, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from "../hook/ToastContext"
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
import ActiveOrdersCard from "./Components/ActiveOrdersCard"
import OrdersTabs from "./Components/OrdersTab"
import PastOrdersCard from "./Components/PastOrdersCard"
import RetryPaymentModal, { RetryPaymentOrder } from './Components/RetryPaymentModal'

const TITLE_HEIGHT = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(46)
const PAGE_SIZE = 10

export default function OrdersScreen() {
    const insets = useSafeAreaInsets()
    const {showToast} = useToast()
    const preventDoublePress = usePreventDoublePress()
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions()
    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()

    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"active orders" | "past orders">("active orders")

    const activeOffsetRef = useRef(0)
    const pastOffsetRef = useRef(0)

    const activeHasMoreRef = useRef(true)
    const pastHasMoreRef = useRef(true)

    const requestInProgressRef = useRef({
        ACTIVE: false,
        PAST: false
    })

    const [activeOrders, setActiveOrders] = useState<OrderListItem[]>([])
    const [pastOrders, setPastOrders] = useState<OrderListItem[]>([])
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMoreActive, setHasMoreActive] = useState(true)
    const [hasMorePast, setHasMorePast] = useState(true)

    const fetchOrdersByTab = useCallback(async (
        tab: "active orders" | "past orders",
        reset = false
    ) => {
        const status: OrderListStatus = tab === "active orders"
            ? "ACTIVE"
            : "PAST"

        if (requestInProgressRef.current[status]) {
            console.log(`${status} request already in progress`)
            return
        }

        const hasMore = status === "ACTIVE"
            ? activeHasMoreRef.current
            : pastHasMoreRef.current

        if (!reset && !hasMore) {
            console.log(`No more ${status} orders to fetch`)
            return
        }

        const offset = reset
            ? 0
            : status === "ACTIVE"
                ? activeOffsetRef.current
                : pastOffsetRef.current

        console.log("Fetching orders:", {
            tab,
            status,
            reset,
            offset,
            limit: PAGE_SIZE
        })

        try {
            requestInProgressRef.current[status] = true

            if (reset) {
                setLoadingOrders(true)
            } else {
                setLoadingMore(true)
            }

            const res = await measureApi(
                status === "ACTIVE"
                    ? "Active Orders"
                    : "Past Orders",
                () =>
                    getUserOrders({
                        status,
                        offset,
                        limit: PAGE_SIZE
                    })
            )

            console.log(`${status} API response:`, res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch orders", "warning")

                return
            }

            const newOrders: OrderListItem[] = res.data.data ?? []

            console.log(`${status} new orders:`, newOrders)

            console.log(`${status} fetched count:`, newOrders.length)

            const hasMore = newOrders.length === PAGE_SIZE

            console.log(`${status} has more:`, hasMore)

            if (status === "ACTIVE") {
                if (reset) {
                    setActiveOrders(newOrders)

                    console.log("ACTIVE orders reset:", newOrders)
                } else {
                    setActiveOrders(prev => {
                        const updatedOrders = [
                            ...prev,
                            ...newOrders
                        ]

                        console.log("ACTIVE orders after append:", updatedOrders)

                        return updatedOrders
                    })
                }

                activeOffsetRef.current = offset + newOrders.length

                activeHasMoreRef.current = hasMore

                console.log("ACTIVE next offset:", activeOffsetRef.current)
            } else {
                if (reset) {
                    setPastOrders(newOrders)

                    console.log("PAST orders reset:", newOrders)
                } else {
                    setPastOrders(prev => {
                        const updatedOrders = [
                            ...prev,
                            ...newOrders
                        ]

                        console.log("PAST orders after append:", updatedOrders)

                        return updatedOrders
                    })
                }

                pastOffsetRef.current = offset + newOrders.length

                pastHasMoreRef.current = hasMore

                console.log("PAST next offset:", pastOffsetRef.current)
            }
        } catch (error: any) {
            console.log("Fetch orders error:", error?.response?.data ?? error)

            showToast(error?.response?.data?.message || error?.message || "Unable to fetch orders", "warning")
        } finally {
            requestInProgressRef.current[status] = false

            if (reset) {
                setLoadingOrders(false)
            } else {
                setLoadingMore(false)
            }
        }
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            fetchOrdersByTab(activeTab, true)
        }, [activeTab, fetchOrdersByTab])
    )

    const handleLoadMore = useCallback(() => {
        if (loadingOrders || loadingMore) {
            return
        }

        fetchOrdersByTab(activeTab, false)
    }, [activeTab, loadingOrders, loadingMore, fetchOrdersByTab])

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

    const ordersData = activeTab === "active orders" ? activeOrders : pastOrders

    const handleCancelOrder = useCallback(async (orderId: string) => {
        try {
            showLoader()

            const res = await cancelOrder(orderId)

            console.log("Cancel order response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to cancel order", "warning")

                return
            }

            showToast(res.data.message || "Order cancelled successfully", "success")
        } catch (error: any) {
            console.log("Cancel order error:", error)

            showToast(error?.response?.data?.message || error?.message || "Unable to cancel order", "warning")
        } finally{
            hideLoader()
        }

        await fetchOrdersByTab("active orders", true)
    },[fetchOrdersByTab])

    const [retryPaymentOrder, setRetryPaymentOrder] = useState<RetryPaymentOrder | null>(null)

    const handleCloseRetryPayment = useCallback(() => {
        setRetryPaymentOrder(null)
    }, [])

    const handleCanPay = useCallback(async (orderId: string) => {
        try {
            showLoader()

            const orderRes = await getOrderById(orderId)

            console.log("Order details response:", orderRes.data)

            if (!orderRes.data.success) {
                showToast(orderRes.data.message || "Unable to fetch order details", "info")

                return
            }

            const order = orderRes.data.data

            if (order.status !== "PENDING_PAYMENT" || !order.canpay) {
                showToast("Payment cannot be retried for this order.", "info")

                return
            }

            setRetryPaymentOrder({
                id: order.id,
                restaurantId: order.restaurant_id,
                restaurantName: order.restaurant_name,
                amount: Number(order.final_total) || 0,
                paymentRetry: order.payment_retry ?? null,
                items: order.items ?? []
            })
        } catch (error: any) {
            console.log("Order details error:", error?.response?.data || error)

            showToast(error?.response?.data?.message || "Unable to fetch order details", "warning")
        } finally {
            hideLoader()
        }
    },[])

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

    // const getOrderEta = (estimatedDeliveryAt?: string | null) => {
    //     if (!estimatedDeliveryAt) {
    //         return "Not available"
    //     }

    //     const estimatedTime = new Date(estimatedDeliveryAt).getTime()

    //     const now = new Date().getTime()

    //     const diffMinutes = Math.ceil((estimatedTime - now) / (1000 * 60))

    //     if (diffMinutes <= 0) {
    //         return "Arriving soon"
    //     }

    //     if (diffMinutes < 60) {
    //         return `${diffMinutes} mins`
    //     }

    //     const hours = Math.floor(diffMinutes / 60)

    //     const minutes = diffMinutes % 60

    //     if (hours < 24) {
    //         return minutes > 0
    //             ? `${hours}h ${minutes}m`
    //             : `${hours}h`
    //     }

    //     return new Date(estimatedDeliveryAt).toLocaleDateString(
    //         "en-IN",
    //         {
    //             day: "2-digit",
    //             month: "short"
    //         }
    //     )
    // }

    // const getRemainingTime = (remainingMinutes: number | null) => {
    //     if (remainingMinutes == null) {
    //         return "Arriving soon"
    //     }

    //     if (remainingMinutes <= 0) {
    //         return "Arriving soon"
    //     }

    //     return `${remainingMinutes} mins`
    // }

    const renderOrder = useCallback(({ item }: { item: OrderListItem }) => {
        if (activeTab === "active orders") {
            return (
                <ActiveOrdersCard
                    restaurantName={item.restaurant_name}
                    restaurantImage={item.restaurant_logo}
                    orderId={item.id}
                    status={item.status}
                    remainingMinutes={item.remaining_minutes}
                    estimatedDeliveryAt={item.estimated_delivery_at}
                    paymentDeadline={item.payment_deadline}
                    canPay={item.canpay}
                    iscancellable={item.iscancellable}
                    items={item.items}
                    onPayNow={() => handleCanPay(item.id)}
                    onCancelOrder={() => handleCancelOrder(item.id)}
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
                canPay={item.canpay}
                iscancellable={item.iscancellable}
                items={item.items}
                onReorder={() => handleReorder(item.id)}
                onInvoice={() => handleInvoice(item.id)}
        />
        )
    }, [activeTab, handleCancelOrder, handleCanPay,  handleReorder, handleInvoice, handleTrackOrder, handleContactRider])

    const loaderHeight = Math.max(
        verticalScale(250),
        SCREEN_HEIGHT - insets.top -
        titleHeight - searchBarHeight - verticalScale(180)
    )

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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

            <Animated.FlatList
                ref={animatedRef}
                data={loadingOrders ? [] : ordersData}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
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
                    !loadingOrders ? (
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
                    ) : null
                }
                ListHeaderComponent={
                    <View style={{ marginTop: verticalScale(4) }}>
                        <View className="flex-row items-center justify-center gap-3 mb-5">
                            <View
                                className="bg-[#FAFAFA] justify-center border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    borderWidth: moderateScale(0.5),
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
                                className="bg-[#FAFAFA] justify-center border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    borderWidth: moderateScale(0.5),
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
                                className="bg-[#FAFAFA] justify-center border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    borderWidth: moderateScale(0.5),
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

                        {loadingOrders && (
                            <View
                                className="items-center justify-center"
                                style={{ minHeight: loaderHeight }}
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
                        )}
                    </View>
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View
                            className="items-center justify-center"
                            style={{ paddingTop: verticalScale(16) }}
                        >
                            <LottieView
                                source={require(
                                    "../../../assets/animations/Loading3.json"
                                )}
                                autoPlay
                                loop
                                style={{
                                    width: moderateScale(45),
                                    height: moderateScale(45)
                                }}
                            />
                        </View>
                    ) : null
                }
            />

            <RetryPaymentModal
                visible={!!retryPaymentOrder}
                orderId={retryPaymentOrder?.id ?? ""}
                restaurantId={retryPaymentOrder?.restaurantId ?? ""}
                restaurantName={retryPaymentOrder ?.restaurantName ?? ""}
                amount={retryPaymentOrder?.amount ?? 0}
                paymentRetry={retryPaymentOrder ?.paymentRetry ?? null}
                items={retryPaymentOrder?.items ?? []}
                onCancel={handleCloseRetryPayment}
            />
        </SafeAreaView>
    )
}