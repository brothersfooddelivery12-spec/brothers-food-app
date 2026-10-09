import { usePreventDoublePress } from "@/Features/hook/usePreventDoublePress"
import { useCartStore } from "@/Stores/useCartStore"
import ArrowDownIcon from "@/assets/icon/ArrowDown.svg"
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
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
            className="overflow-hidden"
            style={{
                backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                width: moderateScale(44),
                height: moderateScale(44),
                borderRadius: moderateScale(12),
                borderWidth: hasImage ? 0 : moderateScale(0.7),
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.08)
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
            className="mb-2"
            style={{
                backgroundColor: COLORS.primaryBackgroundColor,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                borderWidth: moderateScale(0.7),
                borderRadius: moderateScale(22),
                paddingHorizontal: scale(10),
                paddingTop: verticalScale(10),
                paddingBottom: verticalScale(10)
            }}
        >
            <Text
                className="font-semibold"
                style={{
                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
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
                    <View key={cart.id}>
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
                                paddingVertical: verticalScale(4),
                                paddingHorizontal: scale(4),
                                gap: scale(8)
                            }}
                        >
                            <CartFoodImage imageUrl={firstImage} />

                            <View className="flex-1">
                                <Text
                                    numberOfLines={1}
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    {cart.restaurantName}
                                </Text>

                                <Text
                                    className="font-medium"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.65),
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

                            <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color={hexToRgba(COLORS.primaryTextColor, 0.85)} strokeWidth={2} />
                        </TouchableOpacity>

                        {index < otherCarts.length - 1 && (
                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.15),
                                    height: moderateScale(0.5),
                                    marginVertical: verticalScale(4),
                                    marginHorizontal: scale(8)
                                }}
                            />
                        )}
                    </View>
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
                className="flex-row items-center"
                style={{
                    backgroundColor: COLORS.primaryColor,
                    minHeight: verticalScale(62),
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(8),
                    borderRadius: moderateScale(24),

                    shadowColor: COLORS.primaryTextColor,
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
                        className="rounded-full absolute self-center items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
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
                            <ArrowDownIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} />
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
                    style={{ marginLeft: scale(10), marginRight: scale(10) }}
                >
                    <Text
                        numberOfLines={1}
                        className="font-bold"
                        style={{
                            fontSize: moderateScale(14),
                            color: COLORS.primaryBackgroundColor
                        }}
                    >
                        {restaurantName}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
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
                        className="flex-row items-center"
                        style={{
                            backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.15),
                            borderRadius: moderateScale(18),
                            paddingLeft: scale(12),
                            paddingRight: scale(6),
                            paddingVertical: verticalScale(8),
                            gap: scale(2)
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(11),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            View Cart
                        </Text>

                        <ArrowRightIcon width={moderateScale(15)} height={moderateScale(15)} color={COLORS.primaryBackgroundColor} strokeWidth={2} />
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}