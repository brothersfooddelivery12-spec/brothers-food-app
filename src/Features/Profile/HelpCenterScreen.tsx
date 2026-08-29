import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import PhoneIcon from '@/assets/icon/CallFilledIcon.svg'
import ChatIcon from '@/assets/icon/ChatFilledIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import MailIcon from '@/assets/icon/MailFilledIcon.svg'
import PaymentIcon from '@/assets/icon/MoneyFilledIcon.svg'
import OfferIcon from '@/assets/icon/OfferFilledIcon.svg'
import RefundIcon from '@/assets/icon/RefundIcon.svg'
import BotIcon from '@/assets/icon/RobotIcon.svg'
import AccountSettingsIcon from '@/assets/icon/UserFilledIcon.svg'
import UtensilsIcon from '@/assets/icon/UtensilIcon2.svg'
import SearchBar from '@/components/SearchBar'
import { router } from "expo-router"
import { useEffect, useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FAQCard, { FAQItem } from './Components/FAQCard'
import HelpCenterCard, { HelpCenterItem } from './Components/HelpCenterCard'
import SupportRequestCard, { SupportRequest } from './Components/SupportRequestCard'

const HELP_CENTER_CATEGORIES: HelpCenterItem[] = [
    {
        id: "1",
        title: "Order Issues",
        description: "Get help with missing, incorrect, delayed, or cancelled orders.",
        icon: UtensilsIcon,
        size: 24
    },
    {
        id: "2",
        title: "Payment",
        description: "Resolve payment failures, charges, and transaction-related issues.",
        icon: PaymentIcon,
        size: 25
    },
    {
        id: "3",
        title: "Delivery",
        description: "Get assistance with delivery status, delays, or rider-related concerns.",
        icon: DeliveryIcon,
        size: 24
    },
    {
        id: "4",
        title: "Offers",
        description: "Find help with coupons, promo codes, discounts, and special offers.",
        icon: OfferIcon,
        size: 26
    },
    {
        id: "5",
        title: "Refunds",
        description: "Check refund status or get help with pending and failed refunds.",
        icon: RefundIcon,
        size: 24
    },
    {
        id: "6",
        title: "Account",
        description: "Manage your profile, login details, preferences, and account settings.",
        icon: AccountSettingsIcon,
        size: 25
    }
]

const FAQS: FAQItem[] = [
    {
        id: "1",
        question: "Where is my order?",
        answer:
            "You can track your order in real-time through the 'Orders' tab in the bottom navigation. We'll send you push notifications at every stage from preparation to the final delivery at your door.",
    },
    {
        id: "2",
        question: "How do refunds work?",
        answer:
            "Eligible refunds are processed back to your original payment method. Depending on your bank or payment provider, it may take a few business days to appear.",
    },
    {
        id: "3",
        question: "Can I change my delivery address?",
        answer:
            "You can update the delivery address before the restaurant starts preparing your order. Once preparation begins, address changes may not be available.",
    }
]

const SUPPORT_OPTIONS = [
    {
        id: "1",
        title: "Live Chat",
        description: "Connect with an agent now",
        icon: ChatIcon,
        badge: "~30S WAIT",
        featured: true
    },
    {
        id: "2",
        title: "AI Assistant",
        description: "Instant answers 24/7",
        icon: BotIcon,
        featured: false,
        route: "/brothers-ai"
    },
    {
        id: "3",
        title: "Call Support",
        description: "Speak to our concierge",
        icon: PhoneIcon,
        featured: false
    },
    {
        id: "4",
        title: "Email Support",
        description: "Typically 2–4h response",
        icon: MailIcon,
        featured: false
    }
]

const SUPPORT_REQUESTS: SupportRequest[] = [
    {
        id: "1",
        ticketId: "BR-8921",
        title: "Late Delivery",
        description:
            "Your order arrived later than expected.",
        status: "in_progress",
        createdAt: "Oct 24, 2026",
        time: "10:45 AM"
    },
    {
        id: "2",
        ticketId: "BR-7740",
        title: "Refund Request",
        description:
            "Requested refund for cancelled order.",
        status: "resolved",
        createdAt: "Oct 12, 2026",
        time: "04:20 PM"
    },
    {
        id: "3",
        ticketId: "BR-6824",
        title: "Payment Dispute",
        description:
            "Your payment dispute could not be approved.",
        status: "rejected",
        createdAt: "Oct 08, 2026",
        time: "02:15 PM"
    }
]

export default function HelpCenterScreen(){
    const insets = useSafeAreaInsets()
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

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
                        Help Center
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Find answers and get the support you need
                    </Text>
                </View>
            </View>

            <FlatList
                data={[{}]}
                renderItem={null}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: insets.bottom + verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <View
                            className="self-start flex-row items-center bg-[#F8D56A]"
                            style={{
                                marginTop: moderateScale(10),
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <Text
                                className="font-semibold text-[#3F2516] uppercase"
                                style={{ fontSize: moderateScale(10) }}
                            >
                                SUPPORT 24/7
                            </Text>
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-black'
                            style={{
                                fontSize: moderateScale(28),
                                marginTop: verticalScale(10)
                            }}
                        >   
                            Need help?{"\n"}We're{"\n"}available 24/7
                        </Text>

                        <Text
                            className='text-[#1F1F1F]/75 font-medium mr-4 leading-5'
                            style={{
                                marginTop: verticalScale(6),
                                fontSize: moderateScale(12)
                            }}
                        >
                            Our premium concierge team is ready to
                            assist you with any culinary request or
                            delivery concern.
                        </Text>

                        <View
                            style={{
                                marginTop: verticalScale(18),
                                marginBottom: verticalScale(16)
                            }}
                        >
                            <SearchBar
                                value={search}
                                onChangeText={setsearch}
                                placeholder="Search for help articles..."
                                onRightPress={() => {}}
                            />
                        </View>

                        <View
                            className="flex-row flex-wrap justify-between mx-2"
                            style={{ gap: moderateScale(12) }}
                        >
                            {HELP_CENTER_CATEGORIES.map((item) => (
                                <HelpCenterCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-7 ml-2"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Reach Out Directly
                        </Text>

                        <View className="flex-row flex-wrap justify-between mt-4 mx-2">
                            {SUPPORT_OPTIONS.map((item) => {
                                const Icon = item.icon

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            if (item.route) {
                                                router.push(item.route as any)
                                            }
                                        }}
                                        className={`border ${
                                            item.featured
                                                ? "bg-[#4A2818] border-[#4A2818]"
                                                : "bg-white border-[#1F1F1F]/10"
                                        }`}
                                        style={{
                                            width: "48%",
                                            minHeight: moderateScale(140),
                                            borderRadius: moderateScale(20),
                                            padding: moderateScale(14),
                                            marginBottom: verticalScale(12)
                                        }}
                                    >
                                        <View className="flex-row items-start justify-between">
                                            <View
                                                className={`items-center justify-center ${
                                                    item.featured
                                                        ? "bg-white/10"
                                                        : item.id === "2"
                                                        ? "bg-[#F8D56A]"
                                                        : "bg-[#F5F5F5]"
                                                }`}
                                                style={{
                                                    width: moderateScale(42),
                                                    height: moderateScale(42),
                                                    borderRadius: moderateScale(12)
                                                }}
                                            >
                                                <Icon
                                                    width={moderateScale(24)}
                                                    height={moderateScale(24)}
                                                    color={
                                                        item.featured
                                                            ? "#FFFFFF"
                                                            : "#3F2516"
                                                    }
                                                />
                                            </View>

                                            {item.badge && (
                                                <View
                                                    className="bg-[#F8D56A] rounded-full"
                                                    style={{
                                                        paddingHorizontal: scale(7),
                                                        paddingVertical: verticalScale(3)
                                                    }}
                                                >
                                                    <Text
                                                        className="text-[#3F2516] font-bold"
                                                        style={{ fontSize: moderateScale(7) }}
                                                    >
                                                        {item.badge}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <View className="flex-1 justify-end">
                                            <Text
                                                className={`font-bold ${
                                                    item.featured
                                                        ? "text-white"
                                                        : "text-[#3F2516]"
                                                }`}
                                                style={{ fontSize: moderateScale(16) }}
                                            >
                                                {item.title}
                                            </Text>

                                            <Text
                                                numberOfLines={2}
                                                className={`font-medium mt-1 ${
                                                    item.featured
                                                        ? "text-white/60"
                                                        : "text-[#1F1F1F]/75"
                                                }`}
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    lineHeight: moderateScale(13)
                                                }}
                                            >
                                                {item.description}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <View
                            className="flex-row items-center w-full mt-3"
                            style={{ marginBottom: verticalScale(12) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-semibold flex-1"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Common Questions
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {} }
                                className="items-center"
                            >
                                <Text
                                    className="text-[#3F2516] font-bold"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    View All FAQ
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            {FAQS.map(item => (
                                <FAQCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-3 mb-3"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Recent Tickets
                        </Text>

                        {SUPPORT_REQUESTS.map(item => (
                            <SupportRequestCard
                                key={item.id}
                                item={item}
                                onPress={(request) => {
                                    console.log("Selected:", request)
                                }}
                            />
                        ))}
                    </>
                }
            />
        </SafeAreaView>
    )
}