import AddUserIcon from '@/assets/icon/AddUserFilledIcon.svg'
import ArrowDownIcon from "@/assets/icon/ArrowDown.svg"
import UtensilIcon from '@/assets/icon/UtensilIcon2.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
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
            ? "#FFFFFF"
            : active
              ? "#3F2516"
              : "#756A63"

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
                        backgroundColor: completed
                            ? "#3F2516"
                            : active
                              ? "#EDE4DA"
                              : "#F0F0F0",
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
                                    backgroundColor: completed
                                        ? "#CDBBAE"
                                        : "#E6E6E6"
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
                    paddingBottom: last
                        ? 0
                        : verticalScale(18)
                }}
            >
                <Text
                    className="text-[#1F1F1F] font-bold"
                    style={{ fontSize: moderateScale(13) }}
                >
                    {title}
                </Text>

                <Text
                    className="text-[#1F1F1F]/65 font-medium"
                    style={{
                        fontSize: moderateScale(10.5),
                        lineHeight: moderateScale(15),
                        marginTop: verticalScale(3)
                    }}
                >
                    {description}
                </Text>

                {meta && (
                    <Text
                        className="text-[#1F1F1F]/50 font-medium"
                        style={{
                            fontSize: moderateScale(9),
                            marginTop: verticalScale(4)
                        }}
                    >
                        {meta}
                    </Text>
                )}

                {active && !completed && (
                    <View
                        className="self-start bg-[#EDE3D8]"
                        style={{
                            marginTop: verticalScale(7),
                            paddingHorizontal: scale(8),
                            paddingVertical: verticalScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className="text-[#5C4639] font-semibold"
                            style={{ fontSize: moderateScale(9) }}
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
                className="bg-[#F5F5F5]"
                style={{
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

        const getStatusClasses = () => {
            switch (item.status) {
                case "earned":
                    return {
                        container: "bg-[#E3F2E8]",
                        text: "text-[#4D9151]"
                    }

                case "pending":
                    return {
                        container: "bg-[#E8B93F]/15",
                        text: "text-[#5C4639]"
                    }

                default:
                    return {
                        container: "bg-[#3F2516]/10",
                        text: "text-[#3F2516]"
                    }
            }
        }

        const statusStyle = getStatusClasses()

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
                className="bg-white border border-[#1F1F1F]/10"
                style={{
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
                        className="items-center justify-center bg-[#3F2516]"
                        style={{
                            width: moderateScale(46),
                            height: moderateScale(46),
                            borderRadius: moderateScale(23)
                        }}
                    >
                        <Text
                            className="text-white font-bold"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            {initials}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <Text
                            numberOfLines={1}
                            className="text-[#1F1F1F] font-bold"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            {item.name}
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="text-[#1F1F1F]/55 font-medium"
                            style={{
                                fontSize: moderateScale(10),
                                marginTop: verticalScale(3)
                            }}
                        >
                            {item.phone}
                        </Text>
                    </View>

                    <View
                        className={statusStyle.container}
                        style={{
                            paddingHorizontal: scale(7),
                            paddingVertical: verticalScale(4),
                            borderRadius: moderateScale(12)
                        }}
                    >
                        <Text
                            className={`${statusStyle.text} font-semibold`}
                            style={{ fontSize: moderateScale(8.5) }}
                        >
                            {getStatusLabel()}
                        </Text>
                    </View>

                    <Animated.View
                        style={[
                            arrowAnimatedStyle,
                            {
                                width: moderateScale(28),
                                height: moderateScale(28)
                            }
                        ]}
                        className="items-center justify-center rounded-full bg-[#E8B93F]/15"
                    >
                        <ArrowDownIcon width={moderateScale(16)} height={moderateScale(16)} color="#5C4639" />
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