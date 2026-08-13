import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

export default function SearchScreen() {
    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: scale(16),
                    paddingBottom: verticalScale(30)
                }}
                showsVerticalScrollIndicator={false}
            >
            </ScrollView>
        </SafeAreaView>
    )
}