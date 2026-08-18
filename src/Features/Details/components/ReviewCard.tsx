import { View, Text } from "react-native"
import { Image } from "expo-image"
import RatingStars from "@/components/RatingStars"
import QuoteIcon from '@/assets/icon/QuoteIcon.svg'
import { moderateScale, verticalScale } from "react-native-size-matters";
import React from "react";

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
            className="p-4 border border-[#D9C5B9] mb-4"
            style={{ borderRadius: moderateScale(18) }}
        >
            <View className="flex-row gap-3 items-center">
                <View
                    className="items-center overflow-hidden justify-center self-start rounded-full border border-[#FFFFFF]"
                    style={{
                        width: moderateScale(46),
                        height: moderateScale(46),
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
                            height: "100%",
                        }}
                    />
                </View>

                <View className="items-center">
                    <Text
                        numberOfLines={1}
                        className="text-[#1F1F1F] font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            marginBottom: moderateScale(6),
                        }}
                    >
                        {review.name}
                    </Text>

                    <View
                        className="self-start flex-row items-center bg-[#F8D56A]"
                        style={{
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10),
                        }}
                    >
                        <Text
                            className="font-semibold text-[#3F2516] uppercase"
                            style={{
                                fontSize: moderateScale(8),
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
                className="text-[#1F1F1F]/65 mx-4 font-medium"
                style={{
                    fontSize: moderateScale(12),
                    marginTop: verticalScale(8),
                    lineHeight: moderateScale(14),
                }}
            >
                {review.comment}
            </Text>

            <View className="flex-row gap-3 items-center justify-center mt-3">
                <View
                    className="rounded-full bg-[#E8DDD3]/85"
                    style={{
                        height: verticalScale(0.7),
                        width: moderateScale(95),
                        marginVertical: verticalScale(8),
                    }}
                />

                <View
                    className="rounded-full bg-[#E8B93F]/20 items-center justify-center"
                    style={{
                        width: moderateScale(20),
                        height: moderateScale(20),
                    }}
                >
                    <QuoteIcon width={moderateScale(14)} height={moderateScale(14)} color="#3F2516" />
                </View>

                <View
                    className="rounded-full bg-[#E8DDD3]/85"
                    style={{
                        height: verticalScale(0.7),
                        width: moderateScale(95),
                        marginVertical: verticalScale(8),
                    }}
                />
            </View>
        </View>
    )
}

export default React.memo(ReviewCard)