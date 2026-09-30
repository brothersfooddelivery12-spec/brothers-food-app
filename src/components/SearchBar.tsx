import CloseIcon from '@/assets/icon/CancelCircleIcon2.svg';
import SearchIcon from "@/assets/icon/SearchOutline.svg";
import { forwardRef, memo } from "react";
import { StyleProp, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";
import { moderateScale, scale, verticalScale, } from "react-native-size-matters";
import { SvgProps } from "react-native-svg";

type IconComponent = React.ComponentType<
    SvgProps & {
        strokeWidth?: number
    }
>

interface SearchBarProps
    extends Omit<
        TextInputProps,
        | "value"
        | "onChangeText"
        | "placeholder"
    > {

    value: string

    onChangeText: (text: string) => void
    placeholder?: string
    
    backgroundColor?: string
    LeftIcon?: IconComponent
    RightIcon?: IconComponent
    leftIconColor?: string
    rightIconColor?: string

    onRightPress?: () => void
    onClear?: () => void
    showClear?: boolean
    loading?: boolean
    disabled?: boolean
    containerStyle?: StyleProp<ViewStyle>
    inputContainerStyle?: StyleProp<ViewStyle>
    rightButtonStyle?: StyleProp<ViewStyle>
}


const SearchBar = forwardRef<TextInput, SearchBarProps>(
(
    {
        value,
        onChangeText,

        backgroundColor = "#FAFAFA",
        placeholder = "Search...",
        LeftIcon = SearchIcon,
        RightIcon,
        leftIconColor = "#3F2516",
        rightIconColor = "#3F2516",
        onRightPress,
        onClear,
        showClear = false,
        loading = false,
        disabled = false,
        containerStyle,
        inputContainerStyle,
        rightButtonStyle,
        returnKeyType = "search",
        autoCorrect = false,
        autoCapitalize = "none",
        ...textInputProps
    },
    ref
) => {
        const handleClear = () => {
            onChangeText("")

            onClear?.()
        }


        return (
            <View
                className="flex-row items-center gap-3"
                style={containerStyle}
            >
                <View
                    className="flex-1 flex-row items-center border-[#1F1F1F]/10"
                    style={[
                        {   
                            backgroundColor: backgroundColor ?? "#FAFAFA",
                            borderWidth: moderateScale(0.5),
                            borderRadius: moderateScale(22),
                            paddingHorizontal: scale(13),
                            height: verticalScale(46),
                            opacity: disabled ? 0.6 : 1
                        },

                        inputContainerStyle
                    ]}
                >

                    <LeftIcon width={moderateScale(22)} height={moderateScale(22)} color={leftIconColor} strokeWidth={2} />

                    <TextInput
                        ref={ref}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor="#7A7D81"
                        editable={!disabled}
                        multiline={false}
                        numberOfLines={1}
                        returnKeyType={returnKeyType}
                        autoCorrect={autoCorrect}
                        autoCapitalize={autoCapitalize}
                        selectionColor="#79685E"
                        className="flex-1 text-[#1F1F1F] font-medium"
                        style={{
                            fontSize: moderateScale(14),
                            marginLeft: scale(8),
                            paddingVertical: 0
                        }}

                        {...textInputProps}
                    />

                    {/* {loading && (
                        <ActivityIndicator
                            size="small"
                            color="#3F2516"
                        />
                    )} */}


                    {/* Clear */}
                    {!loading &&
                        showClear &&
                        value.length > 0 && (
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={handleClear}
                                hitSlop={10}
                                className="items-center justify-center"
                            >
                                <CloseIcon width={moderateScale(22)} height={moderateScale(22)} color="rgba(31,31,31,0.48)" strokeWidth={1.8} />
                            </TouchableOpacity>
                        )}
                </View>

                {RightIcon && (
                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={disabled}
                        onPress={onRightPress}
                        className="items-center justify-center bg-white border border-[#1F1F1F]/10"
                        style={[
                            {
                                width: moderateScale(52),
                                height: moderateScale(52),
                                borderRadius: moderateScale(18),
                                opacity: disabled ? 0.6 : 1
                            },

                            rightButtonStyle
                        ]}
                    >
                        <RightIcon width={moderateScale(24)} height={moderateScale(24)} color={rightIconColor} strokeWidth={1.5} />
                    </TouchableOpacity>
                )}
            </View>
        )
    }
)

SearchBar.displayName = "SearchBar"

export default memo(SearchBar)