import EllipsisVerticalIcon from "@/assets/icon/EllipsisVerticalIcon.svg"
import { Address } from "@/Features/Services/address-service"
import React, { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

type SavedAddressCardProps = {
    item: Address
    icon: React.FC<SvgProps>
    onPress?: (item: Address) => void
    onMenuPress?: (item: Address) => void
    menuAnchorRef?: (ref: View | null) => void
}

function SavedAddressCard({
    item,
    icon: Icon,
    onPress,
    onMenuPress,
    menuAnchorRef
}: SavedAddressCardProps) {
    const formattedAddress = [
        item.address_line,
        item.landmark,
        item.area,
        item.city,
        item.state,
        item.pincode
    ]
        .filter(Boolean)
        .join(", ")

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="p-3 bg-white border border-[#1F1F1F]/10"
            style={{
                borderRadius: moderateScale(22),
                position: "relative"
            }}
        >
            <View
                ref={menuAnchorRef}
                collapsable={false}
                className="absolute top-4 right-2"
                style={{
                    zIndex: 10
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={(event) => {
                        event.stopPropagation()
                        onMenuPress?.(item)
                    }}
                    className="items-center justify-center"
                    style={{
                        width: moderateScale(28),
                        height: moderateScale(28)
                    }}
                >
                    <EllipsisVerticalIcon
                        width={moderateScale(20)}
                        height={moderateScale(20)}
                        color="#3F2516"
                        strokeWidth={1.8}
                    />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-start gap-3">
                <View
                    className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                    style={{
                        width: moderateScale(44),
                        height: moderateScale(44)
                    }}
                >
                    <Icon width={moderateScale(21)} height={moderateScale(21)} color="#5C4639" strokeWidth={1.8} />
                </View>

                <View
                    className="flex-1"
                    style={{
                        marginTop: verticalScale(5),
                        paddingRight: scale(25)
                    }}
                >
                    <View className="flex-row items-center gap-2">
                        <Text
                            numberOfLines={1}
                            className="text-[#1F1F1F] font-bold tracking-wide"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            {item.label}
                        </Text>
                    </View>

                    <Text
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            lineHeight: moderateScale(17),
                            marginTop: verticalScale(3)
                        }}
                    >
                        {formattedAddress}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(SavedAddressCard)