import { View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { moderateScale } from "react-native-size-matters"
import CameraIcon from '@/assets/icon/CameraIcon.svg'

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
                borderColor: "#FFFFFF"
              }}
            />
        </View>

        <Pressable
          onPress={onPress}
          className="bg-white items-center justify-center absolute rounded-full"
          style={{
            right: moderateScale(12),
            bottom: moderateScale(5),
            width: moderateScale(38),
            height: moderateScale(38)
          }}
        >
            <CameraIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={2} />
        </Pressable>
      </View>

      <Text
        style={{
          marginTop: moderateScale(8),
          fontSize: moderateScale(13)
        }}
        className="font-bold text-[#1F1F1F]"
      >
        Add Profile Photo
      </Text>
    </View>
  )
}