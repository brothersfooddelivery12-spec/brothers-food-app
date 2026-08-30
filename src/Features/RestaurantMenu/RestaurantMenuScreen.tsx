import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import CouponIcon from '@/assets/icon/CouponFilledIcon.svg'
import DessertIcon from '@/assets/icon/DessertIcon.svg'
import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import MicIcon from '@/assets/icon/MicIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import SearchBar from '@/components/SearchBar'
import { COMBO_OFFERS } from '@/constant/ComboData'
import { popularitems } from "@/constant/PopularItemData"
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import PopularItemCard from '../Details/components/PopularItemCard'
import FoodCard from '../Home/components/FoodCard'
import ComboCard from './Components/ComboCard'

const TABS = ["Popular", "Recommended", "Main Course"]

const TAB_TITLES = {
    Popular: "Popular Items",
    Recommended: "Recommended Items",
    "Main Course": "Main Course",
}

export const FREQUENTLY_ORDERED_TOGETHER = [
    {
        id: "1",
        name: "Peri Peri Fries",
        category: "Sides",
        price: 119,
        imageUri:
            "https://i.pinimg.com/736x/73/7e/d9/737ed93987aae98a76fc2e5f12fc0ecc.jpg",
    },
    {
        id: "2",
        name: "Cold Coffee",
        category: "Beverages",
        price: 89,
        imageUri:
            "https://i.pinimg.com/236x/23/b2/bc/23b2bcc80be05c9169a1333470d920e5.jpg",
    },
    {
        id: "3",
        name: "Cheesy Garlic Bread",
        category: "Sides",
        price: 149,
        imageUri:
            "https://i.pinimg.com/1200x/89/52/62/8952620f20999169e06c97f10a5eb24b.jpg",
    },
    {
        id: "4",
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 109,
        imageUri:
            "https://i.pinimg.com/736x/18/39/b5/1839b51798c581c9219f3d7ccd62cbda.jpg",
    },
]

export default function RestaurantMenuScreen(){
    const insets = useSafeAreaInsets()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const [favourite, setFavourite] = useState(false)
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [activeTab, setActiveTab] = useState("Popular")

    const isOpen = true
    const horizontalPadding = scale(28)
    
    const gap = scale(12)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 2

    const handleFavourite = useCallback(() => {
        setFavourite((prev) => !prev)
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

    const handleAddCombo = useCallback((item: any) => {
        console.log("Add:", item)
    }, [])

    const handlePressCombo = useCallback((item: any) => {
        console.log("Press:", item)
    }, [])

    const renderPopularitems = useCallback(
        ({ item }: { item: any }) => {
            return(
                <View
                    className='-px-4'
                    style={{
                        marginTop: moderateScale(12),
                        gap: moderateScale(15)
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

    const renderComboItem = useCallback(
        ({ item }: { item: any }) => (
            <ComboCard
                item={item}
                onAdd={handleAddCombo}
                onPress={handlePressCombo}
            />
        ),
        [handleAddCombo, handlePressCombo]
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)

        return () => clearTimeout(timer)
    }, [search])

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
                        Restaurant Menu
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Browse your favorites and find something new
                    </Text>
                </View>

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
                            <FavouriteFilledIcon width={moderateScale(22)} height={moderateScale(22)} color={"#1F1F1F"} style={{ marginTop: moderateScale(2) }} />
                        ): (
                            <FavouriteOutlineIcon width={moderateScale(22)} height={moderateScale(22)} color={"#1F1F1F"}  strokeWidth={1.5} style={{ marginTop: moderateScale(2) }} />
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
                        <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F"} strokeWidth={1.5} style={{ marginRight: moderateScale(2)} } />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={popularitems}
                keyExtractor={(item) => item.id}
                renderItem={renderPopularitems}
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
                            className="items-center bg-[#FFFFFF] border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), padding: moderateScale(8) }}
                        >
                            <View className="flex-row gap-3 justify-center">
                                <Image
                                    source={{
                                        uri: "https://i.pinimg.com/736x/36/b7/fa/36b7fa818d446a5ccba21e95f2e738b0.jpg"
                                    }}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    style={{
                                        width: moderateScale(62),
                                        height: moderateScale(62),
                                        borderRadius: moderateScale(16)
                                    }}
                                />
                            
                                <View className='gap-2 flex-1 justify-center'>
                                    <Text
                                        className='text-[#1F1F1F] font-bold'
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        The Burger King
                                    </Text>
                            
                                    <View className='items-center flex-row gap-3'>
                                        <View
                                            className={`items-center justify-center ${
                                                isOpen ? "bg-[#22A06B]" : "bg-[#7A7D81]"
                                            }`}
                                            style={{
                                                paddingHorizontal: scale(7),
                                                paddingVertical: verticalScale(3),
                                                borderRadius: moderateScale(10)
                                            }}
                                        >
                                            <Text
                                                className="text-white font-bold"
                                                style={{ fontSize: moderateScale(8) }}
                                            >
                                                {isOpen ? "OPEN NOW" : "CLOSE"}
                                            </Text>
                                        </View>
                                        
                                        <View
                                            className="flex-row gap-1 items-center bg-[#F8D56A] self-start"
                                            style={{
                                                paddingHorizontal: moderateScale(6),
                                                paddingVertical: moderateScale(2.5),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <RatingIcon width={moderateScale(12)} height={moderateScale(12)} color="#5c4639" />

                                            <Text
                                                className="font-bold text-[#5c4639]"
                                                style={{ fontSize: moderateScale(10), marginRight: moderateScale(2) }}
                                            >
                                                4.9
                                            </Text>
                                        </View>
                                    </View>

                                    <View className='items-center flex-row gap-3'>
                                        <View className='justify-center items-center flex-row gap-1'>
                                            <ClockIcon width={moderateScale(14)} height={moderateScale(14)} color={"#1F1F1F"} />

                                            <Text
                                                className='text-[#1F1F1F]/75 font-medium'
                                                style={{ fontSize: moderateScale(11) }}
                                            >
                                                20-25 mins
                                            </Text>
                                        </View>

                                        <Text
                                            className='text-[#1F1F1F]/75 font-medium'
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            ₹300 for two
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-3 mt-5">
                            <View
                                className="flex-row items-center bg-[#E8B93F]/15 border border-[#E8B93F]/25 py-4 px-3 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(55),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <CouponIcon width={moderateScale(28)} height={moderateScale(28)} color={"#3F2516"} />

                                <View className='justify-center gap-1'>
                                    <Text
                                        className="text-[#1F1F1F] font-medium"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        FLAT ₹125 OFF
                                    </Text>
                            
                                    <Text
                                        className="text-[#1F1F1F]/75 font-semibold"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        use BROTHER125
                                    </Text>
                                </View>
                            </View>
                        
                            <View
                                className="flex-row items-center bg-[#E8B93F]/15 border border-[#E8B93F]/25 py-4 px-3 gap-2"
                                style={{
                                    width: cardWidth,
                                    height: moderateScale(55),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <DessertIcon width={moderateScale(24)} height={moderateScale(24)} color={"#3F2516"} />

                                <View className='justify-center gap-1'>
                                    <Text
                                        className="text-[#1F1F1F] font-medium"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        FREE DESSERT
                                    </Text>
                            
                                    <Text
                                        className="text-[#1F1F1F]/75 font-semibold"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        On Orders {">"} ₹500
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{ marginTop: verticalScale(16) }}
                        >
                            <SearchBar
                                value={search}
                                onChangeText={setsearch}
                                placeholder="Search in The Burfer King..."
                                RightIcon={MicIcon}
                                rightIconColor="#1F1F1F"
                                onRightPress={() => {}}
                            />
                        </View>

                        <View
                            className="w-full"
                            style={{ marginTop: verticalScale(8) }}
                        >
                            <ScrollView
                                horizontal
                                nestedScrollEnabled
                                directionalLockEnabled
                                showsHorizontalScrollIndicator={false}
                                className="-mx-5"
                                contentContainerStyle={{
                                    paddingHorizontal: scale(14),
                                    gap: scale(8)
                                }}
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
                                                        numberOfLines={1}
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
                            </ScrollView>

                            <Text
                                className="text-[#1F1F1F] font-bold"
                                style={{
                                    fontSize: moderateScale(15),
                                    marginTop: verticalScale(6)
                                }}
                            >
                                {TAB_TITLES[activeTab as keyof typeof TAB_TITLES]}
                            </Text>
                        </View>
                    </View>
                }
                ListFooterComponent={
                    <View>
                        <View
                            className="flex-row items-center w-full"
                            style={{ marginTop: verticalScale(18) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold flex-1"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Combos
                            </Text>

                            <Text
                                className="text-[#3F2516] font-bold"
                                style={{ fontSize: moderateScale(12) }}
                            >
                                SAVE UP TO 30%
                            </Text>
                        </View>

                        <FlatList
                            horizontal
                            data={COMBO_OFFERS}
                            renderItem={renderComboItem}
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

                        <Text
                            className="text-[#1F1F1F] font-bold mt-5"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Frequently Ordered Together
                        </Text>

                        <FlatList
                            data={FREQUENTLY_ORDERED_TOGETHER}
                            horizontal
                            nestedScrollEnabled
                            directionalLockEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            className="-mx-5 mt-3"
                            contentContainerStyle={{
                                paddingHorizontal: scale(14),
                                gap: moderateScale(10)
                            }}
                            renderItem={({ item }) => (
                                <FoodCard
                                    item={item}
                                    onPress={() => {}}
                                    onAddPress={() =>
                                        console.log("Add:", item.id)
                                    }
                                />
                            )}
                        />
                    </View>
                }
            />
        </SafeAreaView>
    )
}