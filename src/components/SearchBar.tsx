import { View, TextInput, TouchableOpacity } from "react-native"
import SearchIcon from "@/assets/icon/SearchOutline.svg"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type SearchBarProps = {
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    RightIcon?: React.ComponentType<any>
    rightIconColor?: string
    onRightPress?: () => void
};

export default function SearchBar({ value, onChangeText, placeholder, RightIcon, rightIconColor, onRightPress }: SearchBarProps) {
    return (
        <View className="flex-row items-center gap-3">
            <View
                className="flex-1 flex-row items-center bg-white border border-[#1F1F1F]/10"
                style={{
                    borderRadius: moderateScale(22),
                    paddingHorizontal: scale(13),
                    height: verticalScale(46)
                }}    
            >
                <SearchIcon height={moderateScale(22)} width={moderateScale(22)} color="#4a4a4a" strokeWidth={1.8} />

                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#7A7D81"
                    multiline={false}
                    numberOfLines={1}
                    value={value}
                    onChangeText={onChangeText}
                    className="flex-1 text-[#1F1F1F]/65 font-medium"
                    style={{ fontSize: moderateScale(14), marginLeft: moderateScale(8) }}
                    selectionColor="#79685e"
                />
            </View>

            {RightIcon && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onRightPress}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10"
                    style={{
                        width: moderateScale(52),
                        height: moderateScale(52),
                        borderRadius: moderateScale(18),
                    }}
                >
                    <RightIcon width={moderateScale(24)} height={moderateScale(24)} color={rightIconColor} strokeWidth={1.5} />
                </TouchableOpacity>
            )}
        </View>
    )
}