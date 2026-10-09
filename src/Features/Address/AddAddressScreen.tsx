import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BuildingIcon from '@/assets/icon/BuildingIcon.svg'
import CallIcon from '@/assets/icon/CallOutlineIcon.svg'
import CityIcon from '@/assets/icon/CityIcon.svg'
import HouseIcon from '@/assets/icon/HomeIcon.svg'
import LocateFixedIcon from '@/assets/icon/LocateFixedIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import MapsLocationIcon from '@/assets/icon/MapsLocationIcon.svg'
import PinLocation from '@/assets/icon/PinLocation.svg'
import UserIcon from '@/assets/icon/UserIcon.svg'
import GradientButton from '@/components/GradientButton'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { router, useLocalSearchParams } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { addAddress, AddAddressRequest, getAddressById, updateAddress } from '../../Services/address-service'
import { useAddressRefreshStore } from '../../Stores/address-refresh-store'
import { useToast } from '../hook/ToastContext'
import { AddressField } from './Components/AddressField'

const ADDRESS_LABELS = [
    "Home",
    "Work",
    "College",
    "Others"
]

const DEFAULT_LATITUDE = 25.1526
const DEFAULT_LONGITUDE = 73.0823

export default function AddAddressScreen(){
    const { showToast } = useToast()
    const { addressId } = useLocalSearchParams<{addressId?: string}>()
    const isEditMode = Boolean(addressId)
    const markAddressesDirty = useAddressRefreshStore((state) => state.markAddressesDirty)

    const [initialLoading, setInitialLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("Home")
    const [receiverName, setReceiverName] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [area, setArea] = useState("")
    const [landmark, setLandmark] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [pinCode, setPinCode] = useState("")
    const [addressLine, setAddressLine] = useState("")
    const [latitude, setLatitude] = useState(DEFAULT_LATITUDE)
    const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE)
    
    const [receiverNameError, setReceiverNameError] = useState(false)
    const [addressLineError, setAddressLineError] = useState(false)
    const [numberError, setNumberError] = useState(false)
    const [areaError, setAreaError] = useState(false)
    const [cityError, setCityError] = useState(false)
    const [stateError, setStateError] = useState(false)
    const [pinCodeError, setPinCodeError] = useState(false)

    const receiverNameRef = useRef<TextInput>(null)
    const phoneRef = useRef<TextInput>(null)
    const addressLineRef = useRef<TextInput>(null)
    const pincodeRef = useRef<TextInput>(null)

    const formatMobileNumber = (text: string) => {
        let numbersOnly = text.replace(/\D/g, "")

        if (numbersOnly.startsWith("91") && numbersOnly.length > 10) {
            numbersOnly = numbersOnly.slice(2)
        }

        numbersOnly = numbersOnly.slice(0, 10)

        setMobileNumber(numbersOnly)
    }

    const fetchAddressDetails = useCallback(async () => {
        if (!addressId) return

        try {
            setInitialLoading(true)

            const res = await getAddressById(addressId)

            console.log("Fetched Addresse response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch address", "warning")

                router.back()
                return
            }

            const address = res.data.data

            setSelectedCategory(address.label || "Home")
            setReceiverName(address.receiver_name || "")
            setMobileNumber(address.receiver_phone || "")
            setAddressLine(address.address_line || "")
            setLandmark(address.landmark || "")
            setArea(address.area || "")
            setCity(address.city || "")
            setState(address.state || "")
            setPinCode(address.pincode || "")
            const apiLatitude = Number(address.latitude)
            const apiLongitude = Number(address.longitude)

            const hasValidCoordinates =
                Number.isFinite(apiLatitude) &&
                Number.isFinite(apiLongitude) &&
                apiLatitude !== 0 &&
                apiLongitude !== 0

            setLatitude(
                hasValidCoordinates
                    ? apiLatitude
                    : DEFAULT_LATITUDE
            )

            setLongitude(
                hasValidCoordinates
                    ? apiLongitude
                    : DEFAULT_LONGITUDE
            )
        } catch (error: any) {
            console.log("Fetch address error:", error)

            showToast(error?.message || "Unable to fetch address","warning")

            router.back()
        } finally {
            setInitialLoading(false)
        }
    }, [addressId])

    useEffect(() => {
        if (isEditMode) {
            fetchAddressDetails()
        }
    }, [isEditMode, fetchAddressDetails])

    const handleSaveAddress = async () => {
        if (loading) return

        const trimmedReceiverName = receiverName.trim()
        const trimmedAddressLine = addressLine.trim()
        const trimmedArea = area.trim()
        const trimmedLandmark = landmark.trim()
        const trimmedCity = city.trim()
        const trimmedState = state.trim()
        const trimmedPinCode = pinCode.trim()

        setReceiverNameError(false)
        setNumberError(false)
        setAddressLineError(false)
        setAreaError(false)
        setCityError(false)
        setStateError(false)
        setPinCodeError(false)

        let hasError = false

        if (!trimmedReceiverName) {
            setReceiverNameError(true)
            hasError = true

            return
        }

        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            setNumberError(true)
            hasError = true

            return
        }

        if (!trimmedAddressLine) {
            setAddressLineError(true)
            hasError = true

            return
        }

        if (!trimmedArea) {
            setAreaError(true)
            hasError = true

            showToast("Please fill all required fields correctly", "warning")
            return
        }

        if (!trimmedCity) {
            setCityError(true)
            hasError = true

            showToast("Please fill all required fields correctly", "warning")
            return
        }

        if (!trimmedState) {
            setStateError(true)
            hasError = true

            showToast("Please fill all required fields correctly", "warning")
            return
        }

        if (!/^[1-9][0-9]{5}$/.test(trimmedPinCode)) {
            setPinCodeError(true)
            hasError = true

            return
        }

        if (hasError) {
            showToast("Please fill all required fields correctly", "warning")

            return
        }

        const payload: AddAddressRequest = {
            label: selectedCategory,
            receiver_name: trimmedReceiverName,
            receiver_phone: mobileNumber,
            address_line: trimmedAddressLine,
            landmark: trimmedLandmark,
            area: trimmedArea,
            city: trimmedCity,
            state: trimmedState,
            pincode: trimmedPinCode,
            latitude,
            longitude
        }

        try {
            setLoading(true)

            if (isEditMode && addressId) {
                const res =
                    await updateAddress(
                        addressId,
                        {
                            id: addressId,
                            ...payload
                        }
                    )
                
                console.log("Update Addresse response:", res.data)

                if (!res.data.success) {
                    showToast(res.data.message || "Unable to update address", "warning")

                    return
                }

                markAddressesDirty()

                showToast("Address updated successfully","success")
            } else {
                const res = await addAddress(payload)

                console.log("Add Address response:", res.data)

                if (!res.data.success) {
                    showToast(res.data.message || "Unable to save address", "warning")

                    return
                }

                markAddressesDirty()
                
                showToast("Address saved successfully", "success")
            }

            router.back()
        } catch (error: any) {
            console.error("Save address error:", error)

            showToast(error?.message || "Unable to save address", "warning")
        } finally {
            setLoading(false)
        }
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
                        borderWidth: moderateScale(0.5),
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
                        {isEditMode ? "Edit Address" : "Add Address"}
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        {isEditMode
                            ? "Update your delivery address details"
                            : "Add your delivery address for a seamless experience"
                        }
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
                    <View
                        className="flex-row gap-2 p-3 items-center"
                        style={{
                            backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                            borderColor: hexToRgba(COLORS.accentColor, 0.15),
                            borderWidth: moderateScale(0.7),
                            borderRadius: moderateScale(16),
                            marginBottom: verticalScale(8)
                        }}
                    >
                        <View
                            className='rounded-full items-center justify-center'
                            style={{
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.25),
                                width: moderateScale(40),
                                height: moderateScale(40)
                            }}
                        >
                            <LocateFixedIcon width={moderateScale(22)} height={moderateScale(22)} color={COLORS.secondaryColor} strokeWidth={1.5} />
                        </View>

                        <View className='justify-center gap-1 mr-1'>
                            <Text
                                className='font-semibold'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Use Current Location
                            </Text>

                            <Text
                                className='font-medium'
                                style={{
                                    fontSize: moderateScale(9),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                Automatically detect your address
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center"
                            style={{
                                backgroundColor: COLORS.primaryColor,
                                paddingHorizontal: scale(10),
                                paddingVertical: verticalScale(7),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <LocateFixedIcon width={moderateScale(21)} height={moderateScale(21)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />

                            <View className='justify-center mr-1'>
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(9),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    Select
                                </Text>

                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(9),
                                        color: COLORS.primaryBackgroundColor
                                    }}
                                >
                                    Current Location
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text
                        className='font-semibold mt-3'
                        style={{
                            fontSize: moderateScale(15),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Address Label
                    </Text>

                    <ScrollView
                        horizontal
                        nestedScrollEnabled
                        directionalLockEnabled
                        showsHorizontalScrollIndicator={false}
                        className="-mx-5 mt-3"
                        contentContainerStyle={{
                            paddingHorizontal: scale(14),
                            gap: scale(10)
                        }}
                    >
                        {ADDRESS_LABELS.map((category) => {
                            const isSelected = selectedCategory === category
                    
                            return (
                                <TouchableOpacity
                                    key={category}
                                    activeOpacity={0.85}
                                    onPress={() => {
                                        setSelectedCategory(category)
                                    }}
                                    className="items-center justify-center"
                                    style={{
                                        backgroundColor: isSelected
                                            ? COLORS.primaryColor
                                            : hexToRgba(COLORS.softBackgroundColor, 0.75),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(16),
                                        paddingVertical: verticalScale(7),
                                        borderWidth: 0.7,
                                        borderColor: isSelected ? COLORS.primaryColor : COLORS.softBackgroundColor
                                    }}
                                >
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor
                                        }}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>

                    <View 
                        className="flex-row items-center"
                        style={{ marginTop: verticalScale(14) }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
                        >
                            Receiver Name
                        </Text>

                        <Text
                            className="font-bold"
                            style={{
                                color: COLORS.errorBorderColor,
                                fontSize: moderateScale(13),
                                marginLeft: scale(2)
                            }}
                        >
                            *
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                receiverNameRef.current?.focus()
                            }
                        }}
                        className="flex-row items-center overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: receiverNameError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
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
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <UserIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={receiverNameRef}
                                className="p-0 tracking-wide font-medium"
                                style={{
                                    color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
                                    height: verticalScale(40),
                                    fontSize: moderateScale(13),
                                    textAlignVertical: "center",
                                    includeFontPadding: false
                                }}
                                value={receiverName}
                                onChangeText={(text) => {
                                    const cleaned = text
                                        .replace(/[^a-zA-Z\s.'-]/g, "")
                                        .replace(/\s{2,}/g, " ")

                                    setReceiverName(cleaned)
                                    setReceiverNameError(false)
                                }}
                                placeholder="Enter Receiver Name"
                                placeholderTextColor={ COLORS.placeholderTextColor }
                                keyboardType="default"
                                returnKeyType="done"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="name"
                                autoComplete="name"
                                maxLength={50}
                                selectionColor={ COLORS.selectionColor }
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {receiverNameError && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11),
                                color: COLORS.errorTextColor
                            }}
                        >
                            Please enter receiver name
                        </Text>
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{ marginTop: verticalScale(10) }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
                        >
                            Receiver Phone
                        </Text>

                        <Text
                            className="font-bold"
                            style={{
                                color: COLORS.errorBorderColor,
                                fontSize: moderateScale(13),
                                marginLeft: scale(2)
                            }}
                        >
                            *
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                phoneRef.current?.focus()
                            }
                        }}
                        className="flex-row items-center overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: numberError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
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
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <CallIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={phoneRef}
                                className="p-0 tracking-wide font-medium"
                                style={{
                                    color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
                                    height: verticalScale(40),
                                    fontSize: moderateScale(13),
                                    textAlignVertical: "center",
                                    includeFontPadding: false
                                }}
                                value={
                                    mobileNumber
                                        .replace(/(\d{5})(\d{0,5})/,"$1 $2")
                                        .trim()
                                }
                                onChangeText={(text) => {
                                    formatMobileNumber(text)
                                    setNumberError(false)
                                }}
                                placeholder="Enter 10-digit mobile number"
                                placeholderTextColor={ COLORS.placeholderTextColor }
                                keyboardType="phone-pad"
                                returnKeyType="done"
                                autoCorrect={false}
                                autoCapitalize="none"
                                textContentType="telephoneNumber"
                                autoComplete="tel"
                                maxLength={16}
                                selectionColor={ COLORS.selectionColor }
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {numberError && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11),
                                color: COLORS.errorTextColor
                            }}
                        >
                            Please enter a valid 10-digit mobile number
                        </Text>
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{ marginTop: verticalScale(10) }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
                        >
                            Address Line
                        </Text>

                        <Text
                            className="font-bold"
                            style={{
                                color: COLORS.errorBorderColor,
                                fontSize: moderateScale(13),
                                marginLeft: scale(2)
                            }}
                        >
                            *
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                addressLineRef.current?.focus()
                            }
                        }}
                        className="flex-row items-center overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: addressLineError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
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
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <HouseIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={addressLineRef}
                                className="p-0 tracking-wide font-medium"
                                style={{
                                    color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
                                    height: verticalScale(40),
                                    fontSize: moderateScale(13),
                                    textAlignVertical: "center",
                                    includeFontPadding: false
                                }}
                                value={addressLine}
                                onChangeText={(text) => {
                                    const cleaned = text
                                        .replace(/[^\p{L}\p{M}\p{N}\s,.'#/\-()]/gu, "")
                                        .replace(/\s{2,}/g, " ")

                                    setAddressLine(cleaned)
                                    setAddressLineError(false)
                                }}
                                placeholder="House/Building No., Street Name etc."
                                placeholderTextColor={ COLORS.placeholderTextColor }
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="fullStreetAddress"
                                autoComplete="street-address"
                                maxLength={120}
                                selectionColor={ COLORS.selectionColor }
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {addressLineError  && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11),
                                color: COLORS.errorTextColor
                            }}
                        >
                            Please enter your complete address
                        </Text>
                    )}

                    <View
                        className="w-full flex-row"
                        style={{
                            gap: scale(10),
                            marginTop: verticalScale(10)
                        }}
                    >
                        <AddressField
                            label="Area"
                            required
                            value={area}
                            placeholder="Enter area"
                            icon={BuildingIcon}
                            loading={loading}
                            error={areaError}
                            maxLength={60}
                            onChangeText={(text) => {
                                const cleaned = text
                                    .replace(/[^\p{L}\p{M}\d\s.'-/&]/gu, "")
                                    .replace(/\s{2,}/g, " ")

                                setArea(cleaned)
                                setAreaError(false)
                            }}
                        />

                        <AddressField
                            label="Landmark"
                            value={landmark}
                            placeholder="Near landmark"
                            icon={LocationIcon}
                            loading={loading}
                            maxLength={80}
                            onChangeText={(text) => {
                                setLandmark(text)
                            }}
                        />
                    </View>

                    <View
                        className="w-full flex-row"
                        style={{
                            gap: scale(10),
                            marginTop: verticalScale(10)
                        }}
                    >
                        <AddressField
                            label="City"
                            required
                            value={city}
                            placeholder="Enter city"
                            icon={CityIcon}
                            loading={loading}
                            error={cityError}
                            maxLength={50}
                            onChangeText={(text) => {
                                const cleaned = text
                                    .replace(/[^\p{L}\p{M}\s.'-]/gu, "")
                                    .replace(/\s{2,}/g, " ")

                                setCity(cleaned)
                                setCityError(false)
                            }}
                        />

                        <AddressField
                            label="State"
                            required
                            value={state}
                            placeholder="Enter state"
                            icon={PinLocation}
                            loading={loading}
                            error={stateError}
                            onChangeText={(text) => {
                                const cleaned = text
                                    .replace(/[^\p{L}\p{M}\s.'-]/gu, "")
                                    .replace(/\s{2,}/g, " ")

                                setState(cleaned)
                                setStateError(false)
                            }}
                        />
                    </View>

                    <View 
                        className="flex-row items-center"
                        style={{ marginTop: verticalScale(10) }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: hexToRgba(COLORS.primaryTextColor, 0.85)
                            }}
                        >
                            Pincode
                        </Text>

                        <Text
                            className="font-bold"
                            style={{
                                color: COLORS.errorBorderColor,
                                fontSize: moderateScale(13),
                                marginLeft: scale(2)
                            }}
                        >
                            *
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => {
                            if(!loading) {
                                pincodeRef.current?.focus()
                            }
                        }}
                        className="flex-row items-center overflow-hidden"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: pinCodeError ? COLORS.errorBorderColor : hexToRgba(COLORS.primaryTextColor, 0.1),
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
                                backgroundColor: hexToRgba(COLORS.neutralSurfaceColor, 0.75),
                                width: moderateScale(36),
                                height: moderateScale(36),
                                borderRadius: moderateScale(10)
                            }}
                        >
                            <MapsLocationIcon width={scale(20)} height={scale(20)} color={COLORS.primaryTextColor} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={pincodeRef}
                                value={pinCode}
                                onChangeText={(text) => {
                                    const cleaned = text
                                        .replace(/\D/g, "")
                                        .slice(0, 6)

                                    setPinCode(cleaned)
                                    setPinCodeError(false)
                                }}
                                placeholder="Enter 6-digit pincode"
                                placeholderTextColor={ COLORS.placeholderTextColor }
                                keyboardType="number-pad"
                                returnKeyType="done"
                                maxLength={6}
                                autoCorrect={false}
                                autoCapitalize="none"
                                textContentType="postalCode"
                                autoComplete="postal-code"
                                className="p-0 tracking-wide font-medium"
                                style={{
                                    color: loading ? COLORS.disabledTextColor : COLORS.inputTextColor,
                                    height: moderateScale(22),
                                    fontSize: moderateScale(13),
                                    includeFontPadding: false,
                                    textAlignVertical: "center"
                                }}
                                selectionColor={ COLORS.selectionColor }
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {pinCodeError && (
                        <Text
                            className="self-start font-medium"
                            style={{
                                marginTop: verticalScale(4),
                                marginLeft: scale(8),
                                fontSize: moderateScale(11),
                                color: COLORS.errorTextColor
                            }}
                        >
                            Please enter a valid 6-digit PIN code
                        </Text>
                    )}

                    <GradientButton title={isEditMode ? "Update Address" : "Save Address"} onPress={handleSaveAddress} loading={loading} />
                </KeyboardAwareScrollView>
            )}
        </SafeAreaView>
    )
}