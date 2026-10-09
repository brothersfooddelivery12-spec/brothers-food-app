import CallIcon from '@/assets/icon/CallOutlineIcon.svg'
import EllipsisVerticalIcon from "@/assets/icon/EllipsisVerticalIcon.svg"
import { COLORS } from '@/constant/colors'
import { Address } from '@/Services/address-service'
import { hexToRgba } from '@/utils/hexToRgba'
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
            className="p-3"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(22),
                position: "relative"
            }}
        >
            <View
                ref={menuAnchorRef}
                collapsable={false}
                className="absolute top-4 right-2"
                style={{ zIndex: 10 }}
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
                    <EllipsisVerticalIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} strokeWidth={1.8} />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-start gap-3">
                <View
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                        width: moderateScale(44),
                        height: moderateScale(44)
                    }}
                >
                    <Icon width={moderateScale(21)} height={moderateScale(21)} color={COLORS.secondaryColor} strokeWidth={1.8} />
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
                            className="font-bold tracking-wide"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {item.label}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={1}
                        className="font-semibold"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                            fontSize: moderateScale(13),
                            marginTop: verticalScale(3)
                        }}
                    >
                        {item.receiver_name}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                            fontSize: moderateScale(11),
                            lineHeight: moderateScale(17),
                            marginTop: verticalScale(3)
                        }}
                    >
                        {formattedAddress}
                    </Text>

                    <View className="flex-row gap-1 items-center justify-center self-start mt-2">
                        <CallIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryTextColor} strokeWidth={1.8} />
                    
                        <Text
                            numberOfLines={1}
                            className="font-normal"
                            style={{
                                fontSize: moderateScale(11),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {item.receiver_phone}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(SavedAddressCard)