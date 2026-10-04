import { Coupon } from "@/Services/api-service"
import { Image } from "expo-image"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type RewardCouponCardProps = {
    item: Coupon

    onPress?: (item: Coupon) => void
    onRedeem?: (item: Coupon) => void
    onPurchase?: (item: Coupon) => void
}

function RewardCouponCard({
    item,
    onPress,
    onRedeem,
    onPurchase
}: RewardCouponCardProps) {
    const isRewardPoints = item.purchase_method === "REWARD_POINTS"

    const isMoney = item.purchase_method === "MONEY"

    const isFree = item.purchase_method === "FREE"

    const handleAction = () => {
        if (isRewardPoints) {
            onRedeem?.(item)
            return
        }

        if (isMoney) {
            onPurchase?.(item)
            return
        }

        if (isFree) {
            onRedeem?.(item)
        }
    }

    const priceText = isRewardPoints
        ? `${item.points_required ?? 0} pts`
        : isMoney
            ? `₹${Number(item.money_price)}`
            : "Free"

    const buttonText = isRewardPoints
        ? "Redeem"
        : isMoney
            ? "Purchase"
            : "Get"

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="overflow-hidden bg-[#FAFAFA] border-[#1F1F1F]/10"
            style={{
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(22),
                width: scale(250)
            }}
        >
            <View
                className="bg-[#3F2516] m-2 overflow-hidden items-center justify-center"
                style={{
                    height: verticalScale(100),
                    borderRadius: moderateScale(18)
                }}
            >
                <Image
                    source={require("@/assets/images/ReedeemPointsIllustration.png")}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    style={{
                        width: "100%",
                        height: verticalScale(90)
                    }}
                />
            </View>

            <View className="px-3 pb-3">
                <Text
                    numberOfLines={1}
                    className="text-[#1F1F1F] font-bold"
                    style={{ fontSize: moderateScale(14) }}
                >
                    {item.title}
                </Text>

                <Text
                    numberOfLines={2}
                    className="text-[#1F1F1F]/75 font-medium mt-1"
                    style={{
                        fontSize: moderateScale(11),
                        lineHeight: moderateScale(17)
                    }}
                >
                    {item.description}
                </Text>

                <View
                    className="bg-[#E8DDD3]/75"
                    style={{
                        height: moderateScale(0.7),
                        marginVertical: verticalScale(8),
                        marginHorizontal: scale(4)
                    }}
                />

                <View className="flex-row items-center">
                    <Text
                        className="text-[#5C4639] font-extrabold flex-1"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        {priceText}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={(event) => {
                            event.stopPropagation()

                            handleAction()
                        }}
                        className="bg-[#3F2516]"
                        style={{
                            paddingHorizontal: scale(13),
                            paddingVertical: verticalScale(6),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <Text
                            className="text-[#FFFFFF] font-bold"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(RewardCouponCard)