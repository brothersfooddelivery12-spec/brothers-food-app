import AiBrainIcon from '@/assets/icon/AiBrainIcon.svg'
import SparkleIcon from '@/assets/icon/AiSparklesIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import DicesIcon from '@/assets/icon/DicesIcon.svg'
import MicIcon from '@/assets/icon/MicIcon.svg'
import RatingIcon from "@/assets/icon/RatingIcon.svg"
import RobotIcon from '@/assets/icon/RobotIcon.svg'
import SparkleIcon2 from '@/assets/icon/SparkleIcon.svg'
import SearchBar from '@/components/SearchBar'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from "expo-router"
import { useEffect, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
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
    const insets = useSafeAreaInsets()
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
                    marginBottom: verticalScale(12),
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
                        Brothers AI
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
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
                    paddingBottom: insets.bottom + verticalScale(25)
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
                                    className="absolute items-center justify-center bg-white"
                                    style={{
                                        right: moderateScale(22),
                                        bottom: moderateScale(22),

                                        width: moderateScale(30),
                                        height: moderateScale(30),
                                        borderRadius: moderateScale(17),

                                        shadowColor: "#000",
                                        shadowOpacity: 0.12,
                                        shadowRadius: moderateScale(6),
                                        shadowOffset: {
                                            width: 0,
                                            height: moderateScale(2)
                                        },
                                        elevation: 4
                                    }}
                                >
                                    <SparkleIcon width={moderateScale(16)} height={moderateScale(16)} color="#7052D8" />
                                </View>
                            </View>
                        </View>

                        <View
                            className='items-center justify-center p-5 mx-2 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(22) }}
                        >
                            <Text
                                className='text-[#1F1F1F] text-center font-semibold'
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Good Evening Harsh, 👋
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 text-center font-medium mt-2'
                                style={{ fontSize: moderateScale(12) }}
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
                                RightIcon={MicIcon}
                                rightIconColor="#1F1F1F"
                                onRightPress={() => {}}
                            />
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-semibold mt-2"
                            style={{ fontSize: moderateScale(15) }}
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
                                        className={`items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#FFFFFF]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(17),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: isSelected ? 1 : 1,
                                            borderColor: "rgba(31, 31, 31, 0.10)"
                                        }}
                                    >
                                        <Text
                                            className={`font-medium ${
                                                isSelected ? "text-white" : "text-[#1F1F1F]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
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
                                className="text-[#1F1F1F] font-semibold flex-1"
                                style={{ fontSize: moderateScale(15) }}
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
                            className="w-full overflow-hidden bg-white border border-[#1F1F1F]/10"
                            style={{
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
                                    className="flex-row self-start items-center justify-center gap-1 bg-[#F8D56A]"
                                    style={{
                                        paddingHorizontal: moderateScale(10),
                                        paddingVertical: moderateScale(4),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <Text
                                        className='text-[#3F2516] font-semibold'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        AI CHOICE
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#1F1F1F] font-semibold mt-2'
                                    style={{ fontSize: moderateScale(15)}}
                                >
                                    A Royal Indian Feast
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium mt-1'
                                    style={{ fontSize: moderateScale(11)}}
                                >
                                    Rich, spicy and satisfying.
                                </Text>

                                <View
                                    className=" absolute flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                                    style={{
                                        right: moderateScale(12),
                                        bottom: moderateScale(12),
                                        paddingHorizontal: moderateScale(8),
                                        paddingVertical: moderateScale(4),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <RatingIcon width={moderateScale(16)} height={moderateScale(16)} color="#5c4639" />

                                    <Text
                                        className="font-bold text-[#5c4639]"
                                        style={{ fontSize: moderateScale(12), marginRight: moderateScale(2) }}
                                    >
                                        4.9
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-3 items-start py-4 pl-4 pr-2 bg-white border border-[#1F1F1F]/10"
                            style={{
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
                                    className="text-[#1F1F1F]/70 font-medium"
                                    style={{
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
                            className="items-start p-4 bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(16)
                            }}
                        >
                            <Text
                                className='text-[#1F1F1F] font-semibold'
                                style={{ fontSize: moderateScale(14) }}
                            >
                                🌧️ Weather Forecast
                            </Text>
                            
                            <View
                                className='bg-[#F5F5F5] w-full justify-center py-3 px-3'
                                style={{
                                    marginTop: verticalScale(10),
                                    borderRadius: moderateScale(16)
                                }}
                            >
                                <View className='flex-row items-center'>
                                    <Text
                                        className="text-[#1F1F1F] font-semibold ml-2 flex-1"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        {RAINY_WEATHER.title}
                                    </Text>

                                    <ArrowRightIcon width={moderateScale(16)} height={moderateScale(16)} color={"#1F1F1F"} strokeWidth={1.8} />
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
                                            className="bg-white border border-[#1F1F1F]/10"
                                            style={{
                                                borderRadius: moderateScale(18),
                                                paddingHorizontal: scale(10),
                                                paddingVertical: verticalScale(4)
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
                            </View>
                        </View>

                        <View
                            className="items-start py-4 px-5 bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(16),
                            }}
                        >
                            <View className="w-full flex-row items-center justify-between">
                                <Text
                                    className="text-[#1F1F1F] font-semibold"
                                    style={{ fontSize: moderateScale(14) }}
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
                                        className="absolute w-full bg-[#1F1F1F]/10"
                                        style={{
                                            height: moderateScale(5),
                                            borderRadius: moderateScale(10)
                                        }}
                                    />

                                    <Animated.View
                                        pointerEvents="none"
                                        className="absolute bg-[#5C4639]"
                                        style={[
                                            {
                                                height: moderateScale(5),
                                                borderRadius: moderateScale(10)
                                            },
                                            activeTrackStyle
                                        ]}
                                    />

                                    <Animated.View
                                        pointerEvents="none"
                                        className="absolute bg-[#3F2516]"
                                        style={[
                                            {
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
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    ₹{MIN_BUDGET}
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-semibold uppercase"
                                    style={{
                                        fontSize: moderateScale(9),
                                        letterSpacing: 0.8
                                    }}
                                >
                                    Budget Range
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    ₹{MAX_BUDGET}+
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center bg-[#3F2516] mx-2"
                            style={{
                                marginTop: verticalScale(20),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <DicesIcon width={moderateScale(20)} height={moderateScale(20)} color={"#FFFFFF"} strokeWidth={1.8} />
                                                
                            <Text
                                className="text-[#FFFFFF] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
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