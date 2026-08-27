import React, { memo } from "react"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

export type BenefitItem = {
    id: string
    title: string
    description: string
    icon: React.FC<SvgProps>
    size: number
}

type BenefitCardProps = {
    item: BenefitItem
}

function BenefitCard({
    item,
}: BenefitCardProps) {
    const Icon = item.icon

    return (
        <View
            className="bg-white border border-[#1F1F1F]/10 items-center"
            style={{
                width: "48%",
                minHeight: moderateScale(160),
                paddingHorizontal: scale(14),
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(20)
            }}
        >
            <View
                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                style={{
                    width: moderateScale(56),
                    height: moderateScale(56)
                }}
            >
                <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color="#5c4639" strokeWidth={1.8} />
            </View>

            <Text
                className="text-[#3F2516] font-bold text-center"
                style={{
                    fontSize: moderateScale(14),
                    marginTop: verticalScale(16)
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

export default memo(BenefitCard)