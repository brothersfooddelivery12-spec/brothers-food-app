import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BagIcon from '@/assets/icon/CartIcon.svg'
import CardIcon from '@/assets/icon/MoneyIcon.svg'
import TagIcon from '@/assets/icon/OfferIcon.svg'
import SettingIcon from '@/assets/icon/SettingIcon.svg'
import { getNotificationGroup } from '@/utils/notificationUtils'
import { router } from "expo-router"
import { useMemo, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import NotificationCard, { NotificationItem } from './Components/NotificationCard'

const NOTIFICATION_CATEGORIES = [
    {
        id: "all",
        title: "All",
        count: 13,
        icon: null
    },
    {
        id: "orders",
        title: "Orders",
        icon: BagIcon
    },
    {
        id: "offers",
        title: "Offers",
        icon: TagIcon
    },
    {
        id: "payments",
        title: "Payments",
        icon: CardIcon
    }
]

const NOTIFICATIONS: NotificationItem[] = [
    // TODAY
    {
        id: "1",
        type: "order",
        title: "Delivery Rider is Nearby",
        description:
            "Your order will arrive in 5 minutes.",
        createdAt: "2026-09-01T20:45:00",
        unread: true,
    },
    {
        id: "2",
        type: "payment",
        title: "Payment Successful",
        description:
            "Payment of ₹710 completed successfully.",
        createdAt: "2026-09-01T14:20:00",
        unread: false,
    },
    {
        id: "5",
        type: "default",
        title: "Welcome to Brothers!",
        description:
            "Thanks for joining us. Discover delicious food, exclusive offers, and exciting rewards.",
        createdAt: "2026-09-01T10:15:00",
        unread: true,
    },

    // YESTERDAY
    {
        id: "3",
        type: "restaurant",
        title: "The Pizza Hub has opened near you",
        description:
            "Discover authentic Neapolitan pizzas.",
        createdAt: "2026-08-31T19:30:00",
        restaurantId: "pizza-hub",
        image:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        unread: false,
    },
    {
        id: "6",
        type: "default",
        title: "Your Reward Points Are Waiting",
        description:
            "You have 2,450 reward points available. Redeem them on your next order.",
        createdAt: "2026-08-31T12:45:00",
        unread: false,
    },

    // EARLIER
    {
        id: "4",
        type: "flash_sale",
        badge: "FLASH SALE: BURGER FEST",
        title: "Flat 40% OFF on all burgers.",
        description:
            "Valid for the next 2 hours only.",
        createdAt: "2026-08-28T12:30:00",
        offerId: "burger-fest",
        unread: true,
    },
]

export default function NotificationScreen(){
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const preventDoublePress = usePreventDoublePress()
    const [selectedCategory, setSelectedCategory] = useState("all")

    const horizontalPadding = scale(42)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 3

    const groupedNotifications = useMemo(() => {
        const groups = {
            Today: [] as NotificationItem[],
            Yesterday: [] as NotificationItem[],
            Earlier: [] as NotificationItem[],
        }

        NOTIFICATIONS.forEach((item) => {
            const group = getNotificationGroup(item.createdAt)

            groups[group].push(item)
        })

        return groups
    }, [])

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
                    marginBottom: verticalScale(12),
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
                        Notifications
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Stay updated on orders, offers, and more
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => 
                        preventDoublePress(() => {
                            router.push('/notification-preferences')
                        })
                    }
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <SettingIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={1.5} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={[{}]}
                renderItem={null}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: verticalScale(4),
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-2"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(10),
                            }}
                        >
                            {NOTIFICATION_CATEGORIES.map((category) => {
                                const isSelected = selectedCategory === category.id
                                const Icon = category.icon

                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.9}
                                        onPress={() => setSelectedCategory(category.id)}
                                        className={`flex-row items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#FAF5EF]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(22),
                                            paddingHorizontal: scale(14),
                                            paddingVertical: verticalScale(5),
                                            gap: scale(5),

                                            borderWidth: 1,
                                            borderColor: isSelected ? "#3F2516" : "#F1E7DC"
                                        }}
                                    >
                                        {Icon && (
                                            <Icon
                                                width={moderateScale(18)}
                                                height={moderateScale(18)}
                                                color={ isSelected ? "#FFFFFF" : "#5A3825" }
                                                strokeWidth={1.5}
                                            />
                                        )}

                                        <Text
                                            className={`font-semibold ${
                                                isSelected ? "text-white" : "text-[#5A3825]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {category.title}
                                        </Text>

                                        {category.count !== undefined && (
                                            <View
                                                className={ isSelected ? "bg-white/15" : "bg-[#5A3825]/10" }
                                                style={{
                                                    minWidth: moderateScale(23),
                                                    height: moderateScale(23),
                                                    paddingHorizontal: scale(4),
                                                    borderRadius: moderateScale(13),

                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <Text
                                                    className={`font-bold ${
                                                        isSelected ? "text-white" : "text-[#5A3825]"
                                                    }`}
                                                    style={{ fontSize: moderateScale(9) }}
                                                >
                                                    {category.count}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View className="flex-row items-center justify-center gap-3 mt-4">
                            <View
                                className="bg-white justify-center items-center border border-[#1F1F1F]/10 py-4 px-5 gap-1"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(22) }}
                                >
                                    12
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Unread
                                </Text>
                            </View>

                            <View
                                className="bg-white justify-center items-center border border-[#1F1F1F]/10 py-4 px-5 gap-1"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(22) }}
                                >
                                    8
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Today
                                </Text>
                            </View>

                            <View
                                className="bg-white justify-center items-center border border-[#1F1F1F]/10 py-4 px-5 gap-1"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(22)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F] font-extrabold"
                                    style={{ fontSize: moderateScale(22) }}
                                >
                                    5
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Offers
                                </Text>
                            </View>
                        </View>

                        <View>
                            {Object.entries(groupedNotifications).map(
                                ([section, items]) => {
                                    if (items.length === 0) return null

                                    return (
                                        <View
                                            key={section}
                                            style={{ marginBottom: verticalScale(6) }}
                                        >
                                            <Text
                                                className='text-[#1F1F1F] font-bold mt-4 mb-4'
                                                style={{ fontSize: moderateScale(16) }}
                                            >
                                                {section}
                                            </Text>

                                            <View
                                                style={{ gap: verticalScale(10) }}
                                            >
                                                {items.map((item) => (
                                                    <NotificationCard
                                                        key={item.id}
                                                        item={item}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    )
                                }
                            )}
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}