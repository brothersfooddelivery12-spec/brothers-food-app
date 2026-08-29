import { View } from "react-native"
import { verticalScale } from "react-native-size-matters"
import RewardActionCard, { RewardActionItem } from "./RewardActionCard"

type RewardActionsListProps = {
    data: RewardActionItem[]
    brothersPlus: RewardActionItem
    onPress?: (item: RewardActionItem) => void
}

const RewardActionsList = ({
    data,
    brothersPlus,
    onPress,
}: RewardActionsListProps) => {
    const normalItems = data.filter(
        item => item.id !== "brothers_plus"
    )

    return (
        <View
            style={{ gap: verticalScale(8) }}
        >
            {normalItems.map(item => (
                <RewardActionCard
                    key={item.id}
                    item={item}
                    onPress={onPress}
                />
            ))}

            <RewardActionCard
                item={brothersPlus}
                isBrothersPlus
                onPress={onPress}
            />
        </View>
    )
}

export default RewardActionsList