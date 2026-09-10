import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CakeIcon from '@/assets/icon/CakeIcon2.svg'
import CalendarIcon from '@/assets/icon/DateIcon.svg'
import IndiaFlag from '@/assets/icon/India.svg'
import MailIcon from '@/assets/icon/MailIcon.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import VenusAndMarsIcon from '@/assets/icon/VenusAndMarsIcon.svg'
import GradientButton from '@/components/GradientButton'
import ProfilePhotoPicker from "@/components/ProfilePhotoPicker"
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef, useState } from "react"
import { Dimensions, Keyboard, Modal, Platform, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import { editUserProfile } from '../Services/api-service'
import { useAuthStore } from '../Stores/auth-store'

type Gender = "MALE" | "FEMALE" | "OTHER"

const GENDER_OPTIONS: {label: string, value: Gender}[] = [
    {
        label: "Male",
        value: "MALE"
    },
    {
        label: "Female",
        value: "FEMALE"
    },
    {
        label: "Other",
        value: "OTHER"
    }
]

export default function EditProfileScreen(){
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const user = useAuthStore((state) => state.user)
    const updateUser = useAuthStore((state) => state.updateUser)
    const {showToast} = useToast()

    const [initialLoading, setInitialLoading] = useState(false)
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [showDatePicker, setShowDatePicker] = useState(false)

    const [loading, setLoading] = useState(false)
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined)
    const [fullName, setFullName] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [numberError, setNumberError] = useState(false)

    const nameRef = useRef<TextInput>(null)
    const emailRef = useRef<TextInput>(null)

    const [isEditingPhone, setIsEditingPhone] = useState(mobileNumber.length !== 10)
    const hasSavedNumber = mobileNumber.trim().length === 10

    useEffect(() => {
        if (!user) {
            return
        }

        setProfileImage(user.profileImage)
        setFullName(user.name ?? "")
        setEmailAddress(user.email ?? "")
        setMobileNumber(user.phone ?? "")
        setSelectedGender(user.gender ?? null)
        setDateOfBirth(user.dateOfBirth ?? "")
    }, [user])
    
    const formatMobileNumber = (text: string) => {
        let numbersOnly = text.replace(/\D/g, "")

        if (numbersOnly.startsWith("91") && numbersOnly.length > 10) {
            numbersOnly = numbersOnly.slice(2)
        }

        numbersOnly = numbersOnly.slice(0, 10)

        setMobileNumber(numbersOnly)
    }

    const formatDateForApi = (date: Date) => {
        const year = date.getFullYear()

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0")

        const day = String(
            date.getDate()
        ).padStart(2, "0")

        return `${year}-${month}-${day}`
    }

    const formatDateForDisplay = (value: string) => {
        if (!value) return ""

        const [year, month, day] =
            value.split("-").map(Number)

        const date = new Date(
            year,
            month - 1,
            day
        )

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        )
    }

    const handleDateChange = (event: DateTimePickerChangeEvent, selectedDate: Date) => {
        setDateOfBirth(formatDateForApi(selectedDate))

        if (Platform.OS === "android") {
            setShowDatePicker(false)
        }
    }

    const getDatePickerValue = () => {
        if (!dateOfBirth) {
            return new Date(2000, 0, 1)
        }

        const [year, month, day] =
            dateOfBirth
                .split("-")
                .map(Number)

        return new Date(
            year,
            month - 1,
            day
        )
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

    const handleUpdateProfile = async () => {
        if (loading) return

        const trimmedName = fullName.trim()
        const trimmedEmail = emailAddress.trim()
        const trimmedPhone = mobileNumber.trim()

        let hasError = false

        setNameError(false)
        setEmailError(false)
        setNumberError(false)

        if (!trimmedName) {
            setNameError(true)
            hasError = true
        }

        if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setEmailError(true)
            hasError = true
        }

        if (trimmedPhone && !/^[6-9]\d{9}$/.test(trimmedPhone)) {
            setNumberError(true)
            hasError = true
        }

        if (hasError) {
            showToast("Please enter valid profile details", "warning")

            return
        }

        try {
            setLoading(true)

            const profileRes = await editUserProfile({
                name: trimmedName,

                ...(trimmedEmail && {
                    email: trimmedEmail
                }),

                ...(trimmedPhone && {
                    phone: trimmedPhone
                }),

                ...(profileImage &&
                    profileImage.startsWith("http") && {
                        image_url: profileImage
                    })
            })

            console.log("Edit profile response:", profileRes.data)

            if (!profileRes.data.success) {
                showToast(profileRes.data.message || "Failed to update profile", "warning")

                return
            }

            const updatedProfile = profileRes.data.data

            updateUser({
                id: updatedProfile?.id ?? user?.id,
                name: updatedProfile?.name ?? trimmedName,
                email: updatedProfile?.email ?? trimmedEmail,
                phone:
                    updatedProfile?.phone ??
                    (trimmedPhone || user?.phone || null),
                gender:
                    updatedProfile?.gender ??
                    selectedGender ??
                    user?.gender ??
                    null,

                dateOfBirth:
                    updatedProfile?.date_of_birth ??
                    dateOfBirth ??
                    user?.dateOfBirth ??
                    null,
                profileImage:
                    updatedProfile?.picture_url ??
                    updatedProfile?.image_url ??
                    user?.profileImage,
                isActive: updatedProfile?.is_active ?? user?.isActive,
                role:
                    updatedProfile?.role ??
                    user?.role ??
                    "USER"
                    
            })

            showToast("Profile updated successfully", "success")

            router.back()
        } catch (error: any) {
            console.log("Update profile error:", error)

            showToast(error?.message || "Unable to update profile", "warning")
        } finally {
            setLoading(false)
        }
    }

    const [selectedGender, setSelectedGender] = useState<Gender | null>(user?.gender ?? null)
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const menuRefs = useRef<Record<string, View | null>>({})

    const [menuPosition, setMenuPosition] = useState({top: 0, left: 0})

    const MENU_WIDTH = moderateScale(155)
    const MENU_HEIGHT = moderateScale(125)

    const handleOpenMenu = (id: string) => {
        const ref = menuRefs.current[id]

        if (!ref) return

        ref.measureInWindow((x, y, width, height) => {
            const screenHeight = Dimensions.get("window").height

            const spaceBelow = screenHeight - (y + height)

            const openUp = spaceBelow < MENU_HEIGHT + verticalScale(20)

            setMenuPosition({
                left: Math.max(
                    scale(12),
                    x + width - MENU_WIDTH
                ),

                top: openUp
                    ? y - MENU_HEIGHT - verticalScale(5)
                    : y + height + verticalScale(5)
            })

            setOpenMenu(id)
        })
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

            {initialLoading ? (
                <View className="flex-1 items-center justify-center">
                    <LottieView
                        source={require("../../../assets/animations/Food_Loading2.json")}
                        autoPlay
                        loop
                        style={{
                            width: moderateScale(125),
                            height: moderateScale(125)
                        }}
                    />
                </View>
            ) : (
                <KeyboardAwareScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        marginTop: verticalScale(8),
                        paddingBottom: verticalScale(25),
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

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                nameRef.current?.focus()
                            }
                        }}
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
                                ref={nameRef}
                                className={`p-0 tracking-wide font-medium ${
                                    loading
                                        ? "text-[#9CA3AF]"
                                        : "text-[#151515]"
                                }`}
                                style={{
                                    height: verticalScale(40),
                                    fontSize: moderateScale(13),
                                    textAlignVertical: "center",
                                    includeFontPadding: false
                                }}
                                value={fullName}
                                onChangeText={(text) => {
                                    const cleaned = text
                                        .replace(/[^a-zA-Z\s.'-]/g, "")
                                        .replace(/\s{2,}/g, " ")

                                    setFullName(cleaned)
                                    setNameError(false)
                                }}
                                placeholder="Full Name"
                                placeholderTextColor="#9A9A9A"
                                keyboardType="default"
                                returnKeyType="done"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="name"
                                autoComplete="name"
                                maxLength={50}
                                selectionColor="#79685e"
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

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

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                emailRef.current?.focus()
                            }
                        }}
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
                                ref={emailRef}
                                className={`p-0 tracking-wide font-medium ${
                                    loading
                                        ? "text-[#9CA3AF]"
                                        : "text-[#151515]"
                                }`}
                                style={{
                                    height: verticalScale(40),
                                    fontSize: moderateScale(13),
                                    textAlignVertical: "center",
                                    includeFontPadding: false
                                }}
                                value={emailAddress}
                                onChangeText={(text) => {
                                    setEmailAddress(
                                        text.trimStart().replace(/\s/g, "")
                                    )

                                    setEmailError(false)
                                }}
                                placeholder="Email Address"
                                placeholderTextColor="#9A9A9A"
                                keyboardType="email-address"
                                returnKeyType="next"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="emailAddress"
                                autoComplete="email"
                                maxLength={100}
                                selectionColor="#79685e"
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {emailError && (
                        <Text
                            className="self-start font-medium text-[#E05252]"
                            style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                        >
                            Please enter a valid email address
                        </Text>
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{
                            marginTop: verticalScale(10),
                            marginLeft: scale(8)
                        }}    
                    >
                        <Text
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Mobile Number
                        </Text>
                    </View>

                    <View
                        className={`w-full flex-row overflow-hidden ${
                            numberError
                                ? "border border-red-400"
                                : "border border-[#1F1F1F]/10"
                        } bg-white`}
                        style={{
                            marginTop: verticalScale(6),
                            height: verticalScale(46),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="flex-row items-center justify-center relative"
                            style={{
                                width: "22%"
                            }}
                        >
                            <IndiaFlag
                                width={scale(20)}
                                height={verticalScale(22)}
                                style={{ marginRight: scale(6) }}
                            />

                            <Text
                                className="font-medium text-[#151515]"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                +91
                            </Text>

                            <View
                                className="absolute right-0 top-0 bottom-0 bg-[#1F1F1F]/10"
                                style={{ width: scale(0.8) }}
                            />
                        </View>

                        <View
                            className="flex-1 flex-row items-center"
                            style={{
                                paddingLeft: scale(10),
                                paddingRight: scale(7)
                            }}
                        >
                            <TextInput
                                className="flex-1 p-0 tracking-wide font-medium text-[#151515]"
                                style={{
                                    height: verticalScale(40),
                                    fontSize: moderateScale(13),
                                    textAlignVertical: "center",
                                    includeFontPadding: false
                                }}
                                value={
                                    mobileNumber
                                        .replace(/(\d{5})(\d{0,5})/, "$1 $2")
                                        .trim()
                                }
                                placeholder="No mobile number added"
                                placeholderTextColor="#9A9A9A"
                                editable={false}
                                pointerEvents="none"
                            />

                            <TouchableOpacity
                                activeOpacity={0.95}
                                disabled={loading}
                                className='items-center justify-center bg-[#3F2516] mr-2'
                                onPress={() => {
                                    preventDoublePress(() => {
                                        router.push({
                                            pathname: "/change-mobile-number",
                                            params: {
                                                mode: hasSavedNumber ? "change" : "add",
                                                currentPhone: mobileNumber
                                            }
                                        })
                                    })
                                }}
                                style={{
                                    borderRadius:moderateScale(16),
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(6)
                                }}
                            >
                                <Text
                                    className="text-[#FFFFFF] font-semibold"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    {hasSavedNumber ? "Change" : "Add"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {numberError && (
                        <Text
                            className="self-start font-medium text-[#E05252]"
                            style={{
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11)
                            }}
                        >
                            Please enter a valid 10-digit mobile number
                        </Text>
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{
                            marginTop: verticalScale(10),
                            marginLeft: scale(8)
                        }}    
                    >
                        <Text
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Date of Birth
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={loading}
                        onPress={() => {
                            if (!loading) {
                                setShowDatePicker(true)
                            }
                        }}
                        className='bg-[#FFFFFF] border gap-3 border-[#1F1F1F]/10 w-full flex-row items-center overflow-hidden'
                        style={{
                            marginTop: verticalScale(6),
                            paddingRight: scale(15),
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
                            <CakeIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.5} /> 
                        </View>

                        <Text
                            className={`tracking-wide font-medium flex-1 ${
                                dateOfBirth
                                    ? "text-[#151515]"
                                    : "text-[#9A9A9A]"
                            }`}
                            style={{ fontSize: moderateScale(13) }}
                        >
                            {dateOfBirth
                                ? formatDateForDisplay(
                                    dateOfBirth
                                )
                                : "Enter your Date of Birth"}
                        </Text>

                        <CalendarIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F85"} strokeWidth={1.8} />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={getDatePickerValue()}
                            mode="date"
                            display={
                                Platform.OS === "ios"
                                    ? "spinner"
                                    : "default"
                            }
                            maximumDate={new Date()}
                            onValueChange={handleDateChange}
                            onDismiss={() => {
                                setShowDatePicker(false)
                            }}
                        />
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{
                            marginTop: verticalScale(10),
                            marginLeft: scale(8)
                        }}    
                    >
                        <Text
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Gender
                        </Text>
                    </View>

                    <View
                        ref={(ref) => {menuRefs.current.gender = ref}}
                        collapsable={false}
                    >
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {
                                if(!loading) {
                                    handleOpenMenu("gender")
                                }
                            }}
                            className='bg-[#FFFFFF] border gap-3 border-[#1F1F1F]/10 w-full flex-row items-center overflow-hidden'
                            style={{
                                marginTop: verticalScale(6),
                                paddingRight: scale(15),
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
                                <VenusAndMarsIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.5} /> 
                            </View>

                            <Text
                                className={`flex-1 font-medium ${
                                    selectedGender
                                        ? "text-[#151515]"
                                        : "text-[#9A9A9A]"
                                }`}
                                style={{ fontSize: moderateScale(13) }}
                            >
                                {selectedGender
                                    ? GENDER_OPTIONS.find(
                                        (item) =>
                                            item.value ===
                                            selectedGender
                                    )?.label
                                    : "Select gender"
                                }
                            </Text>

                            <ArrowDownIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F85"} strokeWidth={1.8} />
                        </TouchableOpacity>
                    </View>

                    <GradientButton title='Update Profile' onPress={handleUpdateProfile} loading={loading} />
                </KeyboardAwareScrollView>
            )}

            <Modal
                transparent
                visible={openMenu === "gender"}
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() =>
                    setOpenMenu(null)
                }
            >
                <View className="flex-1">
                    <Pressable
                        onPress={() =>
                            setOpenMenu(null)
                        }
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                    />

                    {openMenu === "gender" && (
                        <View
                            className="absolute bg-white border border-[#1F1F1F]/10"
                            style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                                width: MENU_WIDTH,
                                borderRadius: moderateScale(16),
                                paddingVertical: verticalScale(5)
                            }}
                        >
                            {GENDER_OPTIONS.map(
                                (
                                    option,
                                    index
                                ) => {
                                    const isSelected = selectedGender === option.value

                                    return (
                                        <React.Fragment
                                            key={option.value}
                                        >
                                            <TouchableOpacity
                                                activeOpacity={0.95}
                                                onPress={() => {
                                                    setSelectedGender(option.value)
                                                    setOpenMenu(null)
                                                }}
                                                style={{
                                                    paddingHorizontal: scale(14),
                                                    paddingVertical: verticalScale(8)
                                                }}
                                            >
                                                <Text
                                                    className={
                                                        isSelected
                                                            ? "text-[#3F2516] font-semibold"
                                                            : "text-[#1F1F1F]/85 font-medium"
                                                    }
                                                    style={{
                                                        fontSize: moderateScale(13)
                                                    }}
                                                >
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>

                                            {index !== GENDER_OPTIONS.length - 1 && (
                                                <View
                                                    className="bg-[#1F1F1F]/10"
                                                    style={{
                                                        height: 1,
                                                        marginHorizontal: scale(10)
                                                    }}
                                                />
                                            )}
                                        </React.Fragment>
                                    )
                                }
                            )}
                        </View>
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    )
}