import { ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { scale, verticalScale } from "react-native-size-matters"

export default function VerificationSuccessScreen() {
    return(
        <SafeAreaView className="flex-1">
            <ScrollView
                className="flex-1 bg-[#F5F5F5]"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: verticalScale(30),
                    paddingHorizontal: scale(16)
                }}
                showsVerticalScrollIndicator={false}
            >

            </ScrollView>
        </SafeAreaView>
    )
}