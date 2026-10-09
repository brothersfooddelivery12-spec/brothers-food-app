import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import SearchBar from "@/components/SearchBar"
import { COLORS } from '@/constant/colors'
import { cancelOrder, getOrderById, getUserOrders, OrderListItem, OrderListStatus } from "@/Services/api-service"
import { hideLoader, showLoader } from '@/Services/loader-service'
import { hexToRgba } from '@/utils/hexToRgba'
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
import AccountActionDialog from '../Profile/Components/AccountActionDialog'
import ActiveOrdersCard from "./Components/ActiveOrdersCard"
import OrdersTabs from "./Components/OrdersTab"
import PastOrdersCard from "./Components/PastOrdersCard"
import RetryPaymentModal, { OrderSuccessParams, RetryPaymentOrder } from './Components/RetryPaymentModal'

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

    const [cancelDialogVisible, setCancelDialogVisible] = useState(false)
    const [orderToCancel, setOrderToCancel] = useState<OrderListItem | null>(null)
    const [cancelOrderLoading, setCancelOrderLoading] = useState(false)

    const handleCancelOrder = useCallback(async (orderId: string): Promise<boolean> => {
        if (cancelOrderLoading) {
            return false
        }

        try {
            setCancelOrderLoading(true)

            const res = await cancelOrder(orderId)

            console.log("Cancel order response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to cancel order", "warning")

                return false
            }

            showToast(res.data.message || "Order cancelled successfully", "success")

            setCancelDialogVisible(false)
            setOrderToCancel(null)

            await fetchOrdersByTab("active orders", true)

            return true
        } catch (error: any) {
            console.log("Cancel order error:", error)

            showToast(error?.response?.data?.message || error?.message || "Unable to cancel order", "warning")

            return false
        } finally {
            setCancelOrderLoading(false)
        }
    },[cancelOrderLoading, fetchOrdersByTab])

    const [retryPaymentOrder, setRetryPaymentOrder] = useState<RetryPaymentOrder | null>(null)

    const handleCloseRetryPayment = useCallback(() => {
        setRetryPaymentOrder(null)
    }, [])

    const handleRetryPaymentSuccess = useCallback((params: OrderSuccessParams) => {
        // Close modal first
        setRetryPaymentOrder(null)

        router.push({
            pathname: "/order-success",
            params
        })
    }, [router])

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
                amount: order.final_total,
                paymentRetry: order.payment_retry,
                items: order.items,

                receiverName: order.receiver_name,
                receiverPhone: order.receiver_phone,
                addressLine: order.address_line,
                landmark: order.landmark,
                area: order.area,
                city: order.city,
                state: order.state,
                pincode: order.pincode
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
        return {
            active: activeOrders.length,
            past: pastOrders.length
        }
    }, [activeOrders, pastOrders])

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
                    onCancelOrder={() => {
                        setOrderToCancel(item)
                        setCancelDialogVisible(true)
                    }}
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
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}    
        >
            <StatusBar
                translucent
                backgroundColor={COLORS.primaryBackgroundColor}
                barStyle="dark-content"
            />

            <Animated.View
                className="w-full absolute left-0 right-0"
                style={[
                    {
                        top: insets.top,
                        paddingHorizontal: moderateScale(14),
                        zIndex: 10,
                        backgroundColor: COLORS.primaryBackgroundColor
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
                        className="font-extrabold"
                        style={{
                            color: COLORS.primaryTextColor,
                            fontSize: moderateScale(18),
                            marginTop: verticalScale(10),
                        }}
                    >
                        My Orders
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
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
                                className=" w-full items-center justify-center mx-2"
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
                                    <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.secondaryColor} />
                                </View>
    
                                <Text
                                    className="font-semibold"
                                    style={{
                                        color: COLORS.primaryTextColor,
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
                                    className="font-medium text-center"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
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
                                className="justify-center py-4 px-4 gap-2"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                    }}
                                >
                                    Active Orders
                                </Text>

                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(17),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    {orderStats.active}
                                </Text>
                            </View>

                            <View
                                className="justify-center py-4 px-5 gap-2"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                    }}
                                >
                                    Past Orders
                                </Text>

                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(17),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    {orderStats.past}
                                </Text>
                            </View>

                            <View
                                className="justify-center py-4 px-5 gap-2"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                    }}
                                >
                                    Completed
                                </Text>

                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(17),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    0
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

            {retryPaymentOrder && (
                <RetryPaymentModal
                    visible={retryPaymentOrder !== null}
                    orderId={retryPaymentOrder?.id ?? ""}
                    restaurantId={retryPaymentOrder?.restaurantId ?? ""}
                    restaurantName={retryPaymentOrder ?.restaurantName ?? ""}
                    amount={retryPaymentOrder?.amount ?? 0}
                    paymentRetry={retryPaymentOrder ?.paymentRetry ?? null}
                    items={retryPaymentOrder?.items ?? []}
                    receiverName={retryPaymentOrder.receiverName}
                    receiverPhone={retryPaymentOrder.receiverPhone}
                    addressLine={retryPaymentOrder.addressLine}
                    landmark={retryPaymentOrder.landmark}
                    area={retryPaymentOrder.area}
                    city={retryPaymentOrder.city}
                    state={retryPaymentOrder.state}
                    pincode={retryPaymentOrder.pincode}
                    onCancel={handleCloseRetryPayment}
                    onPaymentSuccess={handleRetryPaymentSuccess}
                />
            )}

            {cancelDialogVisible && (
                <AccountActionDialog
                    visible={cancelDialogVisible}
                    type="cancel-order"
                    loading={cancelOrderLoading}
                    restaurantName={orderToCancel?.restaurant_name}
                    onCancel={() => {
                        if (cancelOrderLoading) {
                            return
                        }

                        setCancelDialogVisible(false)
                        setOrderToCancel(null)
                    }}
                    onConfirm={async () => {
                        if (!orderToCancel || cancelOrderLoading) {
                            return
                        }

                        await handleCancelOrder(orderToCancel.id)
                    }}
                />
            )}
        </SafeAreaView>
    )
}