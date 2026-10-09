import MinusCircleIcon from "@/assets/icon/ClockIcon3.svg"
import ToggleSwitch from "@/components/ToggleSwitch"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type NotificationScheduleCardProps = {
    enabled: boolean
    startTime: string
    endTime: string

    onToggle: () => void
    onEditStartTime: () => void
    onEditEndTime: () => void
}

const NotificationScheduleCard = ({
    enabled,
    startTime, endTime,
    onToggle,
    onEditStartTime, onEditEndTime
}: NotificationScheduleCardProps) => {
    return (
        <View
            className="mt-6"
            style={{
                backgroundColor: COLORS.primaryColor,
                borderRadius: moderateScale(24),
                paddingHorizontal: scale(16),
                paddingVertical: verticalScale(16)
            }}
        >
            <View className="flex-row items-center gap-3">
                <View
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.accentLightColor,
                        width: moderateScale(36),
                        height: moderateScale(36)
                    }}
                >
                    <MinusCircleIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} strokeWidth={2} />
                </View>

                <Text
                    className="font-extrabold"
                    style={{
                        fontSize: moderateScale(16),
                        color: COLORS.accentLightColor
                    }}
                >
                    Schedule
                </Text>
            </View>

            <View
                className="flex-row items-center"
                style={{ marginTop: verticalScale(14) }}
            >
                <Text
                    className="flex-1 font-semibold"
                    style={{
                        fontSize: moderateScale(15),
                        color: COLORS.primaryBackgroundColor
                    }}
                >
                    Do Not Disturb
                </Text>

                <ToggleSwitch enabled={enabled} onPress={onToggle} color={true} />
            </View>

            <View
                style={{
                    backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.05),
                    borderRadius: moderateScale(20),
                    paddingHorizontal: scale(14),
                    paddingVertical: verticalScale(12),
                    marginTop: verticalScale(14)
                }}
            >
                <View className="flex-row items-center">
                    <Text
                        className="flex-1 font-medium tracking-widest"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryBackgroundColor, 0.75)
                        }}
                    >
                        ACTIVE HOURS
                    </Text>
                </View>

                <View
                    className="flex-row items-center"
                    style={{ marginTop: verticalScale(8) }}
                >
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onEditStartTime}
                    >
                        <Text
                            className="font-black"
                            style={{
                                fontSize: moderateScale(20),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            {startTime}
                        </Text>
                    </TouchableOpacity>

                    <Text
                        className="font-black"
                        style={{
                            color: COLORS.primaryBackgroundColor,
                            fontSize: moderateScale(20),
                            marginHorizontal: scale(7)
                        }}
                    >
                        -
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={onEditEndTime}
                    >
                        <Text
                            className="font-black"
                            style={{
                                fontSize: moderateScale(20),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            {endTime}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text
                className="font-medium"
                style={{
                    color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
                    fontSize: moderateScale(11),
                    lineHeight: moderateScale(16),
                    marginTop: verticalScale(12)
                }}
            >
                Notifications will be silenced during this period to ensure your rest.
            </Text>
        </View>
    )
}

export default memo(NotificationScheduleCard)