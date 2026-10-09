import CouponIcon from '@/assets/icon/CouponIcon.svg'
import GiftIcon from '@/assets/icon/GiftIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { memo } from "react"
import { Pressable, Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

type RewardAndCouponTab = "rewards" | "coupons"

interface RewardAndCouponTabsProps {
    activeTab: RewardAndCouponTab
    onChange: (tab: RewardAndCouponTab) => void
}

const RewardAndCouponTabs = memo(
    ({ activeTab, onChange }: RewardAndCouponTabsProps) => {
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
                    onPress={() => onChange("rewards")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor: activeTab === "rewards"
                            ? COLORS.primaryColor
                            : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <GiftIcon width={moderateScale(18)} height={moderateScale(18)}
                        color={
                            activeTab === "rewards"
                                ? COLORS.primaryBackgroundColor
                                : hexToRgba(COLORS.primaryTextColor, 0.75)
                        }
                    />

                    <Text
                        className={
                            activeTab === "rewards"
                                ? "font-semibold"
                                : "font-medium"
                        }
                        style={{
                            fontSize: moderateScale(14),
                            color: activeTab === "rewards"
                                ? COLORS.primaryBackgroundColor
                                : hexToRgba(COLORS.primaryTextColor, 0.75)
                        }}
                    >
                        Rewards
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => onChange("coupons")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor: activeTab === "coupons"
                            ? COLORS.primaryColor
                            : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <CouponIcon width={moderateScale(18)} height={moderateScale(18)}
                        color={
                            activeTab === "coupons"
                                ? COLORS.primaryBackgroundColor
                                : hexToRgba(COLORS.primaryTextColor, 0.75)
                        }
                    />

                    <Text
                        className={
                            activeTab === "coupons"
                                ? "font-semibold"
                                : "font-medium"
                        }
                        style={{
                            fontSize: moderateScale(14),
                            color: activeTab === "coupons"
                                ? COLORS.primaryBackgroundColor
                                : hexToRgba(COLORS.primaryTextColor, 0.75) 
                        }}
                    >
                        Coupons
                    </Text>
                </Pressable>
            </View>
        )
    }
)

export default RewardAndCouponTabs