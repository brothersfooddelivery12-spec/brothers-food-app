import ProfilePhotoPicker from "@/components/ProfilePhotoPicker"
import { useEffect, useState } from "react"
import { ScrollView, StatusBar, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import UserIcon from '@/assets/icon/UserIcon.svg'
import MailIcon from '@/assets/icon/MailIcon.svg'
import IndiaFlag from '@/assets/icon/India.svg'
import { router, useLocalSearchParams } from "expo-router"
import AddressInput from "@/components/AddressInput"
import CityIcon from '@/assets/icon/CityIcon.svg'
import PinLocation from '@/assets/icon/PinLocation.svg'
import GradientButton from "@/components/GradientButton"
import * as ImagePicker from "expo-image-picker"

export default function CompleteProfileScreen() {
    const { UserMobileNumber } = useLocalSearchParams()

    const [profileImage, setProfileImage] = useState<string | undefined>(undefined)
    const [fullName, setFullName] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [pinCode, setPinCode] = useState("")

    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [numberError, setNumberError] = useState(false)

    const formatMobileNumber = (text: string) => {
        let numbersOnly = text.replace(/\D/g, "")

        if (numbersOnly.startsWith("91") && numbersOnly.length > 10) {
            numbersOnly = numbersOnly.slice(2);
        }

        numbersOnly = numbersOnly.slice(0, 10)

        setMobileNumber(numbersOnly)
    }

    useEffect(() => {
        if (UserMobileNumber) {
            setMobileNumber(UserMobileNumber.toString())
        }
    }, [UserMobileNumber])

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        })

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri)
        }
    }

    return(
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <StatusBar
                translucent
                backgroundColor="#F5F5F5"
                barStyle="dark-content"
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(30)
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    className="font-extrabold text-[#1F1F1F] text-center"
                    style={{ marginTop: verticalScale(24), fontSize: moderateScale(21) }}
                >
                    Complete Your Profile
                </Text>
                
                <Text
                    className="font-medium text-[#1F1F1F]/60 text-center"
                    style={{ marginTop: verticalScale(5), marginBottom: verticalScale(12), fontSize: moderateScale(12) }}
                >
                    {`Tell us a bit about yourself to\npersonalize your experience`}
                </Text>

                <ProfilePhotoPicker imageUri={profileImage} onPress={handlePickImage} />

                <Text
                    className="font-medium text-[#1F1F1F]/85 self-start"
                    style={{ fontSize: moderateScale(13), marginTop: verticalScale(15), marginLeft: scale(6) }}
                >
                    Full Name
                </Text>

                <View
                    className={`flex-row items-center overflow-hidden
                    ${nameError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
                    style={{
                        marginTop: verticalScale(6),
                        paddingRight: scale(10),
                        paddingLeft: scale(9),
                        height: verticalScale(46),
                        borderRadius: moderateScale(18)
                    }}
                >
                    <View
                        className="items-center justify-center bg-[#3f25161d]"
                        style={{
                            width: moderateScale(36),
                            height: moderateScale(36),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <UserIcon width={scale(20)} height={scale(20)} color={"#655145"} /> 
                    </View>

                    <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                        <TextInput
                            className="p-0 tracking-wide font-medium text-[#151515]"
                            style={{
                                height: verticalScale(40),
                                fontSize: moderateScale(14),
                                textAlignVertical: "center",
                                includeFontPadding: false
                            }}
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text)
                                setNameError(false)
                            }}
                            placeholder="Full Name"
                            placeholderTextColor="#7A7D81"
                            keyboardType="default"
                            returnKeyType="default"
                            selectionColor="#79685e"
                        />
                    </View>
                </View>

                {nameError && (
                    <Text
                        className="self-start font-medium text-[#E05252]"
                        style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                    >
                        Please enter your full name
                    </Text>
                )}

                <Text
                    className="font-medium text-[#1F1F1F]/85 self-start"
                    style={{ fontSize: moderateScale(13), marginTop: verticalScale(10), marginLeft: scale(6) }}
                >
                    Email Address
                </Text>

                <View
                    className={`w-full flex-row items-center overflow-hidden
                    ${emailError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
                    style={{
                        marginTop: verticalScale(6),
                        paddingRight: scale(10),
                        paddingLeft: scale(9),
                        height: verticalScale(46),
                        borderRadius: moderateScale(18)
                    }}
                >
                    <View
                        className="items-center justify-center bg-[#3f25161d]"
                        style={{
                            width: moderateScale(36),
                            height: moderateScale(36),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <MailIcon width={scale(20)} height={scale(20)} color={"#655145"} /> 
                    </View>

                    <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                        <TextInput
                            className="p-0 tracking-wide font-medium text-[#151515]"
                            style={{
                                height: verticalScale(40),
                                fontSize: moderateScale(14),
                                textAlignVertical: "center",
                                includeFontPadding: false
                            }}
                            value={emailAddress}
                            onChangeText={(text) => {
                                setEmailAddress(text)
                                setEmailError(false)
                            }}
                            placeholder="Email Address"
                            placeholderTextColor="#7A7D81"
                            keyboardType="default"
                            returnKeyType="default"
                            selectionColor="#79685e"
                        />
                    </View>
                </View>

                {emailError && (
                    <Text
                        className="self-start font-medium text-[#E05252]"
                        style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                    >
                        Please enter a valid email address
                    </Text>
                )}

                <Text
                    className="font-medium text-[#1F1F1F]/85 self-start"
                    style={{ fontSize: moderateScale(13), marginTop: verticalScale(10), marginLeft: scale(6) }}
                >
                    Mobile Number
                </Text>

                <View className={`w-full flex-row overflow-hidden
                    ${numberError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
                    style={{ marginTop: verticalScale(6), height: verticalScale(46), borderRadius: moderateScale(18) }}
                >
                    <View className="flex-row items-center justify-center relative" style={{ width: "22%" }}>
                        <IndiaFlag width={scale(20)} height={verticalScale(22)} style={{ marginRight: scale(6) }} />

                        <Text className="font-medium text-[#151515]" style={{ fontSize: moderateScale(14) }}>
                            +91
                        </Text>

                        <View className="absolute right-0 top-0 bottom-0 bg-[#1F1F1F]/10" style={{ width: scale(0.8) }} />
                    </View>

                    <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                        <TextInput
                            className="p-0 tracking-wide font-medium text-[#151515]"
                            style={{
                                height: verticalScale(40),
                                fontSize: moderateScale(14),
                                textAlignVertical: "center",
                                includeFontPadding: false
                            }}
                            value={mobileNumber.replace(/(\d{5})(\d{0,5})/, "$1 $2").trim()}
                            onChangeText={(text) => {
                                formatMobileNumber(text)
                                setNumberError(false)
                            }}
                            placeholder="Mobile Number"
                            placeholderTextColor="#7A7D81"
                            keyboardType="phone-pad"
                            returnKeyType="done"
                            selectionColor="#79685e"
                        />
                    </View>
                </View>

                {numberError && (
                    <Text
                        className="self-start font-medium text-[#E05252]"
                        style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                    >
                        Please enter a valid 10-digit mobile number
                    </Text>
                )}

                <Text
                    className="font-medium text-[#1F1F1F]/85 self-start"
                    style={{ fontSize: moderateScale(13), marginTop: verticalScale(10), marginLeft: scale(6) }}
                >
                    Delivery Address
                </Text>

                <AddressInput
                    addressLine1={addressLine1}
                    addressLine2={addressLine2}
                    setAddressLine1={setAddressLine1}
                    setAddressLine2={setAddressLine2}
                />

                <View 
                    className="w-full flex-row"
                    style={{ gap: scale(10), marginTop: verticalScale(10) }}
                >
                    <View
                        className="flex-1 flex-row items-center border border-[#1F1F1F]/10 bg-white"
                        style={{
                            height: moderateScale(56),
                            paddingHorizontal: scale(10),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="items-center justify-center bg-[#3f25161d]"
                            style={{
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <CityIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.5} />
                        </View>

                        <View
                            className="flex-1"
                            style={{ marginLeft: moderateScale(9) }}
                        >
                            <Text
                                className="font-medium text-[#777777]"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                City
                            </Text>

                            <TextInput
                                value={city}
                                onChangeText={setCity}
                                placeholder="Jaipur"
                                placeholderTextColor="#7A7D81"
                                numberOfLines={1}
                                className="m-0 p-0 font-medium text-[#151515]"
                                style={{
                                    height: moderateScale(22),
                                    fontSize: moderateScale(14)
                                }}
                                selectionColor="#79685e"
                            />
                        </View>
                    </View>

                    <View
                        className="flex-1 flex-row items-center border border-[#1F1F1F]/10 bg-white"
                        style={{
                            height: moderateScale(56),
                            paddingHorizontal: scale(10),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="items-center justify-center bg-[#3f25161d]"
                            style={{
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <PinLocation width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.5} />
                        </View>

                        <View
                            className="flex-1"
                            style={{ marginLeft: moderateScale(9) }}
                        >
                            <Text
                                className="font-medium text-[#777777]"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                PIN Code
                            </Text>

                            <TextInput
                                value={pinCode}
                                onChangeText={setPinCode}
                                placeholder="302001"
                                placeholderTextColor="#7A7D81"
                                keyboardType="number-pad"
                                maxLength={6}
                                className="m-0 p-0 font-medium text-[#151515]"
                                style={{
                                    height: moderateScale(22),
                                    fontSize: moderateScale(14)
                                }}
                                selectionColor="#79685e"
                            />
                        </View>
                    </View>
                </View>

                <GradientButton title="Save & Continue" onPress={() => router.push("/(tabs)/home")} />
            </ScrollView>
        </SafeAreaView>
    )
}