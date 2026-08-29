import CloseIcon from "@/assets/icon/CancelCircleIcon.svg"
import ClockIcon from "@/assets/icon/ClockIcon3.svg"
import CalendarIcon from "@/assets/icon/DateIcon.svg"
import HourglassIcon from '@/assets/icon/HourglassIcon.svg'
import CheckIcon from "@/assets/icon/SuccessIcon2.svg"
import TicketIcon from "@/assets/icon/TicketIcon.svg"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type SupportStatus = "in_progress" | "resolved" | "rejected"

export type SupportRequest = {
    id: string
    ticketId: string
    title: string
    description: string
    status: SupportStatus
    createdAt: string
    time: string
}

type SupportRequestCardProps = {
    item: SupportRequest
    onPress?: (item: SupportRequest) => void
}

const STATUS_CONFIG = {
    in_progress: {
        label: "IN PROGRESS",
        color: "#F8D56A",
        textColor: "#6B4F00",
        backgroundColor: "#F8D56A30"
    },

    resolved: {
        label: "RESOLVED",
        color: "#4D9151",
        textColor: "#4D9151",
        backgroundColor: "#4D915125"
    },

    rejected: {
        label: "REJECTED",
        color: "#DC2626",
        textColor: "#DC2626",
        backgroundColor: "#DC262620"
    },
} as const

export default function SupportRequestCard({ item, onPress }: SupportRequestCardProps) {
    const status = STATUS_CONFIG[item.status]

    const renderStatusIcon = () => {
        switch (item.status) {
            case "resolved":
                return (
                    <CheckIcon width={moderateScale(13)} height={moderateScale(13)} color={status.color} strokeWidth={1.5} />
                )

            case "rejected":
                return (
                    <CloseIcon width={moderateScale(13)} height={moderateScale(13)} color={status.color} strokeWidth={1.5} />
                )

            default:
                return (
                    <HourglassIcon width={moderateScale(13)} height={moderateScale(13)} color={status.textColor} strokeWidth={1.5} />
                )
        }
    }

    return (
        <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => onPress?.(item)}
            className="bg-white border border-[#1F1F1F]/10 overflow-hidden"
            style={{
                borderLeftColor: status.color,
                borderLeftWidth: 3,
                borderRadius: moderateScale(20),
                marginBottom: verticalScale(12)
            }}
        >
            <View className="flex-row">
               <View
                    className="flex-1"
                    style={{
                        paddingHorizontal: scale(14),
                        paddingVertical: verticalScale(14)
                    }}
                >
                    <View className="flex-row items-start gap-3">
                        <View
                            className="items-center justify-center"
                            style={{
                                width: moderateScale(46),
                                height: moderateScale(46),
                                borderRadius: moderateScale(23),
                                backgroundColor: status.backgroundColor
                            }}
                        >
                            {item.status === "resolved" ? (
                                <CheckIcon width={moderateScale(22)} height={moderateScale(22)} color={status.color} strokeWidth={1.8} />
                            ) : item.status === "rejected" ? (
                                <CloseIcon width={moderateScale(21)} height={moderateScale(21)} color={status.color} strokeWidth={1.8} />
                            ) : (
                                <TicketIcon width={moderateScale(21)} height={moderateScale(21)} color="#3F2516" strokeWidth={1.8} />
                            )}
                        </View>

                        <View className="flex-1">
                            <Text
                                className="text-[#1F1F1F] font-extrabold"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                #{item.ticketId}
                            </Text>

                            <Text
                                numberOfLines={1}
                                className="text-[#1F1F1F] font-bold"
                                style={{
                                    fontSize: moderateScale(14),
                                    marginTop: verticalScale(2)
                                }}
                            >
                                {item.title}
                            </Text>

                            <Text
                                numberOfLines={2}
                                className="text-[#1F1F1F]/60 font-medium"
                                style={{
                                    fontSize: moderateScale(10.5),
                                    lineHeight: moderateScale(15),
                                    marginTop: verticalScale(3)
                                }}
                            >
                                {item.description}
                            </Text>
                        </View>

                        <View className="items-end gap-3">
                            <View
                                className="flex-row items-center"
                                style={{
                                    gap: scale(5),
                                    backgroundColor: status.backgroundColor,
                                    paddingHorizontal: scale(9),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                {renderStatusIcon()}

                                <Text
                                    className="font-bold"
                                    style={{
                                        color: status.textColor,
                                        fontSize: moderateScale(8)
                                    }}
                                >
                                    {status.label}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        className="bg-[#1F1F1F]/10"
                        style={{
                            height: moderateScale(1),
                            marginTop: verticalScale(16),
                            marginBottom: verticalScale(13)
                        }}
                    />

                    <View className="flex-row items-center">
                        <View className="flex-row items-center">
                            <CalendarIcon width={moderateScale(15)} height={moderateScale(15)} color="#1F1F1F85" strokeWidth={1.5} />

                            <Text
                                className="text-[#1F1F1F]/65 font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    marginLeft: scale(6)
                                }}
                            >
                                Created {item.createdAt}
                            </Text>
                        </View>

                        <View
                            className="bg-[#1F1F1F]/15"
                            style={{
                                width: 1,
                                height: moderateScale(12),
                                marginHorizontal: scale(14)
                            }}
                        />

                        <View className="flex-row items-center">
                            <ClockIcon width={moderateScale(15)} height={moderateScale(15)} color="#1F1F1F85" strokeWidth={1.5} />

                            <Text
                                className="text-[#1F1F1F]/65 font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    marginLeft: scale(6)
                                }}
                            >
                                {item.time}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}