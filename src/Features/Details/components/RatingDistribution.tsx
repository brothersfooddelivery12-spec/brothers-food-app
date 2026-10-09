import RatingIcon from '@/assets/icon/RatingIcon.svg'
import { COLORS } from "@/constant/colors"
import { hexToRgba } from '@/utils/hexToRgba'
import { Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"

interface RatingDistributionProps {
    ratings: Number[],
    ratingLevels?: number[]
}

const RatingDistribution = ({ ratings, ratingLevels = [5, 4, 3, 2, 1] }: RatingDistributionProps) => {
    const totalRatings = ratings.length

    const getRatingCount = (rating: number) => {
        return ratings.filter((item) => item === rating).length
    }

    const getPercentage = (rating: number) => {
        if(totalRatings === 0) return 0

        return Math.round((getRatingCount(rating) / totalRatings) * 100)
    }

    return (
        <View
            className="w-full mt-4"
            style={{ gap: verticalScale(14) }}
        >
            {ratingLevels.map((rating) => {
                const percentage = getPercentage(rating)

                return (
                    <View
                        key={rating}
                        className="flex-row items-center"
                    >
                        <Text
                            className="mr-1 font-semibold"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryColor
                            }}
                        >
                            {rating}
                        </Text>

                        <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryColor} />

                        <View
                            className="overflow-hidden"
                            style={{
                                backgroundColor: COLORS.progressTrackColor,
                                flex: 1,
                                height: verticalScale(8),
                                marginLeft: moderateScale(12),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <View
                                className="h-full"
                                style={{
                                    backgroundColor: COLORS.accentColor,
                                    width: `${percentage}%`,
                                    borderRadius: moderateScale(18)
                                }}
                            />
                        </View>

                        <Text
                            className="font-medium"
                            style={{
                                color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                width: moderateScale(38),
                                marginLeft: moderateScale(6),
                                fontSize: moderateScale(12),
                                textAlign: "right"
                            }}
                        >
                            {percentage}%
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

export default RatingDistribution