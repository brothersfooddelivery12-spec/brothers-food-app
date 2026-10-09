import CameraIcon from '@/assets/icon/CameraIcon.svg';
import { COLORS } from '@/constant/colors';
import { hexToRgba } from '@/utils/hexToRgba';
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface ProfilePhotoPickerProps {
  imageUri?: string;
  onPress?: () => void;
}

export default function ProfilePhotoPicker({ imageUri, onPress }: ProfilePhotoPickerProps) {
  return (
    <View className="items-center">
      <View
        style={{
          width: moderateScale(142),
          height: moderateScale(142)
        }}
        className="items-center justify-center"
      >
        <View
            style={{
                width: moderateScale(134),
                height: moderateScale(134)
            }}
        >
          <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require("@/assets/images/profile-placeholder.jpg")
              }
              contentFit="cover"
              transition={200}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 100,
                borderWidth: 3.5,
                borderColor: COLORS.secondaryBackgroundColor
              }}
            />
        </View>

        <Pressable
          onPress={onPress}
          className="items-center justify-center absolute rounded-full"
          style={{
            backgroundColor: COLORS.secondaryBackgroundColor,
            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
            borderWidth: moderateScale(0.7),
            right: moderateScale(14),
            bottom: moderateScale(7),
            width: moderateScale(34),
            height: moderateScale(34)
          }}
        >
            <CameraIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryColor} strokeWidth={2} />
        </Pressable>
      </View>

      <Text
        style={{
          color: COLORS.primaryTextColor,
          marginTop: moderateScale(8),
          fontSize: moderateScale(13)
        }}
        className="font-bold"
      >
        Add Profile Photo
      </Text>
    </View>
  )
}