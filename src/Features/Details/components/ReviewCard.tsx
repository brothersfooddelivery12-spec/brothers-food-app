import QuoteIcon from '@/assets/icon/QuoteIcon.svg';
import RatingStars from "@/components/RatingStars";
import { COLORS } from "@/constant/colors";
import { hexToRgba } from '@/utils/hexToRgba';
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export interface Review {
    id: string;
    name: string;
    badge: string;
    rating: number;
    comment: string;
    image?: string;
}

interface ReviewCardProps {
    review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    return (
        <View
            className="p-4 mb-4"
            style={{
                borderRadius: moderateScale(18),
                borderColor: COLORS.borderColor,
                borderWidth: moderateScale(0.7)
            }}
        >
            <View className="flex-row gap-3 items-center">
                <View
                    className="items-center overflow-hidden justify-center self-start rounded-full"
                    style={{
                        borderColor: COLORS.primaryBackgroundColor,
                        borderWidth: moderateScale(0.7),
                        width: moderateScale(46),
                        height: moderateScale(46)
                    }}
                >
                    <Image
                        source={
                            review.image
                                ? { uri: review.image }
                                : require("@/assets/images/profile-placeholder.jpg")
                        }
                        contentFit="cover"
                        transition={200}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>

                <View className="items-center">
                    <Text
                        numberOfLines={1}
                        className="font-bold"
                        style={{
                            color: COLORS.primaryTextColor,
                            fontSize: moderateScale(14),
                            marginBottom: moderateScale(6)
                        }}
                    >
                        {review.name}
                    </Text>

                    <View
                        className="self-start flex-row items-center"
                        style={{
                            backgroundColor: COLORS.accentLightColor,
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="font-semibold uppercase"
                            style={{
                                fontSize: moderateScale(8),
                                color: COLORS.primaryColor
                            }}
                        >
                            {review.badge}
                        </Text>
                    </View>
                </View>

                <View
                    className="flex-row items-center ml-auto self-start mt-1"
                    style={{ gap: moderateScale(1) }}
                >
                    <RatingStars rating={review.rating} />
                </View>
            </View>

            <Text
                className="mx-4 font-medium"
                style={{
                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                    fontSize: moderateScale(12),
                    marginTop: verticalScale(8),
                    lineHeight: moderateScale(14)
                }}
            >
                {review.comment}
            </Text>

            <View className="flex-row gap-3 items-center justify-center mt-3">
                <View
                    className="rounded-full"
                    style={{
                        backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                        height: verticalScale(0.7),
                        width: moderateScale(95),
                        marginVertical: verticalScale(8)
                    }}
                />

                <View
                    className="rounded-full items-center justify-center"
                    style={{
                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                        width: moderateScale(20),
                        height: moderateScale(20)
                    }}
                >
                    <QuoteIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.secondaryColor} />
                </View>

                <View
                    className="rounded-full"
                    style={{
                        backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                        height: verticalScale(0.7),
                        width: moderateScale(95),
                        marginVertical: verticalScale(8)
                    }}
                />
            </View>
        </View>
    )
}

export default React.memo(ReviewCard)