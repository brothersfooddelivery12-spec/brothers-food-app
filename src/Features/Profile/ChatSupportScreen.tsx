import AddCircleIcon from '@/assets/icon/AddCircleIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import DateIcon from '@/assets/icon/DateIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import SendHorizontalIcon from '@/assets/icon/SendHorizontalIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import ChatMessage, { ChatMessageItem } from './Components/ChatMessage'

const CHAT_MESSAGES: ChatMessageItem[] = [
    {
        id: "1",
        sender: "support",
        message:
            "Hello! This is Aarav from Brothers. I've reviewed your active order #BR-9942. How can I assist you with your culinary experience today?",
        time: "14:25",
    },
    {
        id: "2",
        sender: "user",
        message:
            "Hi Aarav, my delivery is running a bit late. The tracker says it should have arrived 10 minutes ago. Any update?",
        time: "14:26",
        status: "read",
    },
]

const QUICK_SUPPORT_OPTIONS = [
    {
        id: "1",
        title: "Order Delay",
    },
    {
        id: "2",
        title: "Refund Status",
    },
    {
        id: "3",
        title: "Missing Item",
    },
    {
        id: "4",
        title: "Wrong Order",
    },
    {
        id: "5",
        title: "Payment Issue",
    },
    {
        id: "6",
        title: "Cancel Order",
    }
]

export default function ChatSupportScreen(){
    const isOnline = true
    const [message, setMessage] = useState("")

    const renderMessage = useCallback(
        ({ item }: { item: ChatMessageItem }) => (
            <ChatMessage item={item} />
        ),
        []
    )

    const handleSendMessage = () => {
        const trimmedMessage = message.trim()

        if (!trimmedMessage) return

        console.log("Message:", trimmedMessage)

        // Send message to API / socket here

        setMessage("")
    }

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
                        Support Chat
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Get real-time help from our support team
                    </Text>
                </View>
            </View>

            <KeyboardAvoidingView
                className="flex-1"
                behavior="padding"
                keyboardVerticalOffset={0}
            >
                <FlatList
                    data={CHAT_MESSAGES}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: scale(14)
                    }}
                    ListHeaderComponent={
                        <>
                            <View
                                className='flex-row gap-3 p-3'
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    marginTop: verticalScale(5),
                                    borderRadius: moderateScale(18)
                                }}
                            >
                                <View className="relative self-start">
                                    <Image
                                        source={require("@/assets/images/customer-care.png")}
                                        contentFit="cover"
                                        cachePolicy="memory-disk"
                                        style={{
                                            width: moderateScale(62),
                                            height: moderateScale(62),
                                            borderRadius: moderateScale(90),
                                            borderWidth: 1.5,
                                            borderColor: COLORS.accentLightColor
                                        }}
                                    />
                                
                                    <View
                                        className="absolute items-center justify-center"
                                        style={{
                                            backgroundColor: isOnline
                                                ? COLORS.activeStatusTextColor
                                                : COLORS.neutralSurfaceColor,
                                            borderColor: COLORS.primaryBackgroundColor,
                                            borderWidth: 1.5,
                                            width: moderateScale(15),
                                            height: moderateScale(15),
                                            bottom: verticalScale(0),
                                            right: moderateScale(6),
                                            alignSelf: "flex-end",
                                            borderRadius: moderateScale(90)
                                        }}
                                    >
                                    </View>
                                </View>

                                <View className='justify-center items-start'>
                                    <Text
                                        className='font-bold'
                                        style={{
                                            fontSize: moderateScale(16),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Aarav
                                    </Text>

                                    <Text
                                        className='font-medium'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Customer Service Specialist
                                    </Text>

                                    <View
                                        className="mt-2 flex-row items-center justify-center gap-1"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                            paddingHorizontal: moderateScale(9),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} />

                                        <Text
                                            className="font-bold"
                                            style={{
                                                color: COLORS.primaryColor,
                                                fontSize: moderateScale(10),
                                                marginRight: moderateScale(2)
                                            
                                            }}
                                        >
                                            4.5
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                fontSize: moderateScale(9),
                                                color: COLORS.primaryColor
                                            }}
                                        >
                                            (5,200 + Ratings)
                                        </Text>
                                    </View>
                                </View>    
                            </View>

                            <View className='w-full items-center justify-center mt-6 mb-6'>
                                <View
                                    className='flex-row justify-center'
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                        gap: moderateScale(4),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: moderateScale(10),
                                        paddingVertical: moderateScale(4)
                                    }}
                                >
                                    <DateIcon width={moderateScale(16)} height={moderateScale(16)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={1.5} />

                                    <Text
                                        className='font-normal'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Today, 14:24
                                    </Text>
                                </View>
                            </View>
                        </>
                    }
                    ListFooterComponent={
                        <>
                            <View className="self-start -mt-10 -ml-4 flex-row items-center">
                                <LottieView
                                    source={require("@/assets/animations/Typing.json")}
                                    autoPlay
                                    loop
                                    style={{
                                        width: moderateScale(62),
                                        height: moderateScale(52)
                                    }}
                                />

                                <Text
                                    className='font-medium -ml-2'
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Aarav is typing...
                                </Text>
                            </View>
                        </>
                    }
                />

                <View
                    style={{
                        backgroundColor: COLORS.primaryBackgroundColor,
                        paddingHorizontal: scale(14),
                        paddingBottom: verticalScale(8),
                    }}
                >
                    <ScrollView
                        horizontal
                        nestedScrollEnabled
                        directionalLockEnabled
                        showsHorizontalScrollIndicator={false}
                        className="-mx-5 mb-4 mt-4"
                        contentContainerStyle={{
                            paddingHorizontal: scale(14),
                            gap: scale(8)
                        }}
                    >
                        {QUICK_SUPPORT_OPTIONS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.85}
                                onPress={() => {}}
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.7),
                                    borderRadius: moderateScale(18),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(6)
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
                    </ScrollView>
    
                    <View className="flex-row items-center gap-3 w-full">
                        <View
                            className="flex-1 flex-row items-center"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(22),
                                paddingHorizontal: scale(13),
                                height: verticalScale(46)
                            }}    
                        >
                            <AddCircleIcon height={moderateScale(24)} width={moderateScale(24)} color={hexToRgba(COLORS.primaryTextColor, 0.75)} strokeWidth={1.5} />
    
                            <TextInput
                                placeholder="Type a message..."
                                placeholderTextColor={COLORS.placeholderTextColor}
                                multiline={false}
                                numberOfLines={1}
                                value={message}
                                onChangeText={setMessage}
                                className="flex-1 font-medium"
                                style={{
                                    fontSize: moderateScale(14),
                                    marginLeft: moderateScale(8),
                                    color: COLORS.inputTextColor
                                }}
                                selectionColor={COLORS.selectionColor}
                            />
                        </View>
    
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={handleSendMessage}
                            disabled={!message.trim()}
                            className="items-center justify-center"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                width: moderateScale(52),
                                height: moderateScale(52),
                                borderRadius: moderateScale(28)
                            }}
                        >
                            <SendHorizontalIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} style={{ marginLeft: moderateScale(2) }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}