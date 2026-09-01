import CartIcon from '@/assets/icon/CartIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon2.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import MicIcon from '@/assets/icon/MicIcon.svg'
import NotificationIcon from '@/assets/icon/NotificationIcon.svg'
import SearchIcon from '@/assets/icon/SearchOutline.svg'
import RestaurantCard from "@/components/RestaurantCard"
import { categories } from "@/constant/CategoryData"
import { foodItems } from "@/constant/FoodItems"
import { nearByRestaurants } from "@/constant/NearByRestaurantsData"
import { offers } from "@/constant/OffersCardData"
import { restaurants } from "@/constant/RestaurantData"
import BannerCarousel from "@/Features/Home/components/BannerCarousel"
import FoodCard from "@/Features/Home/components/FoodCard"
import NearByRestaurantsList from "@/Features/Home/components/NearByRestaurants"
import OfferCard from "@/Features/Home/components/OffersCard"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const [activeCategory, setActiveCategory] = useState("1")
    const [selectedReview, setSelectedReview] = useState("All")

    const handleRestaurantPress = useCallback((restaurantId: string) => {
        preventDoublePress(() => {
            router.push({
                pathname: '/restaurant-details',
                params: { id: restaurantId }
            })
        })
    }, [])

    const handleFavouritePress = useCallback((id: string) => {
        console.log("Favourite:", id)
    }, [])

    const handleFoodPress = (foodId: string) => {
        console.log("Selected food:", foodId)

        preventDoublePress(() => {
            router.push({
                pathname: "/food-details",
                params: { id: foodId }
            })
        })
    }

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <FlatList
                data={nearByRestaurants}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(78)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="flex-row items-center w-full gap-2"
                            style={{ marginTop: verticalScale(10) }}
                        >
                            <View className="flex-1">
                                <Text
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Good Evening, Harsh
                                </Text>

                                <View
                                    className="flex-row items-center"
                                    style={{
                                        marginTop: verticalScale(2),
                                        marginLeft: -verticalScale(4)
                                    }}
                                >
                                    <LocationIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" style={{ marginBottom: moderateScale(4) }} />

                                    <Text
                                        className="text-[#1F1F1F] font-extrabold"
                                        style={{ fontSize: moderateScale(16.5) }}
                                    >
                                        Home • Sumerpur
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => 
                                    preventDoublePress(() => {
                                        router.push('/notification')
                                    })
                                }
                                className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                style={{
                                    width: moderateScale(44),
                                    height: moderateScale(44)
                                }}
                            >
                                <NotificationIcon width={moderateScale(23)} height={moderateScale(23)} color="#1F1F1F" strokeWidth={1.5} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {
                                    preventDoublePress(() => {
                                        router.push('/cart')
                                    })
                                }}
                                className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                style={{
                                    width: moderateScale(44),
                                    height: moderateScale(44)
                                }}
                            >
                                <CartIcon width={moderateScale(23)} height={moderateScale(23)} color="#1F1F1F" strokeWidth={1.5} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => 
                                preventDoublePress(() => {
                                    router.push('/(tabs)/search')
                                })
                            }
                            className="flex-row w-full items-center gap-2 mt-5"
                        >
                            <View
                                className="flex-1 flex-row gap-3 items-center bg-white border border-[#1F1F1F]/10"
                                style={{
                                    borderRadius: moderateScale(22),
                                    paddingHorizontal: scale(13),
                                    height: verticalScale(46)
                                }}
                            >
                                <SearchIcon height={moderateScale(24)} width={moderateScale(24)} color="#3F2516" strokeWidth={2} />

                                <Text
                                    className="font-medium text-[#1F1F1F]/65"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    What are you craving today?
                                </Text>
                            </View>

                            <View
                                className="items-center justify-center bg-white border border-[#1F1F1F]/10"
                                style={{
                                    width: moderateScale(50),
                                    height: moderateScale(50),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <MicIcon height={moderateScale(24)} width={moderateScale(24)} color="#1F1F1F" strokeWidth={1.5} />
                            </View>
                        </TouchableOpacity>

                        {/* <FlatList
                            data={categories}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            className="mt-5 -mx-4"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: moderateScale(10)
                            }}
                            renderItem={({ item: category }) => {
                                const isActive = activeCategory === category.id

                                return(
                                    <View className="items-center">
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={() => setActiveCategory(category.id)}
                                            className="items-center justify-center rounded-full bg-[#E5E4E2]/85"
                                            style={{
                                                borderColor: isActive ? "rgba(92, 70, 57, 0.7)" : "#FFFFFF",
                                                borderWidth: moderateScale( isActive ? 2 : 1.5),
                                                width: moderateScale(65),
                                                height: moderateScale(65),

                                                shadowColor: "#5C4639",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 0
                                                },
                                                shadowOpacity: isActive ? 0.75 : 0,
                                                shadowRadius: isActive ? 10 : 0,
                                                elevation: isActive ? 8 : 0
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri: category.imageUri
                                                }}
                                                contentFit="cover"
                                                cachePolicy={'memory-disk'}
                                                style={{
                                                    width: "70%",
                                                    height: "70%"
                                                }}
                                            />
                                        </TouchableOpacity>

                                        <Text
                                            className="text-[#1F1F1F] font-semibold mt-1 mb-2"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            {category.title}
                                        </Text>
                                    </View>
                                )
                            }}
                        /> */}

                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-5 mb-0"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(8)
                            }}
                        >
                            {categories.map((category) => {
                                const isSelected = selectedReview === category.title

                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            setSelectedReview(category.title)
                                        }}
                                        className={`items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#FFFFFF]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(17),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: isSelected ? 0 : 1,
                                            borderColor: "rgba(31, 31, 31, 0.10)"
                                        }}
                                    >
                                        <Text
                                            className={`font-medium ${
                                                isSelected ? "text-white" : "text-[#1F1F1F]"
                                            }`}
                                            style={{ fontSize: moderateScale(13.5) }}
                                        >
                                            {category.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <BannerCarousel />

                        <View
                            className="flex-row items-center w-full"
                            style={{ marginTop: verticalScale(18) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(16) }}
                            >
                                Popular Near You
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="items-center"
                            >
                                <Text
                                    className="text-[#3F2516] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                marginTop: moderateScale(12),
                                gap: moderateScale(15)
                            }}
                        >
                            {restaurants.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    {...restaurant}
                                    onPress={() =>
                                        handleRestaurantPress(restaurant.id)
                                    }
                                    onFavouritePress={() =>
                                        handleFavouritePress(restaurant.id)
                                    }
                                />
                            ))}
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Today's Special Offers
                        </Text>

                        <FlatList
                            data={offers}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            className="-mx-5"
                            contentContainerStyle={{
                                paddingHorizontal: moderateScale(15),
                                gap: moderateScale(12),
                                marginTop: moderateScale(12)
                            }}
                            renderItem={({ item }) => (
                                <OfferCard
                                    offer={item}
                                    onPress={() => {
                                        console.log("Selected offer:", item.id)
                                    }}
                                />
                            )}
                        />

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Continue Ordering
                        </Text>

                        <View
                            className="flex-row items-center gap-2 mt-3 bg-[#E5E4E2]/85"
                            style={{
                                borderRadius: moderateScale(18),
                                paddingHorizontal: moderateScale(9),
                                paddingVertical: moderateScale(9)
                            }}
                        >
                            <View
                                className="items-center justify-center overflow-hidden"
                                style={{
                                    width: moderateScale(62),
                                    height: moderateScale(62),
                                    borderRadius: moderateScale(15)
                                }}
                            >
                                <Image
                                    source={{
                                        uri: "https://i.pinimg.com/736x/c9/c5/01/c9c5013a47c78dde12d22a8659cdb945.jpg"
                                    }}
                                    contentFit="cover"
                                    transition={100}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </View>

                            <View className="justify-center flex-1">
                                <Text
                                    numberOfLines={1}
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    The Big Burger Theory
                                </Text>

                                <Text
                                    numberOfLines={2}
                                    className="text-[#1F1F1F]/65 font-medium mt-1"
                                    style={{ fontSize: moderateScale(11.5) }}
                                >
                                    Double Patty Cheese Burger + Fries
                                </Text>

                            </View>

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {}}
                                className="items-center justify-center flex-row bg-[#3F2516]"
                                style={{
                                    gap: moderateScale(5),
                                    borderRadius: moderateScale(10),
                                    paddingHorizontal: moderateScale(9),
                                    paddingVertical: moderateScale(7)
                                }}
                            >
                                <ClockIcon width={moderateScale(14)} height={moderateScale(14)} color="#FFFFFF" strokeWidth={2.2} />

                                <Text
                                    className="text-[#FFFFFF] font-medium"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Reorder
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Trending Foods
                        </Text>

                        <FlatList
                            data={foodItems}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            className="-mx-5 mt-3"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: moderateScale(12)
                            }}
                            renderItem={({ item }) => (
                                <FoodCard
                                    item={item}
                                    onPress={() => handleFoodPress(item.id)}
                                    onAddPress={() =>
                                        console.log("Add:", item.id)
                                    }
                                />
                            )}
                        />

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(16),
                                marginTop: verticalScale(18),
                                marginBottom: verticalScale(8)
                            }}
                        >
                            Nearby Restaurants
                        </Text>
                    </View>
                }

                renderItem={({ item }) => (
                    <View
                        style={{ marginBottom: moderateScale(12) }}
                    >
                        <NearByRestaurantsList
                            restaurant={item}
                            onPress={() => {
                                console.log("Restaurant:", item.id)
                            }}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}