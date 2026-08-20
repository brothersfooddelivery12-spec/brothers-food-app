import { Image } from "expo-image"
import { Text, TouchableOpacity, View } from "react-native"
import { moderateScale } from "react-native-size-matters"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import PlusIcon from "@/assets/icon/PlusIcon.svg"
import React from "react"

export interface PopularItem {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    price: number;
    tag?: string;
}

interface PopularItemCardProps {
    item: PopularItem;
    onPress?: (item: PopularItem) => void;
    onAdd?: (item: PopularItem) => void;
}

const PopularItemCard = ({ item, onPress, onAdd }: PopularItemCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => onPress?.(item)}
            className="w-full p-2 overflow-hidden bg-white border border-[#1F1F1F]/10"
            style={{ borderRadius: moderateScale(22) }}
        >
            <View className="flex-row gap-3 items-center">
                <View
                    className="items-center justify-center overflow-hidden"
                    style={{
                        borderRadius: moderateScale(18),
                        width: moderateScale(88),
                        height: moderateScale(88)
                    }}
                >
                    <Image
                        source={{
                            uri: item.image
                        }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>

                <View className="flex-1 justify-center mr-4 -mt-1">
                    {item.tag && (
                        <View
                            className="self-start flex-row items-center bg-[#F8D56A]"
                            style={{
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(10),
                                marginBottom: moderateScale(6)
                            }}
                        >
                            <Text
                                className="font-semibold text-[#3F2516] uppercase"
                                style={{ fontSize: moderateScale(9) }}
                            >
                                {item.tag}
                            </Text>
                        </View>
                    )}

                    <Text
                        numberOfLines={1}
                        className="font-bold text-[#1F1F1F]"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        {item.name}
                    </Text>

                    <Text
                        numberOfLines={2}
                        className="font-medium text-[#1F1F1F]/75"
                        style={{ 
                            fontSize: moderateScale(11.5),
                            marginTop: moderateScale(2)
                        }}
                    >
                        {item.description}
                    </Text>
                </View>
            </View>

            <View
                className="flex-row gap-2 items-center"
                style={{
                    marginLeft: moderateScale(4),
                    marginTop: moderateScale(6),
                    marginRight: moderateScale(4)
                }}
            >
                <View
                    className="self-start flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                    style={{
                        marginTop: moderateScale(6),
                        paddingHorizontal: moderateScale(8),
                        paddingVertical: moderateScale(4),
                        borderRadius: moderateScale(12)
                    }}
                >
                    <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color="#5C4639" />

                    <Text
                        className="font-bold text-[#5C4639]"
                        style={{
                            fontSize: moderateScale(12),
                            marginRight: moderateScale(2)
                        }}
                    >
                        {item.rating}
                    </Text>
                </View>

                <View
                    className="self-start items-center justify-center bg-[#E8B93F]/15"
                    style={{
                        marginTop: moderateScale(6),
                        paddingHorizontal: moderateScale(10),
                        paddingVertical: moderateScale(4),
                        borderRadius: moderateScale(12)
                    }}
                >
                    <Text
                        className="font-bold text-[#5C4639]"
                        style={{ fontSize: moderateScale(13) }}
                    >
                        ₹{item.price}
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={(event) => {
                        event.stopPropagation()
                        onAdd?.(item)
                    }}
                    className="items-center justify-center ml-auto bg-[#3F2516]"
                    style={{
                        marginBottom: moderateScale(2),
                        width: moderateScale(32),
                        height: moderateScale(32),
                        borderRadius: moderateScale(12)
                    }}
                >
                    <PlusIcon width={moderateScale(16)} height={moderateScale(16)} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(PopularItemCard)