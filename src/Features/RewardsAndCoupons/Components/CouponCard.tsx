import ClockIcon from "@/assets/icon/ClockIcon3.svg"
import CopyIcon from "@/assets/icon/CopyIcon.svg"
import InfoIcon from "@/assets/icon/InformationCircleIcon.svg"
import UtensilsIcon from "@/assets/icon/UtensilIcon2.svg"
import { COLORS } from "@/constant/colors"
import { Coupon } from "@/Services/api-service"
import { hexToRgba } from "@/utils/hexToRgba"
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

    purchaseMethod: Coupon["purchase_method"]

    pointsRequired: number | null
    moneyPrice: number

    isActive: boolean
    isExpired: boolean
}

type CouponCardProps = {
    item: CouponItem
    onApply?: (item: CouponItem) => void
    onCopy?: (item: CouponItem) => void
}

function CouponCard({ item, onApply, onCopy }: CouponCardProps) {
    const isUnavailable = !item.isActive || item.isExpired
    
    const NoteIcon = item.noteType === "expiry"
        ? ClockIcon
        : item.noteType === "exclusive"
        ? UtensilsIcon
        : InfoIcon

    const isExpiry = item.noteType === "expiry"
    const isExpired = item.isExpired

    return (
        <View
            className="flex-row overflow-visible"
            style={{
                backgroundColor: isExpired
                    ? hexToRgba(COLORS.primaryTextColor, 0.035)
                    : COLORS.secondaryBackgroundColor,
                borderColor: isExpired
                    ? hexToRgba(COLORS.primaryTextColor, 0.12)
                    : hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
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
                    className="self-start flex-row items-center gap-2"
                    style={{
                        backgroundColor: isExpired
                            ? hexToRgba(COLORS.primaryTextColor, 0.08)
                            : item.featured
                                ? COLORS.accentLightColor
                                : hexToRgba(COLORS.accentColor, 0.15),
                        paddingHorizontal: scale(8),
                        paddingVertical: verticalScale(4),
                        borderRadius: moderateScale(20)
                    }}
                >
                    <Text
                        className="font-bold uppercase"
                        style={{
                            color: isExpired
                                ? hexToRgba(COLORS.primaryTextColor, 0.45)
                                : COLORS.secondaryColor,
                            fontSize: moderateScale(10),
                            letterSpacing: 0.4
                        }}
                    >
                        {item.code}
                    </Text>
                </View>

                <Text
                    numberOfLines={2}
                    className="font-extrabold"
                    style={{
                        color: isExpired
                            ? hexToRgba(COLORS.primaryTextColor, 0.42)
                            : COLORS.primaryTextColor,
                        fontSize: moderateScale(18),
                        marginTop: verticalScale(12)
                    }}
                >
                    {item.title}
                </Text>

                <Text
                    numberOfLines={2}
                    className="font-medium"
                    style={{
                        color: isExpired
                            ? hexToRgba(COLORS.primaryTextColor, 0.32)
                            : hexToRgba(
                                COLORS.primaryTextColor,
                                0.75
                            ),
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(3)
                    }}
                >
                    {item.description}
                </Text>

                <View
                    className="mx-2"
                    style={{
                        backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                        height: 0.7,
                        marginVertical: verticalScale(8)
                    }}
                />

                <View className="flex-row items-center gap-2" >
                    <NoteIcon
                        width={moderateScale(16)}
                        height={moderateScale(16)}
                        color={isExpired
                            ? hexToRgba(COLORS.primaryTextColor, 0.45)
                            : isExpiry
                                ? COLORS.errorTextColor
                                : COLORS.secondaryColor
                        }
                        strokeWidth={1.8}
                    />

                    <Text
                        className="font-medium flex-1"
                        style={{
                            color: isExpired
                                ? hexToRgba(COLORS.primaryTextColor, 0.45)
                                : isExpiry
                                    ? COLORS.errorTextColor
                                    : COLORS.secondaryColor,
                            fontSize: moderateScale(10.5),
                            lineHeight: moderateScale(17)
                        }}
                    >
                        {item.note}
                    </Text>
                </View>
            </View>

            <View
                className="relative items-center justify-center overflow-visible"
                style={{
                    backgroundColor: isExpired
                        ? hexToRgba(COLORS.primaryTextColor, 0.08)
                        : hexToRgba(COLORS.accentColor, 0.1),
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
                                width: 0.7,
                                height: verticalScale(4),
                                backgroundColor: isExpired
                                    ? hexToRgba(COLORS.primaryTextColor, 0.18)
                                    : hexToRgba(COLORS.accentColor, 0.45)
                            }}
                        />
                    ))}
                </View>

                <View
                    pointerEvents="none"
                    className="absolute"
                    style={{
                        backgroundColor: COLORS.primaryBackgroundColor,
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
                    className="absolute"
                    style={{
                        backgroundColor: COLORS.primaryBackgroundColor,
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
                    disabled={isUnavailable}
                    onPress={() => {
                        if (isUnavailable) return

                        onApply?.(item)
                    }}
                    className="w-full items-center justify-center"
                    style={{
                        backgroundColor: isExpired
                            ? hexToRgba(COLORS.primaryTextColor, 0.12)
                            : !item.isActive
                                ? COLORS.disabledBackgroundColor
                                : COLORS.primaryColor,
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(18)
                    }}
                >
                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(13),
                            color: isExpired
                                ? hexToRgba(COLORS.primaryTextColor, 0.4)
                                : COLORS.primaryBackgroundColor
                        }}
                    >
                        {item.isExpired
                            ? "Expired"
                            : !item.isActive
                                ? "Unavailable"
                                : "Apply"
                        }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => onCopy?.(item)}
                    className="w-full flex-row items-center justify-center gap-2"
                    style={{
                        borderColor: isExpired
                            ? hexToRgba(COLORS.primaryTextColor, 0.12)
                            : hexToRgba(COLORS.secondaryColor, 0.65),
                        borderWidth: moderateScale(1),
                        paddingVertical: verticalScale(8),
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(12)
                    }}
                >
                    <CopyIcon width={moderateScale(17)} height={moderateScale(17)} color={COLORS.primaryColor} strokeWidth={1.8} />

                    <Text
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(12),
                            color: isExpired
                                ? hexToRgba(COLORS.primaryTextColor, 0.45)
                                : COLORS.primaryColor
                        }}
                    >
                        Copy
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default memo(CouponCard)