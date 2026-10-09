import { COLORS } from "@/constant/colors"
import { hexToRgba } from "@/utils/hexToRgba"
import { useRef } from "react"
import { KeyboardTypeOptions, Text, TextInput, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { SvgProps } from "react-native-svg"

type AddressFieldProps = {
    label: string
    required?: boolean
    value: string
    placeholder: string
    icon: React.FC<SvgProps>

    error?: boolean
    loading?: boolean

    keyboardType?: KeyboardTypeOptions
    maxLength?: number

    onChangeText: (text: string) => void

    rightIcon?: React.ReactNode
    onPress?: () => void
    editable?: boolean
}

export const AddressField = ({
    label,
    required = false,
    value,
    placeholder,
    icon: Icon,
    error = false,
    loading = false,
    keyboardType = "default",
    maxLength,
    onChangeText,
    rightIcon,
    onPress,
    editable = true
}: AddressFieldProps) => {
    const inputRef = useRef<TextInput>(null)

    const handleFieldPress = () => {
        if(loading) return

        if(onPress) {
            onPress()

            return
        }

        inputRef.current?.focus()
    }

    return (
        <View className="flex-1">
            <View className="flex-row items-center">
                <Text
                    className="font-medium"
                    style={{
                        fontSize: moderateScale(12),
                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                    }}
                >
                    {label}
                </Text>

                {required && (
                    <Text
                        className="font-bold"
                        style={{
                            color: COLORS.errorBorderColor,
                            fontSize: moderateScale(12),
                            marginLeft: scale(2)
                        }}
                    >
                        *
                    </Text>
                )}
            </View>

            <TouchableOpacity
                activeOpacity={onPress ? 0.95 : 1}
                onPress={handleFieldPress}
                disabled={loading}
                className="flex-row items-center overflow-hidden"
                style={{
                    backgroundColor: COLORS.secondaryBackgroundColor,
                    borderColor: error ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
                    borderWidth: moderateScale(0.7),
                    height: verticalScale(46),
                    borderRadius: moderateScale(14),
                    paddingHorizontal: scale(8),
                    marginTop: verticalScale(6)
                }}
            >
                <View
                    className="items-center justify-center"
                    style={{
                        backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                        width: moderateScale(34),
                        height: moderateScale(34),
                        borderRadius: moderateScale(9)
                    }}
                >
                    <Icon width={moderateScale(19)} height={moderateScale(19)} color={COLORS.primaryTextColor} strokeWidth={1.6} />
                </View>

                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={ COLORS.placeholderTextColor }
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    editable={editable && !loading && !onPress}
                    pointerEvents={ onPress ? "none" : "auto" }
                    autoCorrect={false}
                    className="flex-1 p-0 font-medium"
                    style={{
                        color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
                        fontSize: moderateScale(13),
                        marginLeft: scale(9),
                        includeFontPadding: false,
                        textAlignVertical: "center"
                    }}
                    selectionColor={ COLORS.selectionColor }
                    onPressIn={() => {
                        if(!loading) {
                            inputRef.current?.focus()
                        }
                    }}
                />

                {rightIcon}
            </TouchableOpacity>
        </View>
    )
}