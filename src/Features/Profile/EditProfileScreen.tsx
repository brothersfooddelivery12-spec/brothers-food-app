import ArrowDownIcon from '@/assets/icon/ArrowDown.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CakeIcon from '@/assets/icon/CakeIcon2.svg'
import CalendarIcon from '@/assets/icon/DateIcon.svg'
import IndiaFlag from '@/assets/icon/India.svg'
import MailIcon from '@/assets/icon/MailIcon.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import VenusAndMarsIcon from '@/assets/icon/VenusAndMarsIcon.svg'
import CalendarPicker from '@/components/CalenderSheet'
import GradientButton from '@/components/GradientButton'
import ProfilePhotoPicker from "@/components/ProfilePhotoPicker"
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Dimensions, Keyboard, Modal, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { editUserProfile } from '../../Services/api-service'
import { useAuthStore } from '../../Stores/auth-store'
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'

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
    const preventDoublePress = usePreventDoublePress()
    const user = useAuthStore((state) => state.user)
    const updateUser = useAuthStore((state) => state.updateUser)
    const {showToast} = useToast()

    const [initialLoading, setInitialLoading] = useState(false)
    const [dateOfBirth, setDateOfBirth] = useState<string>("")
    const [dobPickerVisible, setDobPickerVisible] = useState(false)

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

        const month = String(date.getMonth() + 1).padStart(2, "0")

        const day = String(date.getDate()).padStart(2, "0")

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

    const handleDobConfirm = useCallback((selectedDate: Date) => {
        const today = new Date()

        if (selectedDate > today) {
            showToast("Date of birth cannot be in the future", "info")

            return
        }

        setDateOfBirth(formatDateForApi(selectedDate))

        setDobPickerVisible(false)
    },[])

    const getDobPickerValue = useCallback(() => {
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
    }, [dateOfBirth])

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
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: COLORS.primaryBackgroundColor }}
        >
            <StatusBar
                translucent
                backgroundColor={COLORS.primaryBackgroundColor}
                barStyle="dark-content"
            />

            <View
                className="flex-row items-center w-full -mx-1"
                style={{
                    paddingHorizontal: scale(14),
                    marginTop: verticalScale(12),
                    marginBottom: verticalScale(8),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center rounded-full"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.7),
                        width: moderateScale(40),
                        height: moderateScale(40)
                    }}
                >
                    <BackArrowIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>
            
                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Edit Profile
                    </Text>
                                
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                        className="font-medium self-start"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.85),
                            fontSize: moderateScale(13),
                            marginTop: verticalScale(15),
                            marginLeft: scale(6)
                        }}
                    >
                        Full Name
                    </Text>

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                nameRef.current?.focus()
                            }
                        }}
                        className="flex-row items-center overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: nameError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.7),
                            marginTop: verticalScale(6),
                            paddingRight: scale(10),
                            paddingLeft: scale(9),
                            height: verticalScale(46),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="items-center justify-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <UserIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={nameRef}
                                className="p-0 tracking-wide font-medium"
                                style={{
                                    color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
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
                                placeholderTextColor={COLORS.placeholderTextColor}
                                keyboardType="default"
                                returnKeyType="done"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="name"
                                autoComplete="name"
                                maxLength={50}
                                selectionColor={COLORS.selectionColor}
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {nameError && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                color: COLORS.errorTextColor,
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11)
                            }}
                        >
                            Please enter your full name
                        </Text>
                    )}

                    <Text
                        className="font-medium self-start"
                        style={{
                            color: hexToRgba(COLORS.primaryTextColor, 0.85),
                            fontSize: moderateScale(13),
                            marginTop: verticalScale(10),
                            marginLeft: scale(6)
                        }}
                    >
                        Email Address
                    </Text>

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                emailRef.current?.focus()
                            }
                        }}
                        className="w-full flex-row items-center overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: emailError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.7),
                            marginTop: verticalScale(6),
                            paddingRight: scale(10),
                            paddingLeft: scale(9),
                            height: verticalScale(46),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="items-center justify-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <MailIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={emailRef}
                                className="p-0 tracking-wide font-medium"
                                style={{
                                    color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
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
                                placeholderTextColor={COLORS.placeholderTextColor}
                                keyboardType="email-address"
                                returnKeyType="next"
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType="emailAddress"
                                autoComplete="email"
                                maxLength={100}
                                selectionColor={COLORS.selectionColor}
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {emailError && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                color: COLORS.errorTextColor,
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11)
                            }}
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
                            className="font-medium"
                            style={{
                                color: hexToRgba(COLORS.primaryTextColor, 0.85),
                                fontSize: moderateScale(13)
                            }}
                        >
                            Mobile Number
                        </Text>
                    </View>

                    <View
                        className="w-full flex-row overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: numberError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.7),
                            marginTop: verticalScale(6),
                            height: verticalScale(46),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="flex-row items-center justify-center relative"
                            style={{ width: "22%" }}
                        >
                            <IndiaFlag width={scale(20)} height={verticalScale(22)} style={{ marginRight: scale(6) }} />

                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.inputTextColor
                                }}
                            >
                                +91
                            </Text>

                            <View
                                className="absolute right-0 top-0 bottom-0"
                                style={{
                                    width: scale(0.6),
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                                }}
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
                                className="flex-1 p-0 tracking-wide font-medium"
                                style={{
                                    color: COLORS.inputTextColor,
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
                                placeholderTextColor={COLORS.placeholderTextColor}
                                editable={false}
                                pointerEvents="none"
                            />

                            <TouchableOpacity
                                activeOpacity={0.95}
                                disabled={loading}
                                className='items-center justify-centermr-2'
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
                                    backgroundColor: COLORS.primaryColor,
                                    borderRadius:moderateScale(16),
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(6)
                                }}
                            >
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    {hasSavedNumber ? "Change" : "Add"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {numberError && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                color: COLORS.errorTextColor,
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
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
                        >
                            Date of Birth
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        disabled={loading}
                        onPress={() => {
                            if (!loading) {
                                setDobPickerVisible(true)
                            }
                        }}
                        className='gap-3 w-full flex-row items-center overflow-hidden'
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.7),
                            marginTop: verticalScale(6),
                            paddingRight: scale(15),
                            paddingLeft: scale(9),
                            height: verticalScale(46),
                            borderRadius: moderateScale(18)
                        }}
                    >
                        <View
                            className="items-center justify-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <CakeIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                        </View>

                        <Text
                            className="tracking-wide font-medium flex-1"
                            style={{
                                fontSize: moderateScale(13),
                                color: dateOfBirth
                                    ? COLORS.inputTextColor
                                    : COLORS.placeholderTextColor
                            }}
                        >
                            {dateOfBirth
                                ? formatDateForDisplay(
                                    dateOfBirth
                                )
                                : "Enter your Date of Birth"
                            }
                        </Text>

                        <CalendarIcon width={moderateScale(22)} height={moderateScale(22)} color={hexToRgba(COLORS.primaryTextColor, 0.65)} strokeWidth={1.8} />
                    </TouchableOpacity>

                    <View 
                        className="flex-row items-center"
                        style={{
                            marginTop: verticalScale(10),
                            marginLeft: scale(8)
                        }}    
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
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
                            className='gap-3 w-full flex-row items-center overflow-hidden'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.7),
                                marginTop: verticalScale(6),
                                paddingRight: scale(15),
                                paddingLeft: scale(9),
                                height: verticalScale(46),
                                borderRadius: moderateScale(18)
                            }}
                        >
                            <View
                                className="items-center justify-center"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.65),
                                    width: moderateScale(36),
                                    height: moderateScale(36),
                                    borderRadius: moderateScale(10)
                                }}
                            >
                                <VenusAndMarsIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} /> 
                            </View>

                            <Text
                                className="flex-1 font-medium"
                                style={{
                                    color: selectedGender
                                        ? COLORS.inputTextColor
                                        : COLORS.placeholderTextColor,
                                    fontSize: moderateScale(13)
                                    
                                }}
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

                            <ArrowDownIcon width={moderateScale(20)} height={moderateScale(20)} color={hexToRgba(COLORS.primaryTextColor, 0.65)} strokeWidth={1.8} />
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
                            className="absolute"
                            style={{
                                backgroundColor: COLORS.primaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.7),
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
                                                    className={isSelected ? "font-semibold" : "font-medium"}
                                                    style={{
                                                        color: isSelected
                                                            ? COLORS.primaryColor
                                                            : hexToRgba(COLORS.primaryTextColor, 0.85),
                                                        fontSize: moderateScale(13)
                                                    }}
                                                >
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>

                                            {index !== GENDER_OPTIONS.length - 1 && (
                                                <View
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
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

            <CalendarPicker
                visible={dobPickerVisible}
                title="Select Date of Birth"
                selectedDate={getDobPickerValue()}
                futureDisable
                action="Select"
                onConfirm={handleDobConfirm}
                onClose={() => {
                    setDobPickerVisible(false)
                }}
            />
        </SafeAreaView>
    )
}