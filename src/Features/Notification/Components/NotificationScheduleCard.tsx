import MinusCircleIcon from "@/assets/icon/ClockIcon3.svg"
import ToggleSwitch from "@/components/ToggleSwitch"
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
            className="bg-[#3F2516] mt-6"
            style={{
                borderRadius: moderateScale(24),
                paddingHorizontal: scale(16),
                paddingVertical: verticalScale(16)
            }}
        >
            <View className="flex-row items-center gap-3">
                <View
                    className="items-center justify-center bg-[#F8D56A] rounded-full"
                    style={{
                        width: moderateScale(36),
                        height: moderateScale(36)
                    }}
                >
                    <MinusCircleIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" strokeWidth={2} />
                </View>

                <Text
                    className="text-[#F8D56A] font-extrabold"
                    style={{ fontSize: moderateScale(16) }}
                >
                    Schedule
                </Text>
            </View>

            <View
                className="flex-row items-center"
                style={{ marginTop: verticalScale(14) }}
            >
                <Text
                    className="flex-1 text-white font-semibold"
                    style={{ fontSize: moderateScale(15) }}
                >
                    Do Not Disturb
                </Text>

                <ToggleSwitch enabled={enabled} onPress={onToggle} color={true} />
            </View>

            <View
                className="bg-white/5"
                style={{
                    borderRadius: moderateScale(20),
                    paddingHorizontal: scale(14),
                    paddingVertical: verticalScale(12),
                    marginTop: verticalScale(14)
                }}
            >
                <View className="flex-row items-center">
                    <Text
                        className="flex-1 text-white/65 font-medium tracking-widest"
                        style={{ fontSize: moderateScale(11) }}
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
                            className="text-white font-black"
                            style={{ fontSize: moderateScale(20) }}
                        >
                            {startTime}
                        </Text>
                    </TouchableOpacity>

                    <Text
                        className="text-white font-black"
                        style={{
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
                            className="text-white font-black"
                            style={{ fontSize: moderateScale(20) }}
                        >
                            {endTime}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text
                className="text-white/75 font-medium"
                style={{
                    fontSize: moderateScale(12),
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