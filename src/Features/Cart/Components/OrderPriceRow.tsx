import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
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
                    className="font-semibold"
                    style={{
                        fontSize: moderateScale(13),
                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                    }}
                >
                    {label}
                </Text>

                <Text
                    className="font-bold tracking-wide"
                    style={{
                        fontSize: moderateScale(14),
                        color: value === "FREE"
                            ? COLORS.successColor
                            : COLORS.primaryTextColor
                    }}
                >
                    {typeof value === "number"
                        ? `₹${value}`
                        : value
                    }
                </Text>
            </View>
        )
    }
)

OrderPriceRow.displayName = "OrderPriceRow"

export default OrderPriceRow