import MaskedView from "@react-native-masked-view/masked-view"
import { LinearGradient } from "expo-linear-gradient"
import { Text } from "react-native"

interface GradientTextProps {
  title: string,
  fontSize: number
}

export default function GradientText({ title, fontSize }: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text 
          className="font-bold"
          style={{ fontSize: fontSize, textAlign: "center"}}
        >
          {title}
        </Text>
      }
    >
      <LinearGradient
        colors={["#C9A227", "#D7B95D", "#C9A227"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text 
          className="font-bold"
          style={{ fontSize: fontSize, textAlign: "center", opacity: 0 }}
        >
          {title}
        </Text>
      </LinearGradient>
    </MaskedView>
  )
}