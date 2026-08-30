import ClockIcon from "@/assets/icon/ClockIcon3.svg"
import CopyIcon from "@/assets/icon/CopyIcon.svg"
import InfoIcon from "@/assets/icon/InformationCircleIcon.svg"
import UtensilsIcon from "@/assets/icon/UtensilIcon2.svg"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type CouponItem = {
    id: string
    code: string
    title: string
    description: string
    note: string
    noteType: "expiry" | "info" | "exclusive"
    featured?: boolean
}

type CouponCardProps = {
    item: CouponItem
    onApply?: (item: CouponItem) => void
    onCopy?: (item: CouponItem) => void
}

function CouponCard({ item, onApply, onCopy }: CouponCardProps) {
    const NoteIcon =
        item.noteType === "expiry"
            ? ClockIcon
            : item.noteType === "exclusive"
            ? UtensilsIcon
            : InfoIcon

    const isExpiry = item.noteType === "expiry"

    return (
        <View
            className="flex-row bg-white border border-[#1F1F1F]/10 overflow-visible"
            style={{
                borderRadius: moderateScale(20),
                minHeight: verticalScale(120)
            }}
        >
            <View
                className="flex-1"
                style={{
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(12),
                }}
            >
                <View
                    className={`self-start flex-row items-center gap-2 ${
                        item.featured
                            ? "bg-[#F8D56A]"
                            : "bg-[#E8B93F]/15"
                    }`}
                    style={{
                        paddingHorizontal: scale(8),
                        paddingVertical: verticalScale(4),
                        borderRadius: moderateScale(20)
                    }}
                >
                    <Text
                        className="text-[#5C4639] font-bold uppercase"
                        style={{
                            fontSize: moderateScale(10),
                            letterSpacing: 0.4
                        }}
                    >
                        {item.code}
                    </Text>
                </View>

                <Text
                    className="text-[#1F1F1F] font-black"
                    style={{
                        fontSize: moderateScale(19),
                        marginTop: verticalScale(14)
                    }}
                >
                    {item.title}
                </Text>

                <Text
                    className="text-[#1F1F1F]/75 font-medium"
                    style={{
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(19),
                        marginTop: verticalScale(3)
                    }}
                >
                    {item.description}
                </Text>

                <View
                    className="bg-[#E8DDD3]/75 mx-2"
                    style={{
                        height: 1,
                        marginTop: verticalScale(14)
                    }}
                />

                <View
                    className="flex-row items-center gap-2"
                    style={{ marginTop: verticalScale(10) }}
                >
                    <NoteIcon
                        width={moderateScale(16)}
                        height={moderateScale(16)}
                        color={isExpiry ? "#DC2626" : "#5C4639"}
                        strokeWidth={1.8}
                    />

                    <Text
                        className={`font-medium flex-1 ${
                            isExpiry
                                ? "text-[#DC2626]"
                                : "text-[#5C4639]"
                        }`}
                        style={{
                            fontSize: moderateScale(10.5),
                            lineHeight: moderateScale(17)
                        }}
                    >
                        {item.note}
                    </Text>
                </View>
            </View>

            <View
                className="relative items-center justify-center bg-[#FFF9F2] overflow-visible"
                style={{
                    width: scale(105),
                    paddingHorizontal: scale(10),
                    borderTopRightRadius: moderateScale(20),
                    borderBottomRightRadius: moderateScale(20)
                }}
            >
                <View
                    className="absolute left-0 h-full items-center overflow-hidden"
                    style={{
                        width: 1,
                        gap: verticalScale(3)
                    }}
                >
                    {Array.from({ length: 30 }).map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: 1,
                                height: verticalScale(4),
                                backgroundColor: "rgba(232,185,63,0.35)"
                            }}
                        />
                    ))}
                </View>

                <View
                    pointerEvents="none"
                    className="absolute bg-[#F5F5F5]"
                    style={{
                        top: -moderateScale(11),
                        left: -moderateScale(11),

                        width: moderateScale(22),
                        height: moderateScale(22),
                        borderRadius: moderateScale(11),

                        zIndex: 20
                    }}
                />

                <View
                    pointerEvents="none"
                    className="absolute bg-[#F5F5F5]"
                    style={{
                        bottom: -moderateScale(11),
                        left: -moderateScale(11),

                        width: moderateScale(22),
                        height: moderateScale(22),
                        borderRadius: moderateScale(11),

                        zIndex: 20
                    }}
                />

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => onApply?.(item)}
                    className="w-full items-center justify-center bg-[#3F2516]"
                    style={{
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(18)
                    }}
                >
                    <Text
                        className="text-white font-bold"
                        style={{ fontSize: moderateScale(13) }}
                    >
                        Apply
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => onCopy?.(item)}
                    className="w-full flex-row items-center justify-center border border-[#3F2516]/65 gap-2"
                    style={{
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(12)
                    }}
                >
                    <CopyIcon width={moderateScale(17)} height={moderateScale(17)} color="#3F2516" strokeWidth={1.8} />

                    <Text
                        className="text-[#3F2516] font-bold"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        Copy
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default memo(CouponCard)