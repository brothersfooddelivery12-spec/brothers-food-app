import MinusIcon from '@/assets/icon/MinusSignIcon.svg'
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import { Image } from "expo-image"
import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type CartItem = {
    id: string
    name: string
    image: string
    quantity: number
    price: number
    description?: string
    isActive: boolean
}

type CartItemRowProps = {
    item: CartItem

    isRestaurantActive: boolean

    editable?: boolean

    onIncrease?: () => void
    onDecrease?: () => void
    onRemove?: () => void
}

const CartItemRow = memo(
    ({
        item,
        isRestaurantActive,
        editable = true,
        onIncrease,
        onDecrease,
        onRemove
    }: CartItemRowProps) => {
        const isUnavailable = !isRestaurantActive || !item.isActive
        const canDecrease = item.quantity > 1

        return (
            <View>
                <View className="flex-row items-center gap-3">
                    <View
                        className="relative overflow-hidden items-start"
                        style={{
                            width: moderateScale(68),
                            height: moderateScale(68),
                            borderRadius: moderateScale(14)
                        }}
                    >
                        <Image
                            source={{
                                uri: item.image
                            }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={0}
                            style={{
                                width: "100%",
                                height: "100%",
                                opacity: isUnavailable ? 0.45 : 1
                            }}
                        />

                        {isUnavailable && (
                            <View
                                pointerEvents="none"
                                className="absolute inset-0"
                                style={{ backgroundColor: "rgba(31,31,31,0.30)" }}
                            />
                        )}

                        {isUnavailable && (
                            <View
                                className="absolute items-center justify-center"
                                style={{
                                    left: moderateScale(4),
                                    right: moderateScale(4),
                                    bottom: moderateScale(4),
                                    paddingVertical: verticalScale(3.5),
                                    borderRadius: moderateScale(12),
                                    backgroundColor: "rgba(31,31,31,0.82)"
                                }}
                            >
                                <Text
                                    className="text-white font-bold uppercase"
                                    style={{ fontSize: moderateScale(6.5) }}
                                >
                                    Unavailable
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="items-start gap-1 flex-1">
                        <Text
                            numberOfLines={1}
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(14),
                                color: isUnavailable ? "rgba(31,31,31,0.50)" : "#1F1F1F"
                            }}
                        >
                            {item.name}
                        </Text>

                        {!!item.description && (
                            <Text
                                numberOfLines={1}
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: isUnavailable
                                        ? "rgba(31,31,31,0.35)"
                                        : "rgba(31,31,31,0.75)"
                                }}
                            >
                                {item.description}
                            </Text>
                        )}

                        {/* {isUnavailable && (
                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(8),
                                    marginTop: verticalScale(1),
                                    color: "#EF4444"
                                }}
                            >
                                {!isRestaurantActive
                                    ? "Restaurant currently closed"
                                    : "Item currently unavailable"}
                            </Text>
                        )} */}

                        {editable ? (
                            <View
                                className="flex-row mt-1 items-center justify-center"
                                style={{ gap: moderateScale(8) }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    disabled={!canDecrease}
                                    onPress={onDecrease}
                                    className="items-center justify-center"
                                    style={{
                                        borderRadius: moderateScale(10),
                                        width: moderateScale(24),
                                        height: moderateScale(24),
                                        backgroundColor:
                                            isUnavailable
                                                ? "rgba(31,31,31,0.07)"
                                                : "rgba(232,185,63,0.15)"
                                    }}
                                >
                                    <MinusIcon
                                        width={moderateScale(12)}
                                        height={moderateScale(12)}
                                        color={isUnavailable ? "#777777" : "#5C4639"}
                                        strokeWidth={2.5}
                                    />
                                </TouchableOpacity>

                                <Text
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: isUnavailable ? "#777777" : "#1F1F1F"
                                    }}
                                >
                                    {item.quantity}
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    disabled={isUnavailable}
                                    onPress={onIncrease}
                                    className="items-center justify-center"
                                    style={{
                                        borderRadius: moderateScale(10),
                                        width: moderateScale(24),
                                        height: moderateScale(24),
                                        opacity: isUnavailable ? 0.35 : 1,
                                        backgroundColor:
                                            isUnavailable
                                                ? "rgba(31,31,31,0.07)"
                                                : "rgba(232,185,63,0.15)"
                                    }}
                                >
                                    <PlusIcon
                                        width={moderateScale(12)}
                                        height={moderateScale(12)}
                                        color={isUnavailable ? "#777777" : "#5C4639"}
                                        strokeWidth={2.5}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View
                                className="mt-1 bg-[#E8B93F]/15"
                                style={{
                                    paddingHorizontal: scale(10),
                                    paddingVertical: verticalScale(3),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <Text
                                    className="text-[#5C4639] font-semibold tracking-wide"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Qty: {item.quantity}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="self-stretch items-end justify-between ml-2">
                        <View
                            className="items-center justify-center"
                            style={{
                                paddingHorizontal: moderateScale(10),
                                paddingVertical: moderateScale(5),
                                borderRadius: moderateScale(10),
                                backgroundColor: isUnavailable ? "#B8B8B8" : "#3F2516"
                            }}
                        >
                            <Text
                                className="font-medium text-white"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                ₹{item.price}
                            </Text>
                        </View>

                        {editable && (
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={onRemove}
                                className="items-center justify-center bg-[#FEE2E2]"
                                style={{
                                    paddingHorizontal: scale(7),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="text-[#DC2626] font-semibold uppercase"
                                    style={{ fontSize: moderateScale(9) }}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        )
    }
)

CartItemRow.displayName = "CartItemRow"

export default CartItemRow