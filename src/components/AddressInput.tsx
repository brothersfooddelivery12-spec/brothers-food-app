import { View, Text, TextInput } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import LocationIcon from '@/assets/icon/LocationIcon2.svg'

interface AddressInputProps {
  addressLine1: string;
  addressLine2: string;
  setAddressLine1: (value: string) => void;
  setAddressLine2: (value: string) => void;
}

export default function AddressInput({
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
            className="items-center justify-center bg-[#3f25161d]"
            style={{
                width: moderateScale(36),
                height: moderateScale(36),
                borderRadius: moderateScale(10),
            }}
        >
            <LocationIcon width={scale(20)} height={scale(20)} color={"#655145"} /> 
        </View>

        <View
            className="flex-1"
            style={{
                marginLeft: moderateScale(9),
            }}
        >
            <Text
                className="font-medium text-[#777777]"
                style={{
                    fontSize: moderateScale(11),
                    marginBottom: moderateScale(2),
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
                className="m-0 p-0 font-medium text-[#151515]"
                style={{
                    height: moderateScale(24),
                    fontSize: moderateScale(14),
                }}
                selectionColor="#79685e"
            />

            <View
                className="h-[1px] bg-[#EEEEEE]"
                style={{
                    marginVertical: moderateScale(7),
                }}
            />

            <Text
                className="font-medium text-[#777777]"
                style={{
                    fontSize: moderateScale(11),
                    marginBottom: moderateScale(2),
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
                className="m-0 p-0 font-medium text-[#151515]"
                style={{
                    height: moderateScale(24),
                    fontSize: moderateScale(14),
                }}
                selectionColor="#79685e"
            />
        </View>
    </View>
  );
}