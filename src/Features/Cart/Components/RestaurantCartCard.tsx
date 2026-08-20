import React, { memo, useCallback, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn, FadeOut, interpolate, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { Image } from "expo-image"
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import ClockIcon from "@/assets/icon/ClockIcon.svg"
import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import PlusSignCircleIcon from '@/assets/icon/PlusSignCircleIcon.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import CartItemRow from "./CartItemRow"

type CartItem = {
    id: string
    name: string
    image: string
    quantity: number
    price: number
    description?: string
}

type RestaurantCartCardProps = {
    restaurantId: string
    restaurantName: string
    restaurantImage: string
    deliveryFee: number,
    deliveryTime: string
    isActive?: boolean
    items: CartItem[]

    onSelectRestaurant: (restaurantId: string) => void
    onAddItem?: (restaurantId: string) => void
    onIncrease?: (item: CartItem) => void
    onDecrease?: (item: CartItem) => void
    onRemove?: (item: CartItem) => void
}

const RestaurantCartContent = memo(
    ({
        items,
        onAddItem,
        restaurantId,
        onIncrease,
        onDecrease,
        onRemove,
    }: {
        items: CartItem[]
        restaurantId: string
        onAddItem?: (restaurantId: string) => void
        onIncrease?: (item: CartItem) => void
        onDecrease?: (item: CartItem) => void
        onRemove?: (item: CartItem) => void
    }) => {
        return (
            <View
                className="p-3 border border-[#1F1F1F]/10"
                style={{ borderRadius: moderateScale(18) }}
            >
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <CartItemRow 
                            item={item}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                            onRemove={onRemove}
                        />

                        {index < items.length - 1 && (
                            <View
                                className="rounded-full bg-[#E8DDD3]/65"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(10),
                                    marginHorizontal: verticalScale(2),
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => onAddItem?.(restaurantId)}
                    className="items-center flex-row mt-5 bg-[#E8B93F]/15"
                    style={{
                        gap: moderateScale(8),
                        paddingHorizontal: moderateScale(8),
                        paddingVertical: moderateScale(6),
                        borderRadius: moderateScale(14),
                    }}
                >
                    <PlusSignCircleIcon width={moderateScale(23)} height={moderateScale(23)} color="#3F2516" strokeWidth={1.5} />

                    <Text
                        className="text-[#1F1F1F] font-semibold flex-1"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Add more item from this restaurant
                    </Text>

                    <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.5} />
                </TouchableOpacity>
            </View>
        )
    }
)

const RestaurantCartCard = memo(
    ({
        restaurantId,
        restaurantName,
        restaurantImage,
        deliveryFee,
        deliveryTime,
        isActive = false,
        items,
        onSelectRestaurant,
        onAddItem,
        onIncrease,
        onDecrease,
        onRemove,
    }: RestaurantCartCardProps) => {
        const progress = useSharedValue(0)
        const contentHeight = useSharedValue(0)

        const expandedMargin = verticalScale(12)

        useEffect(() => {
            progress.value = withTiming(isActive ? 1 : 0, {
                duration: 280,
            })
        }, [isActive, progress])

        const toggleExpanded = useCallback(() => {
            onSelectRestaurant(restaurantId)
        }, [restaurantId, onSelectRestaurant])

        const contentAnimatedStyle = useAnimatedStyle(() => ({
            height: contentHeight.value * progress.value,
            marginTop: expandedMargin * progress.value,
            opacity: progress.value,
            overflow: "hidden"
        }))

        const arrowAnimatedStyle = useAnimatedStyle(() => ({
            transform: [
                {
                    rotate: `${interpolate(
                        progress.value,
                        [0, 1],
                        [180, 0]
                    )}deg`
                },
            ],
        }))

        return (
            <View
                className="p-3 bg-white border border-[#1F1F1F]/10"
                style={{
                    borderRadius: moderateScale(20),
                    marginTop: verticalScale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={toggleExpanded}
                    className="flex-row gap-2 items-center"
                >
                    <View
                        className="items-start overflow-hidden justify-center self-start rounded-full border border-[#1F1F1F]/10"
                        style={{
                            width: moderateScale(46),
                            height: moderateScale(46)
                        }}
                    >
                        <Image
                            source={{
                                uri: restaurantImage
                            }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={0}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </View>

                    <View
                        className="items-start flex-1"
                        style={{ gap: moderateScale(6) }}
                    >
                        <Text
                            numberOfLines={1}
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            {restaurantName}
                        </Text>

                        <View className="flex-row gap-1 items-center">
                            <View
                                className="flex-row items-center justify-center bg-[#E8B93F]/15"
                                style={{
                                    gap: moderateScale(5),
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(3),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <DeliveryIcon width={moderateScale(16)} height={moderateScale(16)} color="#5c4639" />

                                <Text
                                    className="font-semibold text-[#5c4639]"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    {deliveryFee === 0
                                ? "FREE"
                                : `₹${deliveryFee}`}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-1">
                                <View
                                    className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(22),
                                        height: moderateScale(22)
                                    }}
                                >
                                    <ClockIcon width={moderateScale(14)} height={moderateScale(14)} color="#5c4639" />
                                </View>

                                <Text
                                    className="font-medium text-[#1F1F1F]/75"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    {deliveryTime}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {isActive ? (
                        <View
                            className="items-center justify-center bg-[#E3F2E8]"
                            style={{
                                paddingHorizontal: scale(6),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <Text
                                className="text-[#4d9151] font-semibold uppercase"
                                style={{ fontSize: moderateScale(8) }}
                            >
                                Active Cart
                            </Text>
                        </View>
                    ) : (
                        <View
                            className="items-center justify-center bg-[#E8B93F]/15"
                            style={{
                                paddingHorizontal: scale(6),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <Text
                                className="font-medium text-[#5c4639]"
                                style={{ fontSize: moderateScale(10) }}
                            >
                                {items.length} items
                            </Text>
                        </View>
                    )}

                    <Animated.View
                        style={[
                            arrowAnimatedStyle,
                            {
                                width: moderateScale(26),
                                height: moderateScale(26)
                            },
                        ]}
                        className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                    >
                        <ArrowDownIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color="#5c4639"
                            style={{ marginTop: moderateScale(2) }}
                        />
                    </Animated.View>
                </TouchableOpacity>

                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        opacity: 0
                    }}
                    onLayout={(event) => {
                        const height =
                            event.nativeEvent.layout.height

                        if (
                            height > 0 &&
                            height !== contentHeight.value
                        ) {
                            contentHeight.value = height
                        }
                    }}
                >
                    <RestaurantCartContent
                        items={items}
                        restaurantId={restaurantId}
                        onAddItem={onAddItem}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        onRemove={onRemove}
                    />
                </View>

                <Animated.View style={contentAnimatedStyle}>
                    <RestaurantCartContent
                        items={items}
                        restaurantId={restaurantId}
                        onAddItem={onAddItem}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        onRemove={onRemove}
                    />
                </Animated.View>
            </View>
        )
    }
)

RestaurantCartCard.displayName = "RestaurantCartCard"

export default RestaurantCartCard