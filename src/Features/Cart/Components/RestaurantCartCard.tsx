import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import DeliveryIcon from "@/assets/icon/DeliveryIcon.svg"
import PlusSignCircleIcon from '@/assets/icon/PlusSignCircleIcon.svg'
import ClockIcon from "@/assets/icon/TimerIcon.svg"
import { CartItem } from '@/Stores/useCartStore'
import { Image } from "expo-image"
import React, { memo, useCallback, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import CartItemRow from "./CartItemRow"

type RestaurantCartContentProps = {
    items: CartItem[]
    restaurantId: string
    isRestaurantOpen: boolean

    onAddItem?: (restaurantId: string) => void
    onIncrease?: (restaurantId: string, item: CartItem) => void
    onDecrease?: (restaurantId: string, item: CartItem) => void
    onRemove?: (restaurantId: string, item: CartItem) => void
}

const RestaurantCartContent = memo(
    ({
        items,
        restaurantId,
        isRestaurantOpen,
        onAddItem,
        onIncrease,
        onDecrease,
        onRemove
    }: RestaurantCartContentProps) => {
        return (
            <View
                className="p-3 border"
                style={{
                    borderRadius: moderateScale(18),
                    backgroundColor: isRestaurantOpen ? "#FFFFFF" : "#F3F3F3",
                    borderColor: "rgba(31,31,31,0.10)"
                }}
            >
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <CartItemRow
                            item={item}
                            isRestaurantOpen={isRestaurantOpen}

                            onIncrease={() => onIncrease?.(restaurantId, item)}
                            onDecrease={() => onDecrease?.(restaurantId, item)}
                            onRemove={() => onRemove?.(restaurantId, item)}
                        />

                        {index <
                            items.length - 1 && (
                            <View
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(10),
                                    marginHorizontal: verticalScale(2),
                                    backgroundColor: "rgba(31,31,31,0.10)"
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}

                <TouchableOpacity
                    activeOpacity={0.95}
                    disabled={!isRestaurantOpen}
                    onPress={() => {
                        if (
                            !isRestaurantOpen
                        ) {
                            return
                        }

                        onAddItem?.(restaurantId)
                    }}
                    className="items-center flex-row mt-5"
                    style={{
                        gap: moderateScale(8),
                        paddingHorizontal: moderateScale(8),
                        paddingVertical: moderateScale(6),
                        borderRadius: moderateScale(14),
                        backgroundColor:
                            isRestaurantOpen
                                ? "rgba(232,185,63,0.15)"
                                : "rgba(31,31,31,0.06)"
                    }}
                >
                    <PlusSignCircleIcon
                        width={moderateScale(23)}
                        height={moderateScale(23)}
                        color={isRestaurantOpen ? "#3F2516" : "#858585"}
                        strokeWidth={1.5}
                    />

                    <Text
                        className="font-semibold flex-1"
                        style={{
                            fontSize: moderateScale(11),
                            color: isRestaurantOpen ? "#1F1F1F" : "rgba(31,31,31,0.45)"
                        }}
                    >
                        {isRestaurantOpen
                            ? "Add more item from this restaurant"
                            : "Restaurant is currently unavailable"}
                    </Text>

                    {isRestaurantOpen && (
                        <ArrowRightIcon
                            width={moderateScale(18)}
                            height={moderateScale(18)}
                            color="#3F2516"
                            strokeWidth={1.5}
                        />
                    )}
                </TouchableOpacity>
            </View>
        )
    }
)

RestaurantCartContent.displayName = "RestaurantCartContent"

type RestaurantCartCardProps = {
    restaurantId: string
    restaurantName: string
    restaurantLogoUrl: string
    deliveryFee: number
    deliveryTime: string

    isActiveCart: boolean
    isRestaurantOpen: boolean

    items: CartItem[]

    onSelectRestaurant: (restaurantId: string) => void
    onAddItem?: (restaurantId: string) => void

    onIncrease?: (restaurantId: string, item: CartItem) => void
    onDecrease?: (restaurantId: string, item: CartItem) => void
    onRemove?: (restaurantId: string, item: CartItem) => void
}

const RestaurantCartCard = memo(
    ({
        restaurantId,
        restaurantName,
        restaurantLogoUrl,
        deliveryFee,
        deliveryTime,

        isActiveCart,
        isRestaurantOpen,

        items,

        onSelectRestaurant,
        onAddItem,
        onIncrease,
        onDecrease,
        onRemove
    }: RestaurantCartCardProps) => {
        const progress = useSharedValue(isActiveCart ? 1 : 0)
        const contentHeight = useSharedValue(0)
        const expandedMargin = verticalScale(12)

        const [imageError, setImageError] = useState(false)
    
        const DefaultRestaurantLogo = require("../../../../assets/images/Default_Restaurant_Logo.png")
        
        useEffect(() => {
            setImageError(true)
        }, [restaurantLogoUrl])

        const hasImage = !!restaurantLogoUrl && !imageError

        useEffect(() => {
            progress.value =
                withTiming(
                    isActiveCart ? 1 : 0,
                    {
                        duration: 280
                    }
                )
        }, [isActiveCart, progress]
    )

        const toggleExpanded =
            useCallback(() => {
                onSelectRestaurant(
                    restaurantId
                )
            }, [restaurantId, onSelectRestaurant]
        )

        const contentAnimatedStyle =
            useAnimatedStyle(() => ({
                height: contentHeight.value * progress.value,
                marginTop: expandedMargin * progress.value,
                opacity: progress.value,
                overflow: "hidden"
            }))

        const arrowAnimatedStyle =
            useAnimatedStyle(() => ({
                transform: [
                    {
                        rotate: `${interpolate(
                            progress.value,
                            [0, 1],
                            [180, 0]
                        )}deg`
                    }
                ]
            }))

        return (
            <View
                className="p-3 border"
                style={{
                    borderRadius: moderateScale(20),
                    marginTop: verticalScale(8),
                    backgroundColor: isRestaurantOpen ? "#FFFFFF" : "#EFEFEF",
                    borderColor:
                        isRestaurantOpen
                            ? "rgba(31,31,31,0.10)"
                            : "rgba(31,31,31,0.08)"
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={toggleExpanded}
                    className="flex-row gap-2 items-center"
                >
                    <View
                        className="relative items-start overflow-hidden justify-center self-start rounded-full"
                        style={{
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderWidth: !hasImage && !isRestaurantOpen ? 1 : 0,
                            borderColor: "rgba(31,31,31,0.08)"
                        }}
                    >
                        <Image
                            source={
                                hasImage
                                    ? {
                                        uri: restaurantLogoUrl!
                                    }
                                    : DefaultRestaurantLogo
                            }
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={0}
                            style={{
                                width: "100%",
                                height: "100%",
                                opacity: isRestaurantOpen ? 1 : 0.45
                            }}
                        />

                        {!isRestaurantOpen && (
                            <View
                                pointerEvents="none"
                                className="absolute inset-0"
                                style={{ backgroundColor: "rgba(31,31,31,0.30)" }}
                            />
                        )}
                    </View>

                    <View
                        className="items-start flex-1"
                        style={{ gap: moderateScale(6) }}
                    >
                        <Text
                            numberOfLines={1}
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(13),
                                color: isRestaurantOpen ? "#1F1F1F" : "rgba(31,31,31,0.50)"
                            }}
                        >
                            {restaurantName}
                        </Text>

                        <View className="flex-row gap-1 items-center">
                            <View
                                className="flex-row items-center justify-center"
                                style={{
                                    gap: moderateScale(5),
                                    paddingHorizontal: moderateScale(7),
                                    paddingVertical: moderateScale(3),
                                    borderRadius: moderateScale(10),
                                    backgroundColor:
                                        isRestaurantOpen
                                            ? "rgba(232,185,63,0.15)"
                                            : "rgba(31,31,31,0.07)"
                                }}
                            >
                                <DeliveryIcon
                                    width={moderateScale(16)}
                                    height={moderateScale(16)}
                                    color={isRestaurantOpen? "#5C4639" : "#858585"}
                                />

                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: isRestaurantOpen ? "#5C4639" : "#858585"
                                    }}
                                >
                                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-1">
                                <View
                                    className="items-center justify-center rounded-full"
                                    style={{
                                        width: moderateScale(22),
                                        height: moderateScale(22),
                                        backgroundColor:
                                            isRestaurantOpen
                                                ? "rgba(232,185,63,0.15)"
                                                : "rgba(31,31,31,0.07)"
                                    }}
                                >
                                    <ClockIcon
                                        width={moderateScale(14)}
                                        height={moderateScale(14)}
                                        color={isRestaurantOpen ? "#5C4639" : "#858585"} strokeWidth={1.8}
                                    />
                                </View>

                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(10),
                                        color:
                                            isRestaurantOpen
                                                ? "rgba(31,31,31,0.75)"
                                                : "rgba(31,31,31,0.45)"
                                    }}
                                >
                                    {isRestaurantOpen ? `${deliveryTime} min` : "Currently Closed"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {!isRestaurantOpen ? (
                        <View
                            className="items-center justify-center"
                            style={{
                                paddingHorizontal: scale(7),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(12),
                                backgroundColor: "rgba(31,31,31,0.08)"
                            }}
                        >
                            <Text
                                className="font-semibold uppercase"
                                style={{
                                    fontSize: moderateScale(8),
                                    color: "rgba(31,31,31,0.50)"
                                }}
                            >
                                Closed
                            </Text>
                        </View>
                    ) : isActiveCart ? (
                        <View
                            className="items-center justify-center bg-[#E3F2E8]"
                            style={{
                                paddingHorizontal: scale(6),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <Text
                                className="text-[#20bb59] font-semibold uppercase"
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
                                className="font-medium text-[#5C4639]"
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
                                height: moderateScale(26),
                                backgroundColor:
                                    isRestaurantOpen
                                        ? "rgba(232,185,63,0.15)"
                                        : "rgba(31,31,31,0.07)"
                            }
                        ]}
                        className="items-center justify-center rounded-full"
                    >
                        <ArrowDownIcon
                            width={moderateScale(16)}
                            height={moderateScale(16)}
                            color={isRestaurantOpen ? "#5C4639" : "#858585"}
                            style={{ marginTop: moderateScale(2) }}
                        />
                    </Animated.View>
                </TouchableOpacity>

                <View
                    pointerEvents="none"
                    style={{
                        position:"absolute",
                        left: 0,
                        right: 0,
                        opacity: 0
                    }}
                    onLayout={(event) => {
                        const height = event.nativeEvent.layout.height

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
                        isRestaurantOpen={isRestaurantOpen}
                        onAddItem={onAddItem}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        onRemove={onRemove}
                    />
                </View>

                <Animated.View
                    style={ contentAnimatedStyle }
                >
                    <RestaurantCartContent
                        items={items}
                        restaurantId={restaurantId}
                        isRestaurantOpen={isRestaurantOpen}
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