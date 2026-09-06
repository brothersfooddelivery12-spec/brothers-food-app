import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import LogoutIcon from '@/assets/icon/LogoutIcon.svg'
import LottieView from 'lottie-react-native'
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type AccountActionDialogProps = {
    visible: boolean
    type: "logout" | "delete" | "address-delete" | "set-default-address"
    loading?: boolean

    addressLabel?: string

    onCancel: () => void
    onConfirm: () => void
}

export default function AccountActionDialog({
    visible,
    type,
    loading = false,
    addressLabel,
    onCancel,
    onConfirm
}: AccountActionDialogProps) {
    const isLogout = type === "logout"
    const isDeleteAccount = type === "delete"
    const isAddressDelete = type === "address-delete"
    const isSetDefault = type === "set-default-address"

    const isDanger = isDeleteAccount

    const title = isLogout
        ? "Log Out"
        : isAddressDelete
            ? "Delete Address"
            : isSetDefault
                ? "Set as Default"
                : "Delete Account"

    const description = isLogout
        ? "Are you sure you want to log out of your Brothers account?"
        : isAddressDelete
            ? `Are you sure you want to delete ${
                addressLabel
                    ? `"${addressLabel}"`
                    : "this address"
            }? This action cannot be undone.`
            : isSetDefault
                ? `Set ${
                    addressLabel
                        ? `"${addressLabel}"`
                        : "this address"
                } as your default delivery address? It will be automatically selected for future orders.`
                : "Are you sure you want to delete your account? All your account data will be permanently removed and this action cannot be undone."

    const confirmText = isLogout ? "Log Out" : isSetDefault
        ? "Set Default" : "Delete"

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
                    className="bg-white border border-[#1F1F1F]/10"
                    style={{
                        marginHorizontal: scale(12),
                        marginBottom: verticalScale(22),
                        borderRadius: moderateScale(24),
                        paddingHorizontal: scale(20),
                        paddingTop: verticalScale(14),
                        paddingBottom: verticalScale(14)
                    }}
                >
                    <View className="flex-row items-center gap-3 -ml-2">
                        <View
                            className='items-center justify-center'
                            style={{
                                borderRadius: moderateScale(12),
                                backgroundColor: isDanger ? "rgb(254 226 226 / 0.8)" : "rgb(229 228 226 / 0.65)",
                                width: moderateScale(34),
                                height: moderateScale(34)
                            }}
                        >
                            {isLogout ? (
                                <LogoutIcon
                                    width={moderateScale(18)}
                                    height={moderateScale(18)}
                                    color="#1F1F1F"
                                    style={{ marginLeft: moderateScale(1) }}
                                    strokeWidth={1.8}
                                />
                            ) : isAddressDelete ? (
                                <LocationIcon
                                    width={moderateScale(20)}
                                    height={moderateScale(20)}
                                    color="#1F1F1F"
                                    strokeWidth={1.8}
                                />
                            ) : isSetDefault ? (
                                <LocationIcon
                                    width={moderateScale(20)}
                                    height={moderateScale(20)}
                                    color="#3F2516"
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <DeleteIcon
                                    width={moderateScale(20)}
                                    height={moderateScale(20)}
                                    color="rgba(220, 38, 38, 0.9)"
                                    strokeWidth={1.8}
                                />
                            )}
                        </View>

                        <Text
                            className="font-bold"
                            style={{
                                color: isDanger ? "rgba(220, 38, 38, 0.9)" : "#1F1F1F",
                                fontSize: moderateScale(17)
                            }}
                        >
                            {title}
                        </Text>
                    </View>

                    <Text
                        className="text-[#1F1F1F]/75 font-medium"
                        style={{
                            fontSize: moderateScale(12),
                            lineHeight: moderateScale(17),
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
                                backgroundColor: isDanger ? "rgba(220, 38, 38, 0.80)" : "#3F2516",
                                height: verticalScale(46),
                                borderRadius: moderateScale(20),
                                opacity: loading ? 0.85 : 1
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
                                    className="text-white font-semibold"
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