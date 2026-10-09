import ArrowRightIcon from "@/assets/icon/ArrowRight.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import React, { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

type ProfileMenuItemProps = {
    label: string
    icon: React.FC<SvgProps>
    onPress?: () => void
    showDivider?: boolean
}

function ProfileMenuItem({
    label,
    icon: Icon,
    onPress,
    showDivider = true,
}: ProfileMenuItemProps) {
    return (
        <>
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={onPress}
                className="flex-row items-center gap-2"
            >
                <View
                    className="items-center justify-center"
                    style={{ width: moderateScale(24) }}
                >
                    <Icon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={1.5} />
                </View>

                <Text
                    className="font-medium flex-1"
                    style={{
                        fontSize: moderateScale(14),
                        color: COLORS.primaryTextColor
                    }}
                >
                    {label}
                </Text>

                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={2} />
            </TouchableOpacity>

            {showDivider && (
                <View
                    style={{
                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        height: 0.7,
                        marginVertical: verticalScale(12),
                        marginHorizontal: moderateScale(6)
                    }}
                />
            )}
        </>
    )
}

export default memo(ProfileMenuItem)