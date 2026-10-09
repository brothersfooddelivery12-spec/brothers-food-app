import AddUserIcon from '@/assets/icon/AddUserFilledIcon.svg'
import ArrowDownIcon from "@/assets/icon/ArrowDown.svg"
import UtensilIcon from '@/assets/icon/UtensilIcon2.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { memo, useCallback, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type ReferralStatus = "joined" | "pending" | "earned"
type ReferralStepType = "joined" | "order" | "reward"

export type ReferralFriend = {
    id: string
    name: string
    phone: string
    joinedAt: string
    status: ReferralStatus
    reward: number
}

type ReferralFriendCardProps = {
    item: ReferralFriend
}

type ReferralStepProps = {
    type: ReferralStepType
    title: string
    description: string
    meta?: string
    completed?: boolean
    active?: boolean
    last?: boolean
}

const ReferralStep = ({
    type,
    title,
    description,
    meta,
    completed = false,
    active = false,
    last = false
}: ReferralStepProps) => {
    const renderIcon = () => {
        const color = completed
            ? COLORS.primaryBackgroundColor
            : active
              ? COLORS.primaryColor
              : COLORS.primaryTextColor

        const size = moderateScale(17)

        switch (type) {
            case "joined":
                return (
                    <AddUserIcon width={size} height={size} color={color} />
                )

            case "order":
                return (
                    <UtensilIcon width={size} height={size} color={color} />
                )

            case "reward":
                return (
                    <WalletIcon width={size} height={size} color={color} />
                )

            default:
                return null
        }
    }

    return (
        <View className="flex-row">
            <View
                className="items-center"
                style={{ width: moderateScale(38) }}
            >
                <View
                    className="items-center justify-center"
                    style={{
                        width: moderateScale(34),
                        height: moderateScale(34),
                        borderRadius: moderateScale(17),
                        backgroundColor: completed ? COLORS.primaryColor : active
                            ? hexToRgba(COLORS.neutralSurfaceColor, 0.75) : hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                    }}
                >
                    {renderIcon()}
                </View>

                {!last && (
                    <View
                        className="items-center"
                        style={{
                            flex: 1,
                            minHeight: verticalScale(35),
                            marginTop: verticalScale(3),
                            gap: verticalScale(2)
                        }}
                    >
                        {Array.from({ length: 7 }).map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    width: moderateScale(1.2),
                                    height: verticalScale(3),
                                    borderRadius: moderateScale(2),
                                    backgroundColor: completed ? COLORS.secondaryColor : hexToRgba(COLORS.neutralSurfaceColor, 0.85)
                                }}
                            />
                        ))}
                    </View>
                )}
            </View>

            <View
                className="flex-1"
                style={{
                    marginLeft: scale(10),
                    paddingBottom: last ? 0 : verticalScale(18)
                }}
            >
                <Text
                    className="font-bold"
                    style={{
                        fontSize: moderateScale(13),
                        color: COLORS.primaryTextColor
                    }}
                >
                    {title}
                </Text>

                <Text
                    className="font-medium"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(11),
                        lineHeight: moderateScale(15),
                        marginTop: verticalScale(3)
                    }}
                >
                    {description}
                </Text>

                {meta && (
                    <Text
                        className="font-medium"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            fontSize: moderateScale(9.5),
                            marginTop: verticalScale(4)
                        }}
                    >
                        {meta}
                    </Text>
                )}

                {active && !completed && (
                    <View
                        className="self-start"
                        style={{
                            backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                            marginTop: verticalScale(7),
                            paddingHorizontal: scale(8),
                            paddingVertical: verticalScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className="font-semibold"
                            style={{
                                fontSize: moderateScale(9),
                                color: COLORS.primaryColor
                            }}
                        >
                            Awaiting Action
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}

const ReferralProgressContent = memo(
    ({ item }: { item: ReferralFriend }) => {
        const firstName = item.name.split(" ")[0]

        const firstOrderCompleted = item.status === "earned"

        const firstOrderActive = item.status === "pending"

        const rewardCompleted = item.status === "earned"

        return (
            <View
                style={{
                    backgroundColor: COLORS.primaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    borderWidth: moderateScale(0.7),
                    borderRadius: moderateScale(16),
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(14)
                }}
            >
                <ReferralStep
                    type="joined"
                    title="Joined"
                    description={`${firstName} signed up using your referral code.`}
                    meta={item.joinedAt}
                    completed
                />

                <ReferralStep
                    type="order"
                    title="First Order"
                    description={
                        firstOrderCompleted
                            ? `${firstName} completed their first eligible order.`
                            : `Waiting for ${firstName} to place their first order.`
                    }
                    completed={firstOrderCompleted}
                    active={firstOrderActive}
                />

                <ReferralStep
                    type="reward"
                    title="Reward Earned"
                    description={
                        rewardCompleted
                            ? `₹${item.reward} has been added to your reward wallet.`
                            : `₹${item.reward} will be added after the first eligible order is completed.`
                    }
                    completed={rewardCompleted}
                    last
                />
            </View>
        )
    }
)

ReferralProgressContent.displayName = "ReferralProgressContent"

const ReferralFriendCard = memo(({ item }: ReferralFriendCardProps) => {
        const [expanded, setExpanded] = useState(false)
        const progress = useSharedValue(0)
        const contentHeight = useSharedValue(0)
        const expandedMargin = verticalScale(12)

        useEffect(() => {
            progress.value =
                withTiming(
                    expanded ? 1 : 0,
                    {
                        duration: 280
                    }
                )
        }, [expanded, progress])

        const toggleExpanded =
            useCallback(() => {
                setExpanded(previous => !previous)
            }, [])

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
                            [0, 180]
                        )}deg`
                    }
                ]
            }))

        const getStatusLabel = () => {
            switch (item.status) {
                case "earned":
                    return "Reward Earned"

                case "pending":
                    return "Pending Order"

                default:
                    return "Joined"
            }
        }

        const getStatusStyle = () => {
            switch (item.status) {
                case "earned":
                    return {
                        backgroundColor: COLORS.activeStatusBackgroundColor,
                        textColor: COLORS.activeStatusTextColor
                    }

                case "pending":
                    return {
                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                        textColor: COLORS.primaryColor
                    }

                default:
                    return {
                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                        textColor: COLORS.primaryTextColor
                    }
            }
        }

        const statusStyle = getStatusStyle()

        const initials = item.name
            .split(" ")
            .filter(Boolean)
            .map(value =>
                value
                    .charAt(0)
                    .toUpperCase()
            )
            .slice(0, 2)
            .join("")

        return (
            <View
                style={{
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                    borderWidth: moderateScale(0.5),
                    borderRadius: moderateScale(20),
                    padding: moderateScale(12),
                    marginBottom: verticalScale(10)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={toggleExpanded}
                    className="flex-row items-center"
                    style={{ gap: moderateScale(10) }}
                >
                    <View
                        className="items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderRadius: moderateScale(23)
                        }}
                    >
                        <Text
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            {initials}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <Text
                            numberOfLines={1}
                            className="font-bold"
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            {item.name}
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="font-medium"
                            style={{
                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                                fontSize: moderateScale(11),
                                marginTop: verticalScale(3)
                            }}
                        >
                            {item.phone}
                        </Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: statusStyle.backgroundColor,
                            paddingHorizontal: scale(7),
                            paddingVertical: verticalScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(9),
                                color: statusStyle.textColor
                            }}
                        >
                            {getStatusLabel()}
                        </Text>
                    </View>

                    <Animated.View
                        style={[
                            arrowAnimatedStyle,
                            {
                                width: moderateScale(28),
                                height: moderateScale(28),
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15)
                            }
                        ]}
                        className="items-center justify-center rounded-full"
                    >
                        <ArrowDownIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.primaryColor} />
                    </Animated.View>
                </TouchableOpacity>

                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        left: moderateScale(12),
                        right: moderateScale(12),
                        opacity: 0,
                        zIndex: -1
                    }}
                    onLayout={event => {
                        const height = event.nativeEvent.layout.height

                        if (
                            height > 0 &&
                            height !== contentHeight.value
                        ) {
                            contentHeight.value = height
                        }
                    }}
                >
                    <ReferralProgressContent item={item} />
                </View>

                <Animated.View
                    style={contentAnimatedStyle}
                >
                    <ReferralProgressContent item={item} />
                </Animated.View>
            </View>
        )
    }
)

ReferralFriendCard.displayName = "ReferralFriendCard"

export default ReferralFriendCard