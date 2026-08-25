import RatingIcon from "@/assets/icon/RatingIcon.svg"
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
            className="bg-[#E5E4E2]/65 p-4"
            style={{ borderRadius: moderateScale(18) }}
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
                                    ? "#5C4639"
                                    : "#1F1F1F30"
                            }
                        />
                    ))}
                </View>

                <Text
                    className="text-[#1F1F1F]/75 font-medium"
                    style={{ fontSize: moderateScale(12) }}
                >
                    {item.timeAgo}
                </Text>
            </View>

            <Text
                className="text-[#1F1F1F]/75 font-medium"
                style={{
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