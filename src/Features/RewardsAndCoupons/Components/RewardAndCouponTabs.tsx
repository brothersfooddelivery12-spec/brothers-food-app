import CouponIcon from '@/assets/icon/CouponIcon.svg'
import GiftIcon from '@/assets/icon/GiftIcon.svg'
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
                className="flex-row bg-[#FAFAFA] mx-2"
                style={{
                    padding: moderateScale(4),
                    borderRadius: moderateScale(28),
                    borderWidth: moderateScale(0.5),
                    borderColor: "#E8E0D9"
                }}
            >
                <Pressable
                    onPress={() => onChange("rewards")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor:
                            activeTab === "rewards"
                                ? "#3F2516"
                                : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <GiftIcon width={moderateScale(18)} height={moderateScale(18)}
                        color={
                            activeTab === "rewards"
                                ? "#FFFFFF"
                                : "rgba(31,31,31,0.75)"
                        }
                    />

                    <Text
                        className={
                            activeTab === "rewards"
                                ? "text-[#FFFFFF] font-semibold"
                                : "text-[#1F1F1F]/75 font-medium"
                        }
                        style={{ fontSize: moderateScale(14) }}
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
                        backgroundColor:
                            activeTab === "coupons"
                                ? "#3F2516"
                                : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <CouponIcon width={moderateScale(18)} height={moderateScale(18)}
                        color={
                            activeTab === "coupons"
                                ? "#FFFFFF"
                                : "rgba(31,31,31,0.75)"
                        }
                    />

                    <Text
                        className={
                            activeTab === "coupons"
                                ? "text-[#FFFFFF] font-semibold"
                                : "text-[#1F1F1F]/75 font-medium"
                        }
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Coupons
                    </Text>
                </Pressable>
            </View>
        )
    }
)

export default RewardAndCouponTabs