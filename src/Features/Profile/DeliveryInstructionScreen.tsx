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
import LocationFilledIcon from '@/assets/icon/LocationIcon3.svg'
import MortarboardIcon from '@/assets/icon/MortarboardIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import ToggleSwitch from '@/components/ToggleSwitch'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { router } from "expo-router"
import { useCallback, useState } from 'react'
import { StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export const SAVED_ADDRESSES = [
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
                        Delivery Instructions
                    </Text>
                                        
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                    className="mt-3 p-3"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderRadius: moderateScale(18),
                        borderWidth: moderateScale(0.5)
                    }}
                >
                    <View className='flex-row gap-2 items-center'>
                        <View
                            className="items-center justify-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                width: moderateScale(38),
                                height: moderateScale(38),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <LocationFilledIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} strokeWidth={1.8} />
                        </View>

                        <Text
                            className='font-bold'
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryTextColor
                            }}
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
                                    className="p-3"
                                    style={{
                                        borderRadius: moderateScale(16),
                                        backgroundColor: isSelected
                                            ? hexToRgba(COLORS.accentColor, 0.1)
                                            : COLORS.primaryBackgroundColor,
                                        borderWidth: moderateScale(0.7),
                                        borderColor: isSelected
                                            ? hexToRgba(COLORS.accentColor, 0.15)
                                            : hexToRgba(COLORS.primaryTextColor, 0.1)
                                    }}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <View
                                            className="items-center justify-center rounded-full"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? COLORS.primaryColor
                                                    : hexToRgba(COLORS.accentColor, 0.15),
                                                width: moderateScale(42),
                                                height: moderateScale(42)
                                            }}
                                        >
                                            <Icon width={moderateScale(20)} height={moderateScale(20)} color={isSelected ? COLORS.primaryBackgroundColor : COLORS.secondaryColor} strokeWidth={1.8} />
                                        </View>

                                        <View className="flex-1">
                                            <View className="flex-row items-center gap-2">
                                                <Text
                                                    numberOfLines={1}
                                                    className="font-semibold"
                                                    style={{
                                                        fontSize: moderateScale(14),
                                                        color: COLORS.primaryTextColor
                                                    }}
                                                >
                                                    {item.title}
                                                </Text>

                                                {item.isDefault && (
                                                    <View
                                                        style={{
                                                            backgroundColor: COLORS.accentLightColor,
                                                            borderRadius: moderateScale(10),
                                                            paddingHorizontal: scale(8),
                                                            paddingVertical: verticalScale(3)
                                                        }}
                                                    >
                                                        <Text
                                                            className="font-semibold uppercase"
                                                            style={{
                                                                fontSize: moderateScale(7.5),
                                                                color: COLORS.primaryColor
                                                            }}
                                                        >
                                                            Default
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            <Text
                                                className="font-medium"
                                                style={{
                                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
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
                                                    ? COLORS.secondaryColor
                                                    : hexToRgba(COLORS.neutralSurfaceColor, 0.85)
                                            }}
                                        >
                                            {isSelected && (
                                                <View
                                                    className='rounded-full'
                                                    style={{
                                                        width: moderateScale(14),
                                                        height: moderateScale(14),
                                                        backgroundColor: COLORS.secondaryColor
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
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderWidth: moderateScale(0.5),
                        borderRadius: moderateScale(18),
                        padding: moderateScale(12),
                        marginTop: verticalScale(14)
                    }}
                >
                    <View className="flex-row items-center">
                        <View
                            className="items-center justify-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                width: moderateScale(38),
                                height: moderateScale(38),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <InstructionIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} strokeWidth={1.8} />
                        </View>

                        <View
                            className="flex-1"
                            style={{ marginLeft: scale(10) }}
                        >
                            <Text
                                className="font-bold"
                                style={{
                                    fontSize: moderateScale(13),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Delivery Instructions
                            </Text>

                            <Text
                                className="font-medium"
                                style={{
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                    fontSize: moderateScale(10),
                                    marginTop: verticalScale(2)
                                }}
                            >
                                Add details that will help our delivery partner
                            </Text>
                        </View>

                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(9),
                                color: hexToRgba(COLORS.primaryTextColor, 0.65),
                            }}
                        >
                            {deliveryNote.length}/200
                        </Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: COLORS.primaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.7),
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
                            placeholderTextColor={COLORS.placeholderTextColor}
                            multiline
                            maxLength={200}
                            textAlignVertical="top"
                            className="font-medium flex-1"
                            style={{
                                color: COLORS.inputTextColor,
                                fontSize: moderateScale(12),
                                lineHeight: moderateScale(18),
                                paddingVertical: 0,
                                includeFontPadding: false
                            }}
                            selectionColor={COLORS.selectionColor}
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
                                    className="flex-row items-center"
                                    style={{
                                        borderWidth: moderateScale(0.7),
                                        width: "47%",
                                        minHeight: verticalScale(30),
                                        borderRadius: moderateScale(18),
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(6),

                                        backgroundColor: isSelected
                                            ? COLORS.secondaryColor
                                            : COLORS.primaryBackgroundColor,
                                        borderColor: isSelected
                                            ? COLORS.secondaryColor
                                            : hexToRgba(COLORS.primaryTextColor, 0.1),
                                    }}
                                >
                                    <Icon width={moderateScale(17)} height={moderateScale(17)} color={isSelected ? COLORS.primaryBackgroundColor : COLORS.primaryTextColor} strokeWidth={1.7} />

                                    <Text
                                        numberOfLines={1}
                                        className="font-medium flex-1"
                                        style={{
                                            color: isSelected ? COLORS.primaryBackgroundColor : COLORS.primaryTextColor,
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

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="items-center justify-center"
                        style={{
                            backgroundColor: COLORS.primaryColor,
                            borderRadius: moderateScale(18),
                            paddingVertical: verticalScale(12),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <Text
                            className="font-medium"
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryBackgroundColor
                            }}
                        >
                            Save Instructions
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    className="mt-3 p-3"
                    style={{
                        backgroundColor: COLORS.secondaryBackgroundColor,
                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(14),
                        borderWidth: moderateScale(0.5)
                    }}
                >
                    <View className='flex-row gap-2 items-center'>
                        <View
                            className="items-center justify-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                width: moderateScale(38),
                                height: moderateScale(38),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <CartIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} strokeWidth={1.8} />
                        </View>

                        <Text
                            className='font-bold'
                            style={{
                                fontSize: moderateScale(13),
                                color: COLORS.primaryTextColor
                            }}
                        >
                            Delivery Preferences
                        </Text>
                    </View>

                    <View
                        className="px-3 py-4 mt-4"
                        style={{
                            backgroundColor: COLORS.primaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderRadius: moderateScale(14),
                            borderWidth: moderateScale(0.7)
                        }}
                    >
                        <View className='flex-row gap-2 items-center mx-2'>
                            <View className='justify-center flex-1'>
                                <Text
                                    className='font-semibold'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Contactless Delivery
                                </Text>

                                <Text
                                    className='font-medium mt-1'
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Leave my order at the doorstep.
                                </Text>
                            </View>

                            <ToggleSwitch enabled={deliveryPreferences} onPress={() => setDeliveryPreferences(!deliveryPreferences)} />
                        </View>

                        <View
                            style={{
                                backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                height: 0.7,
                                marginVertical: verticalScale(10),
                                marginHorizontal: moderateScale(6)
                            }}
                        />

                        <View className='flex-row gap-2 items-center mx-2'>
                            <View className='justify-center flex-1'>
                                <Text
                                    className='font-semibold'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Priority Delivery
                                </Text>

                                <Text
                                    className='font-medium mt-1'
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Assign best available delivery partner.
                                </Text>
                            </View>

                            <ToggleSwitch enabled={deliveryPreferences} onPress={() => setDeliveryPreferences(!deliveryPreferences)} />
                        </View>

                        <View
                            style={{
                                backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                height: 1,
                                marginVertical: verticalScale(10),
                                marginHorizontal: moderateScale(6)
                            }}
                        />

                        <View className='flex-row gap-2 items-center mx-2'>
                            <View className='justify-center flex-1'>
                                <Text
                                    className='font-semibold'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Safe Drop Location
                                </Text>

                                <Text
                                    className='font-medium mt-1'
                                    style={{
                                        fontSize: moderateScale(10),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    Deliver at a safe and secure place.
                                </Text>
                            </View>

                            <ToggleSwitch enabled={deliveryPreferences} onPress={() => setDeliveryPreferences(!deliveryPreferences)} />
                        </View>
                    </View>

                    <View
                        className="flex-row gap-3 p-3 items-center"
                        style={{
                            backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                            borderColor: hexToRgba(COLORS.accentColor, 0.15),
                            borderRadius: moderateScale(16),
                            borderWidth: moderateScale(0.5),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <InfoIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} strokeWidth={1.5} />
                        <Text
                            className="font-medium flex-1"
                            style={{
                                fontSize: moderateScale(10),
                                color: COLORS.primaryColor
                            }}
                        >
                            Our delivery partner will follow your instructions and contact you if needed.
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}