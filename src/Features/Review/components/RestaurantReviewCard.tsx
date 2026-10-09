import CommentIcon from '@/assets/icon/CommentIcon.svg'
import QuoteIcon from '@/assets/icon/QuoteIcon.svg'
import ThumbsUpFilled from '@/assets/icon/ThumbsUpFilled.svg'
import ThumbsUpOutline from '@/assets/icon/ThumbsUpOutline.svg'
import RatingStars from "@/components/RatingStars"
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from "expo-image"
import React, { useState } from "react"
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export interface RestaurantReview {
    id: string
    name: string
    badge: string
    rating: number
    review: string
    image?: string
    photos: string[]
    date?: string
}

interface RestaurantReviewCardProps {
    review: RestaurantReview;
}

const RestaurantReviewCard = ({ review }: RestaurantReviewCardProps) => {
    const [isHelpful, setIsHelpful] = useState(false)

    return (
        <View
            className="p-4 mb-5 mx-2"
            style={{
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderRadius: moderateScale(18),
                borderWidth: moderateScale(0.5)
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
                                fontSize: moderateScale(8.5),
                                color: COLORS.primaryColor
                            }}
                        >
                            {review.badge}
                        </Text>
                    </View>
                </View>
                
                <View className="ml-auto items-end justify-between self-stretch my-1">
                    <View
                        className="flex-row items-center"
                        style={{ gap: moderateScale(1) }}
                    >
                        <RatingStars rating={review.rating} />
                    </View>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            fontSize: moderateScale(10.5)
                        }}
                    >
                        {review.date}
                    </Text>
                </View>
            </View>

            <Text
                className="mx-4 font-medium"
                style={{
                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                    fontSize: moderateScale(12),
                    marginTop: verticalScale(12),
                    lineHeight: moderateScale(14)
                }}
            >
                {review.review}
            </Text>

            {review.photos?.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        gap: moderateScale(8),
                        paddingHorizontal: moderateScale(4),
                    }}
                    style={{ marginTop: verticalScale(14) }}
                >
                    {review.photos.map((photo, index) => (
                        <Image
                            key={`${review.id}-photo-${index}`}
                            source={{ uri: photo }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            style={{
                                width: moderateScale(80),
                                height: moderateScale(80),
                                borderRadius: moderateScale(14),
                            }}
                        />
                    ))}
                </ScrollView>
            )}

            <View
                className="rounded-full mx-3"
                style={{
                    backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                    height: verticalScale(0.7),
                    marginVertical: verticalScale(12)
                }}
            />

            <View className="flex-row items-center justify-between">
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => setIsHelpful((prev) => !prev)}
                    className="flex-row justify-center gap-1 items-center"
                    style={{
                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                        paddingHorizontal: moderateScale(7),
                        paddingVertical: moderateScale(3.5),
                        borderRadius: moderateScale(14)
                    }}
                >
                    {isHelpful ? (
                        <ThumbsUpFilled width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                    ) : (
                        <ThumbsUpOutline width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                    )}

                    <Text
                        className="font-semibold"
                        style={{
                            fontSize: moderateScale(11),
                            color: COLORS.secondaryColor
                        }}
                    >
                        Helpful ({isHelpful ? 25 : 24})
                    </Text>
                </TouchableOpacity>

                <Pressable
                    onPress={() => {}}
                >
                    <Text
                        className="font-semibold"
                        style={{
                            fontSize: moderateScale(12),
                            color: COLORS.primaryColor
                        }}
                    >
                        Report
                    </Text>
                </Pressable>
            </View>

            <View
                className="items-center justify-center p-4"
                style={{
                    backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                    borderRadius: moderateScale(18),
                    marginTop: verticalScale(12),
                    marginLeft: scale(12),
                    borderLeftWidth: 2.5,
                    borderLeftColor: COLORS.primaryColor
                }}
            >
                <View className="items-center self-start flex-row gap-2">
                    <CommentIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />

                    <Text
                        numberOfLines={1}
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(12),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        The Burger King
                    </Text>
                </View>

                <Text
                    className="font-medium mt-3"
                    style={{
                        fontSize: moderateScale(10.5),
                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                    }}
                >
                    Thank you for your kind words,
                    Alexander! We take great pride in
                    ensuring our delivery experience
                    mirrors our table service. Looking
                    forward to serving you again soon.
                </Text>
            </View>

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

export default React.memo(RestaurantReviewCard)