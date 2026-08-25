import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BoxIcon from '@/assets/icon/BoxIcon.svg'
import CameraIcon from '@/assets/icon/CameraIcon.svg'
import CancleIcon from '@/assets/icon/CancleIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import HeartFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import HearOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import FireIcon from '@/assets/icon/FireIcon.svg'
import LeafIcon from '@/assets/icon/LeafIcon.svg'
import UtenisilIcon from '@/assets/icon/UtensilIcon2.svg'
import GradientButton from '@/components/GradientButton'
import ToggleSwitch from '@/components/ToggleSwitch'
import { Image } from 'expo-image'
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import RatingStars from './components/RatingStars'

const REVIEW_HIGHLIGHTS = [
    {
        id: "1",
        title: "Fresh Food",
        icon: LeafIcon,
    },
    {
        id: "2",
        title: "Fast Delivery",
        icon: DeliveryIcon,
    },
    {
        id: "3",
        title: "Hot Food",
        icon: FireIcon,
    },
    {
        id: "4",
        title: "Eco-Packaging",
        icon: LeafIcon,
    },
    {
        id: "5",
        title: "Great Portions",
        icon: UtenisilIcon,
    }
]

const MAX_REVIEW_LENGTH = 500
const MAX_IMAGES = 10

export default function WriteReviewScreen() {
    const insets = useSafeAreaInsets()
    const [reviewText, setReviewText] = useState("")
    const [isReviewFocused, setIsReviewFocused] = useState(false)
    const [selectedHighlights, setSelectedHighlights] = useState<string[]>([])
    const [reviewImages, setReviewImages] = useState<string[]>([])
    const [recommended, setRecommended] = useState(false)
    const [ratings, setRatings] = useState({
        foodQuality: 0,
        delivery: 0,
        packaging: 0,
    })

    const handleRating = (
        type: keyof typeof ratings,
        value: number
    ) => {
        setRatings((prev) => ({
            ...prev,
            [type]: value,
        }))
    }

    const handlePickImage = async () => {
    if (reviewImages.length >= MAX_IMAGES) {
        return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: MAX_IMAGES - reviewImages.length,
            quality: 0.8
        })

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri)

            setReviewImages((prev) => [
                ...prev,
                ...newImages,
            ])
        }
    }

    const handleRemoveImage = (uri: string) => {
        setReviewImages((prev) =>
            prev.filter((image) => image !== uri)
        )
    }

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
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>
            
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Write Your Review
                    </Text>
                                
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Share your experience and help others choose better.
                    </Text>
                </View>
            </View>

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: insets.bottom + verticalScale(45)
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bottomOffset={moderateScale(40)}
                extraKeyboardSpace={moderateScale(20)}
            >
                    <View
                        className="items-center flex-row gap-2 p-2 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                        style={{
                            borderRadius: moderateScale(18),
                            marginTop: verticalScale(12)
                        }}
                    >
                        <Image
                            source={{
                                uri: "https://i.pinimg.com/736x/36/b7/fa/36b7fa818d446a5ccba21e95f2e738b0.jpg"
                            }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            style={{
                                width: moderateScale(58),
                                height: moderateScale(58),
                                borderRadius: moderateScale(16)
                            }}
                        />

                        <View className='-mt-2 gap-2 flex-1'>
                            <Text
                                className='text-[#1F1F1F] font-bold'
                                style={{ fontSize: moderateScale(15) }}
                            >
                                The Burger King
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium'
                                style={{ fontSize: moderateScale(11) }}
                            >
                                Truffle Burger, Peri Peri Fries
                            </Text>
                        </View>

                        <View
                            className="self-start flex-row items-center bg-[#F8D56A]"
                            style={{
                                paddingHorizontal: moderateScale(7),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(10),
                                marginTop: moderateScale(4),
                                marginRight: moderateScale(4)
                            }}
                        >
                            <Text
                                className="font-semibold text-[#3F2516] uppercase"
                                style={{ fontSize: moderateScale(9)}}
                            >
                                #BR1234        
                            </Text>
                        </View>
                    </View>

                    <Text
                        className="text-[#1F1F1F] font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            marginTop: verticalScale(14)
                        }}
                    >
                        How was your experience?
                    </Text>

                    <View
                        className="p-4 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                        style={{
                            marginTop: verticalScale(10),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View className="flex-row gap-3 items-center">
                            <View
                                className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                style={{
                                    width: moderateScale(42),
                                    height: moderateScale(42)
                                }}
                            >
                                <UtenisilIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" />
                            </View>

                            <Text
                                className="text-[#1F1F1F] font-semibold flex-1"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Food Quality
                            </Text>

                            <RatingStars
                                value={ratings.foodQuality}
                                onChange={(value) => handleRating("foodQuality", value)}
                            />
                        </View>

                        <View
                            className="rounded-full bg-[#E8DDD3]/65 mx-3"
                            style={{
                                height: verticalScale(0.7),
                                marginVertical: verticalScale(8)
                            }}
                        />

                        <View className="flex-row gap-3 items-center">
                            <View
                                className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                style={{
                                    width: moderateScale(42),
                                    height: moderateScale(42)
                                }}
                            >
                                <DeliveryIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" />
                            </View>

                            <Text
                                className="text-[#1F1F1F] font-semibold flex-1"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Delivery Service
                            </Text>

                            <RatingStars
                                value={ratings.delivery}
                                onChange={(value) => handleRating("delivery", value)}
                            />
                        </View>

                        <View
                            className="rounded-full bg-[#E8DDD3]/65 mx-3"
                            style={{
                                height: verticalScale(0.7),
                                marginVertical: verticalScale(8)
                            }}
                        />

                        <View className="flex-row gap-3 items-center">
                            <View
                                className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                style={{
                                    width: moderateScale(42),
                                    height: moderateScale(42)
                                }}
                            >
                                <BoxIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" />
                            </View>

                            <Text
                                className="text-[#1F1F1F] font-semibold flex-1"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Packaging
                            </Text>

                            <RatingStars
                                value={ratings.packaging}
                                onChange={(value) => handleRating("packaging", value)}
                            />
                        </View>
                    </View>

                    <Text
                        className="text-[#1F1F1F] font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            marginTop: verticalScale(14)
                        }}
                    >
                        What did you like?
                    </Text>

                    <View
                        className="flex-row flex-wrap"
                        style={{
                            gap: scale(8),
                            marginTop: verticalScale(10)
                        }}
                    >
                        {REVIEW_HIGHLIGHTS.map((item) => {
                            const Icon = item.icon
                            const isSelected = selectedHighlights.includes(item.title)

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.85}
                                    onPress={() => {
                                        setSelectedHighlights((prev) =>
                                            prev.includes(item.title)
                                                ? prev.filter((title) => title !== item.title)
                                                : [...prev, item.title]
                                        )
                                    }}
                                    className={`flex-row items-center border ${
                                        isSelected
                                            ? "bg-[#5C4639] border-[#5C4639]"
                                            : "bg-white border-[#1F1F1F]/10"
                                    }`}
                                    style={{
                                        gap: moderateScale(5),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(12),
                                        paddingVertical: verticalScale(8)
                                    }}
                                >
                                    <Icon
                                        width={moderateScale(16)}
                                        height={moderateScale(16)}
                                        color={isSelected ? "#FFFFFF" : "#1F1F1F"}
                                        strokeWidth={2}
                                    />

                                    <Text
                                        className={`font-medium ${
                                            isSelected ? "text-white" : "text-[#1F1F1F]"
                                        }`}
                                        style={{ fontSize: moderateScale(12) }}
                                        numberOfLines={1}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <Text
                        className="text-[#1F1F1F] font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            marginTop: verticalScale(14)
                        }}
                    >
                        Tell us more about your order...
                    </Text>

                    <View
                        className="mt-3 mx-1 bg-[#F8F9FA] border"
                        style={{
                            height: verticalScale(120),
                            borderRadius: moderateScale(18),
                            borderColor: isReviewFocused
                                ? "#3F2516"
                                : "#D9C5B9"
                        }}
                    >
                        <TextInput
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={reviewText}
                            onChangeText={setReviewText}
                            maxLength={MAX_REVIEW_LENGTH}
                            placeholder="Share your experience, what you loved or any suggestions..."
                            placeholderTextColor="#7A7D81"
                            className="text-[#151515] font-medium"
                            onFocus={() => setIsReviewFocused(true)}
                            onBlur={() => setIsReviewFocused(false)}
                            style={{
                                flex: 1,
                                paddingHorizontal: moderateScale(16),
                                paddingTop: moderateScale(16),
                                paddingBottom: moderateScale(32),
                                fontSize: moderateScale(13),
                                lineHeight: moderateScale(26)
                            }}
                            selectionColor="#79685e"
                        />

                        <Text
                            className="absolute bottom-3 right-4 text-[#7A7D81] font-medium"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            {reviewText.length}/{MAX_REVIEW_LENGTH}
                        </Text>
                    </View>

                    <Text
                        className="text-[#1F1F1F] font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            marginTop: verticalScale(14)
                        }}
                    >
                        Add Photos{" "}
                        <Text
                            className='text-[#1F1F1F]/75 font-semibold'
                            style={{ fontSize: moderateScale(13) }}
                        >
                            (Optional)
                        </Text>
                    </Text>

                    <ScrollView
                        horizontal
                        nestedScrollEnabled
                        directionalLockEnabled
                        showsHorizontalScrollIndicator={false}
                        className="-mx-5 mt-3"
                        contentContainerStyle={{
                            paddingHorizontal: scale(14),
                            gap: scale(8)
                        }}
                    >
                        {reviewImages.length < MAX_IMAGES && (
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={handlePickImage}
                                className="border border-dashed border-[#5C4639] items-center justify-center gap-1"
                                style={{
                                    width: moderateScale(75),
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <CameraIcon width={moderateScale(25)} height={moderateScale(25)} color="#3F2516" strokeWidth={1.8} />

                                <Text
                                    className="text-[#3F2516] font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Add Photo
                                </Text>
                            </TouchableOpacity>
                        )}

                        {reviewImages.map((uri, index) => (
                            <View
                                key={`${uri}-${index}`}
                                style={{
                                    width: moderateScale(75),
                                    height: moderateScale(75),
                                    borderRadius: moderateScale(14),
                                    overflow: "hidden"
                                }}
                            >
                                <Image
                                    source={{ uri }}
                                    contentFit="cover"
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                />

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => handleRemoveImage(uri)}
                                    className="absolute bg-[#3F2516] items-center justify-center"
                                    style={{
                                        top: moderateScale(5),
                                        right: moderateScale(5),
                                        width: moderateScale(20),
                                        height: moderateScale(20),
                                        borderRadius: moderateScale(8)
                                    }}
                                >
                                    <CancleIcon width={moderateScale(11)} height={moderateScale(11)} color="#FFFFFF" strokeWidth={2.5} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <Text
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{
                            fontSize: moderateScale(10),
                            marginTop: verticalScale(10)
                        }}
                    >
                        Max 10 files allowed
                    </Text>

                    <View className='flex-row items-center mt-6 gap-3 mx-1'>
                        <View
                            className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38)
                            }}
                        >
                            {recommended ? (
                                <HeartFilledIcon width={moderateScale(20)} height={moderateScale(20)} color={"#3F2516"} style={{ marginTop: moderateScale(2) }} />
                            ) : (
                                <HearOutlineIcon width={moderateScale(20)} height={moderateScale(20)} color={"#3F2516"} style={{ marginTop: moderateScale(2) }} />
                            )}
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-semibold flex-1'
                            style={{ fontSize: moderateScale(13) }}
                        >
                            I recommended this restaurant
                        </Text>

                        <ToggleSwitch enabled={recommended} onPress={() => setRecommended(!recommended)} /> 
                    </View>

                    <GradientButton  title='Submit Review' onPress={() => {}} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}