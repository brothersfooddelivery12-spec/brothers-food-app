import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import LogoutIcon from '@/assets/icon/LogoutIcon.svg'
import LottieView from 'lottie-react-native'
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type AccountActionDialogProps = {
    visible: boolean
    type: "logout" | "delete"
    loading?: boolean

    onCancel: () => void
    onConfirm: () => void
}

export default function AccountActionDialog({
    visible,
    type,
    loading = false,
    onCancel,
    onConfirm
}: AccountActionDialogProps) {
    const isDelete = type === "delete"

    const title = isDelete ? "Delete Account" : "Log Out"

    const description = isDelete
        ? "Are you sure you want to delete your account? All your account data will be permanently removed and this action cannot be undone."
        : "Are you sure you want to log out of your Brothers account?"

    const confirmText = isDelete ? "Delete" : "Log Out"

    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent
            animationType="fade"
            onRequestClose={() => {
                if (!loading) {
                    onCancel()
                }
            }}
        >
            <View className="flex-1 justify-end">
                <Pressable
                    onPress={() => {
                        if (!loading) {
                            onCancel()
                        }
                    }}
                    className="absolute inset-0 bg-black/50"
                />

                <View
                    className="bg-[#FFFFFF] border border-[#1F1F1F]/10"
                    style={{
                        marginHorizontal: scale(14),
                        marginBottom: verticalScale(22),
                        borderRadius: moderateScale(24),
                        paddingHorizontal: scale(20),
                        paddingTop: verticalScale(18),
                        paddingBottom: verticalScale(14)
                    }}
                >
                    <View className="flex-row items-center gap-2">
                        {type === "logout" ? (
                            <LogoutIcon
                                width={moderateScale(22)}
                                height={moderateScale(22)}
                                color="#1F1F1F"
                                strokeWidth={2}
                            />
                        ) : (
                            <DeleteIcon
                                width={moderateScale(22)}
                                height={moderateScale(22)}
                                color="rgba(220, 38, 38, 0.9)"
                                strokeWidth={2}
                            />
                        )}

                        <Text
                            className="text-[#1F1F1F] font-bold"
                            style={{
                                color: isDelete ? "rgba(220, 38, 38, 0.9)" : "#1F1F1F",
                                fontSize: moderateScale(18)
                            }}
                        >
                            {title}
                        </Text>
                    </View>

                    <Text
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{
                            fontSize: moderateScale(12),
                            lineHeight: moderateScale(16),
                            marginTop: verticalScale(8)
                        }}
                    >
                        {description}
                    </Text>

                    <View
                        className="flex-row"
                        style={{
                            gap: scale(14),
                            marginTop: verticalScale(24)
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.95}
                            disabled={loading}
                            onPress={onCancel}
                            className="flex-1 items-center justify-center bg-[#E5E4E2]/65"
                            style={{
                                height: verticalScale(46),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-medium"
                                style={{ fontSize: moderateScale(15) }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            disabled={loading}
                            onPress={onConfirm}
                            className="flex-1 items-center justify-center"
                            style={{
                                backgroundColor: isDelete ? "rgba(220, 38, 38, 0.80)" : "#3F2516",
                                height: verticalScale(46),
                                borderRadius: moderateScale(20),
                                opacity: loading ? 0.95 : 1
                            }}
                        >
                            {loading ? (
                                <LottieView
                                    source={require("../../../../assets/animations/Loading.json")}
                                    autoPlay
                                    loop
                                    style={{
                                        width: moderateScale(62),
                                        height: moderateScale(62)
                                    }}
                                />
                            ) : (
                                <Text
                                    className="text-[#FFFFFF] font-semibold"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    {confirmText}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}