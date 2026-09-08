import EditIcon from "@/assets/icon/EditIcon.svg"
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import MortarboardIcon from '@/assets/icon/MortarboardIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import { Address } from "@/Features/Services/address-service"
import { useEffect } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
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
    const progress = useSharedValue(isSelected ? 1 : 0)

    useEffect(() => {
        progress.value = withSpring(
            isSelected ? 1 : 0,
            {
                damping: 18,
                stiffness: 180,
                mass: 0.7
            }
        )
    }, [isSelected])

    const editStyle = useAnimatedStyle(
        () => ({
            opacity: progress.value,

            transform: [
                {
                    scale: 0.85 + progress.value * 0.15
                }
            ]
        })
    )

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
                backgroundColor:
                    isSelected
                        ? "rgba(232,185,63,0.04)"
                        : "#FFFFFF",
                borderWidth: moderateScale(1),
                borderColor:
                    isSelected
                        ? "rgba(63,37,22,0.35)"
                        : "rgba(31,31,31,0.10)",
                marginTop: verticalScale(8),
                borderRadius: moderateScale(20)
            }}
        >
            <View
                className="items-center justify-center rounded-full"
                style={{
                    width: moderateScale(44),
                    height: moderateScale(44),
                    backgroundColor: isSelected ? "#3F2516" : "rgba(232,185,63,0.15)"
                }}
            >
                <Icon
                    width={moderateScale(21)}
                    height={moderateScale(21)}
                    color={isSelected ? "#FFFFFF" : "#3F2516"}
                    strokeWidth={1.5}
                />
            </View>

            <View
                className="flex-1 items-start"
                style={{
                    minWidth: 0,
                    paddingRight: isSelected ? moderateScale(12) : 0
                }}
            >
                <View
                    className="flex-row items-center"
                    style={{ gap: scale(5) }}
                >
                    <Text
                        numberOfLines={1}
                        className="text-[#1F1F1F] font-bold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        {item.label}
                    </Text>

                    {isSelected && (
                        <Text
                            className="text-[#1F1F1F]/60 font-semibold"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            (Selected)
                        </Text>
                    )}
                </View>

                <Text
                    numberOfLines={1}
                    className="font-semibold text-[#3F2516]"
                    style={{
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(5)
                    }}
                >
                    {item.receiver_name}
                </Text>

                <Text
                    numberOfLines={1}
                    className="font-medium text-[#1F1F1F]/75"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: verticalScale(2)
                    }}
                >
                    +91 {item.receiver_phone}
                </Text>

                <Text
                    className="font-medium text-[#1F1F1F]/65"
                    style={{
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        marginTop: verticalScale(5),
                        width: "100%"
                    }}
                >
                    {formattedAddress}
                </Text>
            </View>

            <Animated.View
                pointerEvents={
                    isSelected
                        ? "auto"
                        : "none"
                }
                style={[
                    {
                        position: "absolute",
                        top: moderateScale(8),
                        right: moderateScale(8)
                    },

                    editStyle
                ]}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={(event) => {
                        event.stopPropagation()

                        onEdit()
                    }}
                    className="flex-row items-center justify-center gap-2 bg-[#3F2516]"
                    style={{
                        paddingHorizontal: moderateScale(12),
                        paddingVertical: moderateScale(7),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <EditIcon width={moderateScale(12)} height={moderateScale(12)} color="#FFFFFF" strokeWidth={1.5} />

                    <Text
                        className="text-white font-medium"
                        style={{ fontSize: moderateScale(10)}}
                    >
                        Edit
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </AnimatedTouchableOpacity>
    )
}

export default AddressCard