import DoubleTickIcon from "@/assets/icon/DoubleTickIcon.svg"
import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { Image } from "expo-image"
import { memo } from "react"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type ChatMessageItem = {
    id: string
    message: string
    time: string
    sender: "support" | "user"
    avatar?: string
    status?: "sent" | "delivered" | "read"
}

type ChatMessageProps = {
    item: ChatMessageItem
}

function ChatMessage({ item }: ChatMessageProps) {
    const isUser = item.sender === "user"

    return (
        <View
            className={`w-full ${isUser ? "items-end" : "items-start"}`}
            style={{ marginBottom: verticalScale(14) }}
        >
            <View
                className={`flex-row items-start ${
                    isUser ? "justify-end" : "justify-start"
                }`}
                style={{ width: "100%" }}
            >
                {!isUser && (
                    <View
                        className="overflow-hidden"
                        style={{
                            backgroundColor: COLORS.primaryBackgroundColor,
                            borderColor: COLORS.accentLightColor,
                            width: moderateScale(42),
                            height: moderateScale(42),
                            borderRadius: moderateScale(21),
                            marginRight: scale(6),
                            borderWidth: moderateScale(1)
                        }}
                    >
                        <Image
                            source={
                                item.avatar
                                ? { uri: item.avatar }
                                : require("@/assets/images/customer-care.png")
                            }
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </View>
                )}

                <View
                    style={{ maxWidth: isUser ? "82%" : "78%" }}
                >
                    <View
                        style={{
                            backgroundColor: isUser
                                ? COLORS.primaryColor
                                : COLORS.secondaryBackgroundColor,
                            borderColor: isUser
                                ? COLORS.primaryColor
                                : hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            paddingHorizontal: scale(16),
                            paddingVertical: verticalScale(14),
                            borderRadius: moderateScale(22),

                            ...(isUser
                                ? {
                                      borderBottomRightRadius: moderateScale(6)
                                  }
                                : {
                                      borderTopLeftRadius: moderateScale(6)
                                  }
                                )
                        }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                color: isUser
                                    ? COLORS.primaryBackgroundColor
                                    : COLORS.primaryTextColor,
                                fontSize: moderateScale(12),
                                lineHeight: moderateScale(18)
                            }}
                        >
                            {item.message}
                        </Text>
                    </View>

                    <View
                        className={`flex-row items-center ${
                            isUser ? "justify-end" : "justify-start"
                        }`}
                        style={{
                            marginTop: verticalScale(5),
                            paddingHorizontal: scale(4),
                            gap: scale(4)
                        }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(10),
                                color: hexToRgba(COLORS.primaryTextColor, 0.65)
                            }}
                        >
                            {item.time}
                        </Text>

                        {isUser && item.status === "read" && (
                            <DoubleTickIcon width={moderateScale(16)} height={moderateScale(16)} color="#3F2516" />
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default memo(ChatMessage)