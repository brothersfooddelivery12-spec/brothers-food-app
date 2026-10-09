import { COLORS } from "@/constant/colors";
import { hexToRgba } from "@/utils/hexToRgba";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface ImageGridProps {
    images?: string[];
    gap?: number;
    size?: number;
    borderRadius?: number
}

interface GridImageProps {
    uri: string
    size: number
    borderRadius: number
}

const DefaultFoodImage = require("../../../../assets/images/Default_Gallery_Image.png")

const GridImage = ({
    uri,
    size,
    borderRadius
}: GridImageProps) => {
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        setImageError(false)
    }, [uri])

    const hasImage =
        typeof uri === "string" &&
        uri.trim().length > 0 &&
        !imageError

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius,
                overflow: "hidden",
                borderWidth: !hasImage ? 0.7 : 0,
                borderColor: hexToRgba(COLORS.primaryTextColor, 0.08)
            }}
        >
            <Image
                source={
                    hasImage
                        ? { uri }
                        : DefaultFoodImage
                }
                onError={() => {
                    setImageError(true)
                }}
                contentFit="contain"
                cachePolicy="memory-disk"
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        </View>
    )
}

const ImageGrid = ({
    images = [],
    gap = moderateScale(8),
    borderRadius = moderateScale(18),
    size = moderateScale(110)
}: ImageGridProps) => {
    if (images.length === 0) {
        return null
    }

    return (
        <FlatList
            data={images}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{
                marginTop: moderateScale(16),
                alignItems: "center"
            }}
            columnWrapperStyle={{
                gap,
                marginBottom: gap,
            }}
            renderItem={({ item }) => (
                <GridImage
                    uri={item}
                    size={size}
                    borderRadius={borderRadius}
                />
            )}
        />
    )
}

export default React.memo(ImageGrid)