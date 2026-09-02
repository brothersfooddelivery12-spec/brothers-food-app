import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import BankIcon from '@/assets/icon/BankOutlineIcon.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import RefundIcon from '@/assets/icon/RefundIcon.svg'
import SendIcon from '@/assets/icon/SendHorizontalIcon.svg'
import TransactionHistoryIcon from '@/assets/icon/TransactionHistoryIcon.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import { TransactionItem, WalletTransaction } from './Components/TransactionItem'

const WALLET_TRANSACTIONS: WalletTransaction[] = [
    {
        id: "1",
        title: "Burger Point",
        description: "Food Order • Today, 2:30 PM",
        amount: 710,
        type: "debit",
        status: "completed",
        category: "order"
    },
    {
        id: "2",
        title: "Order Cashback",
        description: "Promotion • Yesterday",
        amount: 100,
        type: "credit",
        status: "completed",
        category: "cashback"
    },
    {
        id: "3",
        title: "Wallet Recharge",
        description: "Bank Transfer • 2 days ago",
        amount: 500,
        type: "credit",
        status: "completed",
        category: "recharge"
    },
    {
        id: "4",
        title: "Refund: Pizza Hut",
        description: "Order Cancellation • 3 days ago",
        amount: 320,
        type: "credit",
        status: "processing",
        category: "refund"
    }
]

const WALLET_ACTIONS = [
    {
        id: "add",
        title: "Add Money",
        icon: PlusIcon,
        strokeWidth: 1.8
    },
    {
        id: "send",
        title: "Send",
        icon: SendIcon,
        strokeWidth: 1.5,
        marginLeft: true
    },
    {
        id: "withdraw",
        title: "Withdraw",
        icon: BankIcon,
        strokeWidth: 1.5
    },
    {
        id: "history",
        title: "History",
        icon: TransactionHistoryIcon,
        strokeWidth: 1.5,
        route: "/transaction-history"
    }
]

const TRANSACTIONS_CATEGORIES = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "2",
        title: "Order"
    },
    {
        id: "3",
        title: "Refunds"
    },
    {
        id: "4",
        title: "Cashback"
    }
]

export default function BrothersWalletScreen(){
    const [selectedCategory, setSelectedCategory] = useState("1")
    const preventDoublePress = usePreventDoublePress()

    const currentPoints = 2450
    const currentTierPoints = 2000
    const nextTierPoints = 3000
    const currentTier = "Gold"
    const nextTier = "Platinum"

    const progress =
        ((currentPoints - currentTierPoints) /
            (nextTierPoints - currentTierPoints)) *
        100

    const safeProgress = Math.min(
        Math.max(progress, 0),
        100
    )

    const handleTransactionPress = useCallback(
        (transaction: WalletTransaction) => {
            console.log("Transaction:", transaction)
        },
        []
    )

    const renderTransaction = useCallback(
        ({ item }: { item: WalletTransaction }) => {
            return (
                <TransactionItem
                    item={item}
                    onPress={handleTransactionPress}
                />
            )
        },[handleTransactionPress]
    )

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
                        Brothers Wallet
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Manage your balance, rewards, and transactions
                    </Text>
                </View>
            </View>

            <FlatList
                data={WALLET_TRANSACTIONS}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25),
                    gap: verticalScale(8)
                }}
                ListHeaderComponent={
                    <>
                        <View
                            className="bg-[#3F2516] px-4 py-4 items-center flex-row gap-2"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1 items-start'>
                                <Text
                                    className='text-[#FFFFFF]/80 font-normal ml-2'
                                    style={{
                                        fontSize: moderateScale(13),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    Available Balance
                                </Text>

                                <Text
                                    className='text-[#FFFFFF] tracking-wider font-black ml-2'
                                    style={{
                                        fontSize: moderateScale(28.5),
                                        marginTop: verticalScale(2)
                                    }}
                                >
                                    ₹1,850
                                </Text>

                                <Text
                                    className='text-[#FFFFFF]/70 font-normal ml-2'
                                    style={{
                                        fontSize: moderateScale(12),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    Wallet ID
                                </Text>

                                <Text
                                    className='text-[#F8D56A] font-medium mt-1 ml-2 uppercase'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    BFD-WALLET-4521
                                </Text>
                            </View>

                            <Image
                                source={require("@/assets/images/BrotherWalletIllustration.png")}
                                contentFit="contain"
                                cachePolicy="memory-disk"
                                style={{
                                    width: moderateScale(165),
                                    height: moderateScale(110),
                                    marginRight: -moderateScale(6)
                                }}
                            />
                        </View>

                        <View className="flex-row items-start mt-5">
                            {WALLET_ACTIONS.map((item) => {
                                const Icon = item.icon

                                return (
                                    <View
                                        key={item.id}
                                        className="flex-1 items-center"
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={() => 
                                                preventDoublePress(() => {
                                                    if (item.route) {
                                                        router.push(item.route as any)
                                                    }
                                                })
                                            }
                                            className="rounded-full bg-white border border-[#1F1F1F]/10 items-center justify-center"
                                            style={{
                                                width: moderateScale(52),
                                                height: moderateScale(52)
                                            }}
                                        >
                                            <Icon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" strokeWidth={item.strokeWidth}
                                                style={{ marginLeft: item.marginLeft ? moderateScale(4) : moderateScale(0) }}
                                            />
                                        </TouchableOpacity>

                                        <Text
                                            numberOfLines={1}
                                            className="text-[#1F1F1F] font-semibold text-center"
                                            style={{
                                                fontSize: moderateScale(12),
                                                marginTop: verticalScale(6)
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>

                        <View
                            className="mt-6 p-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-3 items-center'>
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <CircleStarIcon width={scale(28)} height={scale(28)} color={"#3F2516"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Reward Points
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F] font-extrabold'
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        2,450
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <View
                            className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-3 items-center'>
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <WalletIcon width={scale(25)} height={scale(25)} color={"#3F2516"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Total Cashback
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F] font-extrabold'
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        ₹1,280
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <View
                            className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-3 items-center'>
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <RefundIcon width={scale(23)} height={scale(23)} color={"#3F2516"} strokeWidth={1.5} /> 
                                </View>

                                <View className='justify-center flex-1'>
                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Pending Refunds
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F] font-extrabold'
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        ₹380
                                    </Text>
                                </View>

                                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                            </View>
                        </View>

                        <View
                            className="bg-[#3F2516] px-4 py-4 justify-center"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <View className="flex-row items-center justify-between">
                                <View
                                    className="flex-row items-center justify-center gap-1 bg-[#F8D56A]"
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingRight: scale(6),
                                        paddingLeft: scale(4),
                                        paddingVertical: verticalScale(1)
                                    }}
                                >
                                    <CircleStarIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" />

                                    <Text
                                        className="text-[#3F2516] font-semibold uppercase"
                                        style={{ fontSize: moderateScale(9) }}
                                    >
                                        Brothers Rewards
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => 
                                        preventDoublePress(() => {
                                            router.push('/rewards-coupons')
                                        })
                                    }
                                    className="items-center justify-center bg-[#F8D56A]"
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(12),
                                        paddingVertical: verticalScale(5)
                                    }}
                                >
                                    <Text
                                        className="text-[#3F2516] font-semibold uppercase"
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Redeem
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text
                                className='text-[#FFFFFF]/85 font-medium leading-5'
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: verticalScale(10)
                                }}
                            >
                                You're
                                <Text
                                    className='text-[#F8D56A]/85 font-medium'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    {" "}550 points away{" "}
                                </Text>
                                from Platinum.
                            </Text>

                            <View
                                className="w-full justify-center"
                                style={{
                                    marginTop: verticalScale(14),
                                    height: moderateScale(8)
                                }}
                            >
                                <View
                                    className="absolute w-full bg-[#FFFFFF]/10"
                                    style={{
                                        height: moderateScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                />

                                <View
                                    className="absolute bg-[#E0A400]"
                                    style={{
                                        width: `${safeProgress}%`,
                                        height: moderateScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                />

                                <View
                                    className="absolute bg-[#E0A400] border border-[#FFFFFF]/65"
                                    style={{
                                        width: moderateScale(14),
                                        height: moderateScale(14),
                                        borderRadius: moderateScale(14),

                                        left: `${safeProgress}%`,

                                        transform: [
                                            {
                                                translateX: -moderateScale(6.5)
                                            }
                                        ]
                                    }}
                                />
                            </View>

                            <View
                                className="flex-row items-center justify-between"
                                style={{ marginTop: verticalScale(8) }}
                            >
                                <View className="flex-row items-center">
                                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color="#F8D56A" />

                                    <Text
                                        className="text-[#FFFFFF] font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        {currentTier}
                                    </Text>

                                    <Text
                                        className="text-[#FFFFFF]/65 font-medium"
                                        style={{ fontSize: moderateScale(9.5) }}
                                    >
                                        ({currentTierPoints.toLocaleString()})
                                    </Text>
                                </View>

                                <View className="flex-row items-center">
                                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color="rgba(184, 137, 232, 0.90)" />

                                    <Text
                                        className="text-[#FFFFFF] font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        {nextTier}
                                    </Text>

                                    <Text
                                        className="text-[#FFFFFF]/65 font-medium"
                                        style={{ fontSize: moderateScale(9.5) }}
                                    >
                                        ({nextTierPoints.toLocaleString()})
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            className="flex-row items-center w-full"
                            style={{ marginTop: verticalScale(14) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Recent Transactions
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="items-center"
                            >
                                <Text
                                    className="text-[#3F2516] font-bold"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-5 mb-2"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(10)
                            }}
                        >
                            {TRANSACTIONS_CATEGORIES.map((category) => {
                                const isSelected = selectedCategory === category.id
                        
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            setSelectedCategory(category.id)
                                        }}
                                        className={`items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#faf5ef]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(16),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: isSelected ? 1 : 1,
                                            borderColor: isSelected ? "3F2516" : "#E8DDD3"
                                        }}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected ? "text-white" : "text-[#5A3825]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {category.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </>
                }
            />
        </SafeAreaView>
    )
}