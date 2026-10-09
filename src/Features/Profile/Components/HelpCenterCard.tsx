import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import React, { memo } from "react"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

export type HelpCenterItem = {
    id: string
    title: string
    description: string
    icon: React.FC<SvgProps>
    size: number
}

type HelpCenterCardProps = {
    item: HelpCenterItem
}

function HelpCenterCard({ item }: HelpCenterCardProps) {
    const Icon = item.icon

    return (
        <View
            className="items-center"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                width: "48%",
                minHeight: moderateScale(160),
                paddingHorizontal: scale(14),
                paddingTop: verticalScale(16),
                paddingBottom: verticalScale(12),
                borderRadius: moderateScale(20)
            }}
        >
            <View
                className="items-center justify-center rounded-full"
                style={{
                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                    width: moderateScale(54),
                    height: moderateScale(54)
                }}
            >
                <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color={COLORS.primaryColor} strokeWidth={1.8} />
            </View>

            <Text
                className="font-bold text-center"
                style={{
                    color: COLORS.primaryTextColor,
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(12)
                }}
            >
                {item.title}
            </Text>

            <Text
                className="font-medium text-center"
                style={{
                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                    fontSize: moderateScale(11),
                    lineHeight: moderateScale(14),
                    marginTop: verticalScale(6)
                }}
            >
                {item.description}
            </Text>
        </View>
    )
}

export default memo(HelpCenterCard)