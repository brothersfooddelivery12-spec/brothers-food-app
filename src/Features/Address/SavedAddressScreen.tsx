import AddLocationIcon from '@/assets/icon/AddLocationIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import EditIcon from '@/assets/icon/EditIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import InformationCircleIcon from '@/assets/icon/InformationCircleIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon3.svg'
import MortarboardIcon from '@/assets/icon/MortarboardIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import SendIcon from '@/assets/icon/SendIcon.svg'
import { COLORS } from '@/constant/colors'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router, useFocusEffect } from "expo-router"
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, Modal, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { Address, deleteAddress, getAllAddresses, setDefaultAddress } from '../../Services/address-service'
import { useAddressRefreshStore } from '../../Stores/address-refresh-store'
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import AccountActionDialog from '../Profile/Components/AccountActionDialog'
import SavedAddressCard from './Components/SavedAddressCard'

export const ADDRESS_CATEGORIES = [
    "All",
    "Home",
    "Work",
    "College",
    "Others"
]

// export const SAVED_ADDRESSES: AddressItem[] = [
//     {
//         id: "1",
//         title: "Work",
//         address:
//             "MarwadTech Office, Creative Plaza, Floor 4, Jaipur, Rajasthan",
//         isDefault: false,
//     },
//     {
//         id: "2",
//         title: "College",
//         address:
//             "Rajasthan Institute of Technology, Knowledge Park, Jaipur, Rajasthan",
//         isDefault: false,
//     },
//     {
//         id: "3",
//         title: "Other",
//         address:
//             "18 Central Avenue, Near City Mall, Jaipur, Rajasthan",
//         isDefault: false,
//     },
// ]

export default function SavedAddressScreen(){
    const insets = useSafeAreaInsets()
    const preventDoublePress = usePreventDoublePress()
    const { showToast } = useToast()
    const hasFetchedAddresses = useRef(false)
    const addressesDirty = useAddressRefreshStore((state) => state.addressesDirty)
    const clearAddressesDirty = useAddressRefreshStore((state) => state.clearAddressesDirty)

    const [deleteAddressDialogVisible, setDeleteAddressDialogVisible] = useState(false)
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)
    const [defaultDialogVisible, setDefaultDialogVisible] = useState(false)
    const [addressToSetDefault, setAddressToSetDefault] = useState<Address | null>(null)

    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    const menuRefs = useRef<Record<string, View | null>>({})
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
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

    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const selectedMenuItem = addresses.find((item) => item.id === openMenu)

    const defaultAddress = useMemo(() => {
        return (
            addresses.find(
                (item) => item.is_default
            ) ?? null
        )
    }, [addresses])

    const otherAddresses = useMemo(() => {
        return addresses.filter(
            (item) => !item.is_default
        )
    }, [addresses])

    const getAddressIcon = (label: string) => {
        switch (label.toLowerCase()) {
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

    const fetchAddresses = useCallback(async () => {
        try {
            setLoading(true)

            const res = await getAllAddresses()

            console.log("Addresses response:", res.data)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to fetch addresses", "warning")

                return
            }

            setAddresses(res.data.data ?? [])

        } catch (error: any) {
            console.log("Fetch addresses error:", error)

            showToast(error?.message || "Unable to fetch addresses", "warning")

        } finally {
            setLoading(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            const shouldFetch = !hasFetchedAddresses.current || addressesDirty

            if (!shouldFetch) {
                return
            }

            const loadAddresses = async () => {
                await fetchAddresses()

                hasFetchedAddresses.current = true

                if (addressesDirty) {
                    clearAddressesDirty()
                }
            }

            loadAddresses()

        }, [addressesDirty, clearAddressesDirty, fetchAddresses])
    )

    const filteredAddresses = useMemo(() => {
        let result = otherAddresses

        if (selectedCategory !== "All") {
            result = result.filter(
                (item) =>
                    item.label.toLowerCase() ===
                    selectedCategory.toLowerCase()
            )
        }

        if (debouncedSearch.trim()) {
            const query = debouncedSearch.trim().toLowerCase()

            result = result.filter(
                (item) =>
                    item.label.toLowerCase().includes(query) ||

                    item.address_line.toLowerCase().includes(query) ||

                    item.area.toLowerCase().includes(query) ||

                    item.city.toLowerCase().includes(query) ||

                    item.pincode.includes(query)
            )
        }

        return result
    }, [otherAddresses, selectedCategory, debouncedSearch])

    const handleSetDefault = async (addressId: string): Promise<boolean> => {
        if (actionLoading) {
            return false
        }

        try {
            setActionLoading(true)

            const res = await setDefaultAddress(addressId)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to set default address", "warning")

                return false
            }

            setAddresses(prev =>
                prev.map(address => ({
                    ...address,
                    is_default: address.id === addressId
                }))
            )

            showToast(res.data.message || "Default address updated", "success")

            return true
        } catch (error: any) {
            showToast(error?.message || "Unable to set default address", "warning")

            return false
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteAddress = async (addressId: string): Promise<boolean> => {
        if (actionLoading) {
            return false
        }

        try {
            setActionLoading(true)

            const res = await deleteAddress(addressId)

            if (!res.data.success) {
                showToast(res.data.message || "Unable to delete address", "warning")

                return false
            }

            setAddresses(prev => prev.filter(address => address.id !== addressId))

            showToast(res.data.message || "Address deleted", "success")

            return true
        } catch (error: any) {
            showToast(error?.message || "Unable to delete address", "warning")

            return false
        } finally {
            setActionLoading(false)
        }
    }

    const renderAddress = useCallback(
        ({ item }: { item: Address}) => (
            <SavedAddressCard
                item={item}
                icon={getAddressIcon(item.label)}
                menuAnchorRef={(ref) => {
                    menuRefs.current[
                        item.id
                    ] = ref
                }}
                onPress={(address) => {
                    console.log("Address:", address)
                }}
                onMenuPress={(address) => {
                    if (openMenu === address.id) {
                        setOpenMenu(null)
                        return
                    }

                    handleOpenMenu(address.id)
                }}
            />
        ),[openMenu]
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)
    
        return () => clearTimeout(timer)
    }, [search])

    const EmptyAddressState = () => {
        return (
            <View
                className="flex-1 items-center justify-center"
                style={{
                    paddingHorizontal: scale(30),
                    paddingBottom: verticalScale(28)
                }}
            >
                <Image
                    source={require("@/assets/images/EmptyAddressIllustration.png")}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    style={{
                        width: moderateScale(175),
                        height: moderateScale(175)
                    }}
                />

                <Text
                    className="font-extrabold text-center -mt-2"
                    style={{
                        fontSize: moderateScale(17),
                        color: COLORS.primaryTextColor
                    }}
                >
                    No saved addresses yet
                </Text>

                <Text
                    className="font-medium text-center"
                    style={{
                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
                        fontSize: moderateScale(11),
                        marginTop: verticalScale(4),
                        lineHeight: moderateScale(14),
                        paddingHorizontal: scale(24)
                    }}
                >
                    Add a delivery address to make checkout faster and easier.
                </Text>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => preventDoublePress(() => {
                        router.push("/add-address")
                    })}
                    className="flex-row items-center justify-center gap-2"
                    style={{
                        backgroundColor: COLORS.primaryColor,
                        marginTop: verticalScale(15),
                        paddingHorizontal: scale(22),
                        paddingVertical: verticalScale(10),
                        borderRadius: moderateScale(24)
                    }}
                >
                    <AddLocationIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />

                    <Text
                        className="font-semibold"
                        style={{
                            fontSize: moderateScale(13),
                            color: COLORS.primaryBackgroundColor
                        }}
                    >
                        Add New Address
                    </Text>
                </TouchableOpacity>
            </View>
        )
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
                        Saved Addresses
                    </Text>
                                
                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
                    >
                        View and manage delivery addresses
                    </Text>
                </View>
            </View>

            {/* <View
                style={{
                    marginBottom: verticalScale(10),
                    marginHorizontal: scale(14)
                }}
            >
                <SearchBar
                    value={search}
                    onChangeText={setsearch}
                    placeholder="Search your saved addresses..."
                    onRightPress={() => {}}
                />
            </View> */}

            {loading ? (
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
            ) : addresses.length === 0 ? (
                <EmptyAddressState />
            ) : (
                    <FlatList
                        data={filteredAddresses}
                        renderItem={renderAddress}
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="none"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: scale(14),
                            gap: verticalScale(10),
                            paddingBottom: verticalScale(25)
                        }}
                        ListHeaderComponent={
                            <View>
                                <Text
                                    className="font-bold mt-2"
                                    style={{
                                        fontSize: moderateScale(15),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Quick Select
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
                                    {ADDRESS_CATEGORIES.map((category) => {
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
        
                                {defaultAddress && (
                                    <>
                                        <Text
                                            className="font-bold mt-5"
                                            style={{
                                                fontSize: moderateScale(15),
                                                color: COLORS.primaryTextColor
                                            }}
                                        >
                                            Default Destination
                                        </Text>
        
                                        <View
                                            className="relative p-4"
                                            style={{
                                                backgroundColor: COLORS.primaryColor,
                                                borderRadius: moderateScale(22),
                                                marginTop: verticalScale(8)
                                            }}
                                        >
                                            <View
                                                className="absolute items-center justify-center"
                                                style={{
                                                    backgroundColor: COLORS.accentLightColor,
                                                    top: verticalScale(12),
                                                    right: scale(12),
                                                    paddingHorizontal: scale(9),
                                                    paddingVertical: verticalScale(4),
                                                    borderRadius: moderateScale(12),
                                                    zIndex: 10
                                                }}
                                            >
                                                <Text
                                                    className="font-bold"
                                                    style={{
                                                        fontSize: moderateScale(10),
                                                        color: COLORS.primaryColor
                                                    }}
                                                >
                                                    Default
                                                </Text>
                                            </View>
        
                                            <View className="flex-row items-start gap-3">
                                                <View
                                                    className="items-center justify-center rounded-full"
                                                    style={{
                                                        backgroundColor: COLORS.accentLightColor,
                                                        width: moderateScale(44),
                                                        height: moderateScale(44)
                                                    }}
                                                >
                                                    {(() => {
                                                        const Icon = getAddressIcon(defaultAddress.label)
        
                                                        return (
                                                            <Icon
                                                                width={moderateScale(21)}
                                                                height={moderateScale(21)}
                                                                color={COLORS.primaryColor}
                                                                strokeWidth={1.8}
                                                            />
                                                        )
                                                    })()}
                                                </View>
        
                                                <View className="flex-1 mt-2">
                                                    <Text
                                                        numberOfLines={1}
                                                        className="font-bold tracking-wide"
                                                        style={{
                                                            color: COLORS.primaryBackgroundColor,
                                                            fontSize: moderateScale(16),
                                                            paddingRight: scale(65)
                                                        }}
                                                    >
                                                        {defaultAddress.label}
                                                    </Text>
        
                                                    <Text
                                                        className="font-medium"
                                                        style={{
                                                            color: hexToRgba(COLORS.primaryBackgroundColor, 0.75),
                                                            fontSize: moderateScale(11),
                                                            lineHeight: moderateScale(17),
                                                            marginTop: verticalScale(3)
                                                        }}
                                                    >
                                                        {[
                                                            defaultAddress.address_line,
                                                            defaultAddress.landmark,
                                                            defaultAddress.area,
                                                            defaultAddress.city,
                                                            defaultAddress.state,
                                                            defaultAddress.pincode
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </Text>
                                                </View>
                                            </View>
        
                                            <View
                                                className='border border-dashed'
                                                style={{
                                                    borderColor: hexToRgba(COLORS.primaryBackgroundColor, 0.35),
                                                    marginTop: verticalScale(14),
                                                    paddingHorizontal: scale(12),
                                                    paddingVertical: verticalScale(10),
                                                    borderRadius: moderateScale(14)
                                                }}
                                            >
                                                <View className="flex-row items-center gap-2">
                                                    <InformationCircleIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.accentLightColor} strokeWidth={1.5} />
        
                                                    <Text
                                                        className="font-medium uppercase"
                                                        style={{
                                                            color: COLORS.accentLightColor,
                                                            fontSize: moderateScale(10),
                                                            letterSpacing: 0.5
                                                        }}
                                                    >
                                                        Delivery Instructions
                                                    </Text>
                                                </View>
        
                                                <Text
                                                    className="font-medium"
                                                    style={{
                                                        color: hexToRgba(COLORS.primaryBackgroundColor, 0.9),
                                                        fontSize: moderateScale(11),
                                                        lineHeight: moderateScale(17),
                                                        marginTop: verticalScale(6)
                                                    }}
                                                >
                                                    “Leave at the door, ring the bell once.”
                                                </Text>
                                            </View>
        
                                            <View className="flex-row items-center gap-3 mt-4">
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => {}}
                                                    className='flex-row items-center justify-center gap-2'
                                                    style={{
                                                        backgroundColor: COLORS.accentLightColor,
                                                        borderRadius: moderateScale(18),
                                                        paddingRight: scale(12),
                                                        paddingLeft: scale(8),
                                                        paddingVertical: verticalScale(8)
                                                    }}
                                                >
                                                    <SendIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} strokeWidth={1.8} />
        
                                                    <Text
                                                        className='font-semibold'
                                                        style={{
                                                            fontSize: moderateScale(12),
                                                            color: COLORS.primaryColor
                                                        }}
                                                    >
                                                        Navigate
                                                    </Text>
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => {
                                                        preventDoublePress(() => {
                                                            router.push({
                                                                pathname: "/add-address",
                                                                params: {
                                                                    addressId: defaultAddress.id
                                                                }
                                                            })
                                                        })
                                                    }}
                                                    className='rounded-full flex-row items-center justify-center gap-2'
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.25),
                                                        width: moderateScale(40),
                                                        height: moderateScale(40)
                                                    }}
                                                >
                                                    <EditIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />
                                                </TouchableOpacity>
        
                                                <TouchableOpacity
                                                    activeOpacity={0.95}
                                                    onPress={() => {
                                                        setAddressToDelete(defaultAddress)

                                                        setDeleteAddressDialogVisible(true)
                                                    }}
                                                    className='rounded-full flex-row items-center justify-center gap-2'
                                                    style={{
                                                        backgroundColor: hexToRgba(COLORS.primaryBackgroundColor, 0.25),
                                                        width: moderateScale(40),
                                                        height: moderateScale(40)
                                                    }}
                                                >
                                                    <DeleteIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.5} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                )}

                                <View
                                    style={{ marginTop: verticalScale(15) }}
                                >
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(15),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Other Locations
                                    </Text>

                                    {filteredAddresses.length === 0 && (
                                        <View
                                            className="items-center justify-center mx-2"
                                            style={{
                                                backgroundColor: COLORS.secondaryBackgroundColor,
                                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                                borderWidth: moderateScale(0.5),
                                                marginTop: verticalScale(15),
                                                paddingHorizontal: scale(20),
                                                paddingVertical: verticalScale(20),
                                                borderRadius: moderateScale(20)
                                            }}
                                        >
                                            <View
                                                className='rounded-full items-center justify-center'
                                                style={{
                                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                                    width: moderateScale(44),
                                                    height: moderateScale(44)
                                                }}
                                            >
                                                <LocationIcon width={moderateScale(24)} height={moderateScale(24)} color={COLORS.secondaryColor} strokeWidth={1.5} />
                                            </View>

                                            <Text
                                                className="font-semibold"
                                                style={{
                                                    color: COLORS.primaryTextColor,
                                                    fontSize: moderateScale(14),
                                                    marginTop: verticalScale(8)
                                                }}
                                            >
                                                {otherAddresses.length === 0
                                                    ? "No other locations"
                                                    : "No matching addresses"
                                                }
                                            </Text>

                                            <Text
                                                className="font-medium text-center"
                                                style={{
                                                    color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                                    fontSize: moderateScale(11),
                                                    marginTop: verticalScale(3)
                                                }}
                                            >
                                                {otherAddresses.length === 0
                                                    ? "Add another delivery address to see it here."
                                                    : "Try selecting a different address category."
                                                }
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        }
                        ListFooterComponent={
                            <>
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => preventDoublePress(() => {
                                        router.push("/add-address")
                                    })}
                                    className="flex-row gap-2 items-center justify-center mx-2"
                                    style={{
                                        backgroundColor: COLORS.primaryColor,
                                        marginTop: verticalScale(16),
                                        borderRadius: moderateScale(28),
                                        paddingHorizontal: scale(12),
                                        paddingVertical: verticalScale(14)
                                    }}
                                >
                                    <AddLocationIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />
                                
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(14),
                                            color: COLORS.primaryBackgroundColor
                                        }}
                                    >
                                        Add New Address
                                    </Text>
                                </TouchableOpacity>
                            </>
                        }
                    />
                )
            }

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
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {
                                    setOpenMenu(null)

                                    preventDoublePress(() => {
                                        router.push({
                                            pathname: "/add-address",
                                            params: {
                                                addressId: selectedMenuItem.id
                                            }
                                        })
                                    })
                                }}
                                style={{
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(8)
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                    }}
                                >
                                    Edit Address
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    height: 1,
                                    marginHorizontal: scale(10)
                                }}
                            />

                            {!selectedMenuItem.is_default && (
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {
                                        setOpenMenu(null)

                                        setAddressToSetDefault(selectedMenuItem)

                                        setDefaultDialogVisible(true)
                                    }}
                                    style={{
                                        paddingHorizontal: scale(14),
                                        paddingVertical: verticalScale(8)
                                    }}
                                >
                                    <Text
                                        className="font-medium"
                                        style={{
                                            fontSize: moderateScale(13),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                        }}
                                    >
                                        Set as Default
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <View
                                style={{
                                    backgroundColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                    height: 1,
                                    marginHorizontal: scale(10)
                                }}
                            />

                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => {
                                    setOpenMenu(null)

                                    setAddressToDelete(selectedMenuItem)

                                    setDeleteAddressDialogVisible(true)
                                }}
                                style={{
                                    paddingHorizontal: scale(14),
                                    paddingVertical: verticalScale(8)
                                }}
                            >
                                <Text
                                    className="font-medium"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.errorTextColor
                                    }}
                                >
                                    Delete Address
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>

            {deleteAddressDialogVisible && (
                <AccountActionDialog
                    visible={deleteAddressDialogVisible}
                    type="address-delete"
                    loading={actionLoading}
                    addressLabel={addressToDelete?.label}
                    onCancel={() => {
                        if (actionLoading) return

                        setDeleteAddressDialogVisible(false)
                        setAddressToDelete(null)
                    }}
                    onConfirm={async () => {
                        if (!addressToDelete) {
                            return
                        }

                        const success = await handleDeleteAddress(addressToDelete.id)

                        if (!success) {
                            return
                        }

                        setDeleteAddressDialogVisible(false)
                        setAddressToDelete(null)
                    }}
                />
            )}

            {defaultDialogVisible && (
                <AccountActionDialog
                    visible={defaultDialogVisible}
                    type="set-default-address"
                    loading={actionLoading}
                    addressLabel={addressToSetDefault?.label}
                    onCancel={() => {
                        if (actionLoading) return

                        setDefaultDialogVisible(false)
                        setAddressToSetDefault(null)
                    }}
                    onConfirm={async () => {
                        if (!addressToSetDefault || actionLoading) {
                            return
                        }

                        const success = await handleSetDefault(addressToSetDefault.id)

                        if (!success) {
                            return
                        }

                        setDefaultDialogVisible(false)
                        setAddressToSetDefault(null)
                    }}
                />
            )}
        </SafeAreaView>
    )
}