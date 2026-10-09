import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import CheckCircleIcon from '@/assets/icon/SuccessIcon2.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type OrderStep = {
    id: string
    title: string
    time: string
    completed: boolean
    current?: boolean
}

type OrderTimelineProps = {
    steps: OrderStep[]
}

export default function OrderTimeline({ steps }: OrderTimelineProps) {
    return (
        <View className="mt-6">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1

                return (
                    <View
                        key={step.id}
                        className="flex-row"
                    >
                        <View
                            className="items-center"
                            style={{ width: moderateScale(34) }}
                        >
                            <View
                                className="items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: step.completed
                                        ? COLORS.accentLightColor
                                        : COLORS.neutralSurfaceColor,
                                    width: moderateScale(30),
                                    height: moderateScale(30)
                                }}
                            >
                                {step.completed ? (
                                    <CheckCircleIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryColor} strokeWidth={1.8} />
                                ) : (
                                    <LocationIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryTextColor} strokeWidth={1.8} />
                                )}
                            </View>

                            {!isLast && (
                                <View
                                    style={{
                                        height: verticalScale(15),
                                        marginVertical: verticalScale(2),
                                        borderStyle: step.completed ? "dashed" : "solid",
                                        borderWidth: 0.8,
                                        borderColor: step.completed
                                            ? COLORS.accentColor
                                            : hexToRgba(COLORS.primaryTextColor, 0.45)
                                    }}
                                />
                            )}
                        </View>

                        <View
                            style={{
                                marginLeft: scale(8),
                                paddingBottom: isLast ? 0 : verticalScale(10)
                            }}
                        >
                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(13),
                                    color: step.completed
                                        ? COLORS.primaryTextColor
                                        : hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                {step.title}
                            </Text>

                            <Text
                                className="font-medium"
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                    fontSize: moderateScale(10),
                                    marginTop: verticalScale(2)
                                }}
                            >
                                {step.time}
                            </Text>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}