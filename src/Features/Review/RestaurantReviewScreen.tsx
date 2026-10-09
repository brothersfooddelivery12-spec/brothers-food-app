import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BoxIcon from '@/assets/icon/BoxIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import EditIcon from '@/assets/icon/EditIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import RatingIcon2 from '@/assets/icon/RatingIcon2.svg'
import RatingIcon3 from '@/assets/icon/RatingIcon3.svg'
import UtenisilIcon from '@/assets/icon/UtensilIcon2.svg'
import { COLORS } from '@/constant/colors'
import { customerReviews } from "@/constant/CustomerReviewData"
import { hexToRgba } from '@/utils/hexToRgba'
import { getRatingStars } from "@/utils/rating"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import RatingDistribution from "../Details/components/RatingDistribution"
import { usePreventDoublePress } from "../hook/usePreventDoublePress"
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
    const preventDoublePress = usePreventDoublePress()
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
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}
        >
            <StatusBar
                translucent
                backgroundColor={COLORS.primaryBackgroundColor}
                barStyle="dark-content"
            />

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(10),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>
            
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Customer Reviews
                    </Text>
                                
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        See what customers are saying
                    </Text>
                </View>
            </View>

            <FlatList
                data={customerReviews}
                renderItem={renderReviews}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingTop: verticalScale(4),
                    paddingBottom: insets.bottom + verticalScale(5)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="pt-4 pb-8 px-5 mx-1"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(20),
                                marginTop: moderateScale(15)
                            }}
                        >
                            <Text
                                className="font-black text-center mt-3"
                                style={{
                                    fontSize: moderateScale(38),
                                    color: COLORS.primaryTextColor
                                }}
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
                                            <RatingIcon key={index} width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                        )
                                    }

                                    if (type === "half") {
                                        return (
                                            <RatingIcon2 key={index} width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                        )
                                    }

                                    return (
                                        <RatingIcon3 key={index} width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                    )
                                })}
                            </View>

                            <Text
                                className="font-semibold text-center"
                                style={{
                                    color: hexToRgba(COLORS.secondaryColor, 0.85),
                                    fontSize: moderateScale(12),
                                    marginTop: moderateScale(4)
                                }}
                            >
                                5,200 + Reviews
                            </Text>

                            <RatingDistribution ratings={USER_RATINGS} ratingLevels={[5, 4, 3, 2, 1]} />
                        </View>

                        <View
                            className="flex-row items-center gap-3 p-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(22)
                            }}
                        >
                            <View
                                className="items-center justify-center"
                                style={{
                                    backgroundColor: COLORS.secondaryColor,
                                    width: moderateScale(48),
                                    height: moderateScale(48),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <UtenisilIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryBackgroundColor} />
                            </View>

                            <View className="items-start gap-1 justify-center flex-1">
                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Food Quality
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Fresh flavors, great taste, every time.
                                </Text>
                            </View>

                            <View
                                className="flex-row gap-1 items-center"
                                style={{
                                    backgroundColor: COLORS.accentLightColor,
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} />

                                <Text
                                    className="font-bold"
                                    style={{
                                        color: COLORS.primaryColor,
                                        fontSize: moderateScale(11),
                                        marginRight: moderateScale(2)
                                    }}
                                >
                                    4.9
                                </Text>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-3 items-center p-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <View
                                className="items-center justify-center"
                                style={{
                                    backgroundColor: COLORS.secondaryColor,
                                    width: moderateScale(48),
                                    height: moderateScale(48),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <DeliveryIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryBackgroundColor} />
                            </View>

                            <View className="items-start gap-1 justify-center flex-1">
                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Delivery
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Fast, reliable delivery right to your door.
                                </Text>
                            </View>

                            <View
                                className="flex-row gap-1 items-center"
                                style={{
                                    backgroundColor: COLORS.accentLightColor,
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} />

                                <Text
                                    className="font-bold"
                                    style={{
                                        color: COLORS.primaryColor,
                                        fontSize: moderateScale(11),
                                        marginRight: moderateScale(2)
                                    }}
                                >
                                    4.8
                                </Text>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-3 items-center p-3"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <View
                                className="items-center justify-center"
                                style={{
                                    backgroundColor: COLORS.secondaryColor,
                                    width: moderateScale(48),
                                    height: moderateScale(48),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <BoxIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryBackgroundColor} />
                            </View>

                            <View className="items-start gap-1 justify-center flex-1">
                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Packaging
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Neat, secure packaging that keeps food fresh.
                                </Text>
                            </View>

                            <View
                                className="flex-row gap-1 items-center"
                                style={{
                                    backgroundColor: COLORS.accentLightColor,
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(4),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} />

                                <Text
                                    className="font-bold"
                                    style={{
                                        color: COLORS.primaryColor,
                                        fontSize: moderateScale(11),
                                        marginRight: moderateScale(2)
                                    }}
                                >
                                    4.7
                                </Text>
                            </View>
                        </View>

                        <Text
                            className="font-semibold"
                            style={{
                                color: COLORS.primaryTextColor,
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
                            className="mt-4 -mx-5"
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
                                        className="items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected
                                                ? COLORS.primaryColor
                                                : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(16),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: 0.7,
                                            borderColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor
                                        }}
                                    >
                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(13),
                                                color: isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                            }}
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
                                className="font-semibold text-center"
                                style={{
                                    fontSize: moderateScale(13),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                Load More Reviews
                            </Text>
                        </Pressable>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => 
                                preventDoublePress(() => {
                                    router.push('/write-review')
                                })
                            }
                            className="flex-row gap-2 items-center justify-center mx-2"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                marginTop: verticalScale(16),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <EditIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryBackgroundColor
                                }}
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