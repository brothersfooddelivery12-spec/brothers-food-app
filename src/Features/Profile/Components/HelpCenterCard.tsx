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
            className="bg-white border border-[#1F1F1F]/10 items-center"
            style={{
                width: "48%",
                minHeight: moderateScale(160),
                paddingHorizontal: scale(14),
                paddingTop: verticalScale(16),
                paddingBottom: verticalScale(12),
                borderRadius: moderateScale(20)
            }}
        >
            <View
                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                style={{
                    width: moderateScale(54),
                    height: moderateScale(54)
                }}
            >
                <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color="#5c4639" strokeWidth={1.8} />
            </View>

            <Text
                className="text-[#3F2516] font-bold text-center"
                style={{
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(12)
                }}
            >
                {item.title}
            </Text>

            <Text
                className="text-[#1F1F1F]/75 font-medium text-center"
                style={{
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