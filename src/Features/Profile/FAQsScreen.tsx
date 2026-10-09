import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import OrderIcon from '@/assets/icon/CartIcon.svg'
import ReturnIcon from '@/assets/icon/ClockIcon2.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import CardIcon from '@/assets/icon/MoneyIcon.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import SearchBar from '@/components/SearchBar'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useEffect, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
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
                    marginBottom: verticalScale(8),
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
                        FAQs
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <View
                            className="px-4 py-6 items-center flex-row"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1'>
                                <Text
                                    className='font-extrabold ml-2'
                                    style={{
                                        fontSize: moderateScale(20),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    Find Answer{"\n"}to common questions
                                </Text>

                                <Text
                                    className='font-normal leading-5 ml-2'
                                    style={{
                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
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
                                        className="items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected
                                                ? COLORS.primaryColor
                                                : COLORS.secondaryBackgroundColor,
                                            width: moderateScale(76),
                                            height: moderateScale(74),
                                            borderRadius: moderateScale(18),

                                            borderWidth: 0.5,
                                            borderColor: isSelected
                                                ? hexToRgba(COLORS.primaryBackgroundColor, 0.25)
                                                : hexToRgba(COLORS.primaryTextColor, 0.1),

                                            borderBottomWidth: isSelected ? 3 : 1,
                                            borderBottomColor: isSelected
                                                ? hexToRgba(COLORS.primaryBackgroundColor, 0.25)
                                                : hexToRgba(COLORS.primaryTextColor, 0.1),
                                        }}
                                    >
                                        <Icon width={moderateScale(24)} height={moderateScale(24)} color={isSelected ? COLORS.primaryBackgroundColor : COLORS.primaryTextColor} strokeWidth={1.5} />

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: isSelected
                                                    ? COLORS.primaryBackgroundColor
                                                    : COLORS.primaryTextColor,
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
                                className="font-semibold flex-1"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Frequently Asked Questions
                            </Text>

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryColor
                                }}
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
                            className="flex-row gap-2 p-3 items-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                                borderColor: hexToRgba(COLORS.accentColor, 0.15),
                                borderWidth: moderateScale(0.7),
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
                                    className='font-bold'
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Still need help?
                                </Text>

                                <Text
                                    className="font-semibold mt-1"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Our support team is available 24/7 to assist you.
                                </Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {}}
                                className="flex-row items-center justify-center gap-1"
                                style={{
                                    backgroundColor: COLORS.primaryColor,
                                    paddingStart: scale(12),
                                    paddingEnd: scale(8),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    Conatact Support
                                </Text>

                                <ArrowRightIcon width={moderateScale(13)} height={moderateScale(13)} color={COLORS.primaryBackgroundColor} strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}