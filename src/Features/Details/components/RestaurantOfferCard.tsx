import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

export interface RestaurantOffer {
    id: string
    discount: string
    description: string
    codeText: string

    colors: {
        backgroundColor: string,
        iconBackgroundColor: string,
        iconColor: string,
        dicountColor: string,
        descriptionColor: string,
        codeTextColor: string,
        copyCodeBackgroundColor: string,
        copyCodeTextColor: string
    }
}

type RestaurantOfferCardProps = {
    restaurantOffer: RestaurantOffer,
    icon: React.FC<SvgProps>,
    onPress?: (id: string) => void
}

const RestaurantOfferCard = ({ restaurantOffer, icon: Icon , onPress }: RestaurantOfferCardProps) => {
    const { colors } = restaurantOffer

    return(
        <View
            className="overflow-hidden"
            style={{
                width: moderateScale(270),
                height: moderateScale(150),
                paddingVertical: moderateScale(12),
                paddingHorizontal: moderateScale(20),
                borderRadius: moderateScale(26),
                backgroundColor: colors.backgroundColor
            }}
        >
            <View 
                className="flex-row items-center mt-3"
                style={{ gap: moderateScale(8), marginLeft: -moderateScale(3) }}    
            >
                <View
                    className="items-center justify-center rounded-full"
                    style={{
                        height: moderateScale(28),
                        width: moderateScale(28),
                        backgroundColor: colors.iconBackgroundColor
                    }}
                >
                    {Icon && (
                        <Icon width={moderateScale(19)} height={moderateScale(19)} color={colors.iconColor} />
                    )}
                </View>

                <Text
                    className="font-extrabold"
                    style={{
                        fontSize: moderateScale(20),
                        color: colors.dicountColor
                    }}
                >
                    {restaurantOffer.discount}
                </Text>
            </View>

            <Text
                className="font-medium"
                style={{
                    fontSize: moderateScale(12),
                    marginTop: verticalScale(6),
                    color: colors.descriptionColor
                }}
            >
                {restaurantOffer.description}
            </Text>

            <View
                className="flex-row items-center gap-4"
                style={{ marginTop: verticalScale(25) }}
            >
                <Text
                    className="font-extrabold uppercase"
                    style={{
                        fontSize: moderateScale(16),
                        color: colors.codeTextColor
                    }}
                >
                    {restaurantOffer.codeText}
                </Text>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => onPress?.(restaurantOffer.id)}
                    className="items-center justify-center self-start"
                    style={{
                        height: moderateScale(28),
                        paddingHorizontal: moderateScale(9),
                        borderRadius: moderateScale(10),
                        backgroundColor: colors.copyCodeBackgroundColor
                    }}
                >
                    <Text
                        className="font-bold uppercase"
                        style={{
                            fontSize: moderateScale(12),
                            color: colors.copyCodeTextColor
                        }}
                    >
                        copy code
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default React.memo(RestaurantOfferCard)