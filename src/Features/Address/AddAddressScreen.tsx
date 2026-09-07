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
import { router, useLocalSearchParams } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import { addAddress, AddAddressRequest, getAddressById, updateAddress } from '../Services/address-service'
import { useAddressRefreshStore } from '../Stores/address-refresh-store'
import { AddressField } from './Components/AddressField'

const ADDRESS_LABELS = [
    "Home",
    "Work",
    "College",
    "Others"
]

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
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    
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
            setLatitude(address.latitude ?? 0)
            setLongitude(address.longitude ?? 0)
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
                        {isEditMode ? "Edit Address" : "Add Address"}
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        {isEditMode
                            ? "Update your delivery address details"
                            : "Add your delivery address for a seamless experience"}
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
                        className="flex-row gap-2 p-3 items-center bg-[#E8B93F]/10 border border-[#E8B93F]/15"
                        style={{
                            borderRadius: moderateScale(16),
                            marginBottom: verticalScale(8)
                        }}
                    >
                        <View
                            className='bg-[#E8B93F]/25 rounded-full items-center justify-center'
                            style={{
                                width: moderateScale(40),
                                height: moderateScale(40)
                            }}
                        >
                            <LocateFixedIcon width={moderateScale(22)} height={moderateScale(22)} color={"#3F2516"} strokeWidth={1.5} />
                        </View>

                        <View className='justify-center gap-1 mr-1'>
                            <Text
                                className='text-[#1F1F1F] font-semibold'
                                style={{ fontSize: moderateScale(12) }}
                            >
                                Use Current Location
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium'
                                style={{ fontSize: moderateScale(9) }}
                            >
                                Automatically detect your address
                            </Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="bg-[#3F2516] flex-row gap-2 items-center justify-center"
                            style={{
                                paddingHorizontal: scale(10),
                                paddingVertical: verticalScale(7),
                                borderRadius: moderateScale(20)
                            }}
                        >
                            <LocateFixedIcon width={moderateScale(21)} height={moderateScale(21)} color={"#FFFFFF"} strokeWidth={1.5} />

                            <View className='justify-center mr-1'>
                                <Text
                                    className="text-white font-semibold"
                                    style={{ fontSize: moderateScale(9) }}
                                >
                                    Select
                                </Text>

                                <Text
                                    className="text-white font-semibold"
                                    style={{ fontSize: moderateScale(9) }}
                                >
                                    Current Location
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text
                        className='text-[#1F1F1F] font-semibold mt-3'
                        style={{ fontSize: moderateScale(15) }}
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
                                    className={`items-center justify-center ${
                                        isSelected ? "bg-[#3F2516]" : "bg-[#faf5ef]"
                                    }`}
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(16),
                                        paddingVertical: verticalScale(7),
                                        borderWidth: isSelected ? 1 : 1,
                                        borderColor: isSelected ? "#3F2516" : "#E8DDD3"
                                    }}
                                >
                                    <Text
                                        className={`font-semibold ${
                                            isSelected ? "text-white" : "text-[#5A3825]"
                                        }`}
                                        style={{ fontSize: moderateScale(13) }}
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
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Receiver Name
                        </Text>

                        <Text
                            className="font-bold text-[#DC2626]"
                            style={{
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
                        className={`flex-row items-center overflow-hidden
                        ${receiverNameError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
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
                                ref={receiverNameRef}
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
                                value={receiverName}
                                onChangeText={(text) => {
                                    const cleaned = text
                                        .replace(/[^a-zA-Z\s.'-]/g, "")
                                        .replace(/\s{2,}/g, " ")

                                    setReceiverName(cleaned)
                                    setReceiverNameError(false)
                                }}
                                placeholder="Enter Receiver Name"
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

                    {receiverNameError && (
                        <Text
                            className="self-start font-medium text-[#E05252]"
                            style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                        >
                            Please enter receiver name
                        </Text>
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{ marginTop: verticalScale(10) }}
                    >
                        <Text
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Receiver Phone
                        </Text>

                        <Text
                            className="font-bold text-[#DC2626]"
                            style={{
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
                        className={`flex-row items-center overflow-hidden
                        ${numberError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
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
                            <CallIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={phoneRef}
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
                                placeholderTextColor="#9A9A9A"
                                keyboardType="phone-pad"
                                returnKeyType="done"
                                autoCorrect={false}
                                autoCapitalize="none"
                                textContentType="telephoneNumber"
                                autoComplete="tel"
                                maxLength={16}
                                selectionColor="#79685e"
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {numberError && (
                        <Text
                            className="self-start font-medium text-[#E05252]"
                            style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
                        >
                            Please enter a valid 10-digit mobile number
                        </Text>
                    )}

                    <View 
                        className="flex-row items-center"
                        style={{ marginTop: verticalScale(10) }}
                    >
                        <Text
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Address Line
                        </Text>

                        <Text
                            className="font-bold text-[#DC2626]"
                            style={{
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
                        className={`flex-row items-center overflow-hidden
                        ${addressLineError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
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
                            <HouseIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.8} /> 
                        </View>

                        <View className="flex-1 justify-center" style={{ paddingHorizontal: scale(10) }}>
                            <TextInput
                                ref={addressLineRef}
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
                                value={addressLine}
                                onChangeText={(text) => {
                                    const cleaned = text
                                        .replace(/[^\p{L}\p{M}\p{N}\s,.'#/\-()]/gu, "")
                                        .replace(/\s{2,}/g, " ")

                                    setAddressLine(cleaned)
                                    setAddressLineError(false)
                                }}
                                placeholder="House/Building No., Street Name etc."
                                placeholderTextColor="#9A9A9A"
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize="words"
                                autoCorrect={false}
                                textContentType="fullStreetAddress"
                                autoComplete="street-address"
                                maxLength={120}
                                selectionColor="#79685e"
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {addressLineError  && (
                        <Text
                            className="self-start font-medium text-[#E05252]"
                            style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
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
                            className="font-medium text-[#1F1F1F]/85"
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Pincode
                        </Text>

                        <Text
                            className="font-bold text-[#DC2626]"
                            style={{
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
                        className={`flex-row items-center overflow-hidden
                        ${pinCodeError ? "border border-red-400" : "border border-[#1F1F1F]/10"} bg-white`}
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
                            <MapsLocationIcon width={scale(20)} height={scale(20)} color={"#655145"} strokeWidth={1.8} /> 
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
                                placeholderTextColor="#9A9A9A"
                                keyboardType="number-pad"
                                returnKeyType="done"
                                maxLength={6}
                                autoCorrect={false}
                                autoCapitalize="none"
                                textContentType="postalCode"
                                autoComplete="postal-code"
                                className={`p-0 tracking-wide font-medium ${
                                    loading
                                        ? "text-[#9CA3AF]"
                                        : "text-[#151515]"
                                }`}
                                style={{
                                    height: moderateScale(22),
                                    fontSize: moderateScale(13),
                                    includeFontPadding: false,
                                    textAlignVertical: "center"
                                }}
                                selectionColor="#79685e"
                                editable={!loading}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                            />
                        </View>
                    </Pressable>

                    {pinCodeError && (
                        <Text
                            className="self-start font-medium text-[#E05252]"
                            style={{ marginTop: verticalScale(4), marginLeft: scale(8), fontSize: moderateScale(11) }}
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