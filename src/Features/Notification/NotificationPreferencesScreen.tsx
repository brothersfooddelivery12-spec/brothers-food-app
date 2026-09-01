import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import HistoryIcon from '@/assets/icon/ClockIcon2.svg'
import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { router } from "expo-router"
import { useState } from 'react'
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import NotificationPreferenceCard, { NotificationPreference } from './Components/NotificationPreferenceCard'
import NotificationScheduleCard from './Components/NotificationScheduleCard'

export default function NotificationPreferencesScreen(){
    const insets = useSafeAreaInsets()
    const [doNotDisturb, setDoNotDisturb] = useState(false)
    const [startTime, setStartTime] = useState(new Date(2026, 0, 1, 22, 0))
    const [endTime, setEndTime] = useState(new Date(2026, 0, 1, 8, 0))
    const [timePicker, setTimePicker] = useState<"start" | "end" | null>(null)

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
    }

    const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setTimePicker(null)

        if (event.type === "dismissed" || !selectedDate) {
            return
        }

        if (timePicker === "start") {
            setStartTime(selectedDate)
        }

        if (timePicker === "end") {
            setEndTime(selectedDate)
        }
    }

    const [orderPreferences, setOrderPreferences] =
    useState<NotificationPreference[]>([
        {
            id: "order_accepted",
            title: "Order Accepted",
            enabled: false
        },
        {
            id: "preparing",
            title: "Preparing",
            enabled: false
        },
        {
            id: "out_for_delivery",
            title: "Out for Delivery",
            enabled: false
        },
        {
            id: "delivered",
            title: "Delivered",
            enabled: false
        },
        {
            id: "refunds",
            title: "Refunds",
            enabled: false
        }
    ])

    const [offerPreferences, setOfferPreferences] =
    useState<NotificationPreference[]>([
        {
            id: "coupons",
            title: "Coupons",
            enabled: false
        },
        {
            id: "festival_offers",
            title: "Festival Offers",
            enabled: false
        },
        {
            id: "new_restaurants",
            title: "New Restaurants",
            enabled: false
        },
        {
            id: "flash_sales",
            title: "Flash Sales",
            enabled: false
        },
        {
            id: "rewards",
            title: "Rewards",
            enabled: false
        }
    ])

    const [accountPreferences, setAccountPreferences] =
    useState<NotificationPreference[]>([
        {
            id: "login_activity",
            title: "Login Activity",
            enabled: false
        },
        {
            id: "security",
            title: "Security",
            enabled: false
        },
        {
            id: "password",
            title: "Password",
            enabled: false
        },
        {
            id: "payment",
            title: "Payment",
            enabled: false
        }
    ])

    const [reminderPreferences, setReminderPreferences] =
    useState<NotificationPreference[]>([
        {
            id: "complete_checkout",
            title: "Complete Checkout",
            enabled: false
        },
        {
            id: "rate_order",
            title: "Rate Order",
            enabled: false
        },
        {
            id: "reorder",
            title: "Reorder",
            enabled: false
        },
        {
            id: "favorites",
            title: "Favorites",
            enabled: false
        }
    ])

    const [communicationPreferences, setCommunicationPreferences] =
    useState<NotificationPreference[]>([
        {
            id: "push_notifications",
            title: "Push Notifications",
            enabled: false
        },
        {
            id: "sms_messages",
            title: "SMS Messages",
            enabled: false
        },
        {
            id: "email",
            title: "Email",
            enabled: false
        },
        {
            id: "whatsapp",
            title: "WhatsApp",
            enabled: false
        },
        {
            id: "phone_calls",
            title: "Phone Calls",
            enabled: false
        }
    ])

    const handleOrderToggle = (
        id: string,
        enabled: boolean
    ) => {
        setOrderPreferences((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        enabled
                    }
                    : item
            )
        )
    }

    const handleOfferToggle = (
        id: string,
        enabled: boolean
    ) => {
        setOfferPreferences((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        enabled
                    }
                    : item
            )
           )
    }

    const handleAccountToggle = (
        id: string,
        enabled: boolean
    ) => {
        setAccountPreferences((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        enabled
                    }
                    : item
            )
        )
    }

    const handleReminderToggle = (
        id: string,
        enabled: boolean
    ) => {
        setReminderPreferences((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        enabled
                    }
                    : item
            )
        )
    }

    const handleCommunicationToggle = (
        id: string,
        enabled: boolean
    ) => {
        setCommunicationPreferences((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        enabled
                    }
                    : item
            )
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
                        Choose what you want to hear from us.
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: verticalScale(25),
                    paddingHorizontal: scale(14)
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    className="text-[#1F1F1F] font-semibold mt-4"
                    style={{ fontSize: moderateScale(15) }}
                >
                    Order Updates
                </Text>

                <NotificationPreferenceCard
                    items={orderPreferences}
                    onToggle={handleOrderToggle}
                />

                <Text
                    className="text-[#1F1F1F] font-semibold mt-4"
                    style={{ fontSize: moderateScale(15) }}
                >
                    Promotions
                </Text>

                <NotificationPreferenceCard
                    items={offerPreferences}
                    onToggle={handleOfferToggle}
                />

                <Text
                    className="text-[#1F1F1F] font-semibold mt-4"
                    style={{ fontSize: moderateScale(15) }}
                >
                    Account Alerts
                </Text>

                <NotificationPreferenceCard
                    items={accountPreferences}
                    onToggle={handleAccountToggle}
                />

                <Text
                    className="text-[#1F1F1F] font-semibold mt-4"
                    style={{ fontSize: moderateScale(15) }}
                >
                    Reminders
                </Text>

                <NotificationPreferenceCard
                    items={reminderPreferences}
                    onToggle={handleReminderToggle}
                />

                <Text
                    className="text-[#1F1F1F] font-semibold mt-4"
                    style={{ fontSize: moderateScale(15) }}
                >
                    Communication
                </Text>

                <NotificationPreferenceCard
                    items={communicationPreferences}
                    onToggle={handleCommunicationToggle}
                />

                <NotificationScheduleCard
                    enabled={doNotDisturb}
                    startTime={formatTime(startTime)}
                    endTime={formatTime(endTime)}
                    onToggle={() =>
                        setDoNotDisturb((prev) => !prev)
                    }
                    onEditStartTime={() =>
                        setTimePicker("start")
                    }
                    onEditEndTime={() =>
                        setTimePicker("end")
                    }
                />

                {timePicker && (
                    <DateTimePicker
                        value={
                            timePicker === "start"
                                ? startTime
                                : endTime
                        }
                        mode="time"
                        is24Hour={false}
                        onValueChange={(event, selectedDate) => {
                            if (!selectedDate) {
                                return
                            }

                            if (timePicker === "start") {
                                setStartTime(selectedDate)
                            } else {
                                setEndTime(selectedDate)
                            }

                            setTimePicker(null)
                        }}
                        onDismiss={() => {
                            setTimePicker(null)
                        }}
                    />
                )}

                <View
                    className="mt-6 p-4 bg-white border border-[#1F1F1F]/10"
                    style={{ borderRadius: moderateScale(18) }}
                >
                    <View className='flex-row gap-3 items-center'>
                        <View
                            className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38)
                            }}
                        >
                            <HistoryIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.8} />
                        </View>

                        <View className='justify-center flex-1'>
                            <Text
                                className='text-[#1F1F1F] font-bold'
                                style={{ fontSize: moderateScale(15) }}
                            >
                                History
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium'
                                style={{
                                    fontSize: moderateScale(11),
                                    marginTop: verticalScale(2)
                                }}
                            >   
                                Last 30 Days
                            </Text>
                        </View>

                        <View
                            className="items-center justify-center bg-[#F8D56A]"
                            style={{
                                paddingHorizontal: moderateScale(8),
                                paddingVertical: verticalScale(3),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <Text
                                className="font-bold text-[#5C4639]"
                                style={{ fontSize: moderateScale(10) }}
                            >
                                124 Items
                            </Text>
                        </View>
                    </View>

                    <Text
                        className='text-[#1F1F1F]/75 font-medium'
                        style={{
                            fontSize: moderateScale(12),
                            marginTop: verticalScale(8)
                        }}
                    >
                        View all notifications sent to your device in the last month.
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="flex-row gap-2 items-center justify-center bg-[#3F2516]"
                        style={{
                            borderRadius: moderateScale(28),
                            paddingVertical: verticalScale(12),
                            marginTop: verticalScale(13)
                        }}
                    >
                        <DeleteIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} strokeWidth={1.8} />

                        <Text
                            className="text-white font-semibold"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Clear History
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}