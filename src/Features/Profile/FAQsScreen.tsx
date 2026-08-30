import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import OrderIcon from '@/assets/icon/CartIcon.svg'
import ReturnIcon from '@/assets/icon/ClockIcon2.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import CardIcon from '@/assets/icon/MoneyIcon.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import SearchBar from '@/components/SearchBar'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useEffect, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FAQCard, { FAQItem } from './Components/FAQCard'

const FAQ_CATEGORIES = [
    {
        id: "1",
        title: "Orders",
        icon: OrderIcon,
    },
    {
        id: "2",
        title: "Payments",
        icon: CardIcon,
    },
    {
        id: "3",
        title: "Delivery",
        icon: DeliveryIcon,
    },
    {
        id: "4",
        title: "Returns",
        icon: ReturnIcon,
    },
    {
        id: "5",
        title: "Account",
        icon: UserIcon,
    },
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

export default function FAQsScreen(){
    const insets = useSafeAreaInsets()
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("1")

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
                        FAQs
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Find quick answers to common questions
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
                            className="bg-[#3F2516] px-4 py-6 items-center flex-row"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#FFFFFF] font-extrabold ml-2'
                                    style={{ fontSize: moderateScale(20) }}
                                >
                                    Find Answer{"\n"}to common questions
                                </Text>

                                <Text
                                    className='text-[#FFFFFF]/75 font-normal leading-5 ml-2'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Quick solutions for your{"\n"}orders, payments and more.
                                </Text>
                            </View>

                            <Image
                                source={require("@/assets/images/FAQsIllustration.png")}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                style={{
                                    width: moderateScale(95),
                                    height: moderateScale(95)
                                }}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: verticalScale(14),
                                marginBottom: verticalScale(10)
                            }}
                        >
                            <SearchBar
                                value={search}
                                onChangeText={setsearch}
                                placeholder="Search FAQs..."
                                onRightPress={() => {}}
                            />
                        </View>

                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-2"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(8)
                            }}
                        >
                            {FAQ_CATEGORIES.map((item) => {
                                const Icon = item.icon
                                const isSelected = selectedCategory === item.id

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        activeOpacity={0.9}
                                        onPress={() => setSelectedCategory(item.id)}
                                        className={`items-center justify-center ${
                                            isSelected
                                                ? "bg-[#5C4639]/80"
                                                : "bg-white"
                                        }`}
                                        style={{
                                            width: moderateScale(76),
                                            height: moderateScale(74),
                                            borderRadius: moderateScale(18),

                                            borderWidth: 1,
                                            borderColor: isSelected
                                                ? "rgba(63, 37, 22, 0.70)"
                                                : "rgba(31,31,31,0.10)",

                                            borderBottomWidth: isSelected ? 3 : 1,
                                            borderBottomColor: isSelected
                                                ? "rgba(63, 37, 22, 1)"
                                                : "rgba(31,31,31,0.10)"
                                        }}
                                    >
                                        <Icon width={moderateScale(24)} height={moderateScale(24)} color={isSelected ? "#FFFFFF" : "#3F2516"} strokeWidth={1.5} />

                                        <Text
                                            className={`font-medium ${
                                                isSelected
                                                    ? "text-[#FFFFFF]"
                                                    : "text-[#1F1F1F]"
                                            }`}
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View
                            className="flex-row items-center w-full mt-5"
                            style={{ marginBottom: verticalScale(12) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Frequently Asked Questions
                            </Text>

                            <Text
                                className="text-[#3F2516] font-bold"
                                style={{ fontSize: moderateScale(12) }}
                            >
                                12 Questions
                            </Text>
                        </View>

                        <View>
                            {FAQS.map(item => (
                                <FAQCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </View>

                        <View
                            className="flex-row gap-2 p-3 items-center bg-[#E8B93F]/15 border border-[#E8B93F]/25"
                            style={{
                                borderRadius: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <Image
                                source={require("@/assets/images/HeadphonesIllustration.png")}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                style={{
                                    marginLeft: -moderateScale(6),
                                    marginTop: -moderateScale(2),
                                    marginBottom: -moderateScale(6),
                                    width: moderateScale(52),
                                    height: moderateScale(52)
                                }}
                            />

                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#1F1F1F] font-bold'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Still need help?
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-semibold mt-1"
                                    style={{ fontSize: moderateScale(10)}}
                                >
                                    Our support team is available 24/7 to assist you.
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {}}
                                className="flex-row items-center justify-center gap-1 bg-[#3F2516]"
                                style={{
                                    paddingStart: scale(12),
                                    paddingEnd: scale(8),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <Text
                                    className="font-bold text-[#FFFFFF]"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Conatact Support
                                </Text>

                                <ArrowRightIcon width={moderateScale(13)} height={moderateScale(13)} color="#FFFFFF" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}