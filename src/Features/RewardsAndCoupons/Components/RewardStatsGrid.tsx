import React from "react"
import { FlatList, Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

type RewardStatItem = {
    id: string
    title: string
    value: string | number
    size: number
    icon: React.FC<SvgProps>
}

type RewardStatsGridProps = {
    data: RewardStatItem[]
}

const RewardStatsGrid = ({ data }: RewardStatsGridProps) => {
    const renderItem = ({
        item,
        index,
    }: {
        item: RewardStatItem
        index: number
    }) => {
        const Icon = item.icon
        const isLeftItem = index % 2 === 0

        return (
            <View
                className="bg-white border border-[#1F1F1F]/10 flex-row items-center flex-1"
                style={{
                    minHeight: verticalScale(44),
                    borderRadius: moderateScale(20),
                    paddingHorizontal: scale(10),
                    paddingVertical: verticalScale(10),
                    marginRight: isLeftItem ? scale(4) : 0,
                    marginLeft: !isLeftItem ? scale(4) : 0,
                    marginBottom: verticalScale(8)
                }}
            >
                <View
                    className="items-center justify-center bg-[#E8B93F]/15"
                    style={{
                        width: moderateScale(38),
                        height: moderateScale(38),
                        borderRadius: moderateScale(28)
                    }}
                >
                    <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color="#5C4639" />
                </View>

                <View
                    className="flex-1"
                    style={{ marginLeft: scale(8) }}
                >
                    <Text
                        numberOfLines={2}
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{
                            fontSize: moderateScale(10.5),
                            lineHeight: moderateScale(13)
                        }}
                    >
                        {item.title}
                    </Text>

                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="text-[#1F1F1F] font-extrabold"
                        style={{
                            fontSize: moderateScale(18),
                            marginTop: verticalScale(4)
                        }}
                    >
                        {item.value}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default RewardStatsGrid