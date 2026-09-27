import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CouponFilledIcon from '@/assets/icon/CouponFilledIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import MoneyFilledIcon from '@/assets/icon/MoneyFilledIcon.svg'
import FoodIcon from '@/assets/icon/UtensilIcon2.svg'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { FlatList, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import CouponCard from '../RewardsAndCoupons/Components/CouponCard'
import { COUPONS } from '../RewardsAndCoupons/RewardsAndCouponsScreen'

const COUPONS_CATEGORIES = [
    {
        id: "1",
        title: "All",
        icon: null
    },
    {
        id: "2",
        title: "Food",
        icon: FoodIcon
    },
    {
        id: "3",
        title: "Delivery",
        icon: DeliveryIcon
    },
    {
        id: "4",
        title: "Cashback",
        icon: MoneyFilledIcon
    }
]

export default function ApplyCouponScreen(){
    const [couponCode, setCouponCode] = useState("")
    const [couponError, setCouponError] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("1")

    const handleApplyCoupon = useCallback(() => {
        const code = couponCode.trim()

        if (!code) {
            setCouponError("Please enter a coupon code")
            return
        }

        // Example invalid coupon response
        // if (!isValidCoupon) {
        //     setCouponError("This coupon code is invalid or expired")
        //     return
        // }

        setCouponError("")

        console.log("Apply coupon:", code)
    }, [couponCode])

    return(
        <SafeAreaView className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
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
                    className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10 rounded-full"
                    style={{
                        borderWidth: moderateScale(0.5),
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
                        Apply Coupon
                    </Text>
                    
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Save more with available offers and discounts.
                    </Text>
                </View>
            </View>

            <FlatList
                data={COUPONS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CouponCard
                        item={item}
                        onApply={(coupon) => {
                            console.log("Apply:", coupon.code)
                        }}
                        onCopy={(coupon) => {
                            console.log("Copy:", coupon.code)
                        }}
                    />
                )}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25),
                    gap: verticalScale(12)
                }}
                ListHeaderComponent={
                    <>
                        <View
                            className="p-4 items-center bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(20),
                                marginTop: verticalScale(6)
                            }}
                        >
                            <View className='flex-row gap-3 items-center'>
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <CouponFilledIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" strokeWidth={1.5}/>
                                </View>

                                <View className="items-start gap-1 flex-1">
                                    <Text
                                        className="text-[#1F1F1F] font-bold"
                                        style={{ fontSize: moderateScale(14) }}
                                    >
                                        Have a coupon code?
                                    </Text>

                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(10.5) }}
                                    >
                                        Enter your code and unlock delicious savings.
                                    </Text>
                                </View>
                            </View>

                            <View className='flex-row gap-3 items-center mt-4'>
                                <View
                                    className="flex-1 items-start bg-[#FFFFFF] border-[#1F1F1F]/10"
                                    style={{
                                        borderWidth: moderateScale(0.7),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(10),
                                        height: verticalScale(38)
                                    }}   
                                >
                                    <TextInput
                                        value={couponCode}
                                        onChangeText={(text) => {
                                            setCouponCode(text)

                                            if (couponError) {
                                                setCouponError("")
                                            }
                                        }}
                                        placeholder="Enter coupon code"
                                        placeholderTextColor="#1F1F1F65"
                                        multiline={false}
                                        numberOfLines={1}
                                        autoCapitalize="characters"
                                        className="flex-1 text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(13)}}
                                        selectionColor="#79685e"
                                    />
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={handleApplyCoupon}
                                    className="items-center justify-center bg-[#3F2516]"
                                    style={{
                                        height: verticalScale(34),
                                        minWidth: scale(80),
                                        paddingHorizontal: scale(14),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <Text
                                        className="text-[#FFFFFF] font-semibold"
                                        style={{ fontSize: moderateScale(13) }}
                                    >
                                        Apply
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {couponError && (
                                <Text
                                    className="self-start font-medium text-[#E05252]"
                                    style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                                >
                                    {couponError}
                                </Text>
                            )}
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
                            {COUPONS_CATEGORIES.map((category) => {
                                const isSelected = selectedCategory === category.id
                                const Icon = category.icon
                        
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        activeOpacity={0.85}
                                        onPress={() => setSelectedCategory(category.id)}
                                        className={`flex-row gap-2 items-center justify-center ${
                                            isSelected ? "bg-[#3F2516]" : "bg-[#FAF5EF]/75"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(14),
                                            paddingVertical: verticalScale(7),
                                            borderWidth: 0.7,
                                            borderColor: isSelected ? "#3F2516" : "#E8DDD3"
                                        }}
                                    >
                                        {Icon && (
                                            <Icon width={moderateScale(17)} height={moderateScale(17)} color={isSelected ? "#FFFFFF" : "#5A3825"} />
                                        )}

                                        <Text
                                            className={`font-semibold ${
                                                isSelected ? "text-[#FFFFFF]" : "text-[#5A3825]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {category.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </>
                }
            />
        </SafeAreaView>
    )
}