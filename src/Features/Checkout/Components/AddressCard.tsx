import EditIcon from "@/assets/icon/EditIcon.svg"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { moderateScale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface Addresses {
    id: string
    title: string
    name: string
    address: string
    icon: React.FC<SvgProps>
}

type AddressCardProps = {
    item: Addresses
    isSelected: boolean
    onPress: () => void
    onEdit: () => void
}

const AddressCard = ({ item, isSelected, onPress, onEdit }: AddressCardProps) => {
    const progress = useSharedValue(isSelected ? 1 : 0)

    React.useEffect(() => {
        progress.value = withSpring(isSelected ? 1 : 0, {
            damping: 18,
            stiffness: 180,
            mass: 0.7
        })
    }, [isSelected])

    const editStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [
            {
                scale: 0.85 + progress.value * 0.15
            }
        ]
    }))

    const Icon = item.icon

    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="p-4 flex-row gap-3"
            style={{
                backgroundColor: isSelected
                    ? "rgba(232,185,63,0.06)"
                    : "#FFFFFF",
                    
                borderWidth: moderateScale(1),
                borderColor: isSelected
                    ? "rgba(63, 37, 22, 0.45)"
                    : "rgba(31,31,31,0.10)",

                marginTop: verticalScale(8),
                borderRadius: moderateScale(18)
            }}
        >
            <View
                className="items-center justify-center rounded-full"
                style={{
                    width: moderateScale(44),
                    height: moderateScale(44),
                    backgroundColor: isSelected
                        ? "#3F2516"
                        : "rgba(232,185,63,0.15)",
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
                className="flex-1 items-start gap-1"
                style={{
                    minWidth: 0,
                    paddingRight: isSelected
                        ? moderateScale(25)
                        : 0
                }}
            >
                <Text
                    className="text-[#1F1F1F] font-bold"
                    style={{ fontSize: moderateScale(14) }}
                >
                    {item.title}{" "}

                    {isSelected && (
                        <Text
                            className="text-[#1F1F1F]/70 font-semibold"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            (Selected)
                        </Text>
                    )}
                </Text>

                <Text
                    className="font-semibold text-[#3F2516] mt-1"
                    style={{ fontSize: moderateScale(13) }}
                >
                    {item.name}
                </Text>

                <Text
                    className="font-medium text-[#1F1F1F]/65"
                    style={{
                        fontSize: moderateScale(11),
                        lineHeight: moderateScale(15),
                        width: "100%"
                    }}
                >
                    {item.address}
                </Text>
            </View>

            <Animated.View
                pointerEvents={isSelected ? "auto" : "none"}
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
                    onPress={onEdit}
                    className="flex-row items-center justify-center gap-1 bg-[#3F2516]"
                    style={{
                        paddingHorizontal: moderateScale(12),
                        paddingVertical: moderateScale(6),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <EditIcon width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={1.5} />

                    <Text
                        className="text-white font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Edit
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </AnimatedTouchableOpacity>
    )
}

export default AddressCard