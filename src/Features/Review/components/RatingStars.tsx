import RatingIcon from '@/assets/icon/RatingIcon.svg'
import RatingIcon3 from '@/assets/icon/RatingIcon3.svg'
import { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'

type RatingStarsProps = {
    value: number
    onChange: (value: number) => void
}

const RatingStars = ({ value, onChange }: RatingStarsProps) => {
    return (
        <View className="flex-row gap-1 items-center justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    activeOpacity={0.8}
                    onPress={() => onChange(star)}
                    hitSlop={4}
                >
                    {star <= value ? (
                        <RatingIcon width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" />
                    ) : (
                        <RatingIcon3 width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default memo(RatingStars)