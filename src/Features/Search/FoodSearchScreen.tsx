import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import SearchBar from "@/components/SearchBar"
import { cheesePizzaResults } from "@/constant/cheesePizzaResults"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import FoodSearchCard from "./Components/FoodSearchCard"

const SEARCH_CATEGORIES = [
    "All",
    "Veg",
    "Non Veg",
    "Under ₹200",
]

const SIMILAR_SEARCHES = [
    { id: "1", title: "Margherita Pizza" },
    { id: "2", title: "Cheese Burst Pizza" },
    { id: "3", title: "Double Cheese Pizza" },
    { id: "4", title: "Paneer Pizza" },
]

export default function FoodSearchScreen() {
    const insets = useSafeAreaInsets()
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    const handleFoodPress = useCallback((item: any) => {
        console.log("Food:", item.name)
    }, [])

    const handleFavouritePress = useCallback((item: any) => {
        console.log("Favourite:", item.name)
    }, [])

    const handleAddPress = useCallback((item: any) => {
        console.log("Add:", item.name)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

    const renderFoodCard = useCallback(
        ({ item }: { item: any }) => (
            <FoodSearchCard
                {...item}
                onPress={() => handleFoodPress(item)}
                onFavouritePress={() => handleFavouritePress(item)}
                onAddPress={() => handleAddPress(item)}
            />
        ),
        [
            handleFoodPress,
            handleFavouritePress,
            handleAddPress
        ]
    )

    const renderHeader = useCallback(
        () => (
            <>
                <ScrollView
                    horizontal
                    nestedScrollEnabled
                    directionalLockEnabled
                    showsHorizontalScrollIndicator={false}
                    className="-mx-5"
                    contentContainerStyle={{
                        paddingHorizontal: scale(14),
                        gap: scale(10),
                        marginTop: verticalScale(2)
                    }}
                >
                    {SEARCH_CATEGORIES.map((category) => {
                        const isSelected = selectedCategory === category

                        return (
                            <TouchableOpacity
                                key={category}
                                activeOpacity={0.85}
                                onPress={() => setSelectedCategory(category)}
                                className={`items-center justify-center ${
                                    isSelected ? "bg-[#3F2516]" : "bg-[#FAF5EF]/75"
                                }`}
                                style={{
                                    borderRadius: moderateScale(18),
                                    paddingHorizontal: scale(16),
                                    paddingVertical: verticalScale(7),
                                    borderWidth: 0.7,
                                    borderColor: "#E8DDD3"
                                }}
                            >
                                <Text
                                    className={`font-semibold ${
                                        isSelected
                                            ? "text-white"
                                            : "text-[#5A3825]"
                                    }`}
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>

                <Text
                    className="text-[#1F1F1F] font-bold"
                    style={{
                        fontSize: moderateScale(15),
                        marginTop: verticalScale(18)
                    }}
                >
                    Results for cheese Pizza
                </Text>

                <Text
                    className="text-[#1F1F1F]/65 font-medium"
                    style={{
                        fontSize: moderateScale(11),
                        marginTop: verticalScale(4),
                        marginBottom: verticalScale(2)
                    }}
                >
                    24 dishes matching your search
                </Text>
            </>
        ),
        [search, selectedCategory]
    )

    const renderFooter = useCallback(
        () => (
            <>
                <Text
                    className="text-[#1F1F1F] font-bold"
                    style={{
                        fontSize: moderateScale(15),
                        marginTop: verticalScale(22)
                    }}
                >
                    Similar Searches
                </Text>

                <View
                    className="flex-row flex-wrap"
                    style={{
                        gap: scale(8),
                        marginTop: verticalScale(10)
                    }}
                >
                    {SIMILAR_SEARCHES.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.85}
                            onPress={() => setSearch(item.title)}
                            className="flex-row items-center bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(18),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(7)
                            }}
                        >
                            <Text
                                className="font-medium text-[#1F1F1F]"
                                style={{ fontSize: moderateScale(12) }}
                            >
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </>
        ),
        []
    )

    return (
        <SafeAreaView className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
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
                    className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10 rounded-full"
                    style={{
                        borderWidth: moderateScale(0.5),
                        width: moderateScale(46),
                        height: moderateScale(46)
                    }}
                >
                    <BackArrowIcon width={moderateScale(24)} height={moderateScale(24)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(3) }} />
                </TouchableOpacity>

                <View className="flex-1">
                    <SearchBar
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search food"
                        onRightPress={() => {}}
                    />
                </View>
            </View>

            <FlatList
                data={cheesePizzaResults}
                renderItem={renderFoodCard}
                nestedScrollEnabled
                keyExtractor={(item, index) =>
                    `${item.id ?? item.name}-${index}`
                }
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(30)
                }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                updateCellsBatchingPeriod={50}
                removeClippedSubviews={false}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={7}
            />
        </SafeAreaView>
    )
}