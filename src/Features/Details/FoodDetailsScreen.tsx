import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import CheckIcon from '@/assets/icon/CheckIcon.svg'
import FavouriteFilledIcon from '@/assets/icon/FavouriteFilledIcon.svg'
import FavouriteOutlineIcon from '@/assets/icon/FavouriteIconOutline.svg'
import FireIcon from '@/assets/icon/FireIcon.svg'
import MinusIcon from '@/assets/icon/MinusSignIcon.svg'
import PlusIcon from '@/assets/icon/PlusIcon.svg'
import RatingIcon from '@/assets/icon/RatingIcon.svg'
import StopWatchIcon from '@/assets/icon/StopWatchIcon.svg'
import UsersIcon from '@/assets/icon/UsersIcon.svg'
import UtensilIcon from '@/assets/icon/UtensilIcon.svg'
import { addons } from "@/constant/addons"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

const DONENENSSOPTIONS = [
    "Medium Rare",
    "Medium",
    "Medium Well",
]

export default function FoodDetailsScreen() {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const insets = useSafeAreaInsets()
    const [favourite, setFavourite] = useState(false)
    const [selectedAddons, setSelectedAddons] = useState<number[]>([])
    const [quantity, setQuantity] = useState(1)
    const [selectedDoneness, setSelectedDoneness] = useState("Medium Rare")

    const itemPrice = 420
    const addonTotal = addons
        .filter((addon) => selectedAddons.includes(addon.id))
        .reduce((total, addon) => total + addon.price, 0)

    const totalAmount = (itemPrice + addonTotal) * quantity

    const increaseQuantity = useCallback(() => {
        setQuantity((prev) => prev + 1)
    }, [])

    const decreaseQuantity = useCallback(() => {
        setQuantity((prev) => Math.max(1, prev - 1))
    }, [])

    const handleAddonPress = useCallback((addonId: number) => {
        setSelectedAddons((prev) => {
            if (prev.includes(addonId)) {
                return prev.filter((id) => id !== addonId)
            }

            return [...prev, addonId]
        })
    }, [])

    return(
        <SafeAreaView className="flex-1">
            <KeyboardAwareScrollView
                className="flex-1 bg-white"
                contentContainerStyle={{
                    paddingBottom: verticalScale(85)
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bottomOffset={30}
                extraKeyboardSpace={20}
            >
                <View
                    className="absolute left-0 right-0 top-0"
                    style={{ height: verticalScale(220) }}
                >
                    <Image
                        source={{
                            uri: "https://i.pinimg.com/736x/ab/d6/ad/abd6ad97c6fc3ce30912e7994d822010.jpg",
                        }}
                        contentFit="cover"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />

                    <View className="absolute inset-0 bg-black/10" />
                    
                    <View
                        className="absolute left-0 right-0 top-0 flex-row items-center justify-between"
                        style={{
                            marginTop: moderateScale(16),
                            marginHorizontal: scale(12)
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => router.back()}
                            className="items-center self-start justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38)
                            }}
                        >
                            <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={"#1F1F1F"} strokeWidth={2} style={{ marginRight: moderateScale(3) }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => setFavourite(!favourite)}
                            className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38)
                            }}
                        >
                            {favourite ? (
                                <FavouriteFilledIcon width={moderateScale(22)} height={moderateScale(22)} color={"#1F1F1F"} style={{ marginTop: moderateScale(2) }} />
                            ): (
                                <FavouriteOutlineIcon width={moderateScale(22)} height={moderateScale(22)} color={"#1F1F1F"} strokeWidth={1.5} style={{ marginTop: moderateScale(2) }} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    className="w-full bg-white"
                    style={{
                        marginTop: verticalScale(200),
                        minHeight: verticalScale(600),
                        borderTopLeftRadius: moderateScale(22),
                        borderTopRightRadius: moderateScale(22),
                        paddingHorizontal: moderateScale(14)
                    }}
                >
                    <View
                        className="self-start flex-row items-center bg-[#F8D56A]"
                        style={{
                            marginTop: moderateScale(14),
                            paddingHorizontal: moderateScale(7),
                            paddingVertical: moderateScale(4),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <Text
                            className="font-semibold text-[#3F2516] uppercase"
                            style={{ fontSize: moderateScale(10) }}
                        >
                            BestSeller
                        </Text>
                    </View>

                    <Text
                        className="font-extrabold text-[#1F1F1F]"
                        style={{
                            marginTop: moderateScale(8),
                            fontSize: moderateScale(22)
                        }}
                    >
                        Truffle Wagyu Burger
                    </Text>

                    <Text
                        className="font-medium text-[#1F1F1F]/65"
                        style={{
                            fontSize: moderateScale(12),
                            marginTop: moderateScale(8)
                        }}
                    >
                        An exquisite masterpiece featuring
                        200g of A5 Wagyu, aged Gruyère,
                        hand-shaved Perigord black
                        truffles, and our signature bone-
                        marrow infused aioli on a bespoke
                        gold-leaf brioche.
                    </Text>

                    <Text
                        className="font-black text-[#1F1F1F]"
                        style={{
                            fontSize: moderateScale(28),
                            marginTop: moderateScale(12)
                        }}
                    >
                        ₹420
                    </Text>

                    <View
                        className="flex-row gap-2 items-center"
                        style={{ marginTop: moderateScale(8) }}
                    >
                        <View
                            className="self-start flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                            style={{
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
                                4.5
                            </Text>
                        </View>

                        <View
                            className="self-start flex-row items-center justify-center gap-1 bg-[#E8B93F]/15"
                            style={{
                                paddingHorizontal: moderateScale(6),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <UsersIcon width={moderateScale(16)} height={moderateScale(16)} color="#5c4639" />

                            <Text
                                className="font-bold text-[#5c4639]"
                                style={{ fontSize: moderateScale(12), marginRight: moderateScale(2) }}
                            >
                                1.2k Reviews
                            </Text>
                        </View>
                    </View>
                        
                    <View
                        className="rounded-full bg-[#E8DDD3]/65"
                        style={{
                            height: verticalScale(0.7),
                            marginVertical: verticalScale(14),
                            marginHorizontal: verticalScale(2)
                        }}
                    />

                    <View className="flex-row gap-8 items-center justify-center">
                        <View className="items-center">
                            <View
                                className="items-center justify-center rounded-full bg-[#E5E4E2]/65"
                                style={{
                                    width: moderateScale(48),
                                    height: moderateScale(48)
                                }}
                            >
                                <StopWatchIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} strokeWidth={2} />
                            </View>

                            <Text
                                className="font-medium text-[#1F1F1F]/65"
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: moderateScale(5)
                                }}
                            >
                                20-25 min
                            </Text>
                        </View>

                        <View
                            className="rounded-full bg-[#E8DDD3]/65"
                            style={{
                                width: scale(1),
                                height: verticalScale(26),
                                marginHorizontal: verticalScale(2)
                            }}
                        />

                        <View className="items-center">
                            <View
                                className="items-center justify-center rounded-full bg-[#E5E4E2]/65"
                                style={{
                                    width: moderateScale(48),
                                    height: moderateScale(48)
                                }}
                            >
                                <FireIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} strokeWidth={2} />
                            </View>

                            <Text
                                className="font-medium text-[#1F1F1F]/65"
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: moderateScale(5)
                                }}
                            >
                                840 kcal
                            </Text>
                        </View>

                        <View
                            className="rounded-full bg-[#E8DDD3]/65"
                            style={{
                                width: scale(1),
                                height: verticalScale(26),
                                marginHorizontal: verticalScale(2)
                            }}
                        />

                        <View className="items-center">
                            <View
                                className="items-center justify-center rounded-full bg-[#E5E4E2]/65"
                                style={{
                                    width: moderateScale(48),
                                    height: moderateScale(48)
                                }}
                            >
                                <UtensilIcon width={moderateScale(24)} height={moderateScale(24)} color={"#1F1F1F"} strokeWidth={2} />
                            </View>

                            <Text
                                className="font-medium text-[#1F1F1F]/65"
                                style={{
                                    fontSize: moderateScale(12),
                                    marginTop: moderateScale(5)
                                }}
                            >
                                Non-Veg
                            </Text>
                        </View>
                    </View>

                    <View
                        className="p-4 bg-[#F5F5F5]"
                        style={{
                            borderRadius: moderateScale(20),
                            marginTop: moderateScale(25)
                        }}
                    >
                        <Text
                            className="mt-1 font-extrabold text-[#1F1F1F]"
                            style={{
                                fontSize: moderateScale(15),
                                marginLeft: moderateScale(5)
                            }}
                        >
                            Enhance Your Experience
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/55 font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                marginVertical: verticalScale(4),
                                marginLeft: moderateScale(5)
                            }}
                        >
                            Add premium extras to make it perfect
                        </Text>

                        {addons.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id)

                            return (
                                <TouchableOpacity
                                    key={addon.id}
                                    activeOpacity={0.95}
                                    onPress={() => handleAddonPress(addon.id)}
                                    className={`mt-3 flex-row gap-4 items-center bg-white border ${
                                        isSelected
                                            ? "border-[#5c4639]/45"
                                            : "border-[#1F1F1F]/10"
                                    }`}
                                    style={{
                                        paddingHorizontal: scale(14),
                                        paddingVertical: verticalScale(15),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <View
                                        className={`self-center items-center justify-center border ${
                                            isSelected
                                                ? "bg-[#3F2516] border-[#3F2516]"
                                                : "border-[#1F1F1F]/15"
                                        }`}
                                        style={{
                                            marginStart: moderateScale(4),
                                            borderRadius: moderateScale(8),
                                            width: moderateScale(24),
                                            height: moderateScale(24)
                                        }}
                                    >
                                        {isSelected && (
                                            <CheckIcon width={moderateScale(16)} height={moderateScale(16)} color={"#FFFFFF"} strokeWidth={2.5} />
                                        )}
                                    </View>

                                    <View className="flex-1 gap-1">
                                        <Text
                                            className="font-semibold text-[#1F1F1F]"
                                            style={{ fontSize: moderateScale(14) }}
                                        >
                                            {addon.title}
                                        </Text>

                                        <Text
                                            className="font-medium text-[#1F1F1F]/65"
                                            style={{ fontSize: moderateScale(11) }}
                                        >
                                            {addon.description}
                                        </Text>
                                    </View>

                                    <Text
                                        className="text-[#3F2516] font-bold"
                                        style={{ fontSize: moderateScale(16) }}
                                    >
                                        +₹{addon.price}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <View
                        className="p-4 bg-[#F5F5F5]"
                        style={{
                            borderRadius: moderateScale(20),
                            marginTop: moderateScale(25)
                        }}
                    >
                        <Text
                            className="mt-1 font-extrabold text-[#1F1F1F]"
                            style={{
                                fontSize: moderateScale(16),
                                marginLeft: moderateScale(5)
                            }}
                        >
                            Chef's Notes
                        </Text>

                        <Text
                            className="text-[#1F1F1F]/55 font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                marginVertical: verticalScale(4),
                                marginLeft: moderateScale(5)
                            }}
                        >
                            Customize your order just the way you like it
                        </Text>

                        <Text
                            className="mt-4 font-bold text-[#1F1F1F]"
                            style={{
                                fontSize: moderateScale(14),
                                marginLeft: moderateScale(5)
                            }}
                        >
                            DONENESS
                        </Text>

                        <View
                            className="flex-row flex-wrap gap-3"
                            style={{ marginTop: verticalScale(6) }}
                        >
                            {DONENENSSOPTIONS.map((doneness) => {
                                const isSelected = selectedDoneness === doneness

                                return (
                                    <TouchableOpacity
                                        key={doneness}
                                        activeOpacity={0.85}
                                        onPress={() => setSelectedDoneness(doneness)}
                                        className={`items-center justify-center ${
                                            isSelected
                                                ? "bg-[#3F2516]"
                                                : "bg-[#faf5ef]"
                                        }`}
                                        style={{
                                            borderRadius: moderateScale(18),
                                            paddingHorizontal: scale(14),
                                            paddingVertical: verticalScale(6),
                                            borderWidth: isSelected ? 1 : 1,
                                            borderColor: "#E8DDD3"
                                        }}
                                    >
                                        <Text
                                            className={`font-semibold ${
                                                isSelected
                                                    ? "text-white"
                                                    : "text-[#5A3825]"
                                            }`}
                                            style={{ fontSize: moderateScale(13) }}
                                        >
                                            {doneness}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <Text
                            className="font-semibold text-[#3F2516]"
                            style={{
                                fontSize: moderateScale(14),
                                marginLeft: moderateScale(5),
                                marginTop: verticalScale(18)
                            }}
                        >
                            Special Requests
                        </Text>

                        <TextInput
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            placeholder="e.g. No onions, extra aioli on the side..."
                            placeholderTextColor="#7A7D81"
                            className="w-full mt-3 bg-[#F8F9FA] border border-[#D9C5B9] text-[#151515]"
                            style={{
                                height: verticalScale(120),
                                borderRadius: moderateScale(18),
                                paddingHorizontal: moderateScale(16),
                                paddingVertical: moderateScale(16),
                                fontSize: moderateScale(14),
                                lineHeight: moderateScale(26)
                            }}
                            selectionColor="#79685e"
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <View
                className="flex-row items-center absolute left-0 right-0 bottom-0 bg-[#3F2516]"
                style={{
                    paddingHorizontal: scale(16),
                    paddingTop: verticalScale(16),
                    paddingBottom: verticalScale(12) + insets.bottom,
                    borderTopRightRadius: moderateScale(22),
                    borderTopLeftRadius: moderateScale(22),
                    zIndex: 100
                }}
            >
                <View 
                    className="flex-row items-center"
                    style={{ gap: moderateScale(3) }}    
                >
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={decreaseQuantity}
                        disabled={quantity === 1}
                        className="items-center justify-center bg-[#FFFFFF] border border-[#3F2516]/85"
                        style={{
                            width: moderateScale(35),
                            height: moderateScale(34),
                            borderTopLeftRadius: moderateScale(24),
                            borderBottomLeftRadius: moderateScale(24)
                        }}
                    >
                        <MinusIcon width={moderateScale(16)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={3} style={{ marginLeft: moderateScale(2)}} />
                    </TouchableOpacity>

                    <View
                        className="items-center justify-center bg-[#FFFFFF] border border-[#3F2516]/85"
                        style={{
                            width: moderateScale(35),
                            height: moderateScale(34)
                        }}
                    >
                        <Text
                            className="text-[#1F1F1F] font-medium"
                            style={{ fontSize: moderateScale(16) }}
                        >
                            {quantity}
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={increaseQuantity}
                        className="items-center justify-center bg-[#FFFFFF] border border-[#3F2516]/85"
                        style={{
                            width: moderateScale(35),
                            height: moderateScale(34),
                            borderTopRightRadius: moderateScale(24),
                            borderBottomRightRadius: moderateScale(24)
                        }}
                    >
                        <PlusIcon width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={2.5} style={{ marginRight: moderateScale(2)}} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => {}}
                    className="flex-row ml-auto items-center justify-center bg-[#FFFFFF] border border-[#1F1F1F]/15"
                    style={{
                        gap: moderateScale(5),
                        borderRadius: moderateScale(24),
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(8)
                    }}  
                >
                    <CartIcon width={moderateScale(24)} height={moderateScale(24)} color={"#3F2516"} strokeWidth={1.5} style={{ marginLeft: -moderateScale(2)}} />

                    <Text
                        className="text-[#3F2516] font-semibold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        Add To Cart
                    </Text>

                    <View
                        className="rounded-full bg-[#E8DDD3]/95"
                        style={{
                            width: scale(1),
                            height: verticalScale(12),
                            marginHorizontal: verticalScale(2)
                        }}
                    />

                    <Text
                        className="text-[#1F1F1F] font-semibold"
                        style={{ fontSize: moderateScale(15) }}
                    >
                        ₹{totalAmount}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}