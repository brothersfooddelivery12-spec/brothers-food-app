import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CalendarIcon from '@/assets/icon/DateIcon.svg'
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker"
import { router } from "expo-router"
import { useCallback, useMemo, useState } from 'react'
import { ScrollView, SectionList, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { TransactionHistory, TransactionHistoryItem } from './Components/TransactionHistoryItem'

const TRANSACTIONS_CATEGORIES = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "2",
        title: "Income"
    },
    {
        id: "3",
        title: "Expense"
    },
    {
        id: "4",
        title: "Refund"
    }
]

export const WALLET_TRANSACTIONS: TransactionHistory[] = [
    {
        id: "1",
        title: "Burger Point",
        description: "Payment for Order #BFD10293",
        createdAt: "2026-09-02T14:30:00",
        amount: 710,
        type: "debit",
        status: "completed",
        category: "order"
    },
    {
        id: "2",
        title: "Wallet Recharge",
        description: "Added via UPI",
        createdAt: "2026-09-02T11:15:00",
        amount: 500,
        type: "credit",
        status: "completed",
        category: "recharge"
    },
    {
        id: "3",
        title: "Cashback Earned",
        description: "Promo – BURGER30",
        createdAt: "2026-09-02T09:45:00",
        amount: 100,
        type: "credit",
        status: "completed",
        category: "cashback"
    },
    {
        id: "4",
        title: "Refund: Pizza Hut",
        description: "Order Cancellation #BFD10280",
        createdAt: "2026-09-02T08:20:00",
        amount: 320,
        type: "credit",
        status: "refunded",
        category: "refund"
    },

    {
        id: "5",
        title: "The Pizza Hub",
        description: "Payment for Order #BFD10275",
        createdAt: "2026-09-01T19:30:00",
        amount: 480,
        type: "debit",
        status: "completed",
        category: "order"
    },
    {
        id: "6",
        title: "Weekend Offer Cashback",
        description: "Promo – WEEKEND50",
        createdAt: "2026-09-01T16:10:00",
        amount: 150,
        type: "credit",
        status: "completed",
        category: "cashback"
    },
    {
        id: "7",
        title: "Wallet Recharge",
        description: "Added via Card",
        createdAt: "2026-09-01T11:05:00",
        amount: 1000,
        type: "credit",
        status: "completed",
        category: "recharge"
    }
]

export default function TransactionHistoryScreen(){
    const [selectedCategory, setSelectedCategory] = useState("1")
    const [startDate, setStartDate] = useState(new Date(2026, 8, 1))
    const [endDate, setEndDate] = useState(new Date(2026, 8, 2))
    const [datePicker, setDatePicker] = useState<"start" | "end" | null>(null)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    const formattedDateRange = `${formatDate(startDate)} – ${formatDate(endDate)}`

    const handleDateChange = (
        _: DateTimePickerChangeEvent,
        selectedDate?: Date
    ) => {
        if (!selectedDate || !datePicker) {
            setDatePicker(null)
            return
        }

        if (datePicker === "start") {
            setStartDate(selectedDate)

            // If start date becomes greater than end date,
            // update end date too
            if (selectedDate > endDate) {
                setEndDate(selectedDate)
            }
        }

        if (datePicker === "end") {
            setEndDate(selectedDate)
        }

        setDatePicker(null)
    }

    const handleTransactionPress = useCallback(
        (transaction: TransactionHistory) => {
            console.log("Transaction:", transaction)
        },[]
    )

    const renderTransaction = useCallback(
        ({ item }: { item: TransactionHistory }) => {
            return (
                <TransactionHistoryItem
                    item={item}
                    onPress={handleTransactionPress}
                />
            )
        }, [handleTransactionPress]
    )

    const getTransactionSection = (createdAt: string) => {
        const transactionDate = new Date(createdAt)

        const today = new Date()
        const yesterday = new Date()

        yesterday.setDate(today.getDate() - 1)

        const isSameDay = (a: Date, b: Date) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()

        if (isSameDay(transactionDate, today)) {
            return "Today"
        }

        if (isSameDay(transactionDate, yesterday)) {
            return "Yesterday"
        }

        return transactionDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    const filteredTransactions = useMemo(() => {
        const start = new Date(startDate)

        start.setHours(0, 0, 0, 0)

        const end = new Date(endDate)

        end.setHours(23, 59, 59, 999)

        return WALLET_TRANSACTIONS.filter((transaction) => {
            const transactionDate = new Date(transaction.createdAt)

            return (
                transactionDate >= start &&
                transactionDate <= end
            )
        })
    }, [startDate, endDate])

    const transactionSections = useMemo(() => {
        const grouped: Record<string, TransactionHistory[]> = {}

        filteredTransactions.forEach((transaction) => {
            const section = getTransactionSection(transaction.createdAt)

            if (!grouped[section]) {
                grouped[section] = []
            }

            grouped[section].push(transaction)
        })

        return Object.entries(grouped).map(
            ([title, data]) => ({title, data})
        )
    }, [filteredTransactions])

    const renderSectionHeader = useCallback(
        ({ section }: {
            section: {
                title: string
                data: TransactionHistory[]
            }
        }) => (
            <Text
                className="text-[#1F1F1F] font-semibold"
                style={{
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
                        Transaction History
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Track all your wallet transactions
                    </Text>
                </View>
            </View>

            <SectionList
                sections={transactionSections}
                renderItem={renderTransaction}
                renderSectionHeader={renderSectionHeader}
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
                            className="-mx-5 mt-2 mb-2"
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
                                            isSelected ? "bg-[#3F2516]" : "bg-[#FFFFFF]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(16),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: isSelected ? 1 : 1,
                                            borderColor: isSelected ? "#3F2516" : "rgba(31, 31, 31, 0.10)"
                                        }}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected ? "text-white" : "text-[#1F1F1F]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {category.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View
                            className="bg-white border border-[#1F1F1F]/10 mt-2 mb-3"
                            style={{
                                borderRadius: moderateScale(20),
                                paddingHorizontal: scale(12),
                                paddingTop: verticalScale(16),
                                paddingBottom: verticalScale(12)
                            }}
                        >
                            <View className="flex-row items-center">
                                <View className="flex-1 items-center">
                                    <Text
                                        className="text-[#1F1F1F]/75 font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Total Income
                                    </Text>

                                    <Text
                                        className="text-[#22863A] font-extrabold"
                                        style={{
                                            fontSize: moderateScale(16),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        +₹2,530.00
                                    </Text>
                                </View>

                                <View
                                    className="bg-[#1F1F1F]/10 mx-2"
                                    style={{
                                        width: 1,
                                        height: verticalScale(28)
                                    }}
                                />

                                <View className="flex-1 items-center">
                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Total Expense
                                    </Text>

                                    <Text
                                        className="text-[#E13B2F] font-extrabold"
                                        style={{
                                            fontSize: moderateScale(16),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        -₹1,680.00
                                    </Text>
                                </View>

                                <View
                                    className="bg-[#1F1F1F]/10 mx-2"
                                    style={{
                                        width: 1,
                                        height: verticalScale(28)
                                    }}
                                />

                                <View className="flex-1 items-center">
                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Net Balance
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F] font-extrabold"
                                        style={{
                                            fontSize: moderateScale(16),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        +₹850.00
                                    </Text>
                                </View>
                            </View>

                            <View
                                className="bg-[#1F1F1F]/10"
                                style={{
                                    height: 1,
                                    marginTop: verticalScale(16),
                                    marginBottom: verticalScale(12),
                                    marginHorizontal: scale(12)
                                }}
                            />

                            <View
                                className="flex-row items-center"
                                style={{ gap: scale(10) }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => setDatePicker("start")}
                                    className="flex-1 flex-row items-center bg-[#F5F5F5]"
                                    style={{
                                        borderRadius: moderateScale(14),
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(9)
                                    }}
                                >
                                    <View
                                        className="items-center justify-center bg-[#E8B93F]/15"
                                        style={{
                                            width: moderateScale(34),
                                            height: moderateScale(34),
                                            borderRadius: moderateScale(10)
                                        }}
                                    >
                                        <CalendarIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={2} />
                                    </View>

                                    <View
                                        className="flex-1"
                                        style={{ marginLeft: scale(8) }}
                                    >
                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium"
                                            style={{ fontSize: moderateScale(9.5) }}
                                        >
                                            From
                                        </Text>

                                        <Text
                                            numberOfLines={1}
                                            className="text-[#1F1F1F] font-semibold"
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(1)
                                            }}
                                        >
                                            {formatDate(startDate)}
                                        </Text>
                                    </View>

                                    <ArrowDownIcon width={moderateScale(15)} height={moderateScale(15)} color="rgba(31,31,31,0.55)" strokeWidth={2} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => setDatePicker("end")}
                                    className="flex-1 flex-row items-center bg-[#F5F5F5]"
                                    style={{
                                        borderRadius: moderateScale(14),
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(9)
                                    }}
                                >
                                    <View
                                        className="items-center justify-center bg-[#E8B93F]/15"
                                        style={{
                                            width: moderateScale(34),
                                            height: moderateScale(34),
                                            borderRadius: moderateScale(10)
                                        }}
                                    >
                                        <CalendarIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={2} />
                                    </View>

                                    <View
                                        className="flex-1"
                                        style={{ marginLeft: scale(8) }}
                                    >
                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium"
                                            style={{ fontSize: moderateScale(9.5) }}
                                        >
                                            To
                                        </Text>

                                        <Text
                                            numberOfLines={1}
                                            className="text-[#1F1F1F] font-semibold"
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(1)
                                            }}
                                        >
                                            {formatDate(endDate)}
                                        </Text>
                                    </View>

                                    <ArrowDownIcon width={moderateScale(15)} height={moderateScale(15)} color="rgba(31,31,31,0.55)" strokeWidth={2} />
                                </TouchableOpacity>
                            </View>

                            {datePicker && (
                                <DateTimePicker
                                    value={
                                        datePicker === "start"
                                            ? startDate
                                            : endDate
                                    }
                                    mode="date"
                                    maximumDate={new Date()}
                                    minimumDate={
                                        datePicker === "end"
                                            ? startDate
                                            : undefined
                                    }
                                    onValueChange={handleDateChange}
                                    onDismiss={() => setDatePicker(null)}
                                />
                            )}
                        </View>
                    </>
                }
            />
        </SafeAreaView>
    )
}