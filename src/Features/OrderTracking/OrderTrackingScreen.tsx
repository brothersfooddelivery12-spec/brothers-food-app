import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CallFilledIcon from '@/assets/icon/CallFilledIcon.svg'
import ChatFilledIcon from '@/assets/icon/ChatFilledIcon.svg'
import ClipboardFilledIcon from '@/assets/icon/ClipboardFilledIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import OrderPriceRow from '../Cart/Components/OrderPriceRow'
import OrderTimeline, { OrderStep } from './Components/OrderTimeline'

const orderSteps: OrderStep[] = [
    {
        id: "1",
        title: "Confirmed",
        time: "12:30 PM",
        completed: true,
    },
    {
        id: "2",
        title: "Preparing",
        time: "12:45 PM",
        completed: true,
    },
    {
        id: "3",
        title: "Picked Up",
        time: "01:00 PM",
        completed: true,
    },
    {
        id: "4",
        title: "Near You",
        time: "Pending",
        completed: false,
    },
]

export default function OrderTrackingScreen() {
    const isOnline = true
    const insets = useSafeAreaInsets()
    const [isExpanded, setIsExpanded] = useState(false)

    const progress = useSharedValue(0)
    const contentHeight = useSharedValue(0)

    const expandedMargin = verticalScale(14)

    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => {
            const next = !prev

            progress.value = withTiming(next ? 1 : 0, {
                duration: 300,
                easing: Easing.out(Easing.cubic),
            })

            return next
        })
    }, [])

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        height: contentHeight.value * progress.value,
        marginTop: expandedMargin * progress.value,
        opacity: progress.value,
        overflow: "hidden",
    }))

    const arrowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(
                    progress.value,
                    [0, 1],
                    [0, 180]
                )}deg`,
            },
        ],
    }))
    
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
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Order Tracking
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Order ID: #BFD-882941
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: verticalScale(25)
                }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="w-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        marginTop: verticalScale(180),
                        borderTopLeftRadius: moderateScale(22),
                        borderTopRightRadius: moderateScale(22),
                        paddingHorizontal: moderateScale(14),
                        paddingTop: verticalScale(14)
                    }}
                >
                    <View className='flex-row items-center mx-1'>
                        <View className='justify-center flex-1'>
                            <Text
                                className='font-bold'
                                style={{
                                    fontSize: moderateScale(16),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Rider is on the way
                            </Text>

                            <Text
                                className='font-bold mt-1'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                From Burger Castle
                            </Text>
                        </View>

                        <View
                            className="items-center justify-center rounded-full"
                            style={{
                                backgroundColor: COLORS.accentLightColor,
                                width: moderateScale(44),
                                height: moderateScale(44)
                            }}
                        >
                            <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} />
                        </View>
                    </View>

                    <View 
                        className='flex-row gap-2 items-center p-3'
                        style={{
                            backgroundColor: COLORS.primaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            borderRadius: moderateScale(20),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <View className="relative self-start">
                            <Image
                                source={require("@/assets/images/profile-placeholder.jpg")}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                style={{
                                    width: moderateScale(62),
                                    height: moderateScale(62),
                                    borderRadius: moderateScale(90),
                                    borderWidth: 1.5,
                                    borderColor: COLORS.accentLightColor
                                }}
                            />
                        
                            <View
                                className="absolute items-center justify-center"
                                style={{
                                    backgroundColor: isOnline
                                        ? COLORS.activeStatusTextColor
                                        : COLORS.neutralSurfaceColor,
                                    borderColor: COLORS.primaryBackgroundColor,
                                    borderWidth: 1.5,
                                    width: moderateScale(15),
                                    height: moderateScale(15),
                                    bottom: verticalScale(0),
                                    right: moderateScale(6),
                                    alignSelf: "flex-end",
                                    borderRadius: moderateScale(90)
                                }}
                            >
                            </View>
                        </View>

                        <View className='justify-center flex-1 ml-1'>
                            <Text
                                className='font-bold'
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Rahul Sharma
                            </Text>

                            <Text
                                className='font-medium mt-1'
                                style={{
                                    fontSize: moderateScale(10),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                Honda Activa • RJ 22XX 1234
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="items-center justify-center py-4 px-5 gap-1"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                width: moderateScale(55),
                                height: moderateScale(55),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <CallFilledIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryBackgroundColor} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: COLORS.primaryBackgroundColor
                                }}
                            >
                                Call
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="items-center justify-center py-4 px-5 gap-1"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                width: moderateScale(55),
                                height: moderateScale(55),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <ChatFilledIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryBackgroundColor} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: COLORS.primaryBackgroundColor
                                }}
                            >
                                Chat
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <OrderTimeline steps={orderSteps} />

                    <View
                        className="px-3 py-4"
                        style={{
                            backgroundColor: COLORS.primaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            borderRadius: moderateScale(18),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={toggleExpanded}
                            className="flex-row gap-3 items-center"
                        >
                            <ClipboardFilledIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} />

                            <View className="justify-center flex-1">
                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Order Summary
                                </Text>

                                <Text
                                    className="font-medium mt-1"
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    3 items • {isExpanded ? "Hide details" : "View details"}
                                </Text>
                            </View>

                            <Text
                                className="font-black tracking-wide"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                ₹710
                            </Text>

                            <Animated.View
                                style={[
                                    arrowAnimatedStyle,
                                    {
                                        width: moderateScale(26),
                                        height: moderateScale(26)
                                    }
                                ]}
                                className="items-center justify-center rounded-full"
                            >
                                <ArrowDownIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryTextColor} />
                            </Animated.View>
                        </TouchableOpacity>

                        <Animated.View style={contentAnimatedStyle}>
                            <View
                                className="p-5 w-full"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderRadius: moderateScale(18),
                                    borderWidth: moderateScale(0.5)
                                }}
                            >
                                <Text
                                    className="font-bold"
                                    style={{
                                        color: COLORS.primaryTextColor,
                                        fontSize: moderateScale(14),
                                        marginBottom: verticalScale(8)
                                    }}
                                >
                                    Order Summary
                                </Text>

                                <OrderPriceRow label="Item Total" value={707} />

                                <OrderPriceRow label="Delivery Fee" value="FREE" />

                                <OrderPriceRow label="Platform Fee" value={5} />

                                <OrderPriceRow label="Restaurant Packing" value={20} />

                                <OrderPriceRow label="GST and Taxes" value={38} />

                                <View
                                    className="items-center flex-row justify-center mt-3 -mx-1"
                                    style={{
                                        backgroundColor: COLORS.activeStatusBackgroundColor,
                                        paddingHorizontal: scale(12),
                                        paddingVertical: verticalScale(8),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <Text
                                        className="font-semibold flex-1"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.activeStatusTextColor
                                        }}
                                    >
                                        Coupon Savings
                                    </Text>

                                    <Text
                                        className="font-bold"
                                        style={{
                                            fontSize: moderateScale(14),
                                            color: COLORS.activeStatusTextColor
                                        }}
                                    >
                                        -₹100
                                    </Text>
                                </View>

                                <View
                                    className="items-center flex-row justify-center mt-3 -mx-1"
                                    style={{
                                        backgroundColor: COLORS.activeStatusBackgroundColor,
                                        paddingHorizontal: scale(12),
                                        paddingVertical: verticalScale(8),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <Text
                                        className="font-semibold flex-1"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: COLORS.activeStatusTextColor
                                        }}
                                    >
                                        Reward Points Used
                                    </Text>

                                    <Text
                                        className="font-bold"
                                        style={{
                                            fontSize: moderateScale(14),
                                            color: COLORS.activeStatusTextColor
                                        }}
                                    >
                                        -₹50
                                    </Text>
                                </View>

                                <View
                                    className="rounded-full"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                                        height: verticalScale(0.7),
                                        marginVertical: verticalScale(12),
                                        marginHorizontal: verticalScale(2)
                                    }}
                                />

                                <View className="flex-row justify-between items-center">
                                    <Text
                                        className="font-extrabold"
                                        style={{
                                            fontSize: moderateScale(15),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                        }}
                                    >
                                        Grand Total
                                    </Text>

                                    <Text
                                        className="font-black tracking-wide"
                                        style={{
                                            fontSize: moderateScale(16),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        ₹620
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>

                        <View
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                left: scale(12),
                                right: scale(12),
                                opacity: 0,
                                zIndex: -1
                            }}
                            onLayout={(event) => {
                                const height = event.nativeEvent.layout.height

                                if (height > 0 && height !== contentHeight.value) {
                                    contentHeight.value = height
                                }
                            }}
                        >
                            <View
                                className="p-5 w-full"
                                style={{

                                    borderRadius: moderateScale(18),
                                    borderWidth: moderateScale(0.5)
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

                                <OrderPriceRow label="Item Total" value={707} />
                                <OrderPriceRow label="Delivery Fee" value="FREE" />
                                <OrderPriceRow label="Platform Fee" value={5} />
                                <OrderPriceRow label="Restaurant Packing" value={20} />
                                <OrderPriceRow label="GST and Taxes" value={38} />

                                <View
                                    className="items-center flex-row bg-[#E3F2E8] mt-3 -mx-1"
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
                                        -₹100
                                    </Text>
                                </View>

                                <View
                                    className="items-center flex-row bg-[#E3F2E8] mt-3 -mx-1"
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
                                        Reward Points Used
                                    </Text>

                                    <Text
                                        className="text-[#4D9151] font-bold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        -₹50
                                    </Text>
                                </View>

                                <View
                                    className="rounded-full bg-[#E8DDD3]/65"
                                    style={{
                                        height: verticalScale(0.7),
                                        marginVertical: verticalScale(12),
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
                                        className="text-[#1F1F1F] font-black"
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        ₹620
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View 
                        className='p-4 flex-row gap-3'
                        style={{
                            backgroundColor: COLORS.primaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            borderRadius: moderateScale(18),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <View
                            className="items-center justify-center rounded-full"
                            style={{
                                width: moderateScale(44),
                                height: moderateScale(44),
                                backgroundColor: COLORS.primaryColor
                                                
                            }}
                        >
                            <HomeIcon width={moderateScale(21)} height={moderateScale(21)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />
                        </View>
                        
                        <View
                            className="flex-1 items-start gap-1"
                            style={{
                                minWidth: 0,
                                paddingRight: moderateScale(25)
                            }}
                        >
                            <Text
                                className="font-bold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Delivering to
                            </Text>
                        
                            <Text
                                className="font-semibold mt-1"
                                style={{
                                    fontSize: moderateScale(13),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Harsh Suthar
                            </Text>
                        
                            <Text
                                className="font-medium"
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                    fontSize: moderateScale(11),
                                    lineHeight: moderateScale(15),
                                    width: "100%"
                                }}
                            >
                                House No. 24, Heritage Enclave, Sumerpur, Rajasthan - 306902
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="flex-row gap-2 items-center justify-center mx-5"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            marginTop: verticalScale(20),
                            borderRadius: moderateScale(28),
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(12)
                        }}
                    >
                        <ShareIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryBackgroundColor} />
                    
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(14),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Share Tracking
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}