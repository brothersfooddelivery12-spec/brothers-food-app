import { memo } from "react"
import { Text, View } from "react-native"
import { moderateScale } from "react-native-size-matters"

interface OrderPriceRowProps {
    label: string
    value: string | number
}

const OrderPriceRow = memo(
    ({ label, value }: OrderPriceRowProps) => {
        return (
            <View className="flex-row items-center justify-between my-2">
                <Text
                    className="text-[#1F1F1F]/85 font-semibold"
                    style={{ fontSize: moderateScale(13) }}
                >
                    {label}
                </Text>

                <Text
                    className={`font-bold tracking-wide ${
                        value === "FREE" ? "text-[#16A34A]" : "text-[#1F1F1F]"
                    }`}
                    style={{ fontSize: moderateScale(14) }}
                >
                    {typeof value === "number" ? `₹${value}` : value}
                </Text>
            </View>
        )
    }
)

OrderPriceRow.displayName = "OrderPriceRow"

export default OrderPriceRow