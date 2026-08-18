import RatingIcon from '@/assets/icon/RatingIcon.svg'
import RatingIcon2 from '@/assets/icon/RatingIcon2.svg'
import RatingIcon3 from '@/assets/icon/RatingIcon3.svg'
import { View } from 'react-native';
import { moderateScale } from 'react-native-size-matters'

interface RatingStarsProps {
    rating: number;
    size?: number;
}

const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
    return (
        <View
            className="flex-row items-center"
            style={{ gap: moderateScale(1) }}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                let Icon

                if (rating >= star) {
                    // Full star
                    Icon = RatingIcon
                } else if (rating >= star - 0.5) {
                    // Half star
                    Icon = RatingIcon2
                } else {
                    // Empty star
                    Icon = RatingIcon3
                }

                return (
                    <Icon key={star} width={moderateScale(size)} height={moderateScale(size)} color="#5C4639" />
                )
            })}
        </View>
    )
}

export default RatingStars