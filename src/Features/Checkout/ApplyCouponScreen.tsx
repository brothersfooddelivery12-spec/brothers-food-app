import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CouponIcon from '@/assets/icon/CouponFilledIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import MoneyFilledIcon from '@/assets/icon/MoneyFilledIcon.svg'
import FoodIcon from '@/assets/icon/UtensilIcon2.svg'
import { COLORS } from '@/constant/colors'
import { Coupon, getAvailableCoupons } from '@/Services/api-service'
import { useCouponStore } from '@/Stores/useCouponStore'
import { hexToRgba } from '@/utils/hexToRgba'
import * as Clipboard from "expo-clipboard"
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Keyboard, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import CouponCard, { CouponItem } from '../RewardsAndCoupons/Components/CouponCard'

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
    const {showToast} = useToast()
    const [couponCode, setCouponCode] = useState("")
    const [couponError, setCouponError] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("1")
    const setAppliedCoupon = useCouponStore(state => state.setAppliedCoupon)

    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
    const [loadingAvailableCoupons, setLoadingAvailableCoupons] = useState(false)
    const [availableCouponsLoaded, setAvailableCouponsLoaded] = useState(false)
    const couponInputRef = useRef<TextInput>(null)

    const fetchAvailableCoupons = useCallback(async () => {
        try {
            setLoadingAvailableCoupons(true)

            const res = await getAvailableCoupons()

            console.log("Available coupons response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch available coupons", "warning")

                return
            }

            const data: Coupon[] = res.data.data ?? []

            setAvailableCoupons(data)
            setAvailableCouponsLoaded(true)
        } catch (error: any) {
            console.log("Available coupons error:", error)

            showToast(error?.response?.data?.message || error?.message ||
                "Unable to fetch available coupons",
                "warning"
            )
        } finally {
            setLoadingAvailableCoupons(false)
        }
    }, [])

    useEffect(() => {
        fetchAvailableCoupons()
    }, [fetchAvailableCoupons])

    const mapAvailableCoupon = (coupon: Coupon): CouponItem => {
        const validTo = new Date(coupon.valid_to) 
        const isExpired = validTo.getTime() < Date.now()

        const formattedExpiry =
            validTo.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )

        return {
            id: coupon.id,
            code: coupon.code,
            title: coupon.title,
            description: coupon.description,
            note: isExpired
                ? `Expired on ${formattedExpiry}`
                : `Valid until ${formattedExpiry}`,
            noteType: "expiry",
            featured: coupon.purchase_method === "REWARD_POINTS",
            purchaseMethod: coupon.purchase_method,
            pointsRequired: coupon.points_required,
            moneyPrice: Number(coupon.money_price),
            isActive: coupon.is_active,
            isExpired
        }
    }

    const mappedAvailableCoupons = useMemo(() => {
        return availableCoupons.map(mapAvailableCoupon)
    }, [availableCoupons])

    const findValidCoupon = useCallback((code: string) => {
        const normalizedCode = code.trim().toUpperCase()

        const now = new Date()

        return availableCoupons.find(coupon => {
            const validFrom = new Date(coupon.valid_from)

            const validTo = new Date(coupon.valid_to)

            return (
                coupon.id.trim().toUpperCase() === normalizedCode &&
                coupon.is_active &&
                now >= validFrom &&
                now <= validTo
            )
        })
    },[availableCoupons])

    const handleApplyCoupon = useCallback((selectedCode?: string) => {
        const code = (selectedCode ?? couponCode).trim().toUpperCase()

        if (!code) {
            setCouponError("Please enter a coupon code")
            return
        }

        if (loadingAvailableCoupons) {
            setCouponError("Please wait while coupons are loading")
            return
        }

        const coupon = findValidCoupon(code)

        if (!coupon) {
            setCouponError("This coupon code is invalid or expired")
            return
        }

        setAppliedCoupon({
            id: coupon.id,
            code: coupon.code,
            title: coupon.title,
            description: coupon.description,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            max_discount: coupon.max_discount,
            min_order_amount: coupon.min_order_amount
        })

        setCouponError("")
        setCouponCode("")

        Keyboard.dismiss()

        router.back()
    },[couponCode, loadingAvailableCoupons, findValidCoupon, setAppliedCoupon, router])

    const handleCopyCoupon = useCallback(async (code: string) => {
        try {
            await Clipboard.setStringAsync(code)

            showToast(`Coupon code copied`, "success")
        } catch (error) {
            console.log("Copy coupon error:", error)

            showToast("Unable to copy coupon code", "warning")
        }
    },[])

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
                    marginBottom: verticalScale(10),
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
                        Apply Coupon
                    </Text>
                    
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        Save more with available offers and discounts.
                    </Text>
                </View>
            </View>

            {loadingAvailableCoupons ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        source={require("../../../assets/animations/Food_Loading2.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(125),
                            height: moderateScale(125)
                        }}
                    />
                </View>
            ) :(
                <FlatList
                    data={loadingAvailableCoupons ? []: mappedAvailableCoupons}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CouponCard
                            item={item}
                            onApply={(coupon) => {handleApplyCoupon(coupon.id)}}
                            onCopy={(coupon) => {handleCopyCoupon(coupon.id)}}
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
                                className="p-4 items-center"
                                style={{
                                    backgroundColor: COLORS.secondaryBackgroundColor,
                                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    borderWidth: moderateScale(0.5),
                                    borderRadius: moderateScale(20),
                                    marginTop: verticalScale(6)
                                }}
                            >
                                <View className='flex-row gap-3 items-center'>
                                    <View
                                        className="items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                            width: moderateScale(42),
                                            height: moderateScale(42)
                                        }}
                                    >
                                        <CouponIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.primaryColor} strokeWidth={1.5}/>
                                    </View>
    
                                    <View className="items-start gap-1 flex-1">
                                        <Text
                                            className="font-bold"
                                            style={{
                                                fontSize: moderateScale(14),
                                                color: COLORS.primaryTextColor
                                            }}
                                        >
                                            Have a coupon code?
                                        </Text>
    
                                        <Text
                                            className="font-medium"
                                            style={{
                                                fontSize: moderateScale(10.5),
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65)
                                            }}
                                        >
                                            Enter your code and unlock delicious savings.
                                        </Text>
                                    </View>
                                </View>
    
                                <View className='flex-row gap-3 items-center mt-4'>
                                    <Pressable
                                        onPress={() => {
                                            couponInputRef.current?.focus()
                                        }}
                                        className="flex-1 items-start"
                                        style={{
                                            backgroundColor: COLORS.primaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.7),
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(10),
                                            height: verticalScale(38)
                                        }}
                                    >
                                        <TextInput
                                            ref={couponInputRef}
                                            value={couponCode}
                                            onChangeText={(text) => {
                                                setCouponCode(text)
    
                                                if (couponError) {
                                                    setCouponError("")
                                                }
                                            }}
                                            placeholder="Enter coupon code"
                                            placeholderTextColor={COLORS.placeholderTextColor}
                                            multiline={false}
                                            numberOfLines={1}
                                            autoCapitalize="characters"
                                            className="flex-1 font-medium"
                                            style={{
                                                fontSize: moderateScale(13),
                                                color: COLORS.inputTextColor
                                            }}
                                            selectionColor={COLORS.selectionColor}
                                        />
                                    </Pressable>
    
                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={() => {
                                            handleApplyCoupon()

                                            Keyboard.dismiss()
                                        }}
                                        className="items-center justify-center"
                                        style={{
                                            backgroundColor: COLORS.primaryColor,
                                            height: verticalScale(34),
                                            minWidth: scale(80),
                                            paddingHorizontal: scale(14),
                                            borderRadius: moderateScale(18)
                                        }}
                                    >
                                        <Text
                                            className="font-semibold"
                                            style={{
                                                fontSize: moderateScale(13),
                                                color: COLORS.primaryBackgroundColor
                                            }}
                                        >
                                            Apply
                                        </Text>
                                    </TouchableOpacity>
                                </View>
    
                                {couponError && (
                                    <Text
                                        className="self-start font-medium"
                                        style={{
                                            marginTop: verticalScale(4),
                                            marginLeft: scale(8),
                                            fontSize: moderateScale(11),
                                            color: COLORS.errorTextColor
                                        }}
                                    >
                                        {couponError}
                                    </Text>
                                )}
                            </View>

                            <View style={{ marginTop: verticalScale(14) }}>
                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Get More Coupons
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                        fontSize: moderateScale(11),
                                        marginTop: verticalScale(2)
                                    }}
                                >
                                    Redeem your points or purchase exclusive coupons.
                                </Text>

                                <View
                                    className="flex-row"
                                    style={{
                                        gap: scale(10),
                                        marginTop: verticalScale(10)
                                    }}
                                >
                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={() => {
                                            router.push({
                                                pathname: "/rewards-coupons",
                                                params: {
                                                    tab: "rewards",
                                                    section: "redeem"
                                                }
                                            })
                                        }}
                                        className="flex-1"
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(12)
                                        }}
                                    >
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                width: moderateScale(38),
                                                height: moderateScale(38)
                                            }}
                                        >
                                            <CouponIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} />
                                        </View>

                                        <Text
                                            className="font-bold"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(13),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            Redeem Points
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(9.5),
                                                marginTop: verticalScale(2)
                                            }}
                                        >
                                            Use reward points for coupons
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.95}
                                        onPress={() => {
                                            router.push({
                                                pathname: "/rewards-coupons",
                                                params: {
                                                    tab: "rewards",
                                                    section: "purchase"
                                                }
                                            })
                                        }}
                                        className="flex-1"
                                        style={{
                                            backgroundColor: COLORS.secondaryBackgroundColor,
                                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                            borderWidth: moderateScale(0.5),
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(12)
                                        }}
                                    >
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                width: moderateScale(38),
                                                height: moderateScale(38)
                                            }}
                                        >
                                            <CouponIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} />
                                        </View>

                                        <Text
                                            className="font-bold"
                                            style={{
                                                color: COLORS.primaryTextColor,
                                                fontSize: moderateScale(13),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            Purchase Coupons
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                                fontSize: moderateScale(9.5),
                                                marginTop: verticalScale(2)
                                            }}
                                        >
                                            Buy premium discount coupons
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {availableCouponsLoaded && mappedAvailableCoupons.length === 0 && (
                                <View
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: COLORS.secondaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                        borderWidth: moderateScale(0.5),
                                        borderRadius: moderateScale(20),
                                        paddingHorizontal: scale(20),
                                        paddingVertical: verticalScale(24),
                                        marginTop: verticalScale(18)
                                    }}
                                >
                                    <View
                                        className="rounded-full items-center justify-center"
                                        style={{
                                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                            width: moderateScale(46),
                                            height: moderateScale(46)
                                        }}
                                    >
                                        <CouponIcon width={moderateScale(28)} height={moderateScale(28)} color={COLORS.secondaryColor} />
                                    </View>

                                    <Text
                                        className="font-semibold"
                                        style={{
                                            color: COLORS.primaryTextColor,
                                            fontSize: moderateScale(14),
                                            marginTop: verticalScale(8)
                                        }}
                                    >
                                        No Coupons Available
                                    </Text>

                                    <Text
                                        className="font-medium text-center"
                                        style={{
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                            fontSize: moderateScale(11),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        Redeem points or purchase a coupon to unlock more savings.
                                    </Text>
                                </View>
                            )}
    
                            {mappedAvailableCoupons.length > 0 && (
                                <ScrollView
                                    horizontal
                                    nestedScrollEnabled
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    className="-mx-5 mt-7 mb-1"
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
                                                activeOpacity={0.95}
                                                onPress={() => setSelectedCategory(category.id)}
                                                className="flex-row gap-2 items-center justify-center"
                                                style={{
                                                    backgroundColor: isSelected
                                                        ? COLORS.primaryColor
                                                        : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                                    borderRadius: moderateScale(18),
                                                    paddingHorizontal: category.title === "All" ? scale(18) : scale(14),
                                                    paddingVertical: verticalScale(7),
                                                    borderWidth: 0.7,
                                                    borderColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor
                                                }}
                                            >
                                                {Icon && (
                                                    <Icon width={moderateScale(17)} height={moderateScale(17)} color={isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor} />
                                                )}
        
                                                <Text
                                                    className="font-semibold"
                                                    style={{
                                                        fontSize: moderateScale(13),
                                                        color: isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                                    }}
                                                >
                                                    {category.title}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            )}
                        </>
                    }
                />
            )}
        </SafeAreaView>
    )
}