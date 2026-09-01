import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity, View } from "react-native"

type ToggleSwitchProps = {
    enabled: boolean
    color?: boolean
    onPress: () => void
}

export default function ToggleSwitch({ enabled, color=false, onPress }: ToggleSwitchProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {enabled ? (
            <LinearGradient
                colors={["#5C4639", "#45352b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    width: 48,
                    height: 28,
                    borderRadius: 16,
                    justifyContent: "center",
                    paddingHorizontal: 4,
                }}
            >
                <View className="h-6 w-6 self-end rounded-full bg-white shadow" 
                    style={{
                        backgroundColor: color ? "#F8D56A" : "#FFFFFF"
                    }}
                />
            </LinearGradient>
        ) : (
            <View className="h-[28px] w-[48px] justify-center rounded-full bg-[#E5E4E2]/75">
                <View className="mx-1 h-6 w-6 self-start rounded-full bg-white shadow" />
            </View>
        )}
    </TouchableOpacity>
  )
}