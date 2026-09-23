import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CalendarIcon from '@/assets/icon/DateIcon.svg'
import TransactionHistoryIcon from '@/assets/icon/TransactionHistoryIcon.svg'
import { getMyWalletTransactions, WalletTransaction } from '@/Services/wallet-service'
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker"
import { router, useLocalSearchParams } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, SectionList, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
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

export default function TransactionHistoryScreen(){
    const { walletId } = useLocalSearchParams<{walletId?: string}>()
    const {showToast} = useToast()

    const [selectedCategory, setSelectedCategory] = useState("1")
    const today = new Date()
    const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
    const [endDate, setEndDate] = useState(today)
    const [datePicker, setDatePicker] = useState<"start" | "end" | null>(null)

    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])

    const [loadingTransactions, setLoadingTransactions] =
        useState(false)

    const fetchWalletTransactions = useCallback(async (walletId: string) => {
        if (!walletId) {
            return
        }

        try {
            setLoadingTransactions(true)

            const res = await getMyWalletTransactions({wallet_id: walletId})

            console.log("Wallet transactions response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch wallet transactions", "warning")

                return
            }

            setWalletTransactions(res.data.data ?? [])
        } catch (error: any) {
            console.log("Wallet transactions error:", error?.response?.data ?? error)

            showToast(error?.response?.data?.message || error?.message || "Unable to fetch wallet transactions", "warning")
        } finally {
            setLoadingTransactions(false)
        }
    },[])

    useEffect(() => {
        if (!walletId) {
            return
        }

        fetchWalletTransactions(walletId)
    }, [walletId, fetchWalletTransactions])

    const mapWalletTransaction = (transaction: WalletTransaction): TransactionHistory => {
        switch (transaction.transaction_type) {
            case "ADD_MONEY":
                return {
                    id: transaction.id,
                    title: "Money Added",
                    description: transaction.description,
                    createdAt: transaction.created_at,
                    amount: Number(transaction.amount),
                    type: "credit",
                    status: "completed",
                    category: "addMoney"
                }

            case "ORDER_PAYMENT":
                return {
                    id: transaction.id,
                    title: "Order Payment",
                    description: transaction.description,
                    createdAt: transaction.created_at,
                    amount: Number(transaction.amount),
                    type: "debit",
                    status: "completed",
                    category: "order"
                }

            case "REFUND":
                return {
                    id: transaction.id,
                    title: "Refund Received",
                    description: transaction.description,
                    createdAt: transaction.created_at,
                    amount: Number(transaction.amount),
                    type: "credit",
                    status: "refunded",
                    category: "refund"
                }

            case "CASHBACK":
                return {
                    id: transaction.id,
                    title: "Cashback Received",
                    description: transaction.description,
                    createdAt: transaction.created_at,
                    amount: Number(transaction.amount),
                    type: "credit",
                    status: "completed",
                    category: "cashback"
                }

            default:
                return {
                    id: transaction.id,
                    title: "Wallet Transaction",
                    description: transaction.description,
                    createdAt: transaction.created_at,
                    amount: Number(transaction.amount),
                    type: "debit",
                    status: "completed",
                    category: "addMoney"
                }
        }
    }

    const transactions = useMemo(() => {
        return walletTransactions.map(
            mapWalletTransaction
        )
    }, [walletTransactions])

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    const handleDateChange = (_: DateTimePickerChangeEvent, selectedDate?: Date) => {
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

    const renderTransaction = useCallback(({ item }: { item: TransactionHistory }) => {
        return (
            <TransactionHistoryItem
                item={item}
                onPress={handleTransactionPress}
            />
        )
    },[handleTransactionPress])

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

        return transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.createdAt)

            const matchesDate = transactionDate >= start && transactionDate <= end

            let matchesCategory = true

            switch (selectedCategory) {
                // All
                case "1":
                    matchesCategory = true
                    break

                // Income
                case "2":
                    matchesCategory =
                        transaction.type === "credit" &&
                        transaction.category !== "refund"
                    break

                // Expense
                case "3":
                    matchesCategory = transaction.type === "debit"
                    break

                // Refund
                case "4":
                    matchesCategory = transaction.category === "refund"
                    break
            }

            return (matchesDate && matchesCategory)
        })
    }, [transactions, startDate, endDate, selectedCategory])

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

    const transactionSummary = useMemo(() => {
        const income = filteredTransactions
            .filter(transaction => transaction.type === "credit")
            .reduce((total, transaction) => total + Number(transaction.amount), 0)

        const expense = filteredTransactions
            .filter(transaction => transaction.type === "debit")
            .reduce((total, transaction) => total + Number(transaction.amount), 0)

        return {
            income,
            expense,
            netBalance: income - expense
        }
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

    const renderEmptyTransactions = useCallback(() => {
        const hasAnyTransactions = transactions.length > 0

        return (
            <View className="flex-1 items-center justify-center px-8">
                <View
                    className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                    style={{
                        width: moderateScale(62),
                        height: moderateScale(62)
                    }}
                >
                    <TransactionHistoryIcon width={moderateScale(30)} height={moderateScale(30)} color="#3F2516" strokeWidth={1.5} />
                </View>

                <Text
                    className="text-[#1F1F1F] font-bold text-center"
                    style={{
                        fontSize: moderateScale(16),
                        marginTop: verticalScale(12)
                    }}
                >
                    {hasAnyTransactions ? "No Transactions Found" : "No Transactions Yet"}
                </Text>

                <Text
                    className="text-[#1F1F1F]/65 font-medium text-center"
                    style={{
                        fontSize: moderateScale(11),
                        lineHeight: moderateScale(15),
                        marginTop: verticalScale(4)
                    }}
                >
                    {hasAnyTransactions
                        ? `No wallet transactions were found between ${formatDate(
                            startDate
                        )} and ${formatDate(endDate)}.`
                        : "Your wallet transactions will appear here once you add money or make a payment."}
                </Text>
            </View>
        )
    }, [transactions.length, startDate, endDate])
    
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

            {loadingTransactions ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        source={require("../../../assets/animations/Food_Loading2.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(125),
                            height: moderateScale(125)
                        }}
                    />
                </View>
            ) : (
                <SectionList
                    sections={transactionSections}
                    renderItem={renderTransaction}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={
                        renderEmptyTransactions
                    }
                    contentContainerStyle={{
                        flexGrow: 1,
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
                                            +₹{transactionSummary.income.toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
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
                                            -₹{transactionSummary.expense.toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
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
                                            {transactionSummary.netBalance >= 0
                                                ? "+"
                                                : "-"}
                                            ₹{Math.abs(
                                                transactionSummary.netBalance
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}
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
            )}
        </SafeAreaView>
    )
}