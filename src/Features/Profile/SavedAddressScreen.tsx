import AddLocationIcon from '@/assets/icon/AddLocationIcon.svg'
import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import DeleteIcon from '@/assets/icon/DeleteIcon.svg'
import EditIcon from '@/assets/icon/EditIcon.svg'
import HomeIcon from '@/assets/icon/HomeIcon.svg'
import InformationCircleIcon from '@/assets/icon/InformationCircleIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import MortarboardIcon from '@/assets/icon/MortarboardIcon.svg'
import OfficeIcon from '@/assets/icon/OfficeIcon.svg'
import SendIcon from '@/assets/icon/SendIcon.svg'
import { router } from "expo-router"
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Modal, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import SavedAddressCard, { AddressItem } from './Components/SavedAddressCard'

const ADDRESS_CATEGORIES = [
    "All",
    "Home",
    "Office",
    "College",
    "Others"
]

export const SAVED_ADDRESSES: AddressItem[] = [
    {
        id: "1",
        title: "Work",
        address:
            "MarwadTech Office, Creative Plaza, Floor 4, Jaipur, Rajasthan",
        isDefault: false,
    },
    {
        id: "2",
        title: "College",
        address:
            "Rajasthan Institute of Technology, Knowledge Park, Jaipur, Rajasthan",
        isDefault: false,
    },
    {
        id: "3",
        title: "Other",
        address:
            "18 Central Avenue, Near City Mall, Jaipur, Rajasthan",
        isDefault: false,
    },
]

export default function SavedAddressScreen(){
    const insets = useSafeAreaInsets()
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    const menuRefs = useRef<Record<string, View | null>>({})
    
    const selectedMenuItem = SAVED_ADDRESSES.find((item) => item.id === openMenu)
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0
    })
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
    
    const renderAddress = useCallback(
        ({ item }: { item: AddressItem }) => (
            <SavedAddressCard
                item={item}
                icon={getAddressIcon(item.title)}
                menuAnchorRef={(ref) => {
                    menuRefs.current[item.id] = ref
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
                        Saved Addresses
                    </Text>
                                
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
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

            <FlatList
                data={SAVED_ADDRESSES}
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
                            className="text-[#1F1F1F] font-bold mt-2"
                            style={{ fontSize: moderateScale(15) }}
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

                        <Text
                            className="text-[#1F1F1F] font-bold mt-5"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Default Destination
                        </Text>

                        <View
                            className="relative bg-[#3F2516] p-4"
                            style={{
                                borderRadius: moderateScale(22),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <View
                                className="absolute items-center justify-center bg-[#F8D56A]"
                                style={{
                                    top: verticalScale(12),
                                    right: scale(12),
                                    paddingHorizontal: scale(9),
                                    paddingVertical: verticalScale(4),
                                    borderRadius: moderateScale(12),
                                    zIndex: 10
                                }}
                            >
                                <Text
                                    className="font-bold text-[#5C4639]"
                                    style={{ fontSize: moderateScale(10) }}
                                >
                                    Default
                                </Text>
                            </View>

                            <View className="flex-row items-start gap-3">
                                <View
                                    className="items-center justify-center rounded-full bg-[#F8D56A]"
                                    style={{
                                        width: moderateScale(44),
                                        height: moderateScale(44)
                                    }}
                                >
                                    <HomeIcon width={moderateScale(21)} height={moderateScale(21)} color="#5C4639" strokeWidth={1.8} />
                                </View>

                                <View className="flex-1 mt-2">
                                    <Text
                                        numberOfLines={1}
                                        className="text-white font-bold tracking-wide"
                                        style={{
                                            fontSize: moderateScale(16),
                                            paddingRight: scale(65)
                                        }}
                                    >
                                        Home
                                    </Text>

                                    <Text
                                        className="text-white/75 font-medium"
                                        style={{
                                            fontSize: moderateScale(11),
                                            lineHeight: moderateScale(17),
                                            marginTop: verticalScale(3)
                                        }}
                                    >
                                        42 Heritage Lane, Skyline Apartments, B-Block, Near Central
                                        Park, Jaipur, Rajasthan 302001
                                    </Text>
                                </View>
                            </View>

                            <View
                                className='border border-dashed border-[#FFFFFF]/35'
                                style={{
                                    marginTop: verticalScale(14),
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(10),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <View className="flex-row items-center gap-2">
                                    <InformationCircleIcon width={moderateScale(18)} height={moderateScale(18)} color="#F8D56A" strokeWidth={1.8} />

                                    <Text
                                        className="text-[#F8D56A] font-bold uppercase"
                                        style={{
                                            fontSize: moderateScale(10),
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        Delivery Instructions
                                    </Text>
                                </View>

                                <Text
                                    className="text-white/90 font-medium"
                                    style={{
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
                                    className='flex-row items-center justify-center gap-2 bg-[#F8D56A]'
                                    style={{
                                        borderRadius: moderateScale(18),
                                        paddingRight: scale(12),
                                        paddingLeft: scale(8),
                                        paddingVertical: verticalScale(8)
                                    }}
                                >
                                    <SendIcon width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} strokeWidth={1.8} />

                                    <Text
                                        className='text-[#3F2516] font-semibold'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Navigate
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='rounded-full flex-row items-center justify-center gap-2 bg-[#FFFFFF]/25'
                                    style={{
                                        width: moderateScale(40),
                                        height: moderateScale(40)
                                    }}
                                >
                                    <EditIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} strokeWidth={1.5} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='rounded-full flex-row items-center justify-center gap-2 bg-[#FFFFFF]/25'
                                    style={{
                                        width: moderateScale(40),
                                        height: moderateScale(40)
                                    }}
                                >
                                    <DeleteIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} strokeWidth={1.5} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text
                            className="text-[#1F1F1F] font-bold mt-5"
                            style={{ fontSize: moderateScale(15) }}
                        >
                            Other Locations
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    <>
                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {}}
                            className="flex-row gap-2 items-center justify-center bg-[#3F2516] mx-2"
                            style={{
                                marginTop: verticalScale(16),
                                borderRadius: moderateScale(28),
                                paddingHorizontal: scale(12),
                                paddingVertical: verticalScale(14)
                            }}
                        >
                            <AddLocationIcon width={moderateScale(18)} height={moderateScale(18)} color={"#FFFFFF"} strokeWidth={1.8} />
                        
                            <Text
                                className="text-[#FFFFFF] font-semibold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Add New Address
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            />

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
                                paddingVertical: verticalScale(5)
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    setOpenMenu(null)

                                    console.log("Edit:", selectedMenuItem)
                                }}
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8)
                                }}
                            >
                                <Text
                                    className="text-[#1F1F1F]/75 font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Edit Address
                                </Text>
                            </TouchableOpacity>

                            {!selectedMenuItem.isDefault && (
                                <>
                                    <View
                                        className="bg-[#1F1F1F]/10"
                                        style={{
                                            height: 1,
                                            marginHorizontal: scale(10)
                                        }}
                                    />

                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => {
                                            setOpenMenu(null)

                                            console.log("Set default:", selectedMenuItem)
                                        }}
                                        style={{
                                            paddingHorizontal: scale(12),
                                            paddingVertical: verticalScale(8)
                                        }}
                                    >
                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium"
                                            style={{ fontSize: moderateScale(12) }}
                                        >
                                            Set as Default
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <View
                                className="bg-[#1F1F1F]/10"
                                style={{
                                    height: 1,
                                    marginHorizontal: scale(10)
                                }}
                            />

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    setOpenMenu(null)

                                    console.log("Delete:", selectedMenuItem)
                                }}
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8)
                                }}
                            >
                                <Text
                                    className="text-[#EF4444] font-medium"
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    Delete Address
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    )
}