import ClockIcon from "@/assets/icon/ClockIcon3.svg"
import InfoIcon from "@/assets/icon/InformationCircleIcon.svg"
import UtensilsIcon from "@/assets/icon/UtensilIcon2.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { CouponItem } from "./CouponCard"

type RewardCouponCardProps = {
    item: CouponItem

    onRedeem?: (item: CouponItem) => void
    onPurchase?: (item: CouponItem) => void
    onGet?: (item: CouponItem) => void
}

function RewardCouponCard({
    item,
    onRedeem,
    onPurchase,
    onGet
}: RewardCouponCardProps) {
    const NoteIcon =
        item.noteType === "expiry"
            ? ClockIcon
            : item.noteType === "exclusive"
                ? UtensilsIcon
                : InfoIcon

    const isExpiry = item.noteType === "expiry"
    const isReward = item.purchaseMethod === "REWARD_POINTS"
    const isMoney = item.purchaseMethod === "MONEY"

    const actionText = isReward
        ? "Redeem"
        : isMoney
            ? "Purchase"
            : "Get"

    const costText = isReward
        ? `${item.pointsRequired ?? 0} pts`
        : isMoney
            ? `₹${item.moneyPrice}`
            : "Free"

    const handleAction = () => {
        if (isReward) {
            onRedeem?.(item)
            return
        }

        if (isMoney) {
            onPurchase?.(item)
            return
        }

        onGet?.(item)
    }

    return (
        <View
            className="flex-row overflow-visible"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(20),
                minHeight: verticalScale(120)
            }}
        >
            <View
                className="flex-1"
                style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(12)
                }}
            >
                <View
                    className="self-start flex-row items-center gap-2"
                    style={{
                        backgroundColor: item.featured
                            ? COLORS.accentLightColor
                            : hexToRgba(COLORS.accentColor, 0.15),
                        paddingHorizontal: scale(8),
                        paddingVertical: verticalScale(4),
                        borderRadius: moderateScale(20)
                    }}
                >
                    <Text
                        className="font-bold uppercase"
                        style={{
                            color: COLORS.secondaryColor,
                            fontSize: moderateScale(10),
                            letterSpacing: 0.4
                        }}
                    >
                        {item.code}
                    </Text>
                </View>

                <Text
                    numberOfLines={2}
                    className="font-extrabold"
                    style={{
                        color: COLORS.primaryTextColor,
                        fontSize: moderateScale(18),
                        marginTop: verticalScale(12)
                    }}
                >
                    {item.title}
                </Text>

                <Text
                    numberOfLines={2}
                    className="font-medium"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(3)
                    }}
                >
                    {item.description}
                </Text>

                <View
                    className="mx-2"
                    style={{
                        backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                        height: 0.7,
                        marginVertical: verticalScale(8)
                    }}
                />

                <View className="flex-row items-center gap-2">
                    <NoteIcon
                        width={moderateScale(16)}
                        height={moderateScale(16)}
                        color={isExpiry ? COLORS.errorTextColor : COLORS.secondaryColor}
                        strokeWidth={1.8}
                    />

                    <Text
                        className="font-medium flex-1"
                        style={{
                            color: isExpiry
                                ? COLORS.errorTextColor
                                : COLORS.secondaryColor,
                            fontSize: moderateScale(10.5),
                            lineHeight: moderateScale(17)
                        }}
                    >
                        {item.note}
                    </Text>
                </View>
            </View>

            <View
                className="relative items-center justify-center overflow-visible"
                style={{
                    backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                    width: scale(105),
                    paddingHorizontal: scale(10),
                    borderTopRightRadius: moderateScale(20),
                    borderBottomRightRadius: moderateScale(20)
                }}
            >
                <View
                    className="absolute left-0 h-full items-center overflow-hidden"
                    style={{
                        width: 1,
                        gap: verticalScale(3)
                    }}
                >
                    {Array.from({ length: 30 }).map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: 0.7,
                                height: verticalScale(4),
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.45),
                            }}
                        />
                    ))}
                </View>

                <View
                    pointerEvents="none"
                    className="absolute"
                    style={{
                        backgroundColor: COLORS.primaryBackgroundColor,
                        top: -moderateScale(11),
                        left: -moderateScale(11),
                        width: moderateScale(22),
                        height: moderateScale(22),
                        borderRadius: moderateScale(11),
                        zIndex: 20
                    }}
                />

                <View
                    pointerEvents="none"
                    className="absolute"
                    style={{
                        backgroundColor: COLORS.primaryBackgroundColor,
                        bottom: -moderateScale(11),
                        left: -moderateScale(11),
                        width: moderateScale(22),
                        height: moderateScale(22),
                        borderRadius: moderateScale(11),
                        zIndex: 20
                    }}
                />

                <Text
                    className="font-extrabold"
                    style={{
                        color: COLORS.primaryColor,
                        fontSize: moderateScale(15.5),
                        marginBottom: verticalScale(9)
                    }}
                >
                    {costText}
                </Text>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={handleAction}
                    className="w-full items-center justify-center"
                    style={{
                        backgroundColor: COLORS.primaryColor,
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(18)
                    }}
                >
                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(12),
                            color: COLORS.primaryBackgroundColor
                        }}
                    >
                        {actionText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default memo(RewardCouponCard)