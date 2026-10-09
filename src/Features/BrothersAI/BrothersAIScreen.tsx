import AiBrainIcon from '@/assets/icon/AiBrainIcon.svg'
import SparkleIcon from '@/assets/icon/AiSparklesIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import DicesIcon from '@/assets/icon/DicesIcon.svg'
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import RobotIcon from '@/assets/icon/RobotIcon.svg'
import SparkleIcon2 from '@/assets/icon/SparkleIcon.svg'
import SearchBar from '@/components/SearchBar'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from "expo-router"
import { useEffect, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { scheduleOnRN } from "react-native-worklets"

const MOOD_CATEGORIES = [
    {
        id: "1",
        title: "Happy",
        emoji: "😊",
        value: "happy"
    },
    {
        id: "2",
        title: "Lazy",
        emoji: "😴",
        value: "lazy"
    },
    {
        id: "3",
        title: "Date Night",
        emoji: "💘",
        value: "date-night"
    },
    {
        id: "4",
        title: "Comfort Food",
        emoji: "🤤",
        value: "comfort-food"
    },
    {
        id: "5",
        title: "Healthy",
        emoji: "🥗",
        value: "healthy"
    },
    {
        id: "6",
        title: "Spicy",
        emoji: "🌶️",
        value: "spicy"
    },
    {
        id: "7",
        title: "Celebration",
        emoji: "🥳",
        value: "celebration"
    },
    {
        id: "8",
        title: "Chill",
        emoji: "😌",
        value: "chill"
    }
]

const RAINY_WEATHER = {
    id: "1",
    title: "Rainy Weather",
    tags: [
        {
            id: "1",
            title: "Hot Soup",
        },
        {
            id: "2",
            title: "Tea",
        },
    ],
}

const MIN_BUDGET = 100
const MAX_BUDGET = 1000
const INITIAL_BUDGET = 100
const THUMB_SIZE = moderateScale(18)
const THUMB_RADIUS = moderateScale(9)
const THUMB_HALF = THUMB_SIZE / 2

export default function BrothersAIScreen(){
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedReview, setSelectedReview] = useState("")
    const [budget, setBudget] = useState(INITIAL_BUDGET)

    const sliderWidth = useSharedValue(0)

    const progress = useSharedValue(
        (INITIAL_BUDGET - MIN_BUDGET) /
            (MAX_BUDGET - MIN_BUDGET)
    )

    const startProgress = useSharedValue(0)

    const updateBudgetText = (value: number) => {
        const steppedValue = Math.round(value / 50) * 50

        const clampedValue = Math.max(
            MIN_BUDGET,
            Math.min(steppedValue, MAX_BUDGET)
        )

        setBudget(clampedValue)
    }

    const sliderGesture = Gesture.Pan()
        .onBegin(() => {
            startProgress.value = progress.value
        })
        .onUpdate((event) => {
            if (sliderWidth.value <= 0) {
                return
            }

            const movement = event.translationX / sliderWidth.value

            const newProgress = Math.max(
                0,
                Math.min(
                    1,
                    startProgress.value + movement
                )
            )

            progress.value = newProgress

            const value = MIN_BUDGET + newProgress * (MAX_BUDGET - MIN_BUDGET)

            scheduleOnRN(updateBudgetText, value)
        })

    const activeTrackStyle = useAnimatedStyle(() => {
        return {
            width: sliderWidth.value * progress.value
        }
    })

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: sliderWidth.value * progress.value - THUMB_HALF
                }
            ]
        }
    })

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
                    marginBottom: verticalScale(12),
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
                        Brothers AI
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Your smart assistant for faster, easier ordering
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
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <View className='w-full justify-center items-center'>
                            <View
                                className="items-center justify-center"
                                style={{
                                    width: moderateScale(140),
                                    height: moderateScale(140)
                                }}
                            >
                                <SparkleIcon2
                                    width={moderateScale(12)}
                                    height={moderateScale(12)}
                                    color="#E9C985"
                                    style={{
                                        position: "absolute",
                                        left: moderateScale(8),
                                        top: moderateScale(80)
                                    }}
                                />

                                <SparkleIcon2
                                    width={moderateScale(10)}
                                    height={moderateScale(10)}
                                    color="#E9C985"
                                    style={{
                                        position: "absolute",
                                        right: moderateScale(18),
                                        top: moderateScale(30)
                                    }}
                                />

                                <SparkleIcon2
                                    width={moderateScale(8)}
                                    height={moderateScale(8)}
                                    color="#E9C985"
                                    style={{
                                        position: "absolute",
                                        right: moderateScale(34),
                                        top: moderateScale(15)
                                    }}
                                />

                                <View
                                    className="items-center justify-center"
                                    style={{
                                        width: moderateScale(100),
                                        height: moderateScale(100),
                                        borderRadius: moderateScale(50),
                                        backgroundColor: "#EEE9FF"
                                    }}
                                >
                                    <LinearGradient
                                        colors={["#8b6fe9", "#5B36C9"]}
                                        start={{ x: 0.2, y: 0 }}
                                        end={{ x: 0.8, y: 1 }}
                                        style={{
                                            width: moderateScale(90),
                                            height: moderateScale(90),
                                            borderRadius: moderateScale(45),
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <RobotIcon width={moderateScale(48)} height={moderateScale(48)} color={"#FFFFFF"} />
                                    </LinearGradient>
                                </View>

                                <View
                                    className="absolute items-center justify-center"
                                    style={{
                                        backgroundColor: COLORS.primaryBackgroundColor,
                                        right: moderateScale(22),
                                        bottom: moderateScale(22),

                                        width: moderateScale(30),
                                        height: moderateScale(30),
                                        borderRadius: moderateScale(17),

                                        shadowColor: COLORS.primaryTextColor,
                                        shadowOpacity: 0.12,
                                        shadowRadius: moderateScale(6),
                                        shadowOffset: {
                                            width: 0,
                                            height: moderateScale(2)
                                        },
                                        elevation: 4
                                    }}
                                >
                                    <SparkleIcon width={moderateScale(16)} height={moderateScale(16)} color="#7052D8" strokeWidth={1.8} />
                                </View>
                            </View>
                        </View>

                        <View
                            className='items-center justify-center p-5 mx-2'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(22),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <Text
                                className='text-center font-semibold'
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Good Evening Harsh, 👋
                            </Text>

                            <Text
                                className='text-center font-medium mt-2'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                What can Brothers AI curate for you{"\n"}tonight?
                            </Text>
                        </View>

                        <View
                            style={{
                                marginTop: verticalScale(14),
                                marginBottom: verticalScale(10)
                            }}
                        >
                            <SearchBar
                                value={search}
                                onChangeText={setsearch}
                                placeholder="Ask Anything..."
                            />
                        </View>

                        <Text
                            className="font-semibold mt-2"
                            style={{
                                fontSize: moderateScale(15),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Curate by Mood
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
                            {MOOD_CATEGORIES.map((category) => {
                                const isSelected = selectedReview === category.title
                                
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.95}
                                        onPress={() => {
                                            setSelectedReview((prev) =>
                                                prev === category.title ? "" : category.title
                                            )
                                        }}
                                        className="items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected
                                                ? COLORS.primaryColor
                                                : COLORS.secondaryBackgroundColor,
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(17),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: moderateScale(0.5),
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                                        }}
                                    >
                                        <Text
                                            className="font-medium"
                                            style={{
                                                fontSize: moderateScale(13),
                                                color: isSelected
                                                    ? COLORS.primaryBackgroundColor
                                                    : COLORS.primaryTextColor
                                            }}
                                        >
                                            {category.emoji}{" "}{category.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>

                        <View
                            className="flex-row items-center w-full"
                            style={{ marginTop: verticalScale(14) }}
                        >
                            <Text
                                className="font-semibold flex-1"
                                style={{
                                    fontSize: moderateScale(15),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Today's Best Match
                            </Text>

                            <Text
                                className="text-[#7052D8] font-bold"
                                style={{ fontSize: moderateScale(16) }}
                            >
                                98%
                            </Text>
                        </View>

                        <View
                            className="w-full overflow-hidden"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(22),
                                marginTop: moderateScale(12)
                            }}
                        >
                            <View
                                className="w-full p-2"
                                style={{ height: verticalScale(120) }}
                            >
                                <Image
                                    source={{
                                        uri: "https://i.pinimg.com/736x/0d/fa/d6/0dfad6a8ef80b3b11fd242bf480091e8.jpg"
                                    }}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: moderateScale(18)
                                    }}
                                />
                            </View>

                            <View className="px-4 pb-4 pt-2">
                                <View
                                    className="flex-row self-start items-center justify-center gap-1"
                                    style={{
                                        backgroundColor: COLORS.accentLightColor,
                                        paddingHorizontal: moderateScale(10),
                                        paddingVertical: moderateScale(4),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(10),
                                            color: COLORS.primaryColor
                                        }}
                                    >
                                        AI CHOICE
                                    </Text>
                                </View>

                                <Text
                                    className='font-semibold mt-2'
                                    style={{
                                        fontSize: moderateScale(15),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    A Royal Indian Feast
                                </Text>

                                <Text
                                    className='font-medium mt-1'
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Rich, spicy and satisfying.
                                </Text>

                                <View
                                    className=" absolute flex-row items-center justify-center gap-1"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        right: moderateScale(12),
                                        bottom: moderateScale(12),
                                        paddingHorizontal: moderateScale(8),
                                        paddingVertical: moderateScale(4),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.secondaryColor} />

                                    <Text
                                        className="font-bold"
                                        style={{
                                            color: COLORS.secondaryColor,
                                            fontSize: moderateScale(12),
                                            marginRight: moderateScale(2)
                                        }}
                                    >
                                        4.9
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-3 items-start py-4 pl-4 pr-2"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderLeftColor: "#7052D8",
                                borderLeftWidth: moderateScale(3),
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(16)
                            }}
                        >
                            <View
                                className="bg-[#7052D8]/15 items-center justify-center"
                                style={{
                                    borderRadius: moderateScale(14),
                                    width: moderateScale(44),
                                    height: moderateScale(44)
                                }}
                            >
                                <AiBrainIcon width={moderateScale(22)} height={moderateScale(22)} color="#7052D8" strokeWidth={1.8} />
                            </View>

                            <View className="flex-1">
                                <Text
                                    className="text-[#7052D8] font-bold uppercase"
                                    style={{
                                        fontSize: moderateScale(11),
                                        letterSpacing: 0.5
                                    }}
                                >
                                    AI Insight
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                        fontSize: moderateScale(12),
                                        lineHeight: moderateScale(17),
                                        marginTop: verticalScale(4)
                                    }}
                                >
                                    Because it's a rainy Friday and you love premium cuts.
                                    This dish matches your preference for high-protein meals
                                    with sophisticated flavors.
                                </Text>
                            </View>
                        </View>

                        <View
                            className="items-start p-4"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(16)
                            }}
                        >
                            <Text
                                className='font-semibold'
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                🌧️ Weather Forecast
                            </Text>
                            
                            <View
                                className='w-full justify-center py-3 px-3'
                                style={{
                                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.55),
                                    marginTop: verticalScale(10),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <View className='flex-row items-center'>
                                    <Text
                                        className="font-semibold ml-2 flex-1"
                                        style={{
                                            fontSize: moderateScale(14),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        {RAINY_WEATHER.title}
                                    </Text>

                                    <ArrowRightIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryTextColor} strokeWidth={1.8} />
                                </View>

                                <View
                                    className="flex-row flex-wrap"
                                    style={{
                                        gap: scale(8),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    {RAINY_WEATHER.tags.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            activeOpacity={0.85}
                                            onPress={() => {}}
                                            style={{
                                                backgroundColor: COLORS.secondaryBackgroundColor,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderWidth: moderateScale(0.5),
                                                borderRadius: moderateScale(18),
                                                paddingHorizontal: scale(10),
                                                paddingVertical: verticalScale(4)
                                            }}
                                        >
                                            <Text
                                                className="font-medium"
                                                style={{
                                                    fontSize: moderateScale(12),
                                                    color: COLORS.primaryTextColor
                                                }}
                                            >
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View
                            className="items-start py-4 px-5"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(16),
                            }}
                        >
                            <View className="w-full flex-row items-center justify-between">
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Budget Assistant
                                </Text>

                                <Text
                                    className="text-[#7052D8] font-bold"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    ₹{budget}
                                </Text>
                            </View>

                            <GestureDetector gesture={sliderGesture}>
                                <View
                                    className="w-full justify-center"
                                    onLayout={(event) => {
                                        sliderWidth.value = event.nativeEvent.layout.width
                                    }}
                                    style={{
                                        marginTop: verticalScale(14),
                                        height: moderateScale(34)
                                    }}
                                >
                                    <View
                                        pointerEvents="none"
                                        className="absolute w-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            height: moderateScale(5),
                                            borderRadius: moderateScale(10)
                                        }}
                                    />

                                    <Animated.View
                                        pointerEvents="none"
                                        className="absolute"
                                        style={[
                                            {
                                                backgroundColor: COLORS.secondaryColor,
                                                height: moderateScale(5),
                                                borderRadius: moderateScale(10)
                                            },
                                            activeTrackStyle
                                        ]}
                                    />

                                    <Animated.View
                                        pointerEvents="none"
                                        className="absolute"
                                        style={[
                                            {
                                                backgroundColor: COLORS.secondaryColor,
                                                width: THUMB_SIZE,
                                                height: THUMB_SIZE,
                                                borderRadius: THUMB_RADIUS,
                                                elevation: 4
                                            },
                                            thumbStyle
                                        ]}
                                    />
                                </View>
                            </GestureDetector>

                            <View
                                className="w-full flex-row items-center justify-between"
                                style={{ marginTop: verticalScale(2) }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    ₹{MIN_BUDGET}
                                </Text>

                                <Text
                                    className="font-semibold uppercase"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                        fontSize: moderateScale(9),
                                        letterSpacing: 0.8
                                    }}
                                >
                                    Budget Range
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    ₹{MAX_BUDGET}+
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center mx-2"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                marginTop: verticalScale(20),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <DicesIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />
                                                
                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryBackgroundColor
                                }}
                            >
                                Surprise Me
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </SafeAreaView>
    )
}