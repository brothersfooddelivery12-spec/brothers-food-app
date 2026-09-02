import TransactionHistoryIcon from '@/assets/icon/MoneyFilledIcon.svg'
import RefundIcon from '@/assets/icon/RefundIcon.svg'
import UtensilsIcon from '@/assets/icon/UtensilIcon2.svg'
import BankIcon from '@/assets/icon/WalletFilledIcon.svg'
import { memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'

export type WalletTransaction = {
    id: string
    title: string
    description: string
    amount: number
    type: "debit" | "credit"
    status: "completed" | "processing"
    category: "order" | "cashback" | "recharge" | "refund"
}

const CATEGORY_CONFIG = {
    order: {
        icon: UtensilsIcon
    },
    cashback: {
        icon: TransactionHistoryIcon
    },
    recharge: {
        icon: BankIcon
    },
    refund: {
        icon: RefundIcon
    }
}

type TransactionItemProps = {
    item: WalletTransaction
    onPress?: (item: WalletTransaction) => void
}

export const TransactionItem = memo(({ item, onPress }: TransactionItemProps) => {
    const config = CATEGORY_CONFIG[item.category]
    const Icon = config.icon

    const isCredit = item.type === "credit"
    const isProcessing = item.status === "processing"

    const transactionStatus = isProcessing
        ? "Processing"
        : isCredit
            ? "Credited"
            : "Debited"

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress?.(item)}
            className="flex-row items-center bg-white border border-[#1F1F1F]/10"
            style={{
                borderRadius: moderateScale(18),
                paddingHorizontal: scale(12),
                paddingVertical: verticalScale(10)
            }}
        >
            <View
                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                style={{
                    width: moderateScale(42),
                    height: moderateScale(42)
                }}
            >
                <Icon width={moderateScale(22)} height={moderateScale(22)} color="#3F2516" />
            </View>

            <View
                className="flex-1"
                style={{ marginLeft: scale(11) }}
            >
                <Text
                    numberOfLines={1}
                    className="text-[#1F1F1F] font-semibold"
                    style={{ fontSize: moderateScale(13) }}
                >
                    {item.title}
                </Text>

                <Text
                    numberOfLines={1}
                    className="text-[#1F1F1F]/75 font-medium"
                    style={{
                        fontSize: moderateScale(10),
                        marginTop: verticalScale(2)
                    }}
                >
                    {item.description}
                </Text>
            </View>

            <View
                className="items-end"
                style={{ marginLeft: scale(8),marginRight: scale(6) }}
            >
                <Text
                    className="text-[#1F1F1F] font-extrabold"
                    style={{ fontSize: moderateScale(13.5) }}
                >
                    {isCredit ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </Text>

                <Text
                    className={
                        isProcessing
                            ? "text-[#E58A24] font-semibold"
                            : isCredit
                                ? "text-[#4D9151] font-semibold"
                                : "text-[#EF4444] font-semibold"
                    }
                    style={{
                        fontSize: moderateScale(10),
                        marginTop: verticalScale(2)
                    }}
                >
                    {transactionStatus}
                </Text>
            </View>
        </TouchableOpacity>
    )
})