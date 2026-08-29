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
                paddingHorizontal: scale(14),
                paddingVertical: verticalScale(11),
                borderRadius: moderateScale(18),
                borderWidth: 1,
                borderColor: isBrothersPlus
                    ? "rgba(248, 213, 106, 0.80)"
                    : "rgba(31,31,31,0.08)",
                backgroundColor: isBrothersPlus
                    ? "rgba(248, 213, 106, 0.25)"
                    : "#FFFFFF"
            }}
        >
            <View
                className="items-center justify-center"
                style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                    borderRadius: moderateScale(50),
                    backgroundColor: isBrothersPlus
                        ? "#F8D56A"
                        : "rgba(92,70,57,0.10)"
                }}
            >
                <Icon width={moderateScale(19)} height={moderateScale(19)} color="#5C4639" />
            </View>

            <View
                className="flex-1"
                style={{ marginLeft: scale(11) }}
            >
                <Text
                    className="text-[#1F1F1F] font-semibold"
                    style={{ fontSize: moderateScale(14) }}
                >
                    {item.title}
                </Text>

                <Text
                    className="text-[#1F1F1F]/75 font-medium"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: verticalScale(2)
                    }}
                >
                    {item.description}
                </Text>

                {item.badge && (
                    <View
                        className="self-start bg-[#E8B93F]/15"
                        style={{
                            marginTop: verticalScale(5),
                            paddingHorizontal: scale(5),
                            paddingVertical: verticalScale(2),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className="text-[#5C4639] font-semibold"
                            style={{ fontSize: moderateScale(9) }}
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