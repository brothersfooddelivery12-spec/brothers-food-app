import CallIcon from '@/assets/icon/CallFilledIcon.svg'
import EditIcon from "@/assets/icon/EditIcon.svg"
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import MortarboardIcon from '@/assets/icon/MortarboardIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import { COLORS } from '@/constant/colors'
import { Address } from '@/Services/address-service'
import { hexToRgba } from '@/utils/hexToRgba'
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from "react-native-reanimated"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

type AddressCardProps = {
    item: Address
    isSelected: boolean
    onPress: () => void
    onEdit: () => void
}

const AddressCard = ({
    item,
    isSelected,
    onPress,
    onEdit
}: AddressCardProps) => {
    const getAddressIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case "home":
                return HomeIcon

            case "work":
                return OfficeIcon

            case "college":
                return MortarboardIcon

            default:
                return LocationIcon
        }
    }

    const Icon = getAddressIcon(item.label)

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
        <AnimatedTouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="p-4 flex-row gap-3"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5),
                marginTop: verticalScale(8),
                borderRadius: moderateScale(20)
            }}
        >
            <View
                className="items-center justify-center rounded-full"
                style={{
                    width: moderateScale(44),
                    height: moderateScale(44),
                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15)
                }}
            >
                <Icon width={moderateScale(21)} height={moderateScale(21)} color={COLORS.primaryColor} strokeWidth={1.5} />
            </View>

            <View
                className="flex-1 items-start"
                style={{
                    minWidth: 0,
                    paddingRight: isSelected ? moderateScale(62) : 0
                }}
            >
                <View
                    className="flex-row items-center"
                    style={{ gap: scale(6) }}
                >
                    <Text
                        numberOfLines={1}
                        className="font-bold tracking-wide"
                        style={{
                            fontSize: moderateScale(14),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {item.label}
                    </Text>

                    {isSelected && (
                        <Animated.View
                            entering={FadeInLeft.duration(280)}
                            exiting={FadeOutLeft.duration(230)}
                            style={{
                                backgroundColor: COLORS.activeStatusBackgroundColor,
                                borderRadius: moderateScale(7),
                                paddingHorizontal: scale(7),
                                paddingVertical: verticalScale(3)
                            }}
                        >
                            <Text   
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: COLORS.activeStatusTextColor
                                }}
                            >
                                Selected
                            </Text>
                        </Animated.View>
                    )}
                </View>

                <Text
                    numberOfLines={1}
                    className="font-semibold"
                    style={{
                        color: COLORS.primaryTextColor,
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(5)
                    }}
                >
                    {item.receiver_name}
                </Text>

                <Text
                    className="font-medium"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
                        fontSize: moderateScale(11.5),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(5),
                        width: "100%"
                    }}
                >
                    {formattedAddress}
                </Text>

                <View className="flex-row gap-1 items-center mt-2">
                    <CallIcon width={moderateScale(15)} height={moderateScale(15)} color={COLORS.primaryTextColor} strokeWidth={1.8} />

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

            {isSelected && (
                <Animated.View
                    entering={FadeInRight.duration(280)}
                    exiting={FadeOutRight.duration(230)}
                    style={{
                        position: "absolute",
                        top: moderateScale(8),
                        right: moderateScale(8)
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={(event) => {
                            event.stopPropagation()

                            onEdit()
                        }}
                        className="flex-row items-center justify-center gap-2"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            paddingHorizontal: moderateScale(12),
                            paddingVertical: moderateScale(7),
                            borderRadius: moderateScale(14)
                        }}
                    >
                        <EditIcon width={moderateScale(12)} height={moderateScale(12)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />

                        <Text
                            className="font-medium tracking-wider"
                            style={{
                                fontSize: moderateScale(10),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </AnimatedTouchableOpacity>
    )
}

export default AddressCard