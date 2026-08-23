import { router } from "expo-router"
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import { FlatList } from "react-native-gesture-handler"
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import RatingIcon2 from '@/assets/icon/RatingIcon2.svg'
import RatingIcon3 from '@/assets/icon/RatingIcon3.svg'
import { getRatingStars } from "@/utils/rating"
import RatingDistribution from "../Details/components/RatingDistribution"
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import UtenisilIcon from '@/assets/icon/UtensilIcon2.svg'
import BoxIcon from '@/assets/icon/BoxIcon.svg'
import { customerReviews } from "@/constant/CustomerReviewData"
import { Image } from "expo-image"
import { useCallback, useState } from "react"
import EditIcon from '@/assets/icon/EditIcon.svg'
import RestaurantReviewCard from "./components/RestaurantReviewCard"

const USER_RATINGS = [
    5,5,5,5,5,5,5,5,5,
    4,4,4,4,4,
    3,3,3,3,3,3,
    2,2,2,2,
    1,1,1
]

const REVIEWS_CATEGORIES = [
    "All Reviews",
    "With Photos",
    "5 Stars"
]

export default function RestaurantReviewScreen() {
    const insets = useSafeAreaInsets()
    const [selectedReview, setSelectedReview] = useState("All Reviews")

    const rating = 4.8
    const stars = getRatingStars(rating)

    const customerReviewPhotos = customerReviews.flatMap((review) =>
        (review.photos ?? []).map((photo, index) => ({
            id: `${review.id}-${index}`,
            uri: photo,
            reviewer: review.name,
            rating: review.rating,
        }))
    )

    const renderReviews = useCallback(
        ({ item }: { item: any }) => {
            return (
                <RestaurantReviewCard
                    review={{
                        id: item.id,
                        name: item.name,
                        badge: item.badge,
                        rating: item.rating,
                        review: item.review,
                        photos: item.photos,
                        image: item.image,
                        date: item.date,
                    }}
                />
            )
        },[]
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
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(10),
                    gap: scale(10)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(44),
                        height: moderateScale(44)
                    }}
                >
                    <BackArrowIcon width={scale(22)} height={scale(22)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: scale(3) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Customer Reviews
                    </Text>
                    
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        See what customers are saying
                    </Text>
                </View>
            </View>

            <FlatList
                data={customerReviews}
                renderItem={renderReviews}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: insets.bottom + verticalScale(45)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="pt-4 pb-8 px-5 bg-[#E5E4E2]/40 mx-1"
                            style={{
                                borderRadius: moderateScale(20),
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

                            <RatingDistribution ratings={USER_RATINGS} ratingLevels={[5, 4, 3, 2, 1]} />
                        </View>

                        <View
                            className="flex-row items-center gap-3 bg-white border border-[#1F1F1F]/10 p-3"
                            style={{
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(22)
                            }}
                        >
                            <View
                                className="items-center justify-center bg-[#5C4639]"
                                style={{
                                    width: moderateScale(48),
                                    height: moderateScale(48),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <UtenisilIcon width={moderateScale(24)} height={moderateScale(24)} color={"#FFFFFF"} />
                            </View>

                            <View className="items-start gap-1 justify-center flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Food Quality
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Fresh flavors, great taste, every time.
                                </Text>
                            </View>

                            <View
                                className="flex-row gap-1 items-center bg-[#F8D56A]"
                                style={{
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                                <Text
                                    className="font-bold text-[#5c4639]"
                                    style={{ fontSize: moderateScale(11), marginRight: moderateScale(2) }}
                                >
                                    4.9
                                </Text>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-3 items-center bg-white border border-[#1F1F1F]/10 p-3"
                            style={{
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <View
                                className="items-center justify-center bg-[#5C4639]"
                                style={{
                                    width: moderateScale(48),
                                    height: moderateScale(48),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color={"#FFFFFF"} />
                            </View>

                            <View className="items-start gap-1 justify-center flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Delivery
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Fast, reliable delivery right to your door.
                                </Text>
                            </View>

                            <View
                                className="flex-row gap-1 items-center bg-[#F8D56A]"
                                style={{
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                                <Text
                                    className="font-bold text-[#5c4639]"
                                    style={{ fontSize: moderateScale(11), marginRight: moderateScale(2) }}
                                >
                                    4.8
                                </Text>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-3 items-center bg-white border border-[#1F1F1F]/10 p-3"
                            style={{
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <View
                                className="items-center justify-center bg-[#5C4639]"
                                style={{
                                    width: moderateScale(48),
                                    height: moderateScale(48),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <BoxIcon width={moderateScale(24)} height={moderateScale(24)} color={"#FFFFFF"} />
                            </View>

                            <View className="items-start gap-1 justify-center flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Packaging
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Neat, secure packaging that keeps food fresh.
                                </Text>
                            </View>

                            <View
                                className="flex-row gap-1 items-center bg-[#F8D56A]"
                                style={{
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />

                                <Text
                                    className="font-bold text-[#5c4639]"
                                    style={{ fontSize: moderateScale(11), marginRight: moderateScale(2) }}
                                >
                                    4.7
                                </Text>
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Customer Photos
                        </Text>

                        <FlatList
                            data={customerReviewPhotos}
                            keyExtractor={(item) => item.id}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="mt-4 -mx-4"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: moderateScale(14)
                            }}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: item.uri }}
                                    contentFit="cover"
                                    style={{
                                        width: moderateScale(110),
                                        height: moderateScale(110),
                                        borderRadius: moderateScale(18)
                                    }}
                                />
                            )}
                        />

                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-7 mb-5"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(8)
                            }}
                        >
                            {REVIEWS_CATEGORIES.map((category) => {
                                const isSelected = selectedReview === category
                        
                                return (
                                    <TouchableOpacity
                                        key={category}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            setSelectedReview(category)
                        
                                        }}
                                        className={`items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#FFFFFF]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(16),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: isSelected ? 0 : 1,
                                            borderColor: "rgba(31, 31, 31, 0.10)"
                                        }}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected ? "text-white" : "text-[#1F1F1F]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                }
                ListFooterComponent={
                    <View>
                        <Pressable
                            onPress={() => {}}
                            className="items-center justify-center mt-1"
                        >
                            <Text
                                className="text-[#3F2516] font-semibold text-center"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Load More Reviews
                            </Text>
                        </Pressable>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-1 items-center justify-center bg-[#3F2516] mx-5"
                            style={{
                                marginTop: verticalScale(16),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(12)
                            }}
                        >
                            <EditIcon width={moderateScale(22)} height={moderateScale(22)} color={"#FFFFFF"} />

                            <Text
                                className="text-[#FFFFFF] font-bold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Write Review
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    )
}