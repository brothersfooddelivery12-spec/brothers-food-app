import LocationIcon from '@/assets/icon/LocationIcon2.svg';
import { Text, TextInput, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface AddressInputProps {
    loading?: boolean;
    addressLine1: string;
    addressLine2: string;
    setAddressLine1: (value: string) => void;
    setAddressLine2: (value: string) => void;
}

export default function AddressInput({
    loading=false,
    addressLine1,
    addressLine2,
    setAddressLine1,
    setAddressLine2,
}: AddressInputProps) {
  return (
    <View
        className="w-full flex-row border border-[#1F1F1F]/10 bg-white"
        style={{
            marginTop: verticalScale(6),
            padding: scale(10),
            minHeight: moderateScale(112),
            borderRadius: moderateScale(18)
        }}
    >
        <View
            className="items-center justify-center bg-[#F5F5F5]"
            style={{
                width: moderateScale(36),
                height: moderateScale(36),
                borderRadius: moderateScale(10)
            }}
        >
            <LocationIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.5} /> 
        </View>

        <View
            className="flex-1"
            style={{ marginLeft: moderateScale(9) }}
        >
            <Text
                className="font-medium text-[#777777]"
                style={{
                    fontSize: moderateScale(11),
                    marginBottom: moderateScale(2)
                }}
            >
                Address Line 1
            </Text>

            <TextInput
                value={addressLine1}
                onChangeText={setAddressLine1}
                placeholder="123, MG Road, Near City Mall"
                placeholderTextColor="#7A7D81"
                numberOfLines={1}
                className={`p-0 tracking-wide font-medium ${
                    loading ? "text-[#9CA3AF]" : "text-[#151515]"
                }`}
                style={{
                    height: moderateScale(24),
                    fontSize: moderateScale(13)
                }}
                selectionColor="#79685e"
                editable={!loading}
            />

            <View
                className="h-[1px] bg-[#EEEEEE]"
                style={{ marginVertical: moderateScale(7) }}
            />

            <Text
                className="font-medium text-[#777777]"
                style={{
                    fontSize: moderateScale(11),
                    marginBottom: moderateScale(2)
                }}
            >
                Address Line 2 (Optional)
            </Text>

            <TextInput
                value={addressLine2}
                onChangeText={setAddressLine2}
                placeholder="Apartment, suite, unit, etc."
                placeholderTextColor="#7A7D81"
                numberOfLines={1}
                className={`p-0 tracking-wide font-medium ${
                    loading ? "text-[#9CA3AF]" : "text-[#151515]"
                }`}
                style={{
                    height: moderateScale(24),
                    fontSize: moderateScale(13)
                }}
                selectionColor="#79685e"
                editable={!loading}
            />
        </View>
    </View>
  );
}