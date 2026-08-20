import { Image } from "expo-image"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

const banners = [
    "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786693524/Banner01_xtwobe.png",
    "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786693525/Banner02_lqojj4.png",
    "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786693524/Banner03_isbqvh.png",
    "https://res.cloudinary.com/dcdg3s1pf/image/upload/v1786693523/Banner04_lx3dlh.png",
]

const carouselBanners = [...banners, ...banners]

interface BannerItemProps {
    uri: string
    width: number
    height: number
    gap: number
}

const BannerItem = memo(({ uri, width, height, gap }: BannerItemProps) => {
        return (
            <View
                style={{
                    width,
                    height,
                    marginRight: gap,
                    borderRadius: moderateScale(24),
                    overflow: "hidden",
                }}
            >
                <Image
                    source={{
                        uri: uri
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </View>
        )
    }
)

BannerItem.displayName = "BannerItem"

export default function BannerCarousel() {
    const { width } = useWindowDimensions()

    const HORIZONTAL_PADDING = scale(14)

    const BANNER_WIDTH = width - HORIZONTAL_PADDING * 2

    const BANNER_GAP = scale(16)

    const ITEM_WIDTH = BANNER_WIDTH + BANNER_GAP

    const BANNER_HEIGHT = verticalScale(190)

    const flatListRef = useRef<FlatList<string>>(null)

    const currentIndexRef = useRef(0)

    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex =
                currentIndexRef.current + 1

            currentIndexRef.current =
                nextIndex

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            })
        }, 4500)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const handleMomentumScrollEnd = useCallback(
        (
            event: NativeSyntheticEvent<NativeScrollEvent>
        ) => {
            const offsetX =
                event.nativeEvent.contentOffset.x

            const index = Math.round(
                offsetX / ITEM_WIDTH
            )

            if (index === banners.length) {
                currentIndexRef.current = 0
                setActiveIndex(0)

                requestAnimationFrame(() => {
                    flatListRef.current?.scrollToIndex({
                        index: 0,
                        animated: false,
                    })
                })

                return
            }

            currentIndexRef.current = index

            setActiveIndex(
                index % banners.length
            )
        },
        [ITEM_WIDTH]
    )

    const renderBanner = useCallback(
        ({
            item,
        }: {
            item: string
        }) => {
            return (
                <BannerItem
                    uri={item}
                    width={BANNER_WIDTH}
                    height={BANNER_HEIGHT}
                    gap={BANNER_GAP}
                />
            )
        },
        [
            BANNER_WIDTH,
            BANNER_HEIGHT,
            BANNER_GAP,
        ]
    )

    return (
        <View
            style={{
                width,
                marginLeft: -HORIZONTAL_PADDING,
                marginTop: verticalScale(18),
                height: verticalScale(200),
            }}
        >
            <FlatList
                ref={flatListRef}
                data={carouselBanners}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderBanner}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                disableIntervalMomentum
                contentContainerStyle={{
                    paddingLeft: HORIZONTAL_PADDING,
                }}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                    length: ITEM_WIDTH,
                    offset:
                        ITEM_WIDTH * index,
                    index,
                })}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
            />

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: moderateScale(5),
                }}
            >
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: activeIndex === index
                                    ? moderateScale(20)
                                    : moderateScale(6),
                            height: verticalScale(6),
                            borderRadius: moderateScale(100),
                            backgroundColor: activeIndex === index
                                    ? "#3F2516"
                                    : "#D8CEC5"
                        }}
                    />
                ))}
            </View>
        </View>
    )
}