import BackArrowIcon from "@/assets/icon/ArrowLeft.svg"
import LocationIcon from "@/assets/icon/LocationIcon3.svg"
import MicIcon from '@/assets/icon/MicIcon.svg'
import RestaurantCard from "@/components/RestaurantCard"
import SearchBar from "@/components/SearchBar"
import { restaurants } from "@/constant/RestaurantData"
import { RestaurantSearchData } from "@/constant/RestaurantSearchData"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import RestaurantSearchCard from "./Components/RestaurantSearchCard"

const RECENTLY_VIEWED = [
    {
        id: "1",
        name: "Joe's Pizza",
        imageUri:
            "https://i.pinimg.com/736x/9d/2f/62/9d2f62b46c1a23bd26df0d455c3a388f.jpg",
        category: "Italian",
        distance: "2.1 km",
    },
    {
        id: "2",
        name: "The Burger House",
        imageUri:
            "https://i.pinimg.com/736x/30/76/11/30761195f30846f6de07d52038d7d4cd.jpg",
        category: "Burgers",
        distance: "1.8 km",
    },
    {
        id: "3",
        name: "Spice Garden",
        imageUri:
            "https://i.pinimg.com/736x/50/9c/d4/509cd4ca90c727994e5da18bc9f81472.jpg",
        category: "North Indian",
        distance: "3.4 km",
    },
    {
        id: "4",
        name: "Dosa Junction",
        imageUri:
            "https://i.pinimg.com/1200x/61/23/74/612374b37b28b6790d6fbcb2ab5e8f82.jpg",
        category: "South Indian",
        distance: "2.7 km",
    },
]

export default function RestaurantSearchScreen() {
    const insets = useSafeAreaInsets()
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

    const handleRestaurantPress = useCallback(
        (restaurant: any) => {
            console.log("Restaurant:", restaurant.name)
        }, []
    )

    const handleFavouritePress = useCallback(
        (restaurant: any) => {
            console.log("Favourite:", restaurant.name)
        }, []
    )

    const handleFoodPress = useCallback(
        (item: any) => {
            console.log("Food:", item.name)
        }, []
    )

    const handleAddPress = useCallback(
        (item: any) => {
            console.log("Add:", item.name)
        }, []
    )

    const renderRestaurantSearchCard =
        useCallback(({item}: {item: any}) => (
                <RestaurantSearchCard
                    {...item}
                    onPress={() =>
                        handleRestaurantPress(item)
                    }
                    onFavouritePress={() =>
                        handleFavouritePress(item)
                    }
                    onFoodPress={(food) =>
                        handleFoodPress(food)
                    }
                    onAddPress={(food) =>
                        handleAddPress(food)
                    }
                />
            ),
            [
                handleRestaurantPress,
                handleFavouritePress,
                handleFoodPress,
                handleAddPress,
            ]
        )

    const renderResultsHeader = useCallback(() => (
            <View>
                <Text
                    className="text-[#1F1F1F] font-extrabold"
                    style={{
                        fontSize: moderateScale(16),
                        marginTop: verticalScale(2),
                    }}
                >
                    Restaurants matching{" "}
                    {search || "Burger King"}
                </Text>

                <Text
                    className="text-[#1F1F1F]/65 font-medium"
                    style={{
                        fontSize: moderateScale(11.5),
                        marginTop: verticalScale(4)
                    }}
                >
                    {/* {filteredRestaurants.length}{" "} */}
                    12 Restaurants Found
                </Text>
            </View>
        ),
        [search, // filteredRestaurants.length
        ]
    )

    const renderFooter = useCallback(() => (
            <View>
                <Text
                    className="text-[#1F1F1F] font-extrabold"
                    style={{
                        fontSize: moderateScale(16),
                        marginTop: verticalScale(14)
                    }}
                >
                    Nearby Favourites
                </Text>

                <Text
                    className="text-[#1F1F1F]/65 font-medium"
                    style={{
                        fontSize: moderateScale(11.5),
                        marginTop: verticalScale(4)
                    }}
                >
                    Similar to your search for{" "}
                    {search || "Burger King"}
                </Text>

                <View
                    style={{
                        marginTop: moderateScale(12),
                        gap: moderateScale(15)
                    }}
                >
                    {restaurants.map(
                        (restaurant) => (
                            <RestaurantCard
                                key={restaurant.id}
                                {...restaurant}
                                onPress={() => handleRestaurantPress(restaurant)}
                                onFavouritePress={() => handleFavouritePress(restaurant)}
                            />
                        )
                    )}
                </View>

                <Text
                    className="text-[#1F1F1F] font-extrabold"
                    style={{
                        fontSize: moderateScale(16),
                        marginTop: verticalScale(22)
                    }}
                >
                    Recently Viewed
                </Text>

                <ScrollView
                    horizontal
                    nestedScrollEnabled
                    directionalLockEnabled
                    showsHorizontalScrollIndicator={false}
                    className="-mx-5"
                    contentContainerStyle={{
                        paddingHorizontal: scale(14),
                        gap: scale(10)
                    }}
                >
                    {RECENTLY_VIEWED.map(
                        (item) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.9}
                                onPress={() =>
                                    console.log("Recently viewed:", item.name)
                                }
                                className="flex-row mt-3 items-center bg-white border border-[#1F1F1F]/10"
                                style={{
                                    gap: moderateScale(7),
                                    width: moderateScale(235),
                                    borderRadius: moderateScale(20),
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(7)
                                }}
                            >
                                <View
                                    className="items-center justify-center overflow-hidden"
                                    style={{
                                        width: moderateScale(62),
                                        height: moderateScale(62),
                                        borderRadius: moderateScale(16)
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: item.imageUri
                                        }}
                                        contentFit="cover"
                                        cachePolicy="memory-disk"
                                        transition={200}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </View>

                                <View className="justify-center flex-1">
                                    <Text
                                        numberOfLines={1}
                                        className="text-[#1F1F1F] font-bold mt-1"
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        {item.name}
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{
                                            fontSize: moderateScale(10),
                                            marginTop: moderateScale(3)
                                        }}
                                    >
                                        {item.category}
                                    </Text>

                                    <View
                                        className="flex-row items-center self-start bg-[#E8B93F]/15"
                                        style={{
                                            marginTop: moderateScale(6),
                                            gap: moderateScale(3),
                                            paddingHorizontal: moderateScale(6),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <LocationIcon width={moderateScale(14)} height={moderateScale(14)} color="#5C4639" />

                                        <Text
                                            className="font-semibold text-[#5C4639]"
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            {item.distance}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    )}
                </ScrollView>
            </View>
        ),
        [
            search,
            handleRestaurantPress,
            handleFavouritePress,
        ]
    )

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(10),
                    gap: scale(10)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(46),
                        height: moderateScale(46),
                        flexShrink: 0
                    }}
                >
                    <BackArrowIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} strokeWidth={2} style={{ marginRight: moderateScale(3) }} />
                </TouchableOpacity>

                <View
                    className="flex-1 -mr-1"
                    style={{ minWidth: 0 }}
                >
                    <SearchBar
                        value={search}
                        onChangeText={setsearch}
                        placeholder="Search restaurant"
                        RightIcon={MicIcon}
                        rightIconColor="#1F1F1F"
                        onRightPress={() => {}}
                    />
                </View>
            </View>

            <FlatList
                data={RestaurantSearchData}
                nestedScrollEnabled
                renderItem={renderRestaurantSearchCard}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={renderResultsHeader}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={7}
                updateCellsBatchingPeriod={50}
                removeClippedSubviews={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(30)
                }}
            />
        </SafeAreaView>
    )
}