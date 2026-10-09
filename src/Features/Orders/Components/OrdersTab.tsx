import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { memo } from "react"
import { Pressable, Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

type OrdersTab = "active orders" | "past orders"

interface OrdersTabsProps {
    activeTab: OrdersTab
    onChange: (tab: OrdersTab) => void
}

const OrdersTabs = memo(
    ({ activeTab, onChange }: OrdersTabsProps) => {
        return (
            <View
                className="flex-row mx-2"
                style={{
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    padding: moderateScale(4),
                    borderRadius: moderateScale(28),
                    borderWidth: moderateScale(0.5)
                }}
            >
                <Pressable
                    onPress={() => onChange("active orders")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor: activeTab === "active orders"
                            ? COLORS.primaryColor
                            : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <Text
                        className={
                            activeTab === "active orders"
                                ? "font-semibold"
                                : "font-medium"
                        }
                        style={{
                            fontSize: moderateScale(14),
                            color: activeTab === "active orders" ? COLORS.primaryBackgroundColor : hexToRgba(COLORS.primaryTextColor, 0.75)
                        }}
                    >
                        Active Orders
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => onChange("past orders")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor: activeTab === "past orders"
                            ? COLORS.primaryColor
                            : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <Text
                        className={
                            activeTab === "past orders"
                                ? "font-semibold"
                                : "font-medium"
                        }
                        style={{
                            fontSize: moderateScale(14),
                            color: activeTab === "past orders" ? COLORS.primaryBackgroundColor : hexToRgba(COLORS.primaryTextColor, 0.75)
                        }}
                    >
                        Past Orders
                    </Text>
                </Pressable>
            </View>
        )
    }
)

export default OrdersTabs