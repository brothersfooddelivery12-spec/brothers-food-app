import { memo } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Image } from "expo-image"
import MinusIcon from '@/assets/icon/MinusSignIcon.svg'
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type CartItem = {
    id: string
    name: string
    image: string
    quantity: number
    price: number
    description?: string
}

type CartItemRowProps = {
    item: CartItem
    onIncrease?: (item: CartItem) => void
    onDecrease?: (item: CartItem) => void
    onRemove?: (item: CartItem) => void
}

const CartItemRow = memo(
    ({
        item,
        onIncrease,
        onDecrease,
        onRemove
    }: CartItemRowProps) => {
        return (
            <View className="flex-row items-center gap-3">
                <View
                    className="overflow-hidden items-start"
                    style={{
                        width: moderateScale(68),
                        height: moderateScale(68),
                        borderRadius: moderateScale(14)
                    }}
                >
                    <Image
                        source={{
                            uri: item.image,
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={0}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </View>

                <View className="items-start gap-1 flex-1">
                    <Text
                        numberOfLines={1}
                        className="text-[#1F1F1F] font-bold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        {item.name}
                    </Text>

                    {!!item.description && (
                        <Text
                            numberOfLines={1}
                            className="font-medium text-[#1F1F1F]/75"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            {item.description}
                        </Text>
                    )}

                    <View
                        className="flex-row mt-2 items-center justify-center bg-[#E8B93F]/15"
                        style={{
                            gap: moderateScale(8),
                            paddingHorizontal: moderateScale(8),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => onDecrease?.(item)}
                            className="items-center justify-center rounded-full"
                            style={{
                                width: moderateScale(16),
                                height: moderateScale(16)
                            }}
                        >
                            <MinusIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" strokeWidth={2.2} />
                        </TouchableOpacity>

                        <Text
                            className="text-[#5c4639] font-extrabold"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            {item.quantity}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => onIncrease?.(item)}
                            className="items-center justify-center rounded-full"
                            style={{
                                width: moderateScale(16),
                                height: moderateScale(16)
                            }}
                        >
                            <PlusIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" strokeWidth={2.2} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="self-stretch items-end justify-between ml-2">
                    <View
                        className="items-center justify-center bg-[#3F2516]"
                        style={{
                            paddingHorizontal: moderateScale(10),
                            paddingVertical: moderateScale(5),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="font-medium text-white"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            ₹{item.price}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => onRemove?.(item)}
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
                </View>
            </View>
        )
    }
)

CartItemRow.displayName = "CartItemRow"

export default CartItemRow