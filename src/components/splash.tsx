import LocationIcon from "@/assets/icon/locationIcon.svg"
import GradientText from "@/components/GradientText"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef } from "react"
import { Animated, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function CustomSplashScreen() {
  const insets = useSafeAreaInsets()

  const logoScale = useRef(new Animated.Value(0.8)).current
  const logoOpacity = useRef(new Animated.Value(0)).current

  const contentOpacity = useRef(new Animated.Value(0)).current
  const contentTranslateY = useRef(new Animated.Value(25)).current
  const bottomLine = useRef(new Animated.Value(0)).current

  const logoSize = moderateScale(120)
  const logoTextSize = moderateScale(18)
  const taglineTextSize = moderateScale(8)
  const iconSize = moderateScale(16)

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),

        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),

        Animated.timing(bottomLine, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
      ]),
    ]).start()
  }, [])

  return (
    <View className="w-full h-full flex-1 items-center justify-center overflow-hidden bg-[#2B160C]">
      <LinearGradient
        colors={["#4A2C1A", "#311707"]}
        locations={[0, 1]}
        className="absolute inset-0"
      />

      <Animated.View
        className="overflow-hidden rounded-[30px] border border-[#4A2C1A]/40"
        style={{
          width: logoSize,
          height: logoSize,
          opacity: logoOpacity,
          marginBottom: verticalScale(50),
          transform: [{ scale: logoScale }],
          shadowColor: "#382114",
          shadowOffset: {
            width: 0,
            height: verticalScale(16),
          },
          shadowOpacity: 0.35,
          shadowRadius: moderateScale(32),
          elevation: 8
        }}
      >
        <LinearGradient
          colors={["#3F2516", "#311707"]}
          locations={[0, 1]}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View className="flex-row items-center justify-center">
            <Text
              className="font-bold text-[#CEAB3D]"
              style={{
                fontSize: logoTextSize,
                letterSpacing: scale(0.3)
              }}
            >
              BR
            </Text>

            <View style={{ marginBottom: verticalScale(2) }}>
              <LocationIcon color={"#CEAB3D"} width={iconSize} height={iconSize} />
            </View>

            <Text
              className="font-bold text-[#CEAB3D]"
              style={{
                fontSize: logoTextSize,
                letterSpacing: scale(0.3)
              }}
            >
              THERS
            </Text>
          </View>

          <View
            className="flex-row items-center justify-center"
            style={{ marginTop: -verticalScale(0.7) }}
          >
            <View
              className="bg-[#E8B93F]/85"
              style={{
                width: scale(5.6),
                height: verticalScale(1),
                marginRight: scale(2.6)
              }}
            />

            <Text
              className="font-medium text-center text-[#E8B93F]/85"
              style={{
                fontSize: taglineTextSize,
                letterSpacing: scale(0.3)
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              FOOD DELIVERY
            </Text>

            <View
              className="bg-[#E8B93F]/85"
              style={{
                width: scale(5.6),
                height: verticalScale(1),
                marginLeft: scale(1.3)
              }}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        className="absolute w-full items-center"
        style={{
          bottom: insets.bottom + verticalScale(35),
          opacity: contentOpacity,
          transform: [
            {
              translateY: contentTranslateY
            },
          ],
        }}
      >
        <GradientText title="Delicious Food," fontSize={moderateScale(20)} />

        <GradientText
          title="Delivered To Your Door."
          fontSize={moderateScale(20)}
        />

        <Text
          className="font-medium text-[#776153]"
          style={{
            fontSize:  moderateScale(8),
            marginTop: verticalScale(6),
            letterSpacing: moderateScale(2.5)
          }}
        >
          EXPERIENCE EXCELLENCE
        </Text>
      </Animated.View>

      <View
        className="absolute rounded-full overflow-hidden"
        style={{
          left: scale(16),
          right: scale(16),
          bottom: insets.bottom + verticalScale(16),
          height: verticalScale(2)
        }}
      >
        <Animated.View
          className="h-full rounded-full bg-[#F59E0B]"
          style={{
            width: bottomLine.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            })
          }}
        />
      </View>
    </View>
  )
}
