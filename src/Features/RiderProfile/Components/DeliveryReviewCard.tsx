import RatingIcon from "@/assets/icon/RatingIcon.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

export type DeliveryReview = {
    id: string
    rating: number
    timeAgo: string
    review: string
}

type DeliveryReviewCardProps = {
    item: DeliveryReview
}

export default function DeliveryReviewCard({ item }: DeliveryReviewCardProps) {
    return (
        <View
            className="p-4"
            style={{
                borderRadius: moderateScale(18),
                backgroundColor: COLORS.secondaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.5)
            }}
        >
            <View className="flex-row items-center">
                <View className="flex-row items-center flex-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <RatingIcon
                            key={index}
                            width={moderateScale(14)}
                            height={moderateScale(14)}
                            color={
                                index < item.rating
                                    ? COLORS.secondaryColor
                                    : hexToRgba(COLORS.primaryTextColor, 0.15)
                            }
                        />
                    ))}
                </View>

                <Text
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(10),
                        color: hexToRgba(COLORS.primaryTextColor, 0.65)
                    }}
                >
                    {item.timeAgo}
                </Text>
            </View>

            <Text
                className="font-medium"
                style={{
                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                    fontStyle: "italic",
                    fontSize: moderateScale(12),
                    lineHeight: moderateScale(19),
                    marginTop: verticalScale(10)
                }}
            >
                "{item.review}"
            </Text>
        </View>
    )
}