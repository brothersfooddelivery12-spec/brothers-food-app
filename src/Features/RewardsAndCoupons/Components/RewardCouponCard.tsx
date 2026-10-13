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

    showActionButton?: boolean
    cutoutColor?: string

    variant?: "default" | "modal"
}

function RewardCouponCard({
    item,
    onRedeem,
    onPurchase,
    onGet,
    showActionButton = true,
    cutoutColor = COLORS.primaryBackgroundColor,
    variant = "default"
}: RewardCouponCardProps) {

    const isModal = variant === "modal"

    const NoteIcon =
        item.noteType === "expiry"
            ? ClockIcon
            : item.noteType === "exclusive"
                ? UtensilsIcon
                : InfoIcon

    const isExpiry =
        item.noteType === "expiry"

    const isReward =
        item.purchaseMethod === "REWARD_POINTS"

    const isMoney =
        item.purchaseMethod === "MONEY"

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
                borderRadius: moderateScale(isModal ? 17 : 20),
                minHeight: verticalScale(isModal ? 100 : 120)
            }}
        >
            <View
                className="flex-1"
                style={{
                    paddingHorizontal: scale(isModal ? 10 : 12),
                    paddingVertical: verticalScale(isModal ? 9 : 12)
                }}
            >
                <View
                    className="self-start flex-row items-center"
                    style={{
                        gap: scale(isModal ? 4 : 8),
                        backgroundColor: item.featured
                            ? COLORS.accentLightColor
                            : hexToRgba(COLORS.accentColor, 0.15),
                        paddingHorizontal: scale(isModal ? 7 : 8),
                        paddingVertical: verticalScale(isModal ? 3 : 4),
                        borderRadius: moderateScale(20)
                    }}
                >
                    <Text
                        className="font-bold uppercase"
                        style={{
                            color: COLORS.secondaryColor,
                            fontSize: moderateScale(isModal ? 8.5 : 10),
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
                        fontSize: moderateScale(isModal ? 14.5 : 18),
                        lineHeight: moderateScale(isModal ? 18 : 22),
                        marginTop: verticalScale(isModal ? 8 : 12)
                    }}
                >
                    {item.title}
                </Text>

                <Text
                    numberOfLines={2}
                    className="font-medium"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(isModal ? 10 : 12),
                        lineHeight: moderateScale(isModal ? 14 : 16),
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
                        marginVertical: verticalScale(isModal ? 6 : 8)
                    }}
                />

                <View
                    className="flex-row items-center"
                    style={{ gap: scale(isModal ? 5 : 8) }}
                >
                    <NoteIcon
                        width={moderateScale(isModal ? 13 : 16)}
                        height={moderateScale(isModal ? 13 : 16)}
                        color={
                            isExpiry
                                ? COLORS.errorTextColor
                                : COLORS.secondaryColor
                        }
                        strokeWidth={1.8}
                    />

                    <Text
                        className="font-medium flex-1"
                        style={{
                            color: isExpiry
                                ? COLORS.errorTextColor
                                : COLORS.secondaryColor,
                            fontSize: moderateScale(isModal ? 9 : 10.5),
                            lineHeight: moderateScale(isModal ? 13 : 17)
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
                    width: scale(isModal ? 88 : 105),
                    paddingHorizontal: scale(isModal ? 8 : 10),
                    borderTopRightRadius: moderateScale(isModal ? 17 : 20),
                    borderBottomRightRadius: moderateScale(isModal ? 17 : 20)
                }}
            >
                <View
                    className="absolute left-0 h-full items-center overflow-hidden"
                    style={{
                        width: 1,
                        gap: verticalScale(isModal ? 2 : 3)
                    }}
                >
                    {Array.from({length: 30}).map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: 0.7,
                                height: verticalScale(isModal ? 3 : 4),
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.45)
                            }}
                        />
                    ))}
                </View>

                <View
                    pointerEvents="none"
                    className="absolute"
                    style={{
                        backgroundColor: cutoutColor,
                        top: -moderateScale(isModal ? 9 : 11),
                        left: -moderateScale(isModal ? 9 : 11),
                        width: moderateScale(isModal ? 18 : 22),
                        height: moderateScale(isModal ? 18 : 22),
                        borderRadius: moderateScale(isModal ? 9 : 11),
                        zIndex: 20
                    }}
                />

                <View
                    pointerEvents="none"
                    className="absolute"
                    style={{
                        backgroundColor: cutoutColor,
                        bottom: -moderateScale(isModal ? 9 : 11),
                        left: -moderateScale(isModal ? 9 : 11),
                        width: moderateScale(isModal ? 18 : 22),
                        height: moderateScale(isModal ? 18 : 22),
                        borderRadius: moderateScale(isModal ? 9 : 11),
                        zIndex: 20
                    }}
                />

                <Text
                    className="font-extrabold text-center"
                    style={{
                        color: COLORS.primaryColor,
                        fontSize: moderateScale(isModal ? 13.5 : 15.5),
                        marginBottom: showActionButton ? verticalScale(isModal ? 6 : 9) : 0
                    }}
                >
                    {costText}
                </Text>

                {showActionButton && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={handleAction}
                        className="w-full items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            paddingVertical: verticalScale(isModal ? 6 : 8),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(isModal ? 10 : 12),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            {actionText}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default memo(RewardCouponCard)