import { Advertisement } from "@/Features/Services/api-service"
import { Image } from "expo-image"
import LottieView from "lottie-react-native"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

interface Banner {
    id: string
    imageUrl: string
    navigateUrl?: string | null
}

interface BannerCarouselProps {
    advertisements: Advertisement[]
    loading?: boolean
}

interface BannerItemProps {
    banner: Banner
    width: number
    height: number
    gap: number
    onPress?: () => void
}

const BannerItem = memo(
    ({
        banner,
        width,
        height,
        gap,
        onPress
    }: BannerItemProps) => {
        return (
            <TouchableOpacity
                activeOpacity={0.95}
                onPress={onPress}
                disabled={!banner.navigateUrl}
                style={{
                    width,
                    height,
                    marginRight: gap,
                    borderRadius: moderateScale(24),
                    overflow: "hidden"
                }}
            >
                <Image
                    source={{
                        uri: banner.imageUrl
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                />
            </TouchableOpacity>
        )
    }
)

BannerItem.displayName = "BannerItem"

export default function BannerCarousel({advertisements, loading = false }: BannerCarouselProps) {
    const { width } = useWindowDimensions()

    const HORIZONTAL_PADDING = scale(14)
    const BANNER_WIDTH = width - HORIZONTAL_PADDING * 2
    const BANNER_GAP = scale(16)
    const ITEM_WIDTH = BANNER_WIDTH + BANNER_GAP
    const BANNER_HEIGHT = verticalScale(190)
    const scrollViewRef = useRef<ScrollView>(null)
    const currentIndexRef = useRef(0)
    const initializedRef = useRef(false)

    const [activeIndex, setActiveIndex] = useState(0)
    const [carouselReady, setCarouselReady] = useState(false)

    const banners = useMemo<Banner[]>(() => {
        return advertisements.flatMap(
            (advertisement) =>
                (
                    advertisement.image_url ?? []
                ).map(
                    (
                        imageUrl,
                        index
                    ) => ({
                        id: `${advertisement.id}-${index}`,
                        imageUrl,
                        navigateUrl: advertisement.navigate_url
                    })
                )
        )
    }, [advertisements])

    const carouselBanners = useMemo(() => {
        if (banners.length <= 1) {
            return banners
        }

        return [
            ...banners,
            ...banners,
            ...banners
        ]
    }, [banners])

    useEffect(() => {
        initializedRef.current = false

        setCarouselReady(banners.length <= 1)

        setActiveIndex(0)

        currentIndexRef.current = banners.length > 1 ? banners.length : 0
    }, [
        banners.length
    ])

    const handleContentSizeChange = useCallback(() => {
        if (banners.length === 0 || initializedRef.current) {
            return
        }

        const initialIndex = banners.length > 1 ? banners.length :  0
        currentIndexRef.current = initialIndex

        setActiveIndex(0)

        scrollViewRef.current?.scrollTo({
            x: initialIndex * ITEM_WIDTH,
            animated: false
        })

        initializedRef.current = true

        requestAnimationFrame(() => {
            setCarouselReady(true)
        })
    }, [
        banners.length,
        ITEM_WIDTH
    ])

    useEffect(() => {
        if (banners.length <= 1 || !carouselReady) {
            return
        }

        const interval = setInterval(() => {
            const nextIndex = currentIndexRef.current + 1
            currentIndexRef.current = nextIndex

            scrollViewRef.current?.scrollTo({
                x: nextIndex * ITEM_WIDTH,
                animated: true
            })
        }, 4500)

        return () => {
            clearInterval(interval)
        }

    }, [
        banners.length,
        ITEM_WIDTH,
        carouselReady
    ])

    const handleMomentumScrollEnd = useCallback(
        (
            event:
                NativeSyntheticEvent<NativeScrollEvent>
        ) => {
            if (banners.length <= 1) {
                return
            }

            const offsetX = event.nativeEvent.contentOffset.x
            const index = Math.round(offsetX / ITEM_WIDTH)

            const realIndex = ((index % banners.length) + banners.length) % banners.length

            setActiveIndex(realIndex)

            currentIndexRef.current = index

            if (index >= banners.length * 2) {
                const resetIndex = banners.length + realIndex
                currentIndexRef.current = resetIndex

                requestAnimationFrame(
                    () => {
                        scrollViewRef.current?.scrollTo(
                            {
                                x: resetIndex * ITEM_WIDTH,
                                animated: false
                            }
                        )
                    }
                )

                return
            }

            if (index < banners.length) {
                const resetIndex = banners.length + realIndex
                currentIndexRef.current = resetIndex

                requestAnimationFrame(
                    () => {
                        scrollViewRef.current?.scrollTo(
                            {
                                x: resetIndex * ITEM_WIDTH,
                                animated: false
                            }
                        )
                    }
                )
            }

        },
        [
            banners.length,
            ITEM_WIDTH
        ]
    )

    const handleBannerPress = useCallback((banner: Banner) => {
        if (!banner.navigateUrl) {
            return
        }

        console.log("Navigate URL:", banner.navigateUrl)

        // Add navigation here

    },[])

    if (loading) {
        return (
            <View
                style={{
                    marginTop: verticalScale(18),
                    height: verticalScale(200),
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: moderateScale(24),
                    backgroundColor: "rgb(229 228 226 / 0.75)"
                }}
            >
                <LottieView
                    source={require(
                        "../../../../assets/animations/Loading.json"
                    )}
                    autoPlay
                    loop
                    style={{
                        width: moderateScale(82),
                        height: moderateScale(82)
                    }}
                />
            </View>
        )
    }

    if (banners.length === 0) {
        return null
    }

    return (
        <View
            style={{
                width,
                marginLeft: -HORIZONTAL_PADDING, 
                marginTop: verticalScale(18),
                height: verticalScale(200)
            }}
        >
            {!carouselReady && banners.length > 1 && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: HORIZONTAL_PADDING,
                        right: HORIZONTAL_PADDING,
                        height: BANNER_HEIGHT,
                        borderRadius: moderateScale(24),
                        backgroundColor: "rgb(229 228 226 / 0.75)",
                        justifyContent:"center",
                        alignItems:"center",
                        zIndex: 10
                    }}
                >
                    <LottieView
                        source={require(
                            "../../../../assets/animations/Loading.json"
                        )}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(82),
                            height: moderateScale(82)
                        }}
                    />
                </View>
            )}

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum
                contentContainerStyle={{
                    paddingLeft: HORIZONTAL_PADDING
                }}
                style={{
                    opacity: carouselReady ? 1 : 0
                }}
                onContentSizeChange={handleContentSizeChange}
                onMomentumScrollEnd={handleMomentumScrollEnd}
            >
                {carouselBanners.map((banner,index) => (
                    <BannerItem
                        key={`${banner.id}-${index}`}
                        banner={banner}
                        width={BANNER_WIDTH}
                        height={BANNER_HEIGHT}
                        gap={BANNER_GAP}
                        onPress={() =>
                            handleBannerPress(banner)
                        }
                    />)
                )}
            </ScrollView>

            {banners.length > 1 &&
                carouselReady && (

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: moderateScale(5)
                    }}
                >
                    {banners.map((_,index) => (
                            <View
                                key={index}
                                style={{
                                    width: activeIndex ===  index
                                        ? moderateScale(20)
                                        : moderateScale(6),
                                    height: verticalScale(6),
                                    borderRadius: moderateScale(100),
                                    backgroundColor: activeIndex === index
                                        ? "#3F2516"
                                        : "#D8CEC5"
                                }}
                            />
                        )
                    )}
                </View>
            )}
        </View>
    )
}