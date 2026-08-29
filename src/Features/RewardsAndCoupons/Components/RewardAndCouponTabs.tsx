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
                className="flex-row bg-[#E5E4E2]/65 mx-2"
                style={{
                    padding: moderateScale(4),
                    borderRadius: moderateScale(28),
                    borderWidth: moderateScale(1),
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
                                : "#8B7A6E"
                        }
                    />

                    <Text
                        className={
                            activeTab === "rewards"
                                ? "text-white font-semibold"
                                : "text-[#756A63] font-medium"
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
                                : "#8B7A6E"
                        }
                    />

                    <Text
                        className={
                            activeTab === "coupons"
                                ? "text-white font-semibold"
                                : "text-[#756A63] font-medium"
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