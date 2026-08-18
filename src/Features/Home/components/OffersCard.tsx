import { Text, TouchableOpacity, View } from "react-native"
import ArrowRightIcon from "@/assets/icon/ArrowRight.svg"
import { moderateScale } from 'react-native-size-matters'
import React from "react"

export interface Offer {
    id: string
    badge: string
    discount: string
    description: string
    actionText: string

    colors: {
        background: string
        badgeBackground: string
        badgeText: string
        title: string
        description: string
        buttonBackground: string
        buttonText: string
        icon: string
    }
}

interface OfferCardProps {
    offer: Offer
    onPress?: () => void
}

const OfferCard = ({ offer, onPress }: OfferCardProps) => {
    const { colors } = offer

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            className="overflow-hidden"
            style={{
                width: moderateScale(300),
                height: moderateScale(165),
                padding: moderateScale(16),
                borderRadius: moderateScale(26),
                backgroundColor: colors.background,
            }}
        >
            <View
                className="items-center justify-center self-start rounded-2xl"
                style={{
                    paddingHorizontal: moderateScale(8),
                    height: moderateScale(22),
                    backgroundColor: colors.badgeBackground,
                }}
            >
                <Text
                    className="p-0 uppercase"
                    style={{
                        fontSize: moderateScale(10),
                        lineHeight: moderateScale(13),
                        fontWeight: "700",
                        color: colors.badgeText,
                        includeFontPadding: false,
                    }}
                >
                    {offer.badge}
                </Text>
            </View>

            <View
                style={{
                    height: moderateScale(34),
                    justifyContent: "flex-end",
                    marginTop: moderateScale(12),
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: moderateScale(24),
                        lineHeight: moderateScale(29),
                        fontWeight: "800",
                        color: colors.title,
                        includeFontPadding: false,
                    }}
                >
                    {offer.discount}
                </Text>
            </View>

            <View
                style={{
                    height: moderateScale(20),
                    justifyContent: "center",
                    marginTop: moderateScale(2),
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(17),
                        fontWeight: "400",
                        color: colors.description,
                        includeFontPadding: false,
                    }}
                >
                    {offer.description}
                </Text>
            </View>

            <View
                className="flex-row items-center justify-center self-start rounded-2xl"
                style={{
                    height: moderateScale(28),
                    paddingHorizontal: moderateScale(9),
                    marginTop: moderateScale(18),
                    gap: moderateScale(2),
                    backgroundColor: colors.buttonBackground,
                }}
            >
                <Text
                    style={{
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(16),
                        fontWeight: "700",
                        color: colors.buttonText,
                        includeFontPadding: false,
                    }}
                >
                    {offer.actionText}
                </Text>

                <ArrowRightIcon
                    width={moderateScale(16)}
                    height={moderateScale(16)}
                    color={colors.icon}
                    strokeWidth={2.5}
                    style={{
                        marginRight: -moderateScale(4),
                    }}
                />
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(OfferCard)