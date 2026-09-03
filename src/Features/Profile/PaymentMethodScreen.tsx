import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import BHIMUpiIcon from '@/assets/icon/BHIMUpiIcon.svg'
import CardIcon from '@/assets/icon/DebitCardIcon.svg'
import EllipsisVerticalIcon from "@/assets/icon/EllipsisVerticalIcon.svg"
import GooglePayIcon from '@/assets/icon/GooglePayIcon.svg'
import PaytmIcon from '@/assets/icon/PaytmLogo.svg'
import PhonePeIcon from '@/assets/icon/PhonePe.svg'
import SuperMoneyIcon from '@/assets/icon/SuperMoneyLogo.svg'
import UpiIcon from '@/assets/icon/upi.svg'
import { router } from "expo-router"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Modal, Platform, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import UpiApps, { InstalledUpiApp } from "../../../modules/upi-apps"
import { PaymentMethod } from '../Checkout/CheckoutScreen'

const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: "gpay",
        title: "Google Pay",
        description: "harshsuthar@oksbi",
        paymentType: "upi",
        icon: GooglePayIcon,
        size: 20,
        isDefault: true
    },
    {
        id: "phonepe",
        title: "PhonePe",
        description: "harshsuthar@ybl",
        paymentType: "upi",
        icon: PhonePeIcon,
        size: 20
    },
    {
        id: "paytm",
        title: "Paytm",
        description: "harshsuthar@paytm",
        paymentType: "upi",
        icon: PaytmIcon,
        size: 28
    },
    {
        id: "hdfc-card",
        title: "HDFC Bank ****4567",
        description: "Credit Card",
        paymentType: "card",
        icon: CardIcon,
        size: 22
    }
]

export default function PaymentMethodScreen(){
    const [installedUpiApps, setInstalledUpiApps] = useState<InstalledUpiApp[]>([])
    const [loadingUpiApps, setLoadingUpiApps] = useState(true)
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS)
    const menuRefs = useRef<Record<string, View | null>>({})

    const selectedMenuItem = paymentMethods.find((item) => item.id === openMenu)
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0
    })
    const MENU_WIDTH = moderateScale(155)
    const MENU_HEIGHT = moderateScale(90)

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

    const handleSetDefault = useCallback((id: string) => {
        setPaymentMethods((prev) =>
            prev.map((item) => ({
                ...item,
                isDefault: item.id === id
            }))
        )

        setOpenMenu(null)
    }, [])

    const handleRemovePayment = useCallback((id: string) => {
        setPaymentMethods((prev) =>
            prev.filter((item) => item.id !== id)
        )

        setOpenMenu(null)
    }, [])

    useEffect(() => {
        const loadUpiApps = async () => {
            if (Platform.OS !== "android") {
                setLoadingUpiApps(false)
                return
            }

            try {
                const apps = await UpiApps.getInstalledUpiApps()

                console.log("Installed UPI Apps:", apps)

                setInstalledUpiApps(apps)
            } catch (error) {
                console.log("UPI Apps detection failed:", error)
            } finally {
                setLoadingUpiApps(false)
            }
        }

        loadUpiApps()
    }, [])

    const getUpiAppIcon = (packageName: string) => {
        switch (packageName) {
            case "com.google.android.apps.nbu.paisa.user":
                return GooglePayIcon

            case "com.phonepe.app":
                return PhonePeIcon

            case "net.one97.paytm":
                return PaytmIcon

            case "in.org.npci.upiapp":
                return BHIMUpiIcon

            case "money.super.payments":
                return SuperMoneyIcon

            default:
                return UpiIcon
        }
    }

    const deviceUpiMethods = useMemo(() => {
        return installedUpiApps.map((app) => ({
            id: `upi-${app.packageName}`,
            title: app.name,
            description: "Pay securely using UPI",
            paymentType: "UPI",
            packageName: app.packageName,
            icon: getUpiAppIcon(app.packageName),
            size: 23
        }))
    }, [installedUpiApps])

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
                        Payment Methods
                    </Text>
                                        
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Choose how you’d like to pay for your order
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25)
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    className='text-[#1F1F1F] font-semibold'
                    style={{ fontSize: moderateScale(15) }}
                >
                    Add New Method
                </Text>

                <View
                    className="bg-white border border-[#1F1F1F]/10 overflow-hidden mt-3"
                    style={{ borderRadius: moderateScale(20) }}
                >
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="flex-row items-center"
                        style={{
                            paddingHorizontal: scale(14),
                            paddingVertical: verticalScale(10)
                        }}
                    >
                        <View
                            className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                            style={{
                                width: moderateScale(46),
                                height: moderateScale(46)
                            }}
                        >
                            <UpiIcon width={moderateScale(30)} height={moderateScale(30)} color="#3F2516" />
                        </View>

                        <View className="flex-1 ml-3">
                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{ fontSize: moderateScale(13) }}
                            >
                                UPI
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/75 font-medium mt-1"
                                style={{ fontSize: moderateScale(10.5) }}
                            >
                                Pay using any UPI app 
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/55 font-medium"
                                style={{ fontSize: moderateScale(9.5), marginTop: moderateScale(2) }}
                            >
                                Google Pay, PhonePe, Paytm, BHIM & more
                            </Text>
                        </View>

                        <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.5} />
                    </TouchableOpacity>
                </View>

                <View
                    className="bg-white border border-[#1F1F1F]/10 overflow-hidden mt-2"
                    style={{ borderRadius: moderateScale(20) }}
                >
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="flex-row items-center"
                        style={{
                            paddingHorizontal: scale(14),
                            paddingVertical: verticalScale(10)
                        }}
                    >
                        <View
                            className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                            style={{
                                width: moderateScale(46),
                                height: moderateScale(46)
                            }}
                        >
                            <CardIcon width={moderateScale(26)} height={moderateScale(26)} color="#3F2516" />
                        </View>

                        <View className="flex-1 ml-3">
                            <Text
                                className="text-[#1F1F1F] font-semibold"
                                style={{ fontSize: moderateScale(13) }}
                            >
                                Credit/Debit Card
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/75 font-medium mt-1"
                                style={{ fontSize: moderateScale(10.5) }}
                            >
                                Add and save your card details
                            </Text>

                            <Text
                                className="text-[#1F1F1F]/55 font-medium"
                                style={{ fontSize: moderateScale(9.5), marginTop: moderateScale(2) }}
                            >
                                Visa, MasterCard, Rupay & more
                            </Text>
                        </View>

                        <ArrowRightIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" strokeWidth={1.5} />
                    </TouchableOpacity>
                </View>

                {deviceUpiMethods.length > 0 && (
                    <>
                        <Text
                            className="text-[#1F1F1F] font-semibold mt-4 mb-2"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            UPI Apps
                        </Text>

                        <View
                            className="bg-white border border-[#1F1F1F]/10 overflow-hidden"
                            style={{ borderRadius: moderateScale(20) }}
                        >
                            {deviceUpiMethods.map((item, index) => {
                                const Icon = item.icon
                                const isLast = index === deviceUpiMethods.length - 1

                                return (
                                    <React.Fragment key={item.id}>
                                        <TouchableOpacity
                                            activeOpacity={0.95}
                                            onPress={() => {}}
                                            className="flex-row items-center"
                                            style={{
                                                paddingHorizontal: scale(14),
                                                paddingVertical: verticalScale(11)
                                            }}
                                        >
                                            <View
                                                className="items-center justify-center rounded-full bg-[#E5E4E2]/55"
                                                style={{
                                                    width: moderateScale(42),
                                                    height: moderateScale(42)
                                                }}
                                            >
                                                <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} />
                                            </View>

                                            <View className="flex-1 ml-3">
                                                <Text
                                                    className="text-[#1F1F1F] font-semibold"
                                                    style={{ fontSize: moderateScale(14) }}
                                                >
                                                    {item.title}
                                                </Text>

                                                <Text
                                                    className="text-[#1F1F1F]/75 font-medium mt-1"
                                                    style={{ fontSize: moderateScale(10) }}
                                                >
                                                    {item.description}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        {!isLast && (
                                            <View
                                                className="bg-[#1F1F1F]/10"
                                                style={{
                                                    height: 1,
                                                    marginHorizontal: scale(14)
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </View>
                    </>
                )}

                <Text
                    className='text-[#1F1F1F] font-semibold mt-6'
                    style={{ fontSize: moderateScale(15) }}
                >
                    Saved Payment Methods
                </Text>

               <View
                    className="bg-white border border-[#1F1F1F]/10 overflow-visible mt-3"
                    style={{ borderRadius: moderateScale(20) }}
                >
                    {paymentMethods.map((item, index) => {
                        const isLast = index === PAYMENT_METHODS.length - 1
                        const Icon = item.icon

                        return (
                            <React.Fragment key={item.id}>
                                <View
                                    className="flex-row items-center relative"
                                    style={{
                                        paddingLeft: scale(14),
                                        paddingRight: scale(10),
                                        paddingVertical: verticalScale(11),
                                        zIndex: openMenu === item.id ? 100 : 1
                                    }}
                                >
                                    <View
                                        className="items-center justify-center bg-[#E5E4E2]/55 rounded-full"
                                        style={{
                                            width: moderateScale(42),
                                            height: moderateScale(42)
                                        }}
                                    >
                                        <Icon width={moderateScale(item.size)} height={moderateScale(item.size)} color="#3F2516" />
                                    </View>

                                    <View
                                        className="flex-1"
                                        style={{ marginLeft: scale(11) }}
                                    >
                                        <View className="flex-row items-center gap-2">
                                            <Text
                                                numberOfLines={1}
                                                className="text-[#1F1F1F] font-semibold"
                                                style={{ fontSize: moderateScale(13) }}
                                            >
                                                {item.title}
                                            </Text>

                                            {item.isDefault && (
                                                <View
                                                    className="bg-[#E8B93F]/15"
                                                    style={{
                                                        borderRadius: moderateScale(10),
                                                        paddingHorizontal: scale(6),
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

                                        {item.description && (
                                            <Text
                                                numberOfLines={1}
                                                className="text-[#1F1F1F]/65 font-medium"
                                                style={{
                                                    fontSize: moderateScale(10),
                                                    marginTop: verticalScale(3)
                                                }}
                                            >
                                                {item.description}
                                            </Text>
                                        )}
                                    </View>

                                    <View
                                        className="flex-row items-center"
                                        style={{
                                            gap: scale(5),
                                            marginLeft: scale(8)
                                        }}
                                    >
                                        {item.paymentType && (
                                            <View
                                                className="border border-[#1F1F1F]/10 items-center justify-center"
                                                style={{
                                                    borderRadius: moderateScale(8),
                                                    paddingHorizontal: scale(7),
                                                    paddingVertical: verticalScale(3)
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    className="text-[#1F1F1F]/75 font-semibold uppercase"
                                                    style={{ fontSize: moderateScale(8.5) }}
                                                >
                                                    {item.paymentType}
                                                </Text>
                                            </View>
                                        )}

                                        <View
                                            ref={(ref) => {
                                                menuRefs.current[item.id] = ref
                                            }}
                                            collapsable={false}
                                        >
                                            <TouchableOpacity
                                                activeOpacity={0.95}
                                                onPress={() => {
                                                    if (openMenu === item.id) {
                                                        setOpenMenu(null)
                                                        return
                                                    }

                                                    handleOpenMenu(item.id)
                                                }}
                                                className="items-center justify-center"
                                                style={{
                                                    width: moderateScale(30),
                                                    height: moderateScale(30)
                                                }}
                                            >
                                                <EllipsisVerticalIcon
                                                    width={moderateScale(19)}
                                                    height={moderateScale(19)}
                                                    color="rgba(31,31,31,0.65)"
                                                    strokeWidth={1.8}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {!isLast && (
                                    <View
                                        className="bg-[#1F1F1F]/10"
                                        style={{
                                            height: 1,
                                            marginHorizontal: scale(14)
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        )
                    })}
                </View>
            </ScrollView>

            <Modal
                transparent
                visible={openMenu !== null}
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setOpenMenu(null)}
            >
                <View className="flex-1">
                    <Pressable
                        onPress={() => setOpenMenu(null)}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                    />

                    {selectedMenuItem && (
                        <View
                            className="absolute bg-white border border-[#1F1F1F]/10"
                            style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                                width: MENU_WIDTH,
                                borderRadius: moderateScale(14),
                                paddingVertical: verticalScale(4)
                            }}
                        >
                            {!selectedMenuItem.isDefault && (
                                <>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => handleSetDefault(selectedMenuItem.id)}
                                        style={{
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(9)
                                        }}
                                    >
                                        <Text
                                            className="text-[#1F1F1F] font-medium"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            Set as Default
                                        </Text>
                                    </TouchableOpacity>

                                    <View
                                        className="bg-[#1F1F1F]/10"
                                        style={{
                                            height: 1,
                                            marginHorizontal: scale(10)
                                        }}
                                    />
                                </>
                            )}

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleRemovePayment(selectedMenuItem.id)}
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(9)
                                }}
                            >
                                <Text
                                    className="text-[#EF4444] font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    )
}