import ArrowRightIcon from "@/assets/icon/ArrowRight.svg"
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
                    <Icon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={1.5} />
                </View>

                <Text
                    className="text-[#1F1F1F] font-medium flex-1"
                    style={{ fontSize: moderateScale(14) }}
                >
                    {label}
                </Text>

                <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
            </TouchableOpacity>

            {showDivider && (
                <View
                    className="bg-[#1F1F1F]/15"
                    style={{
                        height: 1,
                        marginVertical: verticalScale(12),
                        marginHorizontal: moderateScale(6)
                    }}
                />
            )}
        </>
    )
}

export default memo(ProfileMenuItem)