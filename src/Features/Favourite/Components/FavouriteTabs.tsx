import { memo } from "react"
import { Pressable, Text, View } from "react-native"
import { moderateScale, verticalScale } from "react-native-size-matters"
import RestaurantIcon from '@/assets/icon/StoreIcon.svg'
import FoodIcon from '@/assets/icon/FoodIcon.svg'

type FavouriteTab = "restaurants" | "food"

interface FavouriteTabsProps {
    activeTab: FavouriteTab
    onChange: (tab: FavouriteTab) => void
}

const FavouriteTabs = memo(
    ({ activeTab, onChange }: FavouriteTabsProps) => {
        return (
            <View
                className="flex-row bg-[#E5E4E2]/65 mx-2"
                style={{
                    padding: moderateScale(4),
                    borderRadius: moderateScale(28),
                    borderWidth: moderateScale(1),
                    borderColor: "#E8E0D9"
                }}
            >
                <Pressable
                    onPress={() => onChange("restaurants")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor:
                            activeTab === "restaurants"
                                ? "#3F2516"
                                : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <RestaurantIcon width={moderateScale(20)} height={moderateScale(20)}
                        color={
                            activeTab === "restaurants"
                                ? "#FFFFFF"
                                : "#8B7A6E"
                        }
                    />

                    <Text
                        className={
                            activeTab === "restaurants"
                                ? "text-white font-semibold"
                                : "text-[#756A63] font-medium"
                        }
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Restaurants
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => onChange("food")}
                    className="flex-1 flex-row items-center justify-center"
                    style={{
                        height: verticalScale(38),
                        borderRadius: moderateScale(24),
                        backgroundColor:
                            activeTab === "food"
                                ? "#3F2516"
                                : "transparent",
                        gap: moderateScale(4)
                    }}
                >
                    <FoodIcon width={moderateScale(20)} height={moderateScale(20)}
                        color={
                            activeTab === "food"
                                ? "#FFFFFF"
                                : "#8B7A6E"
                        }
                    />

                    <Text
                        className={
                            activeTab === "food"
                                ? "text-white font-semibold"
                                : "text-[#756A63] font-medium"
                        }
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Food Items
                    </Text>
                </Pressable>
            </View>
        )
    }
)

export default FavouriteTabs