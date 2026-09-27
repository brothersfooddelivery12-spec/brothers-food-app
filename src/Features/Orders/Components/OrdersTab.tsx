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
                className="flex-row bg-[#FAFAFA] mx-2 border-[#1F1F1F]/10"
                style={{
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
                        backgroundColor:
                            activeTab === "active orders"
                                ? "#3F2516"
                                : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <Text
                        className={
                            activeTab === "active orders"
                                ? "text-[#FFFFFF] font-semibold"
                                : "text-[#1F1F1F]/75 font-medium"
                        }
                        style={{ fontSize: moderateScale(14) }}
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
                        backgroundColor:
                            activeTab === "past orders"
                                ? "#3F2516"
                                : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <Text
                        className={
                            activeTab === "past orders"
                                ? "text-[#FFFFFF] font-semibold"
                                : "text-[#1F1F1F]/75 font-medium"
                        }
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Past Orders
                    </Text>
                </Pressable>
            </View>
        )
    }
)

export default OrdersTabs