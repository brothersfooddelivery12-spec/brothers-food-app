import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import CheckCircleIcon from '@/assets/icon/SuccessIcon2.svg'
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

export default function OrderTimeline({
    steps,
}: OrderTimelineProps) {
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
                                className={`items-center justify-center rounded-full ${
                                    step.completed
                                        ? "bg-[#F8D56A]"
                                        : "bg-[#E5E4E2]"
                                }`}
                                style={{
                                    width: moderateScale(30),
                                    height: moderateScale(30)
                                }}
                            >
                                {step.completed ? (
                                    <CheckCircleIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" strokeWidth={1.8} />
                                ) : (
                                    <LocationIcon width={moderateScale(16)} height={moderateScale(16)} color="#7A7D81" strokeWidth={1.8} />
                                )}
                            </View>

                            {!isLast && (
                                <View
                                    style={{
                                        width: 1.5,
                                        height: verticalScale(15),
                                        marginVertical: verticalScale(2),
                                        borderStyle: step.completed
                                            ? "dashed"
                                            : "solid",
                                        borderWidth: 0.8,
                                        borderColor: step.completed
                                            ? "#E8B93F"
                                            : "#D1D1D1"
                                    }}
                                />
                            )}
                        </View>

                        <View
                            style={{
                                marginLeft: scale(8),
                                paddingBottom: isLast
                                    ? 0
                                    : verticalScale(10)
                            }}
                        >
                            <Text
                                className={
                                    step.completed
                                        ? "text-[#1F1F1F] font-semibold"
                                        : "text-[#1F1F1F]/55 font-semibold"
                                }
                                style={{ fontSize: moderateScale(13) }}
                            >
                                {step.title}
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/65 font-medium"
                                style={{
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