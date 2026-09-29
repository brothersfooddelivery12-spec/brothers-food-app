import { usePreventDoublePress } from "@/Features/hook/usePreventDoublePress"
import { useCartStore } from "@/Stores/useCartStore"
import ArrowDownIcon from "@/assets/icon/ArrowDown.svg"
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import { Image } from "expo-image"
import { router } from "expo-router"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeInDown, FadeOutDown, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

interface FloatingCartBarProps {
    bottomOffset?: number
}

const DefaultFoodImage = require("../../assets/images/Default_Food_Image.png")

interface CartFoodImageProps {
    imageUrl?: string | null
}

const CartFoodImage = memo(({ imageUrl }: CartFoodImageProps) => {
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        setImageError(false)
    }, [imageUrl])

    const hasImage = !!imageUrl && !imageError

    return (
        <View
            className="overflow-hidden bg-[#EFEFEF]"
            style={{
                width: moderateScale(44),
                height: moderateScale(44),
                borderRadius: moderateScale(12),
                borderWidth: hasImage
                    ? 0
                    : moderateScale(0.7),
                borderColor: "rgba(31,31,31,0.08)"
            }}
        >
            <Image
                source={
                    hasImage
                        ? { uri: imageUrl }
                        : DefaultFoodImage
                }
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={0}
                onError={() => {
                    setImageError(true)
                }}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        </View>
    )}
)

CartFoodImage.displayName ="CartFoodImage"

export default function FloatingCartBar({bottomOffset = 85}: FloatingCartBarProps) {
    const preventDoublePress = usePreventDoublePress()
    const insets = useSafeAreaInsets()
    const carts = useCartStore(state => state.carts)
    const selectRestaurant = useCartStore((state) => state.selectRestaurant)

    const latestRestaurantId = useCartStore(state =>state.latestRestaurantId)

    const latestCart = useMemo(() => {
        if (!carts.length) {
            return null
        }

        if (latestRestaurantId) {
            const cart = carts.find(cart => cart.id === latestRestaurantId)

            if (cart) {
                return cart
            }
        }

        return carts.at(-1) ?? null
    }, [carts, latestRestaurantId])

    const otherCarts = useMemo(() => {
        if (!latestCart) {
            return []
        }

        return carts
            .filter(cart => cart.id !== latestCart.id)
            .reverse()
    }, [carts, latestCart])

    const {totalItems, restaurantName, itemImages} = useMemo(() => {
        if (!latestCart) {
            return {
                totalItems: 0,
                restaurantName: "",
                itemImages: []
            }
        }

        return {
            totalItems: latestCart.items.reduce((sum, item) => sum + item.quantity, 0),
            restaurantName: latestCart.restaurantName,
            itemImages: latestCart.items
                .filter(item => !!item.imageUrl)
                .slice(0, 3)
                .map(item => item.imageUrl as string)
        }
    }, [latestCart])

    if (totalItems === 0) {
        return null
    }

    const [expanded, setExpanded] = useState(false)

    const progress = useSharedValue(0)
    const contentHeight = useSharedValue(0)

    const EXPANDED_GAP = verticalScale(8)

    useEffect(() => {
        progress.value = withTiming(
            expanded ? 1 : 0,
            {
                duration: 280
            }
        )
    }, [expanded])

    useEffect(() => {
        if (otherCarts.length === 0) {
            setExpanded(false)
        }
    }, [otherCarts.length])

    const toggleExpanded = useCallback(() => {
        setExpanded(previous => !previous)
    }, [])

    const cartsAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: contentHeight.value * progress.value,
            opacity: progress.value,
            marginBottom: EXPANDED_GAP * progress.value,
            overflow: "hidden"
        }
    })

    const arrowAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${interpolate(
                        progress.value,
                        [0, 1],
                        [0, 180]
                    )}deg`
                }
            ]
        }
    })

    const renderOtherCarts = () => (
        <View
            className="bg-[#FFFFFF] border-[#1F1F1F]/10 mb-2"
            style={{
                borderWidth: moderateScale(0.7),
                borderRadius: moderateScale(22),
                paddingHorizontal: scale(10),
                paddingTop: verticalScale(10),
                paddingBottom: verticalScale(10)
            }}
        >
            <Text
                className="text-[#1F1F1F]/75 font-semibold"
                style={{
                    fontSize: moderateScale(12),
                    marginBottom: verticalScale(4),
                    marginLeft: scale(4)
                }}
            >
                Other Carts
            </Text>

            {otherCarts.map((cart, index) => {
                const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
                const firstImage = cart.items.find(item => !!item.imageUrl)?.imageUrl

                return (
                    <TouchableOpacity
                        key={cart.id}
                        activeOpacity={0.95}
                        onPress={() => 
                            preventDoublePress(() => {
                                selectRestaurant(cart.id)
                                router.push("/cart")
                            })
                        }
                        className="flex-row items-center"
                        style={{
                            paddingVertical: verticalScale(5),
                            paddingHorizontal: scale(4),
                            gap: scale(8),
                            borderBottomWidth: index < otherCarts.length - 1
                                ? moderateScale(0.5)
                                : 0,
                            borderBottomColor: "rgba(31,31,31,0.08)"
                        }}
                    >
                        <CartFoodImage imageUrl={firstImage} />

                        <View className="flex-1">
                            <Text
                                numberOfLines={1}
                                className="text-[#1F1F1F] font-bold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                {cart.restaurantName}
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/65 font-medium"
                                style={{
                                    fontSize:moderateScale(11),
                                    marginTop: verticalScale(2)
                                }}
                            >
                                {count}{" "}
                                {count === 1
                                    ? "item"
                                    : "items"}{" "}
                                added
                            </Text>
                        </View>

                        <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#1F1F1F85" strokeWidth={2} />
                    </TouchableOpacity>
                )
            })}
        </View>
    )

    return (
        <Animated.View
            entering={FadeInDown.duration(250)}
            exiting={FadeOutDown.duration(200)}
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: scale(14),
                right: scale(14),
                bottom: insets.bottom + verticalScale(bottomOffset),
                zIndex: 100
            }}
        >
            {otherCarts.length > 0 && (
                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        opacity: 0,
                        zIndex: -1
                    }}
                    onLayout={(event) => {
                        const height = event.nativeEvent.layout.height

                        if (height > 0 && height !== contentHeight.value) {
                            contentHeight.value = height
                        }
                    }}
                >
                    {renderOtherCarts()}
                </View>
            )}

            {otherCarts.length > 0 && (
                <Animated.View
                    pointerEvents={
                        expanded
                            ? "auto"
                            : "none"
                    }
                    style={cartsAnimatedStyle}
                >
                    {renderOtherCarts()}
                </Animated.View>
            )}

            <View
                className="flex-row items-center bg-[#3F2516]"
                style={{
                    minHeight: verticalScale(62),
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(8),
                    borderRadius: moderateScale(24),

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 8
                }}
            >
                {otherCarts.length > 0 && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={toggleExpanded}
                        className="rounded-full absolute self-center items-center justify-center bg-[#3F2516]"
                        style={{
                            top: -moderateScale(10),
                            left: "50%",
                            width: moderateScale(34),
                            height: moderateScale(32),
                            zIndex: 20
                        }}
                    >
                        <Animated.View
                            style={[
                                arrowAnimatedStyle
                            ]}
                            className="items-center justify-center"
                        >
                            <ArrowDownIcon width={moderateScale(18)} height={moderateScale(18)} color="#FFFFFF" />
                        </Animated.View>
                    </TouchableOpacity>
                )}

                <View
                    style={{
                        width: moderateScale(44) + Math.max(itemImages.length - 1, 0) * scale(14),
                        height: moderateScale(44)
                    }}
                >
                    {itemImages.length > 0 ? (
                        itemImages.map(
                            (imageUrl, index) => (
                                <View
                                    key={`${imageUrl}-${index}`}
                                    style={{
                                        position: "absolute",
                                        left: index * scale(14),
                                        zIndex: index + 1
                                    }}
                                >
                                    <CartFoodImage imageUrl={imageUrl} />
                                </View>
                            )
                        )
                    ) : (
                        <CartFoodImage imageUrl={null} />
                    )}
                </View>

                <View
                    className="flex-1"
                    style={{ marginLeft: scale(10) }}
                >
                    <Text
                        numberOfLines={1}
                        className="text-[#FFFFFF] font-bold"
                        style={{ fontSize: moderateScale(14) }}
                    >
                        {restaurantName}
                    </Text>

                    <Text
                        className="text-white/75 font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            marginTop: verticalScale(2)
                        }}
                    >
                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}{" "}
                        added
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() =>
                        preventDoublePress(() => {
                            if (!latestCart) {
                                return
                            }

                            selectRestaurant(latestCart.id)

                            router.push("/cart")
                        })
                    }
                >
                    <View
                        className="flex-row items-center bg-white/15"
                        style={{
                            borderRadius: moderateScale(14),
                            paddingLeft: scale(10),
                            paddingRight: scale(4),
                            paddingVertical: verticalScale(6),
                            gap: scale(2)
                        }}
                    >
                        <Text
                            className="text-[#FFFFFF] font-semibold"
                            style={{ fontSize: moderateScale(11) }}
                        >
                            View Cart
                        </Text>

                        <ArrowRightIcon width={moderateScale(15)} height={moderateScale(15)} color="#FFFFFF" strokeWidth={2} />
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}