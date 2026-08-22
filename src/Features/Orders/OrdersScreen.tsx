import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import Animated, { interpolate, Extrapolation, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, scrollTo } from "react-native-reanimated"
import { useCallback, useEffect, useState } from "react"
import { ScrollView, StatusBar, Text, View } from "react-native"
import SearchBar from "@/components/SearchBar"
import OrdersTabs from "./Components/OrdersTab"
import { activeorders } from "@/constant/ActiveOrdersData"
import ActiveOrdersCard from "./Components/ActiveOrdersCard"

const TITLE_HEIGHT = verticalScale(48)
const SEARCH_BAR_HEIGHT = verticalScale(46) 

export default function OrdersScreen() {
    const insets = useSafeAreaInsets()
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const animatedRef = useAnimatedRef<Animated.FlatList<any>>()
    const [titleHeight, setTitleHeight] = useState(TITLE_HEIGHT)
    const [activeTab, setActiveTab] = useState<"active orders" | "past orders">("active orders")

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
    }, [])

    const handleContactRider = useCallback((orderId: string) => {
        console.log("Contact rider:", orderId)
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
                        marginBottom: verticalScale(10),
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
                 data={activeorders}
                renderItem={renderActiveOrders}
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
                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mb-6"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(10),
                            }}
                        >
                            <View
                                className="bg-[#3F2516] py-4 px-5 gap-2 justify-center"
                                style={{
                                    width: moderateScale(115),
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(24)
                                }}
                            >
                                <Text
                                    className="text-[#FFFFFF]/85 font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Active
                                </Text>

                                <Text
                                    className="text-[#FFFFFF] font-bold"
                                    style={{ fontSize: moderateScale(17) }}
                                >
                                    02
                                </Text>
                            </View>

                            <View
                                className="bg-white justify-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                                style={{
                                    width: moderateScale(115),
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(24)
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
                                    width: moderateScale(115),
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(24)
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
                        </ScrollView>

                        <OrdersTabs activeTab={activeTab} onChange={setActiveTab} />
                    </View>
                }
            />
        </SafeAreaView>
    )
}