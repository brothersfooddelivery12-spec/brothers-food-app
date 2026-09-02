import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import BellOffIcon from '@/assets/icon/BellOffIcon.svg'
import CallIcon from '@/assets/icon/CallOutlineIcon.svg'
import CartIcon from '@/assets/icon/CartIcon.svg'
import InstructionIcon from '@/assets/icon/DescriptionIcon.svg'
import DoorIcon from '@/assets/icon/DoorIcon.svg'
import HandIcon from '@/assets/icon/HandHelpingIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import InfoIcon from '@/assets/icon/InformationCircleIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import MortarboardIcon from '@/assets/icon/MortarboardIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import ToggleSwitch from '@/components/ToggleSwitch'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { AddressItem } from './Components/SavedAddressCard'

export const SAVED_ADDRESSES: AddressItem[] = [
    {
        id: "1",
        title: "Home",
        address:
            "42 Heritage Lane, Skyline Apartments, B-Block, Near Central Park, Jaipur, Rajasthan 302001",
        isDefault: true,
    },
    {
        id: "2",
        title: "Work",
        address:
            "MarwadTech Office, Creative Plaza, Floor 4, Jaipur, Rajasthan",
        isDefault: false,
    },
    {
        id: "3",
        title: "College",
        address:
            "Rajasthan Institute of Technology, Knowledge Park, Jaipur, Rajasthan",
        isDefault: false,
    },
    {
        id: "4",
        title: "Other",
        address:
            "18 Central Avenue, Near City Mall, Jaipur, Rajasthan",
        isDefault: false,
    },
]

const DELIVERY_OPTIONS = [
    {
        id: "1",
        title: "Don’t ring doorbell",
        icon: BellOffIcon
    },
    {
        id: "2",
        title: "Call before delivery",
        icon: CallIcon
    },
    {
        id: "3",
        title: "Leave at the door",
        icon: DoorIcon
    },
    {
        id: "4",
        title: "Hand to me",
        icon: HandIcon
    }
]

export default function DeliveryInstructionScreen(){
    const [selectedAddressId, setSelectedAddressId] = useState(
        SAVED_ADDRESSES.find((item) => item.isDefault)?.id ?? null
    )
    const [deliveryNote, setDeliveryNote] = useState("")
    const [selectedInstructions, setSelectedInstructions] = useState<string[]>([])
    const [deliveryPreferences, setDeliveryPreferences] = useState(false)
    
    const handleInstructionPress = useCallback((id: string) => {
        setSelectedInstructions((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        )
    }, [])

    const getAddressIcon = (title: string) => {
        switch (title.toLowerCase()) {
            case "home":
                return HomeIcon

            case "work":
                return OfficeIcon

            case "college":
                return MortarboardIcon

            default:
                return LocationIcon
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
                        Delivery Instructions
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Choose where and how to receive your order.
                    </Text>
                </View>
            </View>

            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25)
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bottomOffset={30}
                extraKeyboardSpace={20}
            >

                <View
                    className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                    style={{ borderRadius: moderateScale(18) }}
                >
                    <View className='flex-row gap-2 items-center'>
                        <View
                            className="items-center justify-center bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <LocationIcon width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={1.8} />
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-bold'
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Select Delivery Address
                        </Text>
                    </View>

                    <View
                        style={{
                            marginTop: verticalScale(12),
                            gap: verticalScale(10)
                        }}
                    >
                        {SAVED_ADDRESSES.map((item) => {
                            const Icon = getAddressIcon(item.title)
                            const isSelected = selectedAddressId === item.id

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.95}
                                    onPress={() => setSelectedAddressId(item.id)}
                                    className="p-3 border"
                                    style={{
                                        borderRadius: moderateScale(16),
                                        backgroundColor: isSelected
                                            ? "rgba(232,185,63,0.07)"
                                            : "#FFFFFF",
                                        borderWidth: moderateScale(1),
                                        borderColor: isSelected
                                            ? "rgba(63, 37, 22, 0.45)"
                                            : "rgba(31,31,31,0.10)"
                                    }}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? "#3F2516"
                                                    : "rgba(232,185,63,0.15)",
                                                width: moderateScale(42),
                                                height: moderateScale(42)
                                            }}
                                        >
                                            <Icon width={moderateScale(20)} height={moderateScale(20)} color={isSelected ? "#FFFFFF" : "#3F2516"} strokeWidth={1.8} />
                                        </View>

                                        <View className="flex-1">
                                            <View className="flex-row items-center gap-2">
                                                <Text
                                                    numberOfLines={1}
                                                    className="text-[#1F1F1F] font-semibold"
                                                    style={{ fontSize: moderateScale(14) }}
                                                >
                                                    {item.title}
                                                </Text>

                                                {item.isDefault && (
                                                    <View
                                                        className="bg-[#F8D56A]"
                                                        style={{
                                                            borderRadius: moderateScale(10),
                                                            paddingHorizontal: scale(8),
                                                            paddingVertical: verticalScale(3)
                                                        }}
                                                    >
                                                        <Text
                                                            className="text-[#3F2516] font-semibold uppercase"
                                                            style={{ fontSize: moderateScale(7.5) }}
                                                        >
                                                            Default
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            <Text
                                                className="text-[#1F1F1F]/75 font-medium"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    lineHeight: moderateScale(15),
                                                    marginTop: verticalScale(3)
                                                }}
                                            >
                                                {item.address}
                                            </Text>
                                        </View>

                                        <View
                                            className="items-center justify-center self-center rounded-full"
                                            style={{
                                                width: moderateScale(22),
                                                height: moderateScale(22),
                                                borderWidth: moderateScale(2),
                                                borderColor: isSelected
                                                    ? "#5c4639"
                                                    : "#D6D0CA",
                                            }}
                                        >
                                            {isSelected && (
                                                <View
                                                    className='rounded-full'
                                                    style={{
                                                        width: moderateScale(14),
                                                        height: moderateScale(14),
                                                        backgroundColor: "#5c4639",
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                <View
                    className="bg-white border border-[#1F1F1F]/10"
                    style={{
                        borderRadius: moderateScale(18),
                        padding: moderateScale(12),
                        marginTop: verticalScale(14)
                    }}
                >
                    <View className="flex-row items-center">
                        <View
                            className="items-center justify-center bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <InstructionIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" strokeWidth={1.8} />
                        </View>

                        <View
                            className="flex-1"
                            style={{ marginLeft: scale(10) }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold"
                                style={{ fontSize: moderateScale(13) }}
                            >
                                Delivery Instructions
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/75 font-medium"
                                style={{
                                    fontSize: moderateScale(10),
                                    marginTop: verticalScale(2)
                                }}
                            >
                                Add details that will help our delivery partner
                            </Text>
                        </View>

                        <Text
                            className="text-[#1F1F1F]/55 font-medium"
                            style={{ fontSize: moderateScale(9) }}
                        >
                            {deliveryNote.length}/200
                        </Text>
                    </View>

                    <View
                        className="border border-[#1F1F1F]/10 bg-[#F8F9FA]"
                        style={{
                            borderRadius: moderateScale(14),
                            marginTop: verticalScale(12),
                            minHeight: verticalScale(88),
                            paddingHorizontal: scale(12),
                            paddingVertical: verticalScale(8)
                        }}
                    >
                        <TextInput
                            value={deliveryNote}
                            onChangeText={setDeliveryNote}
                            placeholder="E.g. Don’t ring the doorbell, call on phone, leave at the gate, etc."
                            placeholderTextColor="#7A7D81"
                            multiline
                            maxLength={200}
                            textAlignVertical="top"
                            className="text-[#151515] font-medium flex-1"
                            style={{
                                fontSize: moderateScale(12),
                                lineHeight: moderateScale(18),
                                paddingVertical: 0,
                                includeFontPadding: false
                            }}
                            selectionColor="#79685e"
                        />
                    </View>

                    <View
                        className="flex-row flex-wrap justify-center"
                        style={{
                            gap: moderateScale(10),
                            marginTop: verticalScale(14)
                        }}
                    >
                        {DELIVERY_OPTIONS.map((item) => {
                            const Icon = item.icon
                            const isSelected = selectedInstructions.includes(item.id)

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.95}
                                    onPress={() => handleInstructionPress(item.id)}
                                    className="flex-row items-center border"
                                    style={{
                                        width: "47%",
                                        minHeight: verticalScale(30),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(6),

                                        backgroundColor: isSelected
                                            ? "rgba(63, 37, 22, 0.85)"
                                            : "#FFFFFF",

                                        borderWidth: moderateScale(1),
                                        borderColor: isSelected
                                            ? "rgba(63, 37, 22, 0.45)"
                                            : "rgba(31,31,31,0.10)"
                                    }}
                                >
                                    <Icon width={moderateScale(17)} height={moderateScale(17)} color={isSelected ? "#FFFFFF" : "#3F2516"} strokeWidth={1.7} />

                                    <Text
                                        numberOfLines={1}
                                        className="text-[#1F1F1F] font-medium flex-1"
                                        style={{
                                            color: isSelected ? "#FFFFFF" : "#1F1F1F",
                                            fontSize: moderateScale(10),
                                            marginLeft: scale(8)
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                <View
                    className="mt-3 p-3 bg-white border border-[#1F1F1F]/10"
                    style={{ borderRadius: moderateScale(18), marginTop: verticalScale(14) }}
                >
                    <View className='flex-row gap-2 items-center'>
                        <View
                            className="items-center justify-center bg-[#E8B93F]/15"
                            style={{
                                width: moderateScale(38),
                                height: moderateScale(38),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <CartIcon width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={1.8} />
                        </View>

                        <Text
                            className='text-[#1F1F1F] font-bold'
                            style={{ fontSize: moderateScale(13) }}
                        >
                            Delivery Preferences
                        </Text>
                    </View>

                    <View
                        className="px-3 py-4 border border-[#1F1F1F]/10 bg-[#F8F9FA] mt-4"
                        style={{ borderRadius: moderateScale(14) }}
                    >
                        <View className='flex-row gap-2 items-center mx-2'>
                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#1F1F1F] font-semibold'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Contactless Delivery
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium mt-1'
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Leave my order at the doorstep.
                                </Text>
                            </View>

                            <ToggleSwitch enabled={deliveryPreferences} onPress={() => setDeliveryPreferences(!deliveryPreferences)} />
                        </View>

                        <View
                            className="bg-[#1F1F1F]/10"
                            style={{
                                height: 1,
                                marginVertical: verticalScale(10),
                                marginHorizontal: moderateScale(6)
                            }}
                        />

                        <View className='flex-row gap-2 items-center mx-2'>
                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#1F1F1F] font-semibold'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Priority Delivery
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium mt-1'
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Assign best available delivery partner.
                                </Text>
                            </View>

                            <ToggleSwitch enabled={deliveryPreferences} onPress={() => setDeliveryPreferences(!deliveryPreferences)} />
                        </View>

                        <View
                            className="bg-[#1F1F1F]/10"
                            style={{
                                height: 1,
                                marginVertical: verticalScale(10),
                                marginHorizontal: moderateScale(6)
                            }}
                        />

                        <View className='flex-row gap-2 items-center mx-2'>
                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#1F1F1F] font-semibold'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Safe Drop Location
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium mt-1'
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Deliver at a safe and secure place.
                                </Text>
                            </View>

                            <ToggleSwitch enabled={deliveryPreferences} onPress={() => setDeliveryPreferences(!deliveryPreferences)} />
                        </View>
                    </View>

                    <View
                        className="flex-row gap-3 p-3 items-center bg-[#E8B93F]/15 border border-[#E8B93F]/25"
                        style={{
                            borderRadius: moderateScale(16),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <InfoIcon width={moderateScale(20)} height={moderateScale(20)} color={"#5c4639"} strokeWidth={1.8} />
                        <Text
                            className="text-[#3F2516] font-medium flex-1"
                            style={{ fontSize: moderateScale(10)}}
                        >
                            Our delivery partner will follow your instructions and contact you if needed.
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}