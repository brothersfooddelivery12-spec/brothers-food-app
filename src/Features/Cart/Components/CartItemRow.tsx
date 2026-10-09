import MinusIcon from '@/assets/icon/MinusSignIcon.svg'
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import { COLORS } from '@/constant/colors'
import { CartItem } from '@/Stores/useCartStore'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from "expo-image"
import { memo, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type CartItemRowProps = {
    item: CartItem

    isRestaurantOpen: boolean

    editable?: boolean

    onIncrease?: () => void
    onDecrease?: () => void
    onRemove?: () => void
}

const CartItemRow = memo(
    ({
        item,
        isRestaurantOpen,
        editable = true,
        onIncrease,
        onDecrease,
        onRemove
    }: CartItemRowProps) => {
        const isUnavailable = !isRestaurantOpen || !item.isAvailable
        const canDecrease = item.quantity > 1

        const [imageError, setImageError] = useState(false)
            
        const DefaultFoodImage = require("../../../../assets/images/Default_Food_Image.png")
        
        useEffect(() => {
            setImageError(false)
        }, [item.imageUrl])
    
        const hasImage = !!item.imageUrl && !imageError

        return (
            <View>
                <View className="flex-row items-center gap-3">
                    <View
                        className="relative overflow-hidden items-start"
                        style={{
                            width: moderateScale(68),
                            height: moderateScale(68),
                            borderRadius: moderateScale(14),
                            borderWidth: !hasImage && !isUnavailable ? 0.7 : 0,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.08)
                        }}
                    >
                        <Image
                            source={
                                hasImage
                                    ? {
                                        uri: item.imageUrl!
                                    }
                                    : DefaultFoodImage
                            }
                            onError={() => {
                                setImageError(true)
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
                                style={{ backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.25) }}
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
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.82)
                                }}
                            >
                                <Text
                                    className="font-bold uppercase"
                                    style={{
                                        fontSize: moderateScale(6.5),
                                        color: COLORS.primaryBackgroundColor
                                    }}
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
                                color: isUnavailable ? hexToRgba(COLORS.primaryTextColor, 0.52) : COLORS.primaryTextColor
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
                                        ? hexToRgba(COLORS.primaryTextColor, 0.38)
                                        : hexToRgba(COLORS.primaryTextColor, 0.65)
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
                                        backgroundColor: isUnavailable
                                            ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                            : hexToRgba(COLORS.accentColor, 0.15)
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <MinusIcon
                                        width={moderateScale(12)}
                                        height={moderateScale(12)}
                                        color={isUnavailable ? COLORS.inactiveContentColor : COLORS.secondaryColor}
                                        strokeWidth={2.5}
                                    />
                                </TouchableOpacity>

                                <Text
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: isUnavailable ? COLORS.inactiveContentColor : COLORS.primaryTextColor
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
                                        opacity: isUnavailable ? 0.55 : 1,
                                        backgroundColor: isUnavailable
                                            ? hexToRgba(COLORS.primaryTextColor, 0.1)
                                            : hexToRgba(COLORS.accentColor, 0.15)
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <PlusIcon
                                        width={moderateScale(12)}
                                        height={moderateScale(12)}
                                        color={isUnavailable ? COLORS.inactiveContentColor : COLORS.secondaryColor}
                                        strokeWidth={2.5}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View
                                className="mt-"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                    paddingHorizontal: scale(10),
                                    paddingVertical: verticalScale(3),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <Text
                                    className="font-semibold tracking-wide"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: COLORS.secondaryColor
                                    }}
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
                                backgroundColor: isUnavailable ? COLORS.disabledBackgroundColor : COLORS.primaryColor
                            }}
                        >
                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(11),
                                    color: isUnavailable ? hexToRgba(COLORS.primaryBackgroundColor, 0.65) : COLORS.primaryBackgroundColor
                                }}
                            >
                                ₹{item.price}
                            </Text>
                        </View>

                        {editable && (
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={onRemove}
                                className="items-center justify-center"
                                style={{
                                    backgroundColor: COLORS.dangerBackgroundColor,
                                    paddingHorizontal: scale(7),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="font-semibold uppercase"
                                    style={{
                                        fontSize: moderateScale(9),
                                        color: COLORS.dangerTextColor
                                    }}
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