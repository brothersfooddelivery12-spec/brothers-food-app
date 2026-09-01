import ToggleSwitch from "@/components/ToggleSwitch"
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
            className="mt-3 p-4 bg-white border border-[#1F1F1F]/10"
            style={{ borderRadius: moderateScale(18) }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <React.Fragment key={item.id}>
                        <View className="flex-row items-center gap-2">
                            <Text
                                className="text-[#1F1F1F] font-medium flex-1"
                                style={{ fontSize: moderateScale(14) }}
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
                                className="bg-[#1F1F1F]/10"
                                style={{
                                    height: 1,
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