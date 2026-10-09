import ToggleSwitch from "@/components/ToggleSwitch"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import React, { memo } from "react"
import { Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export type NotificationPreference = {
    id: string
    title: string
    enabled: boolean
}

type NotificationPreferenceCardProps = {
    items: NotificationPreference[]
    onToggle: (id: string, enabled: boolean) => void
}

const NotificationPreferenceCard = ({ items, onToggle }: NotificationPreferenceCardProps) => {
    return (
        <View
            className="mt-3 p-4"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderRadius: moderateScale(18),
                borderWidth: moderateScale(0.5)
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <React.Fragment key={item.id}>
                        <View className="flex-row items-center gap-2">
                            <Text
                                className="font-medium flex-1"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                {item.title}
                            </Text>

                            <ToggleSwitch
                                enabled={item.enabled}
                                onPress={() => onToggle(item.id, !item.enabled)}
                            />
                        </View>

                        {!isLast && (
                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    height: moderateScale(0.7),
                                    marginVertical: verticalScale(8),
                                    marginHorizontal: moderateScale(6)
                                }}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </View>
    )
}

export default memo(NotificationPreferenceCard)