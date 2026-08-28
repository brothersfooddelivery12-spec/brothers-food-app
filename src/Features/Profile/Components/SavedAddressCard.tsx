import EllipsisVerticalIcon from "@/assets/icon/EllipsisVerticalIcon.svg"
import React, { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

export type AddressItem = {
    id: string
    title: string
    address: string
    isDefault: boolean
}

type SavedAddressCardProps = {
    item: AddressItem
    icon: React.FC<SvgProps>
    isMenuOpen?: boolean
    onPress?: (item: AddressItem) => void
    onMenuPress?: (item: AddressItem) => void
    onEdit?: (item: AddressItem) => void
    onDelete?: (item: AddressItem) => void
    onSetDefault?: (item: AddressItem) => void
}

function SavedAddressCard({
    item,
    icon: Icon,
    isMenuOpen,
    onPress,
    onMenuPress,
    onEdit,
    onDelete,
    onSetDefault
}: SavedAddressCardProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="p-3 bg-white border border-[#1F1F1F]/10"
            style={{
                borderRadius: moderateScale(22),
                position: "relative",
                overflow: "visible",
                zIndex: isMenuOpen ? 1000 : 1
            }}
        >
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={(event) => {
                    event.stopPropagation()
                    onMenuPress?.(item)
                }}
                className="absolute top-4 right-2 items-center justify-center"
                style={{
                    width: moderateScale(28),
                    height: moderateScale(28),
                    zIndex: 10
                }}
            >
                <EllipsisVerticalIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" strokeWidth={1.8} />
            </TouchableOpacity>

            {isMenuOpen && (
                <View
                    className="absolute right-2 bg-white border border-[#1F1F1F]/10"
                    style={{
                        top: verticalScale(38),
                        width: moderateScale(145),
                        borderRadius: moderateScale(14),
                        paddingVertical: verticalScale(7),
                        zIndex: 100
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={(event) => {
                            event.stopPropagation()
                            onEdit?.(item)
                        }}
                        style={{
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(5)
                        }}
                    >
                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Edit Address
                        </Text>
                    </TouchableOpacity>

                    {!item.isDefault && (
                        <>
                            <View
                                className="bg-[#1F1F1F]/10"
                                style={{
                                    height: 1,
                                    marginVertical: verticalScale(2),
                                    marginHorizontal: moderateScale(10)
                                }}
                            />

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={(event) => {
                                    event.stopPropagation()
                                    onSetDefault?.(item)
                                }}
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(5)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Set as Default
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <View
                        className="bg-[#1F1F1F]/10"
                        style={{
                            height: 1,
                            marginVertical: verticalScale(2),
                            marginHorizontal: moderateScale(10)
                        }}
                    />

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={(event) => {
                            event.stopPropagation()
                            onDelete?.(item)
                        }}
                        style={{
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(5)
                        }}
                    >
                        <Text
                            className="text-[#EF4444] font-medium"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Delete Address
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

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
                            {item.title}
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
                        {item.address}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(SavedAddressCard)