import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import InvoiceIcon from '@/assets/icon/InvoiceIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import ReorderIcon from '@/assets/icon/ReorderIcon.svg'
import { router } from "expo-router"
import LottieView from "lottie-react-native"
import { ScrollView, StatusBar, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

const ORDER_STATUSES = [
    {
        id: "confirmed",
        label: "Confirmed",
        color: "#22A06B",
    },
    {
        id: "preparing",
        label: "Preparing",
        color: "#F59E0B",
    },
    {
        id: "pickedUp",
        label: "Picked Up",
        color: "#3B82F6",
    },
    {
        id: "onTheWay",
        label: "On the Way",
        color: "#8B5CF6",
    },
]

export default function OrderSuccessScreen() {
    const { width: SCREEN_WIDTH } = useWindowDimensions()

    const horizontalPadding = scale(45)
    const gap = scale(18)
    const cardWidth = (SCREEN_WIDTH - horizontalPadding - gap) / 3

    const currentStatus = "confirmed"
    const currentIndex = ORDER_STATUSES.findIndex(
        (status) => status.id === currentStatus
    )

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />
        
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: verticalScale(30),
                    paddingHorizontal: scale(16)
                }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className=" absolute items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        top: moderateScale(14),
                        left: moderateScale(14),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-center justify-center">
                    <LottieView
                        source={require("@/assets/animations/Success_ Animation.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(242),
                            height: moderateScale(242)
                        }}
                    />
                </View>

                <Text
                    className="text-[#1F1F1F] font-extrabold text-center -mt-4"
                    style={{ fontSize: moderateScale(18) }}
                >
                    Order Placed Successfully!
                </Text>
                
                <Text
                    className="text-[#1F1F1F]/75 font-medium leading-5 text-center mx-4"
                    style={{
                        fontSize: moderateScale(13),
                        marginTop: verticalScale(10)
                    }}
                >
                    The restaurant has received your order and preparation will begin shortly.
                </Text>

                <View
                    className="items-center justify-center p-4 gap-2 bg-[#E5E4E2]/35 border border-[#E5E4E2]/80"
                    style={{
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(18)
                    }}
                >
                    <Text
                        className="text-[#1F1F1F]/85 font-medium uppercase"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        Estimated delivery
                    </Text>

                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(20) }}
                    >
                        22-28{" "}
                        <Text
                            className="text-[#3F2516] font-bold"
                            style={{ fontSize: moderateScale(16) }}
                        >
                            mins
                        </Text>
                    </Text>
                </View>

               <View className="flex-row items-center justify-center mt-8 gap-4">
                    {ORDER_STATUSES.map((status, index) => {
                        const isActive = index <= currentIndex

                        return (
                            <View
                                key={status.id}
                                className="justify-center items-center gap-2"
                            >
                                <View
                                    className="rounded-full"
                                    style={{
                                        height: moderateScale(4),
                                        width: moderateScale(75),
                                        backgroundColor: isActive
                                            ? status.color
                                            : "#E8DDD3"
                                    }}
                                />

                                <Text
                                    className={`font-semibold ${
                                        isActive
                                            ? "text-[#1F1F1F]"
                                            : "text-[#1F1F1F]/45"
                                    }`}
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    {status.label}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                <View
                    className="justify-center p-5 bg-[#FFFFFF] border border-[#1F1F1F]/10"
                    style={{
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(18)
                    }}
                >
                    <Text
                        className="text-[#1F1F1F] font-bold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        The Buger King
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/75 font-normal mt-1"
                        style={{ fontSize: moderateScale(12) }}
                    >
                        Order ID #BFD202600125
                    </Text>

                    <View className="flex-row justify-between items-center mt-5">
                        <Text
                            className="text-[#1F1F1F]/65 font-medium"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Chicken Burger x2
                        </Text>
                        
                        <Text
                            className="text-[#1F1F1F] font-semibold tracking-wide"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            ₹438
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center mt-3">
                        <Text
                            className="text-[#1F1F1F]/65 font-medium"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Fries x1
                        </Text>

                        <Text
                            className="text-[#1F1F1F] font-semibold tracking-wide"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            ₹169
                        </Text>
                    </View>

                    <View
                        className="rounded-full bg-[#E8DDD3]/65"
                        style={{
                            height: verticalScale(0.7),
                            marginVertical: verticalScale(8),
                            marginHorizontal: verticalScale(2)
                        }}
                    />

                    <View className="flex-row justify-between items-center">
                        <Text
                            className="text-[#1F1F1F]/85 font-semibold"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            Paid via UPI
                        </Text>

                        <Text
                            className="text-[#1F1F1F] font-bold tracking-wide"
                            style={{ fontSize: moderateScale(16) }}
                        >
                            ₹607
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-center gap-4 mt-5">
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="bg-white justify-center items-center border border-[#1F1F1F]/10 py-4 px-5 gap-2"
                        style={{
                            width: cardWidth,
                            height: moderateScale(75),
                            borderRadius: moderateScale(22)
                        }}
                    >
                        <LocationIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.8} />
                        
                        <Text
                            className="text-[#1F1F1F] font-medium"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Track
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="bg-white border items-center border-[#1F1F1F]/10 py-4 px-5 gap-2 justify-center"
                        style={{
                            width: cardWidth,
                            height: moderateScale(75),
                            borderRadius: moderateScale(22),
                        }}
                    >
                        <ReorderIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.8} />
                        
                        <Text
                            className="text-[#1F1F1F] font-medium"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Reorder
                        </Text>  
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="bg-white items-center border border-[#1F1F1F]/10 py-4 px-5 gap-2 justify-center"
                        style={{
                            width: cardWidth,
                            height: moderateScale(75),
                            borderRadius: moderateScale(22),
                        }}
                    >
                        <InvoiceIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.8} />
                        
                        <Text
                            className="text-[#1F1F1F] font-medium"
                            style={{ fontSize: moderateScale(12) }}
                        >
                            Invoice
                        </Text> 
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}