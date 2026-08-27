import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CityIcon from '@/assets/icon/CityIcon.svg'
import IndiaFlag from '@/assets/icon/India.svg'
import MailIcon from '@/assets/icon/MailIcon.svg'
import PinLocation from '@/assets/icon/PinLocation.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import AddressInput from "@/components/AddressInput"
import GradientButton from '@/components/GradientButton'
import ProfilePhotoPicker from "@/components/ProfilePhotoPicker"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import { useState } from "react"
import { StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function EditProfileScreen(){
    const insets = useSafeAreaInsets()

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

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(12),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>
            
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Edit Profile
                    </Text>
                                
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Manage your personal information
                    </Text>
                </View>
            </View>

            <KeyboardAwareScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: verticalScale(8),
                    paddingBottom: insets.bottom + verticalScale(35),
                    paddingHorizontal: scale(14)
                }}
                bottomOffset={30}
                extraKeyboardSpace={20}
            >
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
                        className="items-center justify-center bg-[#F5F5F5]"
                        style={{
                            width: moderateScale(36),
                            height: moderateScale(36),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <UserIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.8} /> 
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
                        className="items-center justify-center bg-[#F5F5F5]"
                        style={{
                            width: moderateScale(36),
                            height: moderateScale(36),
                            borderRadius: moderateScale(10)
                        }}
                    >
                        <MailIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.8} /> 
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
                    Default Address
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
                            className="items-center justify-center bg-[#F5F5F5]"
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
                            className="items-center justify-center bg-[#F5F5F5]"
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

                <GradientButton title='Update Profile' onPress={() => {}} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}