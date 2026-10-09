import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CouponIcon from '@/assets/icon/CouponFilledIcon.svg'
import DessertIcon from '@/assets/icon/DessertIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import TimerIcon from '@/assets/icon/TimerIcon.svg'
import SearchBar from '@/components/SearchBar'
import { COLORS } from '@/constant/colors'
import { COMBO_OFFERS } from '@/constant/ComboData'
import { popularitems } from "@/constant/PopularItemData"
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import RestaurantMenuItemCard from '../Details/components/RestaurantMenuItemCard'
import FoodCard, { MenuItem } from '../Home/components/FoodCard'
import ComboCard from './Components/ComboCard'

const TABS = ["Popular", "Recommended", "Main Course"]

const TAB_TITLES = {
    Popular: "Popular Items",
    Recommended: "Recommended Items",
    "Main Course": "Main Course",
}

export const FREQUENTLY_ADDED_TOGETHER: MenuItem[] = [
    {
        id: "restaurant-1-french-fries",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "French Fries",
        description: "Crispy golden french fries",
        imageUrl:
            "https://i.pinimg.com/736x/73/7e/d9/737ed93987aae98a76fc2e5f12fc0ecc.jpg",

        isAvailable: true,
        isVeg: true,

        price: 99.00,

        preparationTime: 15,
        deliveryFee: "25"
    },

    {
        id: "restaurant-1-coke",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "Coke",
        description: "Chilled soft drink",
        imageUrl:
            "https://i.pinimg.com/1200x/60/70/9b/60709bf9dee58b89448c04a6a518b45b.jpg",

        isAvailable: false,
        isVeg: true,

        price: 59.00,

        preparationTime: 5,
        deliveryFee: "25"
    },

    {
        id: "restaurant-1-garlic-bread",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "Garlic Bread",
        description: "Crispy garlic bread with herbs",
        imageUrl:
            "https://i.pinimg.com/1200x/89/52/62/8952620f20999169e06c97f10a5eb24b.jpg",

        isAvailable: true,
        isVeg: true,

        price: 129.00,

        preparationTime: 12,
        deliveryFee: "25"
    },

    {
        id: "restaurant-1-brownie",

        restaurant: {
            id: "restaurant-1",
            name: "Onebite",
            LogoUrl: null,
            isOpen: true
        },

        name: "Brownie",
        description: "Rich chocolate brownie",
        imageUrl:
            "https://i.pinimg.com/736x/18/39/b5/1839b51798c581c9219f3d7ccd62cbda.jpg",

        isAvailable: true,
        isVeg: true,

        price: 99.00,

        preparationTime: 10,
        deliveryFee: "25"
    }
]

export default function RestaurantMenuScreen(){
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
                    <RestaurantMenuItemCard
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
                    marginBottom: verticalScale(8),
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
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Restaurant Menu
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Browse your favorites and find something new
                    </Text>
                </View>

                {/* <View
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
                </View> */}
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
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="items-center"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                padding: moderateScale(8),
                                borderWidth: moderateScale(0.5)
                            }}
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
                                        className='font-bold'
                                        style={{
                                            fontSize: moderateScale(14),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        The Burger King
                                    </Text>
                            
                                    <View className='items-center flex-row gap-3'>
                                        <View
                                            className='items-center justify-center'
                                            style={{
                                                backgroundColor: isOpen
                                                    ? COLORS.activeStatusTextColor
                                                    : COLORS.neutralSurfaceColor,
                                                paddingHorizontal: scale(7),
                                                paddingVertical: verticalScale(3),
                                                borderRadius: moderateScale(10)
                                            }}
                                        >
                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(8),
                                                    color: isOpen
                                                        ? COLORS.primaryBackgroundColor
                                                        : COLORS.primaryTextColor
                                                }}
                                            >
                                                {isOpen ? "OPEN NOW" : "CLOSE"}
                                            </Text>
                                        </View>
                                        
                                        <View
                                            className="flex-row gap-1 items-center self-start"
                                            style={{
                                                backgroundColor: COLORS.accentLightColor,
                                                paddingHorizontal: moderateScale(6),
                                                paddingVertical: moderateScale(2.5),
                                                borderRadius: moderateScale(12)
                                            }}
                                        >
                                            <RatingIcon width={moderateScale(12)} height={moderateScale(12)} color={COLORS.primaryColor} />

                                            <Text
                                                className="font-bold"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    marginRight: moderateScale(2),
                                                    color: COLORS.primaryColor
                                                }}
                                            >
                                                4.9
                                            </Text>
                                        </View>
                                    </View>

                                    <View className='items-center flex-row gap-3'>
                                        <View className='justify-center items-center flex-row gap-1'>
                                            <TimerIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryTextColor} />

                                            <Text
                                                className='font-medium'
                                                style={{
                                                    fontSize: moderateScale(11),
                                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                                }}
                                            >
                                                20-25 mins
                                            </Text>
                                        </View>

                                        <Text
                                            className='font-medium'
                                            style={{
                                                fontSize: moderateScale(11),
                                                color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                            }}
                                        >
                                            ₹300 for two
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-3 mt-5">
                            <View
                                className="flex-row items-center py-4 px-3 gap-2"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                                    borderColor: hexToRgba(COLORS.accentColor, 0.15),
                                    borderWidth: moderateScale(0.7),
                                    width: cardWidth,
                                    height: moderateScale(55),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <CouponIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} />

                                <View className='justify-center gap-1'>
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        FLAT ₹125 OFF
                                    </Text>
                            
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        use BROTHER125
                                    </Text>
                                </View>
                            </View>
                        
                            <View
                                className="flex-row items-center py-4 px-3 gap-2"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                                    borderColor: hexToRgba(COLORS.accentColor, 0.15),
                                    borderWidth: moderateScale(0.7),
                                    width: cardWidth,
                                    height: moderateScale(55),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <DessertIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} />

                                <View className='justify-center gap-1'>
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        FREE DESSERT
                                    </Text>
                            
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
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
                                                        className={isActive ? "font-semibold" : "font-medium"}
                                                        style={{
                                                            color: isActive
                                                                ? COLORS.primaryColor
                                                                : hexToRgba(COLORS.primaryTextColor, 0.65),
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
                                                            className="absolute bottom-0"
                                                            style={{
                                                                backgroundColor: COLORS.primaryColor,
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
                                className="font-semibold"
                                style={{
                                    color: COLORS.primaryTextColor,
                                    fontSize: moderateScale(15),
                                    marginTop: verticalScale(4)
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
                                className="font-semibold flex-1"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Combos
                            </Text>

                            <Text
                                className="font-semibold"
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryColor
                                }}
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
                            className="font-semibold mt-5"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Frequently Ordered Together
                        </Text>

                        <FlatList
                            data={FREQUENTLY_ADDED_TOGETHER}
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