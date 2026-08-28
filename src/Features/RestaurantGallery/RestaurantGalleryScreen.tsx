import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import FssaiLogo from '@/assets/icon/FssaiLogo.svg'
import MenuIcon from '@/assets/icon/MenuIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import VerificationIcon from '@/assets/icon/SecurityIcon.svg'
import { Image } from 'expo-image'
import { router } from "expo-router"
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import ReelCard, { ReelItem } from './Componenets/ReelCard'
import RestaurantGalleryView, { RestaurantGallery } from './Componenets/RestaurantGalleryView'

const CATEGORIES = [
    "All",
    "Food",
    "Restaurants",
    "Kitchen",
    "Ambience"
]

const galleryImages: RestaurantGallery[] = [
    {
        id: "1",
        imageUri: "https://i.pinimg.com/1200x/01/cb/0a/01cb0a88fd1b3ed1f544a80f379e06cd.jpg",
    },
    {
        id: "2",
        imageUri: "https://i.pinimg.com/736x/e5/07/87/e50787e6776fd7d60e51f9773da171f2.jpg",
    },
    {
        id: "3",
        imageUri: "https://i.pinimg.com/236x/d1/e7/47/d1e7478566624c49bcb938f611101314.jpg",
    },
    {
        id: "4",
        imageUri: "https://i.pinimg.com/1200x/2d/97/90/2d979059ca25e64e16e6fc959363dda5.jpg",
    },
    {
        id: "5",
        imageUri: "https://i.pinimg.com/736x/53/ce/35/53ce359889bc9a840abc554ee840dc20.jpg",
    },
]

export const RESTAURANT_REELS: ReelItem[] = [
    {
        id: "1",
        title: "Signature Honey Cake",
        category: "Short reel",
        duration: "00:32",
        thumbnail:
            "https://i.pinimg.com/736x/f7/72/83/f77283624b41c4847fe8162a603853b1.jpg",
    },
    {
        id: "2",
        title: "Friday Night Jazz",
        category: "Ambience",
        duration: "00:45",
        thumbnail:
            "https://i.pinimg.com/736x/b9/6f/3e/b96f3e7efa9d0f47147266fac5416bb3.jpg",
    },
]

const SORT_OPTIONS = [
    "Most Relevant",
    "Newest First",
    "Highest Rated",
    "Lowest Rated",
]

export default function RestaurantGalleryScreen(){
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [showSortMenu, setShowSortMenu] = useState(false)
    const [selectedSort, setSelectedSort] = useState("Most Relevant")

    const arrowRotation = useSharedValue(0)

    useEffect(() => {
        arrowRotation.value = withTiming(showSortMenu ? 1 : 0, {
            duration: 250
        })
    }, [showSortMenu])

    const arrowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${interpolate(
                    arrowRotation.value,
                    [0, 1],
                    [0, 180]
                )}deg`
            }
        ]
    }))

    const handlePressReel = useCallback((item: any) => {
        console.log("Open reel:", item)
            
        // Navigate to reel/video screen
    }, [])

    const renderReelItem = useCallback(
        ({ item }: { item: ReelItem }) => (
            <ReelCard
                item={item}
                onPress={handlePressReel}
            />
        ),
        [handlePressReel]
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
                    marginBottom: verticalScale(8),
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
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Restaurant Gallery
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Explore the restaurant before you order.
                    </Text>
                </View>
            </View>

            <FlatList
                data={[{}]}
                renderItem={null} 
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: verticalScale(8),
                    paddingHorizontal: scale(14),
                    paddingBottom: insets.bottom + verticalScale(35)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="relative overflow-hidden"
                            style={{
                                borderRadius: moderateScale(18),
                                height: moderateScale(175),
                            }}
                        >
                            <Image
                                source={{
                                    uri: "https://i.pinimg.com/1200x/b9/6f/3e/b96f3e7efa9d0f47147266fac5416bb3.jpg",
                                }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                                transition={200}
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                            />

                            <View
                                className="absolute bottom-2 left-2 bg-white/80"
                                style={{
                                    paddingHorizontal: scale(10),
                                    paddingVertical: verticalScale(6),
                                    borderRadius: moderateScale(16),
                                    maxWidth: "72%"
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    The Burger King
                                </Text>

                                <View
                                    className="mt-1 flex-row self-start items-center bg-[#E8B93F]/85"
                                    style={{
                                        paddingHorizontal: scale(7),
                                        paddingVertical: verticalScale(3),
                                        borderRadius: moderateScale(12),
                                        gap: scale(4)
                                    }}
                                >
                                    <RatingIcon width={moderateScale(13)} height={moderateScale(13)} color="#3F2516" />

                                    <Text
                                        className="font-bold text-[#3F2516]"
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        4.5
                                    </Text>

                                    <View
                                        className="bg-[#3F2516]/25"
                                        style={{
                                            width: 1,
                                            height: moderateScale(8)
                                        }}
                                    />

                                    <Text
                                        numberOfLines={1}
                                        className="font-medium text-[#3F2516]/85"
                                        style={{ fontSize: moderateScale(9) }}
                                    >
                                        5.2K+ Ratings
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-5"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: scale(10)
                            }}
                        >
                            {CATEGORIES.map((category) => {
                                const isSelected = selectedCategory === category
                        
                                return (
                                    <TouchableOpacity
                                        key={category}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            setSelectedCategory(category)
                                        }}
                                        className={`items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#faf5ef]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(16),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: isSelected ? 1 : 1,
                                            borderColor: isSelected ? "3F2516" : "#E8DDD3"
                                        }}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected ? "text-white" : "text-[#5A3825]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View
                            className="flex-row items-center w-full"
                            style={{
                                marginBottom: verticalScale(16),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Visual journey
                            </Text>

                            <View className="relative">
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => setShowSortMenu((prev) => !prev)}
                                    className="items-center justify-center flex-row gap-1"
                                >
                                    <Text
                                        className="text-[#3F2516] font-bold"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Sort: {selectedSort}
                                    </Text>

                                    <Animated.View style={arrowAnimatedStyle}>
                                        <ArrowDownIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.8} />
                                    </Animated.View>
                                </TouchableOpacity>

                                {showSortMenu && (
                                    <View
                                        className="absolute right-0 bg-white border border-[#1F1F1F]/10"
                                        style={{
                                            top: verticalScale(25),
                                            width: moderateScale(145),
                                            borderRadius: moderateScale(14),
                                            paddingVertical: verticalScale(6),
                                            zIndex: 100,
                                            elevation: 4
                                        }}
                                    >
                                        {SORT_OPTIONS.map((option, index) => {
                                            const isSelected = selectedSort === option

                                            return (
                                                <React.Fragment key={option}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.9}
                                                        onPress={() => {
                                                            setSelectedSort(option)
                                                            setShowSortMenu(false)
                                                        }}
                                                        style={{
                                                            paddingHorizontal: scale(12),
                                                            paddingVertical: verticalScale(5)
                                                        }}
                                                    >
                                                        <Text
                                                            className={
                                                                isSelected
                                                                    ? "text-[#3F2516] font-semibold"
                                                                    : "text-[#1F1F1F]/75 font-medium"
                                                            }
                                                            style={{ fontSize: moderateScale(13) }}
                                                        >
                                                            {option}
                                                        </Text>
                                                    </TouchableOpacity>
                                            
                                                    {index !== SORT_OPTIONS.length - 1 && (
                                                        <View
                                                            className="bg-[#1F1F1F]/10"
                                                            style={{
                                                                height: 1,
                                                                marginVertical: verticalScale(2),
                                                                marginHorizontal: scale(10)
                                                            }}
                                                        />
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </View>
                                )}
                            </View>
                        </View>

                        <RestaurantGalleryView images={galleryImages} />

                        <Text
                            className="text-[#1F1F1F] font-bold mt-4"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Chef Specials & Vibe
                        </Text>

                        <FlatList
                            horizontal
                            data={RESTAURANT_REELS}
                            renderItem={renderReelItem}
                            keyExtractor={(item) => item.id}
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            className="-mx-5 mt-3"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: moderateScale(10)
                            }}
                        />
                        
                        <View 
                            className='bg-[#FFFFFF] border border-[#1F1F1F]/10 items-center p-4'
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <View className='items-center self-start flex-row gap-3'>
                                <View
                                    className="items-center justify-center rounded-full bg-[#F8D56A]"
                                    style={{
                                        width: moderateScale(40),
                                        height: moderateScale(40)
                                    }}
                                >
                                    <VerificationIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} />
                                </View>
                                
                                <Text
                                    className='text-[#1F1F1F] font-bold'
                                    style={{ fontSize: moderateScale(16) }}
                                >
                                    Safety First
                                </Text>
                            </View>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium mx-2'
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: verticalScale(8)
                                }}
                            >
                                Our kitchen follows 5-star hygiene
                                protocols with FSSAI certification
                                and daily deep sanitization.
                            </Text>

                            <View className='flex-row items-center self-start mt-4 gap-2'>
                                <View
                                    className='rounded-full overflow-hidden bg-[#F5F5F5] items-center justify-center'
                                    style={{
                                        width: moderateScale(34),
                                        height: moderateScale(34)
                                    }}
                                >
                                    <FssaiLogo width={moderateScale(34)} height={moderateScale(34)} />
                                </View>

                                <Text
                                    className='text-[#22A06B] font-semibold'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Verified Kitchen
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => 
                                preventDoublePress(() => {
                                    router.push('/restaurant-menu')
                                })
                            }
                            className="flex-row gap-2 items-center justify-center bg-[#3F2516] mx-2"
                            style={{
                                marginTop: verticalScale(16),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(12)
                            }}
                        >
                            <MenuIcon width={moderateScale(22)} height={moderateScale(22)} color={"#FFFFFF"} />

                            <Text
                                className="text-[#FFFFFF] font-bold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                View Full Menu
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    )
}