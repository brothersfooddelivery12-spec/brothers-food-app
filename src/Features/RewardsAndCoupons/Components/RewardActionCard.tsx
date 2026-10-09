import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

export type RewardActionItem = {
    id: string
    title: string
    description: string
    icon: React.FC<SvgProps>
    badge?: string
}

type RewardActionCardProps = {
    item: RewardActionItem
    isBrothersPlus?: boolean
    onPress?: (item: RewardActionItem) => void
}

const RewardActionCard = ({
    item,
    isBrothersPlus = false,
    onPress,
}: RewardActionCardProps) => {
    const Icon = item.icon

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="flex-row items-center"
            style={{
                minHeight: verticalScale(64),
                paddingHorizontal: scale(12),
                paddingVertical: verticalScale(8),
                borderRadius: moderateScale(18),
                borderWidth: 0.5,
                borderColor: isBrothersPlus
                    ? hexToRgba(COLORS.accentColor, 0.15)
                    : hexToRgba(COLORS.primaryTextColor, 0.1),
                backgroundColor: isBrothersPlus
                    ? hexToRgba(COLORS.accentColor, 0.1)
                    : COLORS.secondaryBackgroundColor
            }}
        >
            <View
                className="items-center justify-center"
                style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                    borderRadius: moderateScale(50),
                    backgroundColor: isBrothersPlus
                        ? COLORS.accentLightColor
                        : hexToRgba(COLORS.neutralSurfaceColor, 0.75)
                }}
            >
                <Icon width={moderateScale(19)} height={moderateScale(19)} color={COLORS.primaryColor} />
            </View>

            <View
                className="flex-1"
                style={{ marginLeft: scale(11) }}
            >
                <Text
                    className="font-semibold"
                    style={{
                        fontSize: moderateScale(14),
                        color: COLORS.primaryTextColor
                    }}
                >
                    {item.title}
                </Text>

                <Text
                    className="font-medium"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(11),
                        marginTop: verticalScale(2)
                    }}
                >
                    {item.description}
                </Text>

                {item.badge && (
                    <View
                        className="self-start"
                        style={{
                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                            marginTop: verticalScale(5),
                            paddingHorizontal: scale(7),
                            paddingVertical: verticalScale(2),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(9),
                                color: COLORS.primaryColor
                            }}
                        >
                            {item.badge}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default RewardActionCard