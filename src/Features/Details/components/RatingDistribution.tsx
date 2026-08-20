import { Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"
import RatingIcon from '@/assets/icon/RatingIcon.svg'

interface RatingDistributionProps {
    ratings: Number[]
}

const RatingDistribution = ({ratings}: RatingDistributionProps) => {
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
            {[5, 4, 3].map((rating) => {
                const percentage = getPercentage(rating)

                return (
                    <View
                        key={rating}
                        className="flex-row items-center"
                    >
                        <Text
                            className="mr-1 font-semibold text-[#1F1F1F]"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            {rating}
                        </Text>

                        <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" />

                        <View
                            className="overflow-hidden bg-[#F3EDE5]"
                            style={{
                                flex: 1,
                                height: verticalScale(8),
                                marginLeft: moderateScale(12),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <View
                                className="h-full bg-[#E9A21B]"
                                style={{
                                    width: `${percentage}%`,
                                    borderRadius: moderateScale(18)
                                }}
                            />
                        </View>

                        <Text
                            className="text-[#1F1F1F]/75 font-medium"
                            style={{
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