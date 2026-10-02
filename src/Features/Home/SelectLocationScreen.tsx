import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import LocateFixedIcon from '@/assets/icon/LocateFixedIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import LocationFilledIcon from '@/assets/icon/LocationIcon3.svg'
import SearchIcon from '@/assets/icon/SearchOutline.svg'
import { useLocationStore } from '@/Stores/locationStore'
import { getCurrentLocationDetails } from '@/utils/getCurrentLocation'
import * as Location from "expo-location"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { Alert, FlatList, Linking, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { useToast } from '../hook/ToastContext'
import { usePreventDoublePress } from '../hook/usePreventDoublePress'
import { LocationPermissionState, sleep } from './HomeScreen'

export default function SelectLocationScreen(){
    const preventDoublePress = usePreventDoublePress()
    const {showToast} = useToast()

    const [locationLoading, setLocationLoading] = useState(false)
    const [locationPermission, setLocationPermission] = useState<LocationPermissionState>("checking")
    
    const setLocation = useLocationStore(state => state.setLocation)

   const handleUseCurrentLocation = useCallback(async (showSuccessToast = true) => {
        if (locationLoading) return

        try {
            setLocationLoading(true)

            const currentLocation = await getCurrentLocationDetails()

            console.log("Location Details:", currentLocation)

            setLocation({
                latitude: currentLocation.latitude, 
                longitude: currentLocation.longitude,
                name: currentLocation.addressLine ||
                    currentLocation.area ||
                    currentLocation.city,
                source: "CURRENT"
            })

            setLocationPermission("granted")

            if (showSuccessToast) {
                //showToast("Current location detected successfully.", "success")
            }
        } catch (error) {
            console.log("Location Error:", error)

            const servicesEnabled = await Location.hasServicesEnabledAsync()

            if (!servicesEnabled) {
                setLocationPermission("services-disabled")

                return
            }

            const permission = await Location.getForegroundPermissionsAsync()

            if (permission.status !== "granted") {
                setLocationPermission("denied")

                return
            }

            showToast(error instanceof Error ? error.message : "Unable to get your location.", "info")
        } finally {
            setLocationLoading(false)
        }
    },[locationLoading, setLocation])

    const handleLocationAccess = useCallback(async () => {
        try {
            let permission = await Location.getForegroundPermissionsAsync()

            if (permission.status !== "granted") {
                if (permission.canAskAgain) {
                    permission = await Location.requestForegroundPermissionsAsync()
                } else {
                    setLocationPermission("denied")

                    Alert.alert(
                        "Location Permission Required",
                        "Allow location access from Settings to find restaurants near you.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings()
                            }
                        ]
                    )

                    return
                }
            }

            if (permission.status !== "granted") {
                setLocationPermission("denied")

                return
            }

            if (Platform.OS === "android") {
                try {
                    await Location.enableNetworkProviderAsync()

                    // Important:
                    // let Android location provider
                    // start after user taps "Turn on"
                    await sleep(400)
                } catch (error) {
                    console.log("Location enable cancelled:", error)

                    return
                }
            }

            const servicesEnabled = await Location.hasServicesEnabledAsync()

            if (!servicesEnabled) {
                setLocationPermission("services-disabled")

                if (Platform.OS === "ios") {
                    Alert.alert(
                        "Turn On Location",
                        "Please turn on Location Services to find restaurants near you.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings()
                            }
                        ]
                    )
                }

                return
            }

            await handleUseCurrentLocation()
        } catch (error) {
            console.log("Location access error:", error)
        }
    }, [handleUseCurrentLocation])

    return(
        <SafeAreaView className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
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
                    className="items-center justify-center bg-[#FAFAFA] border-[#1F1F1F]/10 rounded-full"
                    style={{
                        borderWidth: moderateScale(0.5),
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
                        Select a location
                    </Text>
                    
                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Choose where we should deliver.
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => 
                    preventDoublePress(() => {
                        router.push({
                            pathname: "/map-location",
                            params: {
                                focusSearch: "true"
                            }
                        })
                    })
                }
                className="flex-row gap-3 items-center bg-[#FAFAFA] border-[#1F1F1F]/10"
                style={{
                    marginHorizontal: scale(14),
                    marginBottom: moderateScale(14),
                    borderWidth: moderateScale(0.5),
                    borderRadius: moderateScale(22),
                    paddingHorizontal: scale(13),
                    height: verticalScale(46)
                }}
            >
                <SearchIcon height={moderateScale(22)} width={moderateScale(22)} color="#3F2516" strokeWidth={2} />

                <Text
                    className="font-medium text-[#7A7D81]"
                    style={{ fontSize: moderateScale(14) }}
                >
                    Search area, street or landmark
                </Text>
            </TouchableOpacity>

            <FlatList
                data={[{}]}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{
                    paddingHorizontal: scale(14),
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <>
                        <TouchableOpacity
                            activeOpacity={0.95}
                            disabled={locationLoading}
                            onPress={handleLocationAccess}
                            className="p-3 items-center flex-row gap-3 bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), borderWidth: moderateScale(0.5) }}
                        >
                            <View
                                className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                                style={{
                                    width: moderateScale(40),
                                    height: moderateScale(40)
                                }}
                            >
                                <LocateFixedIcon width={moderateScale(22)} height={moderateScale(22)} color="#3F2516" strokeWidth={1.5}/>
                            </View>

                            <View className="items-start gap-1 flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Use Current Location
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{ fontSize: moderateScale(10.5) }}
                                >
                                    Automatically detect your address
                                </Text>
                            </View>

                            <ArrowRightIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F85"} strokeWidth={1.8} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => 
                                preventDoublePress(() => {
                                    router.push('/map-location')
                                })
                            }
                            className="p-3 items-center flex-row gap-3 mt-3 bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), borderWidth: moderateScale(0.5), }}
                        >
                            <View
                                className="items-center justify-center bg-[#E8B93F]/15 rounded-full"
                                style={{
                                    width: moderateScale(40),
                                    height: moderateScale(40)
                                }}
                            >
                                <LocationIcon width={moderateScale(22)} height={moderateScale(22)} color="#3F2516" strokeWidth={1.5}/>
                            </View>

                            <View className="items-start gap-1 flex-1">
                                <Text
                                    className="text-[#1F1F1F] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Add Address
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/65 font-medium"
                                    style={{ fontSize: moderateScale(10.5) }}
                                >
                                    Save a new address for faster checkout
                                </Text>
                            </View>

                            <ArrowRightIcon width={moderateScale(20)} height={moderateScale(20)} color={"#1F1F1F85"} strokeWidth={1.8} />
                        </TouchableOpacity>

                        <Text
                            className='text-[#1F1F1F] font-semibold'
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(12)
                            }}
                        >
                            Nearby Locations
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {
                                // handle address press
                            }}
                            className="p-4 flex-row items-center gap-3 bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), marginTop: verticalScale(8), borderWidth: moderateScale(0.5) }}
                        >
                            <View className="items-center justify-center">
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <LocationFilledIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" />
                                </View>

                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        marginTop: verticalScale(5),
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(3),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <Text
                                        className="font-semibold text-[#3F2516]"
                                        style={{ fontSize: moderateScale(10.5) }}
                                    >
                                        443 m
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-1">
                                <Text
                                    numberOfLines={1}
                                    className="font-extrabold text-[#1F1F1F]"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Ambit Finvest SUMERPUR
                                </Text>

                                <Text
                                    numberOfLines={2}
                                    className="font-medium text-[#1F1F1F]/65"
                                    style={{
                                        fontSize: moderateScale(11.5),
                                        lineHeight: moderateScale(16),
                                        marginTop: verticalScale(3)
                                    }}
                                >
                                    Jawai Bandh Rd, New Mahaveer Colony, Sumerpur, Rajasthan 306902
                                </Text>
                            </View>

                            <ArrowRightIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F85" strokeWidth={1.8} />
                        </TouchableOpacity>

                        <Text
                            className='text-[#1F1F1F] font-semibold'
                            style={{
                                fontSize: moderateScale(15),
                                marginTop: verticalScale(12)
                            }}
                        >
                            Recent Locations
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.95}
                            onPress={() => {
                                // handle address press
                            }}
                            className="p-4 flex-row items-center gap-3 bg-[#FAFAFA] border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), marginTop: verticalScale(8), borderWidth: moderateScale(0.5) }}
                        >
                            <View className="items-center justify-center">
                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <LocationFilledIcon width={moderateScale(24)} height={moderateScale(24)} color="#3F2516" />
                                </View>

                                <View
                                    className="items-center justify-center bg-[#E8B93F]/15"
                                    style={{
                                        marginTop: verticalScale(5),
                                        paddingHorizontal: scale(10),
                                        paddingVertical: verticalScale(3),
                                        borderRadius: moderateScale(12)
                                    }}
                                >
                                    <Text
                                        className="font-semibold text-[#3F2516]"
                                        style={{ fontSize: moderateScale(10.5) }}
                                    >
                                        249 m
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-1">
                                <Text
                                    numberOfLines={1}
                                    className="font-extrabold text-[#1F1F1F]"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Sumerpur
                                </Text>

                                <Text
                                    numberOfLines={2}
                                    className="font-medium text-[#1F1F1F]/65"
                                    style={{
                                        fontSize: moderateScale(11.5),
                                        lineHeight: moderateScale(16),
                                        marginTop: verticalScale(3)
                                    }}
                                >
                                    Jawai Bandh Rd, New Mahaveer Colony, Sumerpur, Rajasthan 306902
                                </Text>
                            </View>

                            <ArrowRightIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F85" strokeWidth={1.8} />
                        </TouchableOpacity>
                    </>
                }
            />
        </SafeAreaView>
    )
}