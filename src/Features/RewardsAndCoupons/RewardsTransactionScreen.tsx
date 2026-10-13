import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import CalendarIcon from '@/assets/icon/DateIcon.svg'
import TransactionHistoryIcon from '@/assets/icon/TransactionHistoryIcon.svg'
import CalendarPicker from '@/components/CalenderSheet'
import { COLORS } from "@/constant/colors"
import { getMyRewardTransactions, RewardTransaction, RewardTransactionType } from "@/Services/api-service"
import { hexToRgba } from "@/utils/hexToRgba"
import { router } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ScrollView, SectionList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from "../hook/ToastContext"

const REWARD_TRANSACTION_CATEGORIES = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "2",
        title: "Earned"
    },
    {
        id: "3",
        title: "Redeemed"
    },
    {
        id: "4",
        title: "Refunds"
    },
    {
        id: "5",
        title: "Adjustments"
    }
]

export default function RewardTransactionHistoryScreen() {
    const { showToast } = useToast()
    const LIMIT = 20
    const [selectedCategory, setSelectedCategory] = useState("1")

    const [listHeight, setListHeight] = useState(0)
    const [listHeaderHeight, setListHeaderHeight] = useState(0)

    const today = new Date()
    const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
    const [endDate, setEndDate] = useState(today)
    const [datePicker, setDatePicker] = useState<"start" | "end" | null>(null)

    const [transactions, setTransactions] = useState<RewardTransaction[]>([])
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [skip, setSkip] = useState(0)
    const [loadingTransactions, setLoadingTransactions] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)

    const fetchingRef = useRef(false)

    const selectedTransactionType = useMemo<RewardTransactionType | undefined>(() => {
        switch (selectedCategory) {
            case "2":
                return "EARN"

            case "3":
                return "COUPON_PURCHASE"

            case "4":
                return "REFUND"

            case "5":
                return "ADJUSTMENT"

            default:
                return undefined
        }
    }, [selectedCategory])

    const fetchRewardTransactions = useCallback(async (
        reset = false,
        transactionType?: RewardTransactionType
    ) => {
        if (fetchingRef.current) return

        try {
            fetchingRef.current = true

            const offset = reset ? 0 : skip

            if (reset) {
                setLoadingTransactions(true)
            } else {
                setLoadingMore(true)
            }

            const res = await getMyRewardTransactions({
                skip: offset,
                limit: LIMIT,
                transaction_type: transactionType
            })

            console.log("Reward transactions response:", res.data)

            const responseData = res.data?.data ?? res.data

            const newTransactions = Array.isArray(responseData?.transactions)
                ? responseData.transactions
                : []

            const total = responseData?.total ?? 0

            if (reset) {
                setTransactions(newTransactions)
            } else {
                setTransactions(
                    prev => [
                        ...prev,
                        ...newTransactions
                    ]
                )
            }

            setTotalTransactions(total)

            setSkip(offset + newTransactions.length)
        } catch (error: any) {
            console.log("Reward transactions error:", error?.response?.data ?? error)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to fetch reward transactions", "warning")
        } finally {
            fetchingRef.current = false

            setLoadingTransactions(false)
            setLoadingMore(false)
        }
    },[skip])

    useEffect(() => {
        setSkip(0)

        fetchRewardTransactions(
            true,
            selectedTransactionType
        )
    }, [selectedTransactionType])

    const isCreditTransaction = (item: RewardTransaction) => {
        switch (item.transaction_type) {
            case "EARN":
            case "REFUND":
                return true

            case "COUPON_PURCHASE":
                return false

            case "ADJUSTMENT":
                return item.points >= 0

            default:
                return item.points >= 0
        }
    }

    const getTransactionTitle = (type: RewardTransactionType) => {
        switch (type) {
            case "EARN":
                return "Points Earned"

            case "COUPON_PURCHASE":
                return "Coupon Redeemed"

            case "REFUND":
                return "Points Refunded"

            case "ADJUSTMENT":
                return "Points Adjusted"

            default:
                return "Reward Transaction"
        }
    }

    const getTransactionSection = (createdAt: string) => {
        const date = new Date(createdAt)
        const today = new Date()
        const yesterday = new Date()

        yesterday.setDate(today.getDate() - 1)

        const isSameDay = (a: Date, b: Date) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()

        if (isSameDay(date, today)) {
            return "Today"
        }

        if (isSameDay(date, yesterday)) {
            return "Yesterday"
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )
    }
    
    const handleCalendarConfirm = useCallback((selectedDate: Date) => {
        if (!datePicker) {
            return
        }

        if (datePicker === "start") {
            setStartDate(selectedDate)

            if (selectedDate > endDate) {
                setEndDate(selectedDate)
            }
        }

        if (datePicker === "end") {
            if (selectedDate < startDate) {
                showToast("End date cannot be before start date", "info")

                return
            }

            setEndDate(selectedDate)
        }

        setDatePicker(null)
    },[datePicker, startDate, endDate])

    const filteredTransactions = useMemo(() => {
        const start = new Date(startDate)

        start.setHours(0, 0, 0, 0)

        const end = new Date(endDate)

        end.setHours(23, 59, 59, 999)

        return transactions.filter(
            item => {
                const date = new Date(item.created_at)

                return (
                    date >= start &&
                    date <= end
                )
            }
        )
    }, [transactions, startDate, endDate])

    const transactionSections = useMemo(() => {
        const grouped: Record<string, RewardTransaction[]> = {}

        filteredTransactions.forEach(
            item => {
                const section = getTransactionSection(item.created_at)

                if (!grouped[section]) {
                    grouped[section] = []
                }

                grouped[section].push(item)
            }
        )

        return Object.entries(grouped).map(
            ([title, data]) => ({
                title,
                data
            })
        )
    }, [filteredTransactions])

    const transactionSummary = useMemo(() => {
        let earned = 0
        let redeemed = 0

        filteredTransactions.forEach(
            item => {
                const amount = Math.abs(Number(item.points))

                if (isCreditTransaction(item)) {
                    earned += amount
                } else {
                    redeemed += amount
                }
            }
        )

        return {
            earned,
            redeemed,
            net: earned - redeemed
        }
    }, [filteredTransactions])

    const SummaryItem = ({title, value, color}: {
        title: string
        value: string
        color: string
    }) => {
        return (
            <View className="flex-1 items-center">
                <Text
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(10),
                        color: hexToRgba(COLORS.primaryTextColor, 0.7)
                    }}
                >
                    {title}
                </Text>

                <Text
                    className="font-extrabold"
                    style={{
                        fontSize: moderateScale(15),
                        color,
                        marginTop: verticalScale(3)
                    }}
                >
                    {value}
                </Text>
            </View>
        )
    }

    const SummaryDivider = () => {
        return (
            <View
                className="mx-2"
                style={{
                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    width: moderateScale(0.7),
                    height: verticalScale(28)
                }}
            />
        )
    }

    const DateFilter = ({label, date, onPress}: {
        label: string
        date: Date
        onPress: () => void
    }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={onPress}
                className="flex-1 flex-row items-center"
                style={{
                    backgroundColor: COLORS.primaryBackgroundColor,
                    borderRadius: moderateScale(14),
                    paddingHorizontal: scale(10),
                    paddingVertical: verticalScale(9)
                }}
            >
                <View
                    className="items-center justify-center"
                    style={{
                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                        width: moderateScale(34),
                        height: moderateScale(34), 
                        borderRadius: moderateScale(10)
                    }}
                >
                    <CalendarIcon
                        width={moderateScale(18)}
                        height={moderateScale(18)}
                        color={COLORS.secondaryColor}
                        strokeWidth={2}
                    />
                </View>

                <View
                    className="flex-1"
                    style={{ marginLeft: scale(8) }}
                >
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(9.5),
                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                        }}
                    >
                        {label}
                    </Text>

                    <Text
                        numberOfLines={1}
                        className="font-semibold"
                        style={{
                            color: COLORS.primaryTextColor,
                            fontSize: moderateScale(11),
                            marginTop: verticalScale(1)
                        }}
                    >
                        {date.toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )}
                    </Text>
                </View>

                <ArrowDownIcon
                    width={moderateScale(15)}
                    height={moderateScale(15)}
                    color={hexToRgba(COLORS.primaryTextColor, 0.75)}
                    strokeWidth={2}
                />
            </TouchableOpacity>
        )
    }

    const renderTransaction = useCallback(({ item }: {item: RewardTransaction}) => {
        const isCredit = isCreditTransaction(item)

        return (
            <TouchableOpacity
                activeOpacity={0.95}
                className="flex-row items-center"
                style={{
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor,0.1),
                    borderWidth: moderateScale(0.5),
                    borderRadius: moderateScale(18),
                    paddingHorizontal: scale(11),
                    paddingVertical: verticalScale(10),
                    gap: scale(10)
                }}
            >
                <View
                    className="items-center justify-center rounded-full"
                    style={{
                        width: moderateScale(42),
                        height: moderateScale(42),
                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15)
                    }}
                >
                    <CircleStarIcon
                        width={moderateScale(26)}
                        height={moderateScale(26)}
                        color={COLORS.secondaryColor}
                    />
                </View>

                <View className="flex-1">
                    <Text
                        numberOfLines={1}
                        className="font-semibold"
                        style={{
                            fontSize: moderateScale(13),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {getTransactionTitle(item.transaction_type)}
                    </Text>

                    <Text
                        numberOfLines={2}
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(10.5),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            marginTop: verticalScale(2)
                        }}
                    >
                        {item.description?.trim()}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(9),
                            color: hexToRgba(COLORS.primaryTextColor, 0.5),
                            marginTop: verticalScale(3)
                        }}
                    >
                        {new Date(item.created_at).toLocaleTimeString(
                            "en-IN",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )}
                    </Text>
                </View>

                <Text
                    className="font-extrabold"
                    style={{
                        fontSize: moderateScale(13),
                        color: isCredit
                            ? COLORS.successColor
                            : COLORS.errorTextColor
                    }}
                >
                    {isCredit ? "+" : "-"}
                    {Math.abs(item.points).toLocaleString("en-IN")}
                    {" pts"}
                </Text>
            </TouchableOpacity>
        )
    },[])

    const renderSectionHeader = useCallback(({ section }: any) => (
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
    ),[])

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    const renderEmptyTransactions = useCallback(() => {
        const hasAnyTransactions = transactions.length > 0

        return (
            <View
                className="flex-1 items-center justify-center"
                style={{ paddingVertical: verticalScale(20) }}
            >
                <View
                    className="items-center justify-center mx-2"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        paddingHorizontal: scale(20),
                        paddingVertical: verticalScale(24),
                        borderRadius: moderateScale(20)
                    }}
                >
                    <View
                        className="items-center justify-center rounded-full"
                        style={{
                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                            width: moderateScale(52),
                            height: moderateScale(52)
                        }}
                    >
                        <TransactionHistoryIcon
                            width={moderateScale(24)}
                            height={moderateScale(24)}
                            color={COLORS.secondaryColor}
                            strokeWidth={1.5}
                        />
                    </View>

                    <Text
                        className="font-bold text-center"
                        style={{
                            color: COLORS.primaryTextColor, 
                            fontSize: moderateScale(15),
                            marginTop: verticalScale(12)
                        }}
                    >
                        {hasAnyTransactions
                            ? "No Reward Transactions Found"
                            : "No Reward Transactions Yet"
                        }
                    </Text>

                    <Text
                        className="font-medium text-center"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                            fontSize: moderateScale(11),
                            lineHeight: moderateScale(15), 
                            marginTop: verticalScale(4)
                        }}
                    >
                        {hasAnyTransactions
                            ? `No reward transactions were found between ${formatDate(
                                startDate
                            )} and ${formatDate(
                                endDate
                            )}.`
                            : "Your reward transactions will appear here once you earn, redeem, refund, or adjust reward points."
                        }
                    </Text>
                </View>
            </View>
        )
    }, [transactions.length, startDate, endDate])

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor}}
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
                    onPress={() =>
                        router.back()
                    }
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.7),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon
                        width={moderateScale(22)}
                        height={moderateScale(22)}
                        color={COLORS.primaryTextColor}
                        strokeWidth={2}
                        style={{marginRight: moderateScale(4)}}
                    />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Reward History
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Track all your reward point activity
                    </Text>
                </View>
            </View>

            <SectionList
                style={{ flex: 1 }}
                onLayout={(event) => {
                    setListHeight(event.nativeEvent.layout.height)
                }}
                sections={loadingTransactions ? [] : transactionSections}
                renderItem={renderTransaction}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={item => item.id}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (transactions.length < totalTransactions && !loadingMore) {
                        fetchRewardTransactions(
                            false,
                            selectedTransactionType
                        )
                    }
                }}
                onEndReachedThreshold={0.4}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25),
                    gap: verticalScale(8)
                }}
                ListHeaderComponent={
                    <View
                        onLayout={(event) => {
                            setListHeaderHeight(event.nativeEvent.layout.height)
                        }}
                    >
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
                            {REWARD_TRANSACTION_CATEGORIES.map(
                                category => {
                                    const isSelected = selectedCategory === category.id

                                    return (
                                        <TouchableOpacity
                                            key={category.id}
                                            activeOpacity={0.95}
                                            onPress={() =>
                                                setSelectedCategory(category.id)
                                            }
                                            className="items-center justify-center"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? COLORS.primaryColor
                                                    : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                                borderRadius: moderateScale(18),
                                                paddingHorizontal: category.title === "All" ? scale(18) : scale(14),
                                                paddingVertical: verticalScale(7),
                                                borderWidth: 0.7,
                                                borderColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor
                                            }}
                                        >
                                            <Text
                                                className="font-semibold"
                                                style={{
                                                    fontSize: moderateScale(13),
                                                    color: isSelected
                                                        ? COLORS.primaryBackgroundColor
                                                        : COLORS.secondaryColor
                                                }}
                                            >
                                                {category.title}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                            )}
                        </ScrollView>

                        <View
                            className="mt-2 mb-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(20),
                                paddingHorizontal: scale(12),
                                paddingTop: verticalScale(16),
                                paddingBottom: verticalScale(12)
                            }}
                        >
                            <View className="flex-row items-center">
                                <SummaryItem
                                    title="Points Earned"
                                    value={`+${transactionSummary.earned.toLocaleString(
                                        "en-IN"
                                    )}`}
                                    color={COLORS.successColor}
                                />

                                <SummaryDivider />

                                <SummaryItem
                                    title="Redeemed"
                                    value={`-${transactionSummary.redeemed.toLocaleString(
                                        "en-IN"
                                    )}`}
                                    color={COLORS.errorTextColor}
                                />

                                <SummaryDivider />

                                <SummaryItem
                                    title="Net Points"
                                    value={`${
                                        transactionSummary.net >= 0 ? "+" : "-"
                                    }${Math.abs(
                                        transactionSummary.net
                                    ).toLocaleString("en-IN")}`}
                                    color={COLORS.primaryTextColor}
                                />
                            </View>

                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    height: moderateScale(0.7),
                                    marginTop: verticalScale(16),
                                    marginBottom: verticalScale(12),
                                    marginHorizontal: scale(12)
                                }}
                            />

                            <View
                                className="flex-row items-center"
                                style={{ gap: scale(10)}}
                            >
                                <DateFilter
                                    label="From"
                                    date={startDate}
                                    onPress={() =>
                                        setDatePicker("start")
                                    }
                                />

                                <DateFilter
                                    label="To"
                                    date={endDate}
                                    onPress={() =>
                                        setDatePicker("end")
                                    }
                                />
                            </View>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    !loadingTransactions
                        ? renderEmptyTransactions
                        : null
                }
                ListFooterComponent={
                    loadingMore ? (
                        <View className="items-center py-4">
                            <LottieView
                                source={require(
                                    "../../../assets/animations/Loading3.json"
                                )}
                                autoPlay
                                loop
                                style={{
                                    width: moderateScale(45),
                                    height: moderateScale(45)
                                }}
                            />
                        </View>
                    ) : null
                }
            />

            {loadingTransactions && (
                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        top: listHeaderHeight + verticalScale(8),
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <LottieView
                        source={require(
                            "../../../assets/animations/Loading3.json"
                        )}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(50),
                            height: moderateScale(50)
                        }}
                    />
                </View>
            )}

            <CalendarPicker
                visible={datePicker !== null}
                title={
                    datePicker === "start"
                        ? "Select Start Date"
                        : "Select End Date"
                }
                selectedDate={
                    datePicker === "start"
                        ? startDate
                        : endDate
                }
                futureDisable
                action="Apply"
                onConfirm={handleCalendarConfirm}
                onClose={() =>
                    setDatePicker(null)
                }
            />
        </SafeAreaView>
    )
}