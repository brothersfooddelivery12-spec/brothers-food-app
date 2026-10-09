import ErrorIcon from '@/assets/icon/ErrorIcon.svg'
import InfoIcon from '@/assets/icon/InformationSquareIcon.svg'
import SuccessIcon from '@/assets/icon/SuccessIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import React, { createContext, useContext, useRef, useState } from "react"
import { Animated, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale } from "react-native-size-matters"

type ToastMode = "success" | "warning" | "info"

type ToastContextType = {
  showToast: (message: string, mode?: ToastMode) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets()

  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<ToastMode>("success")

  const translateY = useRef(new Animated.Value(-80)).current
  const opacity = useRef(new Animated.Value(0)).current

  const showToast = (msg: string, toastMode: ToastMode = "success") => {
    setMessage(msg)
    setMode(toastMode)
    setVisible(true)

    translateY.setValue(-80)
    opacity.setValue(0)

    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true
        })
      ]),

      Animated.delay(2500),

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 400,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        })
      ]),
    ]).start(() => setVisible(false))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {visible && (
        <Animated.View
          style={{
            position: "absolute",
            top: insets.top + 14,
            width: "100%",
            alignItems: "center",
            zIndex: 999,
            opacity,
            transform: [
              {
                translateY
              }
            ]
          }}
        >
          <View
            className="py-1.5 px-2 flex-row items-center gap-2"
            style={{
              borderRadius: moderateScale(12),
              backgroundColor: mode === "warning"
                ? COLORS.errorBorderColor
                : COLORS.primaryColor
            }}
          >
            {mode === "success" ? (
                <SuccessIcon
                    width={moderateScale(22)}
                    height={moderateScale(22)}
                    color={COLORS.accentLightColor}
                />
            ) : mode === "warning" ? (
                <ErrorIcon
                    width={moderateScale(22)}
                    height={moderateScale(22)}
                    color={hexToRgba(COLORS.primaryBackgroundColor, 0.85)}
                />
            ) : (
                <InfoIcon
                    width={moderateScale(22)}
                    height={moderateScale(22)}
                    color={COLORS.accentLightColor}
                />
            )}

            <Text
              className="text-base font-medium mr-1"
              style={{ color: COLORS.primaryBackgroundColor }}
            >
              {message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }

  return context
}