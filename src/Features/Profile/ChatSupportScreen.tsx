import AddCircleIcon from '@/assets/icon/AddCircleIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import DateIcon from '@/assets/icon/DateIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import SendHorizontalIcon from '@/assets/icon/SendHorizontalIcon.svg'
import { Image } from 'expo-image'
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
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
    const insets = useSafeAreaInsets()
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
                        Support Chat
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
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
                                className='bg-[#FFFFFF] border border-[#1F1F1F]/10 flex-row gap-3 p-3'
                                style={{
                                    marginTop: verticalScale(10),
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
                                            borderColor: "#E8B93F"
                                        }}
                                    />
                                
                                    <View
                                        className={`absolute border-white items-center justify-center ${
                                            isOnline ? "bg-[#22A06B]" : "bg-[#7A7D81]"
                                        }`}
                                        style={{
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
                                        className='text-[#1F1F1F] font-bold'
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        Aarav
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Customer Service Specialist
                                    </Text>

                                    <View
                                        className="mt-2 flex-row items-center justify-center gap-1 bg-[#E8B93F]/20"
                                        style={{
                                            paddingHorizontal: moderateScale(9),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(12)
                                        }}
                                    >
                                        <RatingIcon width={moderateScale(14)} height={moderateScale(14)} color="#3F2516" />

                                        <Text
                                            className="font-bold text-[#3F2516]"
                                            style={{ fontSize: moderateScale(10), marginRight: moderateScale(2) }}
                                        >
                                            4.5
                                        </Text>

                                        <Text
                                            className="font-medium text-[#3F2516]/85"
                                            style={{ fontSize: moderateScale(9) }}
                                        >
                                            (5,200 + Ratings)
                                        </Text>
                                    </View>
                                </View>    
                            </View>

                            <View className='w-full items-center justify-center mt-6 mb-6'>
                                <View
                                    className='flex-row justify-center bg-[#e9e9e9]'
                                    style={{
                                        gap: moderateScale(4),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: moderateScale(10),
                                        paddingVertical: moderateScale(4)
                                    }}
                                >
                                    <DateIcon width={moderateScale(16)} height={moderateScale(16)} color={"#1F1F1F85"} strokeWidth={1.5} />

                                    <Text
                                        className='text-[#1F1F1F]/85 font-normal'
                                        style={{ fontSize: moderateScale(11) }}
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
                                    className='text-[#1F1F1F]/75 font-medium -ml-2'
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Aarav is typing...
                                </Text>
                            </View>
                        </>
                    }
                />

                <View
                    className="bg-[#F5F5F5]"
                    style={{
                        paddingHorizontal: scale(14),
                        paddingBottom:
                            insets.bottom || verticalScale(10),
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
                                className="bg-white border border-[#1F1F1F]/10"
                                style={{
                                    borderRadius: moderateScale(18),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(6)
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
                    </ScrollView>
    
                    <View className="flex-row items-center gap-3 w-full">
                        <View
                            className="flex-1 flex-row items-center bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(22),
                                paddingHorizontal: scale(13),
                                height: verticalScale(46)
                            }}    
                        >
                            <AddCircleIcon height={moderateScale(24)} width={moderateScale(24)} color="#4a4a4a" strokeWidth={1.8} />
    
                            <TextInput
                                placeholder="Type a message..."
                                placeholderTextColor="#7A7D81"
                                multiline={false}
                                numberOfLines={1}
                                value={message}
                                onChangeText={setMessage}
                                className="flex-1 text-[#1F1F1F]/65 font-medium"
                                style={{ fontSize: moderateScale(14), marginLeft: moderateScale(8) }}
                                selectionColor="#79685e"
                            />
                        </View>
    
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={handleSendMessage}
                            disabled={!message.trim()}
                            className={`items-center justify-center ${
                                message.trim()
                                    ? "bg-[#3F2516]"
                                    : "bg-[#3F2516]/80"
                            }`}
                            style={{
                                width: moderateScale(52),
                                height: moderateScale(52),
                                borderRadius: moderateScale(28)
                            }}
                        >
                            <SendHorizontalIcon width={moderateScale(24)} height={moderateScale(24)} color="#FFFFFF" strokeWidth={1.5} style={{ marginLeft: moderateScale(2) }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}