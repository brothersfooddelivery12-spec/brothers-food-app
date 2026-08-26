import { Image } from "expo-image"
import { Text, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export type RestaurantGallery = {
    id: string
    imageUri: string
}

type RestaurantGalleryProps = {
    images: RestaurantGallery[]
}

export default function RestaurantGalleryView({ images }: RestaurantGalleryProps) {
    if (!images?.length) {
        return null
    }

    const firstImage = images[0]
    const secondImage = images[1]
    const thirdImage = images[2]
    const fourthImage = images[3]
    const fifthImage = images[4]

    return (
        <View
            className="flex-row gap-2"
            style={{ height: moderateScale(260) }}
        >
            <View
                className="gap-2"
                style={{
                    width: "56%",
                    height: "100%"
                }}
            >
                {firstImage && (
                    <View
                        className="relative overflow-hidden"
                        style={{
                            flex: 1.65,
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <Image
                            source={{ uri: firstImage.imageUri }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={100}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />

                        <View
                            className="absolute flex-row items-center bg-[#F8D56A]"
                            style={{
                                left: scale(6),
                                bottom: verticalScale(6),
                                paddingHorizontal: scale(8),
                                paddingVertical: verticalScale(4),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <Text
                                className="text-[#3F2516] font-bold"
                                style={{ fontSize: moderateScale(9) }}
                            >
                                Official
                            </Text>
                        </View>
                    </View>
                )}

                {fourthImage && (
                    <Image
                        source={{ uri: fourthImage.imageUri }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={100}
                        style={{
                            flex: 1,
                            width: "100%",
                            borderRadius: moderateScale(18)
                        }}
                    />
                )}
            </View>

            <View
                className="flex-1 gap-2"
                style={{ height: "100%" }}
            >
                {secondImage && (
                    <Image
                        source={{ uri: secondImage.imageUri }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={100}
                        style={{
                            flex: 1,
                            width: "100%",
                            borderRadius: moderateScale(18)
                        }}
                    />
                )}

                {thirdImage && (
                    <Image
                        source={{ uri: thirdImage.imageUri }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={100}
                        style={{
                            flex: 1,
                            width: "100%",
                            borderRadius: moderateScale(18)
                        }}
                    />
                )}

                {fifthImage && (
                    <Image
                        source={{ uri: fifthImage.imageUri }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={100}
                        style={{
                            flex: 1,
                            width: "100%",
                            borderRadius: moderateScale(18)
                        }}
                    />
                )}
            </View>
        </View>
    )
}