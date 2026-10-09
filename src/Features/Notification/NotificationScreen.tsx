import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BagIcon from '@/assets/icon/CartIcon.svg'
import CardIcon from '@/assets/icon/MoneyIcon.svg'
import TagIcon from '@/assets/icon/OfferIcon.svg'
import SettingIcon from '@/assets/icon/SettingIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { router } from "expo-router"
import { useCallback, useMemo, useState } from 'react'
import { ScrollView, SectionList, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
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
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const preventDoublePress = usePreventDoublePress()
    const [selectedCategory, setSelectedCategory] = useState("all")

    const horizontalPadding = scale(42)
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 3

    const getNotificationSection = (createdAt: string) => {
        const notificationDate = new Date(createdAt)

        const today = new Date()
        const yesterday = new Date()

        yesterday.setDate(today.getDate() - 1)

        const isSameDay = (a: Date, b: Date) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()

        if (isSameDay(notificationDate, today)) {
            return "Today"
        }

        if (isSameDay(notificationDate, yesterday)) {
            return "Yesterday"
        }

        return notificationDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }
    
    const notificationSections = useMemo(() => {
        const grouped: Record<string, NotificationItem[]> = {}

        NOTIFICATIONS.forEach((notification) => {
            const section = getNotificationSection(
                notification.createdAt
            )

            if (!grouped[section]) {
                grouped[section] = []
            }

            grouped[section].push(notification)
        })

        return Object.entries(grouped).map(([title, data]) => ({
            title,
            data
        }))
    }, [])

    const renderNotification = useCallback(
        ({ item }: { item: NotificationItem }) => (
            <NotificationCard
                item={item}
            />
        ),[]
    )

    const renderNotificationSectionHeader = useCallback(
        ({ section }: {
            section: {
                title: string
                data: NotificationItem[]
            }
        }) => (
            <Text
                className="font-semibold"
                style={{
                    color: COLORS.primaryTextColor,
                    fontSize: moderateScale(15),
                    marginBottom: verticalScale(2),
                    marginLeft: scale(4)
                }}
            >
                {section.title}
            </Text>
        ),[]
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
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>
                    
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Notifications
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <SettingIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={1.5} />
                </TouchableOpacity>
            </View>

            <SectionList
                sections={notificationSections}
                renderItem={renderNotification}
                renderSectionHeader={renderNotificationSectionHeader}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25),
                    gap: verticalScale(8)
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
                                        className="flex-row items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected
                                                ? COLORS.primaryColor
                                                : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                            borderRadius: moderateScale(22),
                                            paddingHorizontal: scale(14),
                                            paddingVertical: verticalScale(5),
                                            gap: scale(5),

                                            borderWidth: 0.7,
                                            borderColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor
                                        }}
                                    >
                                        {Icon && (
                                            <Icon
                                                width={moderateScale(18)}
                                                height={moderateScale(18)}
                                                color={ isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor }
                                                strokeWidth={1.5}
                                            />
                                        )}

                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(13),
                                                color: isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                            }}
                                        >
                                            {category.title}
                                        </Text>

                                        {category.count !== undefined && (
                                            <View
                                                style={{
                                                    backgroundColor: isSelected
                                                        ? hexToRgba(COLORS.primaryBackgroundColor, 0.15)
                                                        : hexToRgba(COLORS.secondaryColor, 0.1),
                                                    minWidth: moderateScale(23),
                                                    height: moderateScale(23),
                                                    paddingHorizontal: scale(4),
                                                    borderRadius: moderateScale(13),

                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <Text
                                                    className="font-bold"
                                                    style={{
                                                        fontSize: moderateScale(9),
                                                        color: isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                                    }}
                                                >
                                                    {category.count}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View className="flex-row items-center justify-center gap-3 mt-4 mb-2">
                            <View
                                className="justify-center items-center py-4 px-5 gap-1"
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
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(22),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    12
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Unread
                                </Text>
                            </View>

                            <View
                                className="justify-center items-center py-4 px-5 gap-1"
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
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(22),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    8
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Today
                                </Text>
                            </View>

                            <View
                                className="justify-center items-center py-4 px-5 gap-1"
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
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(22),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    5
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Offers
                                </Text>
                            </View>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}