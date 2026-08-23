import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import VerifiedIcon from '@/assets/icon/VerifiedIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import WalletIcon from '@/assets/icon/WalletIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import StoreIcon from '@/assets/icon/StoreIcon.svg'
import OfferIcon from '@/assets/icon/OfferIcon.svg'
import { restaurantsOffers } from "@/constant/restaurantOfferCardData"
import RestaurantOfferCard from "./components/RestaurantOfferCard"
import { popularitems } from "@/constant/PopularItemData"
import PopularItemCard from "./components/PopularItemCard"
import ImageGrid from "./components/ImageGrid"
import RatingIcon2 from '@/assets/icon/RatingIcon2.svg'
import RatingIcon3 from '@/assets/icon/RatingIcon3.svg'
import { getRatingStars } from "@/utils/rating"
import SimilarRestaurantCard from "./components/SimilarRestaurantCard"
import RatingDistribution from "./components/RatingDistribution"
import ReviewCard from "./components/ReviewCard"
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated"
import { usePreventDoublePress } from "../hook/usePreventDoublePress"

const TABS = ["Popular", "Recommended", "Main Course"]

const TAB_TITLES = {
    Popular: "Popular Items",
    Recommended: "Recommended Items",
    "Main Course": "Main Course",
}

const FODD_IMAGES = [
    "https://i.pinimg.com/736x/7f/d5/bb/7fd5bb5cdc861b4b044b6e9770d66fb8.jpg",
    "https://i.pinimg.com/736x/81/87/48/8187485c2f76c5bca3e7e98e0f90254a.jpg",
    "https://i.pinimg.com/1200x/4a/f2/05/4af205d49fed2c4c9d8da12e97ba439f.jpg",
    "https://i.pinimg.com/736x/8f/b0/4f/8fb04fb82290f6b61a73c304f5137432.jpg",
]

const USER_RATINGS = [
    5,
    5,
    5,
    5,
    5,
    4,
    3,
    4,
    4,
    5,
]

const REVIEWS = [
    {
        id: "1",
        name: "Rohan Sharma",
        badge: "Certified Foodie",
        rating: 3.8,
        comment:
            "Absolutely phenomenal taste! The Paneer Butter Masala Heritage is a must-try. The packaging was top-notch and arrived before time. Brothers Delivery never disappoints with their premium selection.",
    },
    {
        id: "2",
        name: "Amit Kumar",
        badge: "Food Explorer",
        rating: 4.5,
        comment:
            "Amazing food quality and excellent packaging. Everything arrived fresh and perfectly packed.",
    },
    {
        id: "3",
        name: "Priya Mehta",
        badge: "Foodie",
        rating: 5,
        comment:
            "Absolutely loved the food! Great taste, fast delivery and excellent overall experience.",
    },
]

const SimialrRestaurants = [
    {
        id: "1",
        name: "Currey Culture",
        image: "https://i.pinimg.com/1200x/54/92/2d/54922dd7b732dc69b31b001fd2bac63b.jpg",
        rating: 4.2,
        deliveryTime: "20-25 mins",
    },
    {
        id: "2",
        name: "The Spice Kitchen",
        image: "https://i.pinimg.com/736x/d6/35/a1/d635a1a04a3bed4443b62b2a03406904.jpg",
        rating: 4.6,
        deliveryTime: "25-30 mins",
    },
    {
        id: "3",
        name: "Royal Tadka",
        image: "https://i.pinimg.com/1200x/b9/6f/3e/b96f3e7efa9d0f47147266fac5416bb3.jpg",
        rating: 4.8,
        deliveryTime: "15-20 mins",
    },
]

export default function RestaurantDetailsScreen() {
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const [favourite, setFavourite] = useState(false)
    const [activeTab, setActiveTab] = useState("Popular")

    const rating = 4.8
    const stars = getRatingStars(rating)

    const handleFavourite = useCallback(() => {
        setFavourite((prev) => !prev)
    }, [])

    const handleBack = useCallback(() => {
        router.back()
    }, [])

    const handleShare = useCallback(() => {
        // share restaurant
    }, [])

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab)
    }, [])

    const handleItemPress = useCallback((item: any) => {
        console.log("Item pressed:", item.name)
    }, [])

    const handleAddItem = useCallback((item: any) => {
        console.log("Add item:", item.name)
    }, [])

    const handleOfferPress = useCallback((id: string) => {
        console.log("Selected offer:", id)
    }, [])

    const handleSimilarRestaurantPress = useCallback((id: string) => {
        console.log("Selected restaurant:", id)
    }, [])

    const renderOffer = useCallback(
        ({ item }: { item: any }) => {
            return(
                <RestaurantOfferCard
                    restaurantOffer={item}
                    icon={OfferIcon}
                    onPress={handleOfferPress}
                />
            )
        },[handleOfferPress]
    )

    const renderPopularitems = useCallback(
        ({ item }: { item: any }) => {
            return(
                <View
                    style={{
                        marginTop: moderateScale(12),
                        gap: moderateScale(15),
                        marginHorizontal: scale(12)
                    }}
                >
                    <PopularItemCard
                        item={item}
                        onPress={handleItemPress}
                        onAdd={handleAddItem}
                    />
                </View>
            )
        },[handleItemPress, handleAddItem]
    )

    const renderSimilarRestaurants = useCallback(
        ({ item }: { item: any }) => {
            return(
                <SimilarRestaurantCard
                    {...item}
                    onPress={handleSimilarRestaurantPress}
                />
            )
        },[handleSimilarRestaurantPress]
    )

    return(
        <SafeAreaView className="flex-1">
            <FlatList
                className="flex-1 bg-white"
                data={popularitems}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: insets.bottom + verticalScale(20)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="absolute left-0 right-0 top-0"
                            style={{ height: verticalScale(200) }}
                        >
                            <Image
                                source={{
                                    uri: "https://i.pinimg.com/736x/98/b5/5b/98b55b61b77fb05cfe91063d39436f40.jpg",
                                }}
                                contentFit="cover"
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                            />

                            <View className="absolute inset-0 bg-black/10" />
                            
                            <View
                                className="absolute left-0 right-0 top-0 flex-row items-center justify-between"
                                style={{
                                    marginTop: moderateScale(16),
                                    marginHorizontal: scale(12)
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={handleBack}
                                    className="items-center self-start justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                    style={{
                                        width: moderateScale(38),
                                        height: moderateScale(38)
                                    }}
                                >
                                    <BackArrowIcon width={scale(22)} height={scale(22)} color={"#1F1F1F"} strokeWidth={2} style={{ marginRight: scale(3) }} />
                                </TouchableOpacity>

                                <View
                                    className="flex-row items-center"
                                    style={{ gap: moderateScale(10) }}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={handleFavourite}
                                        className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                        style={{
                                            width: moderateScale(38),
                                            height: moderateScale(38)
                                        }}
                                    >
                                        {favourite ? (
                                            <FavouriteFilledIcon width={scale(22)} height={scale(22)} color={"#3F2516"} style={{ marginTop: moderateScale(2) }} />
                                        ): (
                                            <FavouriteOutlineIcon width={scale(22)} height={scale(22)} color={"#3F2516"} strokeWidth={2} style={{ marginTop: moderateScale(2) }} />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={handleShare}
                                        className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                                        style={{
                                            width: moderateScale(38),
                                            height: moderateScale(38)
                                        }}
                                    >
                                        <ShareIcon width={scale(20)} height={scale(20)} color={"#3F2516"} strokeWidth={1.5} style={{ marginRight: moderateScale(2)} } />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View
                            className="w-full bg-white"
                            style={{
                                marginTop: verticalScale(180),
                                borderTopLeftRadius: moderateScale(22),
                                borderTopRightRadius: moderateScale(22),
                                paddingHorizontal: moderateScale(14)
                            }}
                        >
                            <View
                                className="p-4 pb-5 bg-[#E5E4E2]/35"
                                style={{
                                    borderRadius: moderateScale(22),
                                    marginTop: moderateScale(15)
                                }}
                            >
                                <View className="w-full flex-row gap-3 items-center">
                                    <View
                                        className="overflow-hidden rounded-full border-[#FFFFFF]"
                                        style={{
                                            borderWidth: moderateScale(3),
                                            width: moderateScale(68),
                                            height: moderateScale(68),
                                            marginLeft: -moderateScale(4)
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: "https://i.pinimg.com/736x/04/5c/e2/045ce255f197758acff31daef213e62d.jpg",
                                            }}
                                            contentFit="cover"
                                            style={{
                                                width: "100%",
                                                height: "100%"
                                            }}
                                        />
                                    </View>

                                    <View className="items-center gap-1">
                                        <Text
                                            className="text-[#1F1F1F] self-start font-extrabold"
                                            style={{
                                                fontSize: moderateScale(20)
                                            }}
                                        >
                                            The Burger king
                                        </Text>

                                        <Text
                                            className="font-medium text-[#1F1F1F]/65"
                                            style={{
                                                fontSize: moderateScale(12),
                                                marginTop: moderateScale(2)
                                            }}
                                        >
                                            North Indian, Chinese, Fast Food
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row gap-2 items-center mt-3">
                                    <View
                                        className="self-start flex-row items-center bg-[#E8B93F]/20"
                                        style={{
                                            paddingHorizontal: moderateScale(7),
                                            paddingVertical: moderateScale(3.5),
                                            borderRadius: moderateScale(14)
                                        }}
                                    >
                                        <VerifiedIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" />
                    
                                        <Text
                                            className="font-bold text-[#3F2516]"
                                            style={{
                                                fontSize: moderateScale(10.5),
                                                marginLeft: moderateScale(2),
                                                marginRight: moderateScale(2)
                                            }}
                                        >
                                            Verified
                                        </Text>
                                    </View>

                                    <View
                                        className="self-start flex-row items-center justify-center gap-1 bg-[#E8B93F]/20"
                                        style={{
                                            paddingHorizontal: moderateScale(9),
                                            paddingVertical: moderateScale(5),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" />

                                        <Text
                                            className="font-bold text-[#3F2516]"
                                            style={{ fontSize: moderateScale(12), marginRight: moderateScale(2) }}
                                        >
                                            4.5
                                        </Text>

                                        <Text
                                            className="font-medium text-[#3F2516]/85"
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            (5,200 + Ratings)
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    className="rounded-full bg-[#E8DDD3]/75"
                                    style={{
                                        height: verticalScale(0.7),
                                        marginVertical: verticalScale(12),
                                        marginHorizontal: verticalScale(2)
                                    }}
                                />

                                <View className="flex-row items-center mx-3">
                                    <View className="gap-4 flex-1">
                                        <View className="flex-row items-center gap-2">
                                            <View
                                                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                                style={{
                                                    width: moderateScale(36),
                                                    height: moderateScale(36)
                                                }}
                                            >
                                                <ClockIcon width={moderateScale(22)} height={moderateScale(22)} color="#5C4639" />
                                            </View>

                                            <View className="justify-center">
                                                <Text
                                                    className="text-[#1F1F1F]/75 font-medium uppercase"
                                                    style={{ fontSize: moderateScale(11) }}
                                                >
                                                    Delivery
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{ fontSize: moderateScale(12) }}
                                                >
                                                    20–25 mins
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center gap-2">
                                            <View
                                                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                                style={{
                                                    width: moderateScale(36),
                                                    height: moderateScale(36)
                                                }}
                                            >
                                                <LocationIcon width={moderateScale(22)} height={moderateScale(22)} color="#5C4639" />
                                            </View>

                                            <View className="justify-center">
                                                <Text
                                                    className="text-[#1F1F1F]/75 font-medium uppercase"
                                                    style={{ fontSize: moderateScale(11) }}
                                                >
                                                    Distance
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{ fontSize: moderateScale(12) }}
                                                >
                                                    2.3 km
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="gap-4">
                                        <View className="flex-row items-center gap-2">
                                            <View
                                                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                                style={{
                                                    width: moderateScale(36),
                                                    height: moderateScale(36)
                                                }}
                                            >
                                                <WalletIcon width={moderateScale(22)} height={moderateScale(22)} color="#5C4639" />
                                            </View>

                                            <View className="justify-center">
                                                <Text
                                                    className="text-[#1F1F1F]/75 font-medium uppercase"
                                                    style={{ fontSize: moderateScale(11) }}
                                                >
                                                    Cost
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F] font-bold"
                                                    style={{ fontSize: moderateScale(12) }}
                                                >
                                                    ₹350 for two
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center gap-2">
                                            <View
                                                className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                                style={{
                                                    width: moderateScale(36),
                                                    height: moderateScale(36)
                                                }}
                                            >
                                                <StoreIcon width={moderateScale(20)} height={moderateScale(20)} color="#5C4639" strokeWidth={1.8} />
                                            </View>

                                            <View className="justify-center">
                                                <Text
                                                    className="text-[#1F1F1F]/75 font-medium uppercase"
                                                    style={{ fontSize: moderateScale(11) }}
                                                >
                                                    Status
                                                </Text>

                                                <Text
                                                    className="text-green-600 font-bold"
                                                    style={{ fontSize: moderateScale(12) }}
                                                >
                                                    OPEN NOW
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <FlatList
                                data={restaurantsOffers}
                                horizontal
                                nestedScrollEnabled
                                directionalLockEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                className="-mx-5 mt-3"
                                style={{
                                    marginTop: verticalScale(28)
                                }}
                                contentContainerStyle={{
                                    paddingHorizontal: scale(14),
                                    gap: scale(16)
                                }}
                                renderItem={renderOffer}
                            />

                            <View
                                className="w-full"
                                style={{ marginTop: verticalScale(12) }}
                            >
                                <View className="flex-row items-end">
                                    {TABS.map((tab) => {
                                        const isActive = activeTab === tab

                                        return (
                                            <TouchableOpacity
                                                key={tab}
                                                activeOpacity={0.95}
                                                onPress={() => handleTabChange(tab)}
                                                className="items-center justify-center"
                                                style={{
                                                    paddingHorizontal: scale(10),
                                                    height: verticalScale(38)
                                                }}
                                            >
                                                <View className="items-center">
                                                    <Text
                                                        className={
                                                            isActive
                                                                ? "font-bold text-[#3F2516]"
                                                                : "font-medium text-[#514A46]"
                                                        }
                                                        style={{
                                                            fontSize: moderateScale(14),
                                                            marginBottom: verticalScale(6)
                                                        }}
                                                    >
                                                        {tab}
                                                    </Text>

                                                    {isActive && (
                                                        <Animated.View
                                                            entering={ZoomIn.duration(340)}
                                                            exiting={ZoomOut.duration(360)}
                                                            className="absolute bottom-0 bg-[#3F2516]"
                                                            style={{
                                                                left: -scale(3),
                                                                right: -scale(3),
                                                                height: verticalScale(2.5),
                                                                borderRadius: scale(28)
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>

                                <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{
                                        fontSize: moderateScale(16),
                                        marginTop: verticalScale(6)
                                    }}
                                >   
                                    {TAB_TITLES[activeTab as keyof typeof TAB_TITLES]}
                                </Text>
                            </View>
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <View
                        style={{
                            paddingHorizontal: scale(14),
                            marginTop: verticalScale(24)
                        }}
                    >
                        <View
                            className="flex-row items-center w-full"
                            style={{ marginBottom: verticalScale(16) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(16) }}
                            >
                                Ambience & Kitchen
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
                                    See All
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ImageGrid
                            images={FODD_IMAGES}
                            gap={moderateScale(15)}
                            size={moderateScale(160)}
                            borderRadius={moderateScale(22)}
                        />

                        <View
                            className="p-4 pb-2 bg-[#E5E4E2]/35"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: moderateScale(15)
                            }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-black text-center mt-3"
                                style={{ fontSize: moderateScale(38) }}
                            >
                                {rating}
                            </Text>

                            <View
                                className="flex-row gap-1 items-center justify-center"
                                style={{ marginTop: moderateScale(4) }}
                            >
                                {stars.map((type, index) => {
                                    if (type === "full") {
                                        return (
                                            <RatingIcon key={index} width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" />
                                        )
                                    }

                                    if (type === "half") {
                                        return (
                                            <RatingIcon2 key={index} width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" />
                                        )
                                    }

                                    return (
                                        <RatingIcon3 key={index} width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" />
                                    )
                                })}
                            </View>

                            <Text
                                className="text-[#5C4639]/90 font-semibold text-center"
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: moderateScale(4)
                                }}
                            >
                                5,200 + Reviews
                            </Text>

                            <RatingDistribution ratings={USER_RATINGS} ratingLevels={[5, 4, 3]} />

                            <View
                                className="rounded-full bg-[#E8DDD3]/75"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(14),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View
                                style={{
                                        
                                }}
                            >
                                {REVIEWS.map((item) => (
                                    <ReviewCard
                                        key={item.id}
                                        review={item}
                                    />
                                ))}
                            </View>
                        </View>

                        <Pressable
                            onPress={() =>
                                preventDoublePress(() => {
                                    router.push("/restaurant-review")
                                })
                            }
                            className="items-center justify-center mt-3"
                        >
                            <Text
                                className="text-[#5C4639] font-semibold text-center"
                                style={{
                                    fontSize: moderateScale(14)
                                }}
                            >
                                See All Reviews
                            </Text>
                        </Pressable>

                        <Text
                            className="text-[#1F1F1F] font-semibold"
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Similar Restaurants
                        </Text>

                        <FlatList
                            data={SimialrRestaurants}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            className="-mx-5 mt-4"
                            contentContainerStyle={{
                                paddingLeft: scale(16),
                                paddingRight: scale(20),
                                gap: scale(12)
                            }}
                            renderItem={renderSimilarRestaurants}
                        />
                    </View>
                }
                renderItem={renderPopularitems}
            />
        </SafeAreaView>
    )
}