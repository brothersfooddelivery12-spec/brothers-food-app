import { FlatList, View, Dimensions, useWindowDimensions } from "react-native"
import { Image } from "expo-image"
import { moderateScale } from "react-native-size-matters"
import React from "react";

interface ImageGridProps {
    images: string[];
    gap?: number;
    size?: number;
    borderRadius?: number
}

const ImageGrid = ({
    images,
    gap = moderateScale(8),
    borderRadius = moderateScale(18),
    size = moderateScale(110)
}: ImageGridProps) => {
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
                <View
                    style={{
                        width: size,
                        height: size,
                        borderRadius,
                        overflow: "hidden"
                    }}
                >
                    <Image
                        source={{ uri: item }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </View>
            )}
        />
    )
}

export default React.memo(ImageGrid)