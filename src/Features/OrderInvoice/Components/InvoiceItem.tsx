import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { Image } from "expo-image"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type InvoiceItemProps = {
    image: string
    name: string
    description?: string
    quantity: number
    amount: number
    showDivider?: boolean
}

export default function InvoiceItem({
    image,
    name,
    description,
    quantity,
    amount,
    showDivider = true,
}: InvoiceItemProps) {
    return (
        <>
            <View className="flex-row items-center">
                <View className="flex-1 flex-row items-center gap-2">
                    <Image
                        source={{ uri: image }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                        style={{
                            width: moderateScale(44),
                            height: moderateScale(44),
                            borderRadius: moderateScale(12)
                        }}
                    />

                    <View className="flex-1 gap-1">
                        <Text
                            numberOfLines={1}
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {name}
                        </Text>

                        {description && (
                            <Text
                                numberOfLines={2}
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                {description}
                            </Text>
                        )}
                    </View>
                </View>

                <View
                    className="items-center justify-center"
                    style={{ width: moderateScale(50) }}
                >
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        {quantity}
                    </Text>
                </View>

                <View
                    className="items-center justify-center"
                    style={{ width: moderateScale(45) }}
                >
                    <Text
                        className="font-semibold"
                        style={{
                            fontSize: moderateScale(11),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        ₹{amount}
                    </Text>
                </View>
            </View>

            {showDivider && (
                <View
                    style={{
                        paddingHorizontal: scale(8),
                        marginVertical: verticalScale(6),
                        width: "100%"
                    }}
                >
                    <View
                        style={{
                            backgroundColor: hexToRgba(COLORS.borderColor, 0.6),
                            height: moderateScale(0.7)
                        }}
                    />
                </View>
            )}
        </>
    )
}