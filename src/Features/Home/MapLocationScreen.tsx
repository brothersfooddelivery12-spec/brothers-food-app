import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import LocateFixedIcon from "@/assets/icon/LocateFixedIcon.svg"
import LocationIcon from "@/assets/icon/LocationIcon3.svg"
import { LoadingDots } from '@/components/LoadingDots'
import SearchBar from "@/components/SearchBar"
import { useLocationStore } from "@/Stores/locationStore"
import { Camera, CameraRef, Map, MapRef, UserLocation } from "@maplibre/maplibre-react-native"
import * as Location from "expo-location"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, Keyboard, Linking, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty"

type SelectedLocation = {
    latitude: number
    longitude: number
    address: string
    city?: string
    state?: string
    pincode?: string
}

interface PhotonSearchResult {
    type: "Feature"

    geometry: {
        type: "Point"
        coordinates: [
            number,
            number
        ]
    }

    properties: {
        name?: string
        street?: string
        housenumber?: string
        district?: string
        city?: string
        county?: string
        state?: string
        postcode?: string
        country?: string
        countrycode?: string
        osm_key?: string
        osm_value?: string
    }
}

 type SelectionMethod = "NONE" | "SEARCH" | "MAP" | "CURRENT"

type LocationPermissionState = "idle" | "granted" | "denied" | "services-disabled"

const isPlusCode = (value?: string | null) => {
    if (!value) {
        return false
    }

    return /^[23456789CFGHJMPQRVWX]{4,}\+[23456789CFGHJMPQRVWX]{2,}/i.test(
        value.trim()
    )
}

const buildAddressLine = (address: Location.LocationGeocodedAddress) => {
    const parts: string[] = []

    if (
        address.name &&
        !isPlusCode(address.name) &&
        address.name !== address.street &&
        address.name !== address.streetNumber
    ) {
        parts.push(address.name)
    }

    if (address.streetNumber) {
        parts.push(address.streetNumber)
    }

    if (address.street) {
        parts.push(address.street)
    }

    return [...new Set(parts)]
        .filter(Boolean)
        .join(", ")
}

export default function MapLocationScreen() {
    const {focusSearch} = useLocalSearchParams<{focusSearch?: string}>()
    const searchInputRef = useRef<TextInput>(null)

    const insets = useSafeAreaInsets()

    const location = useLocationStore(state => state.location)
    const hasHydrated = useLocationStore(state => state.hasHydrated)
    const setLocation = useLocationStore(state => state.setLocation)

    const mapRef = useRef<MapRef>(null)
    const cameraRef = useRef<CameraRef>(null)

    const [headerHeight, setHeaderHeight] = useState(0)
    const [locationSource, setLocationSource] = useState<"CURRENT" | "MANUAL">("MANUAL")
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [loadingAddress, setLoadingAddress] = useState(false)

    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<PhotonSearchResult[]>([])
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const searchAbortRef = useRef<AbortController | null>(null)
    const searchRequestIdRef = useRef(0)

    const [selectionMethod, setSelectionMethod] = useState<SelectionMethod>("NONE")

    useFocusEffect(
        useCallback(() => {
            if (focusSearch !== "true") {
                return
            }

            const timer = setTimeout(() => {
                searchInputRef.current?.focus()
            }, 300)

            return () => {
                clearTimeout(timer)
            }
        }, [focusSearch])
    )

    const searchLocation = useCallback(async (query: string) => {
        const trimmedQuery = query.trim()

        if (trimmedQuery.length < 3) {
            setSearchResults([])
            setHasSearched(false)
            setLoadingSearch(false)

            return
        }

        searchAbortRef.current?.abort()

        const controller = new AbortController()

        searchAbortRef.current = controller

        const requestId = ++searchRequestIdRef.current

        try {
            setLoadingSearch(true)
            setHasSearched(false)

            const params =
                new URLSearchParams({
                    q: trimmedQuery,
                    limit: "8",
                    lang: "en",
                    countrycode: "IN"
                })

            const latitude = selectedLocation?.latitude ?? location?.latitude
            const longitude = selectedLocation?.longitude ?? location?.longitude

            if (latitude != null && longitude != null) {
                params.append("lat", latitude.toString())
                params.append("lon", longitude.toString())
            }

            const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`,
                {
                    signal: controller.signal
                }
            )

            if (!response.ok) {
                throw new Error("Unable to search location")
            }

            const data = await response.json()

            // Ignore an older request
            if (requestId !== searchRequestIdRef.current) {
                return
            }

            const results = data?.features ?? []

            setSearchResults(results)
            setHasSearched(true)
        } catch (error: any) {
            if (error?.name === "AbortError") {
                return
            }

            // Ignore an older request
            if (requestId !== searchRequestIdRef.current) {
                return
            }

            console.log("Location search error:", error)

            setSearchResults([])
            setHasSearched(true)
        } finally {
            // Only latest request can stop loader
            if (requestId === searchRequestIdRef.current) {
                setLoadingSearch(false)
            }
        }
    },[selectedLocation, location])

    useEffect(() => {
        const query = searchQuery.trim()

        // Invalidate any previous search immediately
        searchRequestIdRef.current += 1

        searchAbortRef.current?.abort()

        setSearchResults([])
        setHasSearched(false)

        if (query.length < 3) {
            setLoadingSearch(false)

            return
        }

        // Show loader during debounce also
        setLoadingSearch(true)

        const timer = setTimeout(() => {
            searchLocation(query)
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [searchQuery, searchLocation])

    const formatSearchAddress = (item: PhotonSearchResult) => {
        const p = item.properties

        return [
            p.name,
            p.housenumber,
            p.street,
            p.district,
            p.city,
            p.state,
            p.postcode
        ]
            .filter(Boolean)
            .join(", ")
    }

    const handleSearchResultPress = useCallback((item: PhotonSearchResult) => {
        const [longitude, latitude] = item.geometry.coordinates

        const p = item.properties

        const address = formatSearchAddress(item)

        Keyboard.dismiss()

        setSearchQuery("")
        setSearchResults([])
        setHasSearched(false)

        setLocationSource("MANUAL")
        setSelectionMethod("SEARCH")

        setSelectedLocation({
            latitude,
            longitude,
            address: address || "Selected location",
            city: p.city ?? p.district ?? undefined,
            state: p.state ?? undefined,
            pincode: p.postcode ?? undefined
        })

        // Prevent programmatic camera movement
        // being treated as manual map dragging
        suppressRegionChangeRef.current = true

        cameraRef.current?.flyTo({
            center: [
                longitude,
                latitude
            ],

            duration: 500
        })
    },[])

    const [locationPermission, setLocationPermission] = useState<LocationPermissionState>("idle")

    const buildFormattedAddress = (address: Location.LocationGeocodedAddress) => {
        const addressLine = buildAddressLine(address)

        const area = address.district || ""
        const city = address.city || address.district || ""
        const state = address.region || ""
        const pincode = address.postalCode || ""
        
        const parts = [
            addressLine,
            area,
            city,
            state,
            pincode
        ]
            .map(item => item?.trim())
            .filter((item): item is string => Boolean(item))

        // Remove duplicate values
        return [
            ...new Set(parts)
        ].join(", ")
    }

    const requestLocationPermissionOnOpen = useCallback(async () => {
        try {
            let permission = await Location.getForegroundPermissionsAsync()

            if (permission.status === "granted") {
                setLocationPermission("granted")

                return
            }

            if (permission.canAskAgain) {
                permission = await Location.requestForegroundPermissionsAsync()
            }

            if (permission.status === "granted") {
                setLocationPermission("granted")
            } else {
                setLocationPermission("denied")
            }
        } catch (error) {
            console.log("Location permission error:", error)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            void requestLocationPermissionOnOpen()
        }, [requestLocationPermissionOnOpen])
    )

    const getAddress = useCallback(async (latitude: number, longitude: number) => {
        try {
            setLoadingAddress(true)

            const result = await Location.reverseGeocodeAsync({latitude, longitude})

            const address = result[0]

            if (!address) {
                setSelectedLocation({
                    latitude,
                    longitude,
                    address: "Selected location"
                })

                return
            }

            console.log("Reverse Geocode:", address)

            const formattedAddress = buildFormattedAddress(address)

            const city = address.city || address.subregion || address.district || ""

            setSelectedLocation({
                latitude,
                longitude,
                address: formattedAddress || "Selected location",
                city: city || undefined,
                state: address.region || undefined,
                pincode: address.postalCode || undefined
            })

            console.log("Formatted address:", formattedAddress)
        } catch (error) {
            console.log("Reverse geocode error:", error)
        } finally {
            setLoadingAddress(false)
        }
    },[])

    const suppressRegionChangeRef = useRef(false)

    const moveToLocation = useCallback((
        latitude: number,
        longitude: number,
        animated = true,
        fetchAddress = true
    ) => {
        suppressRegionChangeRef.current = true

        cameraRef.current?.flyTo({
            center: [
                longitude,
                latitude
            ],
            duration: animated ? 400 : 0
        })

        if (fetchAddress) {
            void getAddress(latitude, longitude)
        }
    },[getAddress])

    const moveToCurrentLocation = useCallback(async () => {
        try {
            setLocationSource("CURRENT")
            setSelectionMethod("CURRENT")

            const lastKnown =
                await Location.getLastKnownPositionAsync({
                    maxAge: 5 * 60 * 1000,
                    requiredAccuracy: 500
                })

            if (lastKnown) {
                const {latitude, longitude} = lastKnown.coords

                // Move map immediately,
                // but don't reverse geocode yet
                moveToLocation(latitude, longitude, false, false)
            }

            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            })

            const {latitude, longitude} = current.coords

            // Fresh location:
            // move + reverse geocode
            moveToLocation(latitude, longitude, true, true)
        } catch (error) {
            console.log("Current location error:", error)

            throw error
        }
    }, [moveToLocation])

    const handleLocationAccess = useCallback(async () => {
        if (loadingLocation) {
            return
        }

        try {
            setLoadingLocation(true)

            let permission = await Location.getForegroundPermissionsAsync()

            if (permission.status !== "granted") {
                if (permission.canAskAgain) {
                    permission = await Location.requestForegroundPermissionsAsync()
                } else {
                    setLocationPermission("denied")

                    Alert.alert(
                        "Location Permission Required",
                        "Allow location access from Settings to use your current location.",
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

            let servicesEnabled = await Location.hasServicesEnabledAsync()

            if (!servicesEnabled) {
                setLocationPermission("services-disabled")

                if (Platform.OS === "android") {
                    try {
                        await Location.enableNetworkProviderAsync()

                        // Allow Android location
                        // provider to initialize
                        await new Promise<void>(resolve => setTimeout(resolve, 700))

                        servicesEnabled = await Location.hasServicesEnabledAsync()

                        if (!servicesEnabled) {
                            return
                        }
                    } catch (error) {
                        console.log("Location enable cancelled:", error)

                        return
                    }
                } else {
                    Alert.alert(
                        "Turn On Location",
                        "Please turn on Location Services to use your current location.",
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

            setLocationPermission("granted")

            await moveToCurrentLocation()
        } catch (error) {
            console.log("Location access error:", error)
        } finally {
            setLoadingLocation(false)
        }
    }, [loadingLocation, moveToCurrentLocation])

    const [mapReady, setMapReady] = useState(false)

    useEffect(() => {
        if (!hasHydrated) {
            return
        }

        if (!location) {
            return
        }

        setSelectedLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.name
        })

        setLocationSource(location.source)

        setSelectionMethod("NONE")

        setLoadingLocation(false)
    }, [hasHydrated, location])

    const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleRegionDidChange = useCallback((event: any) => {
        if (suppressRegionChangeRef.current) {
            suppressRegionChangeRef.current = false

            return
        }

        const [longitude, latitude] = event.nativeEvent.center
        
        setLocationSource("MANUAL")
        setSelectionMethod("MAP")

        if (geocodeTimerRef.current) {
            clearTimeout(geocodeTimerRef.current)
        }

        geocodeTimerRef.current = setTimeout(() => {getAddress(latitude, longitude) }, 350)
    },[getAddress])

    useEffect(() => {
        return () => {
            if (geocodeTimerRef.current) {
                clearTimeout(geocodeTimerRef.current)
            }
        }
    }, [])

    const handleConfirmLocation = useCallback(() => {
        if (!selectedLocation) {
            return
        }

        const locationData = {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            name: selectedLocation.address,
            source: locationSource
        }

        console.log("Selected location:", locationData)

        setLocation(locationData)

        router.dismissTo('/(tabs)/home')
    }, [selectedLocation, locationSource, setLocation, router])

    if (!hasHydrated) {
        return (
            <View className="flex-1 bg-[#FFFFFF] items-center justify-center">
                <LottieView
                    source={require(
                        "../../../assets/animations/Loading3.json"
                    )}
                    autoPlay
                    loop
                    style={{
                        width: moderateScale(80),
                        height: moderateScale(80)
                    }}
                />
            </View>
        )
    }

    const isSearchSelected = selectionMethod === "SEARCH"

    const needsLocationPermission =
        locationPermission === "denied" &&
        !isSearchSelected

    const locationMessage = needsLocationPermission
        ? "Allow location access to use your current location."
        : null

    return (
        <View className="flex-1 bg-[#FFFFFF]">
            <StatusBar
                translucent
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <View className="flex-1">
                <Map
                    ref={mapRef}
                    style={{ flex: 1 }}
                    mapStyle={MAP_STYLE}
                    compass
                    attribution
                    onRegionDidChange={handleRegionDidChange}
                    onDidFinishLoadingMap={() => {
                        console.log("Map ready")

                        setMapReady(true)
                    }}
                >
                    <Camera
                        ref={cameraRef}
                        initialViewState={{
                            center: [
                                location?.longitude ?? 73.083126,
                                location?.latitude ?? 25.149131
                            ],
                            zoom: 15
                        }}
                    />

                    <UserLocation animated accuracy/>
                </Map>

                <View
                    onLayout={(event) => {
                        setHeaderHeight(event.nativeEvent.layout.height)
                    }}
                    className="absolute left-0 right-0 bg-[#FFFFFF]"
                    style={{
                        top: 0,
                        paddingTop: insets.top + verticalScale(10),
                        paddingBottom: verticalScale(5),
                        paddingHorizontal: scale(14),
                        zIndex: 20
                    }}
                >
                    <View
                        className="flex-row items-center -mx-1"
                        style={{
                            marginBottom: verticalScale(10),
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
                                Choose delivery location
                            </Text>
                            
                            <Text
                                className="text-[#1F1F1F]/65 font-medium"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                Select where you want your order delivered.
                            </Text>
                        </View>
                    </View>

                    <SearchBar
                        ref={searchInputRef}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search area, street or landmark"
                        loading={loadingSearch}
                        showClear
                        onClear={() => {
                            setSearchResults([])
                            setHasSearched(false)
                        }}
                        onSubmitEditing={() => {
                            const query = searchQuery.trim()

                            if (query.length >= 3) {
                                searchLocation(query)
                            }
                        }}
                    />    
                </View>

                {searchQuery.trim().length >= 3 && (loadingSearch || hasSearched) && (
                    <View
                        className="absolute bg-[#FFFFFF] overflow-hidden border-[#1F1F1F]/10"
                        style={{
                            top: headerHeight + verticalScale(6),
                            left: scale(12),
                            right: scale(12),
                            borderWidth: moderateScale(0.5),
                            borderRadius: moderateScale(20),
                            maxHeight: verticalScale(300),
                            zIndex: 30
                        }}
                    >
                        {loadingSearch ? (
                            <View
                                className="items-center justify-center"
                                style={{ height: verticalScale(100) }}
                            >
                                <View
                                    className="items-center justify-center self-center"
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                >
                                    <LottieView
                                        source={require("../../../assets/animations/Loading3.json")}
                                        autoPlay
                                        loop
                                        style={{
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    />
                                </View>

                                <View
                                    className="flex-row items-center justify-center"
                                    style={{ marginTop: verticalScale(8) }}
                                >
                                    <Text
                                        className="text-[#1F1F1F]/65 font-medium"
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Searching locations
                                    </Text>

                                    <LoadingDots color="rgba(31,31,31,0.65)" />
                                </View>
                            </View>
                        ) : searchResults.length > 0 ? (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                nestedScrollEnabled
                            >
                                {searchResults.map((item, index) => {
                                    const address = formatSearchAddress(item)

                                        return (
                                            <TouchableOpacity
                                                key={`${item.properties.osm_key}-${item.properties.name}-${index}`}
                                                activeOpacity={0.95}
                                                onPress={() => handleSearchResultPress(item)}
                                                className="flex-row items-center px-4"
                                                style={{ minHeight: verticalScale(58) }}
                                            >
                                                <View
                                                    className="items-center justify-center"
                                                    style={{
                                                        backgroundColor: "rgba(232,185,63,0.15)",
                                                        width: moderateScale(36),
                                                        height: moderateScale(36),
                                                        borderRadius: moderateScale(18)
                                                    }}
                                                >
                                                    <LocationIcon width={moderateScale(19)} height={moderateScale(19)}  color="#3F2516" />
                                                </View>

                                                <View className="flex-1 ml-3">
                                                    <Text
                                                        numberOfLines={1}
                                                        className="text-[#1F1F1F] font-bold"
                                                        style={{ fontSize: moderateScale(13) }}
                                                    >
                                                        {item.properties
                                                            .name ||
                                                            item.properties
                                                                .city ||
                                                            "Location"
                                                        }
                                                    </Text>

                                                    <Text
                                                        numberOfLines={2}
                                                        className="text-[#1F1F1F]/65 font-medium mt-0.5"
                                                        style={{ fontSize: moderateScale(10.5) }}
                                                    >
                                                        {address}
                                                    </Text>
                                                </View>

                                                {index < searchResults.length - 1 && (
                                                    <View
                                                        className="absolute bottom-0"
                                                        style={{ 
                                                            backgroundColor: "rgba(31,31,31,0.10)",
                                                            height: moderateScale(0.5),
                                                            left: scale(16),
                                                            right: scale(16)
                                                        }}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )
                                    }
                                )}
                            </ScrollView>
                        ) : (
                            <View
                                className="items-center justify-center px-5"
                                style={{ height: verticalScale(120) }}
                            >
                                <LocationIcon width={moderateScale(30)} height={moderateScale(30)} color="#7A7D81" />

                                <Text
                                    className="text-[#1F1F1F] font-bold text-center"
                                    style={{
                                        fontSize: moderateScale(13),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    No locations found
                                </Text>

                                <Text
                                    className="text-[#1F1F1F]/55 font-medium text-center"
                                    style={{
                                        fontSize: moderateScale(10.5),
                                        marginTop: verticalScale(3)
                                    }}
                                >
                                    Try searching with a different area,
                                    street or landmark
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View
                    pointerEvents="none"
                    className="absolute inset-0 items-center justify-center"
                    style={{ zIndex: 1 }}
                >
                    <View style={{ marginBottom: moderateScale(32) }} >
                        <LocationIcon width={moderateScale(42)} height={moderateScale(42)} color="#3F2516" />
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={handleLocationAccess}
                    disabled={loadingLocation}
                    className="absolute bg-[#FFFFFF] items-center justify-center"
                    style={{
                        right: scale(16),
                        bottom: verticalScale(38),
                        width: moderateScale(48),
                        height: moderateScale(48),
                        borderRadius: moderateScale(24),
                        zIndex: 5,
                        elevation: 4
                    }}
                >
                    <LocateFixedIcon width={moderateScale(23)} height={moderateScale(23)} color="#3F2516" strokeWidth={1.8} />
                </TouchableOpacity>
            </View>

            <View
                className="bg-[#FAFAFA] border-[#1F1F1F]/10 -mt-8"
                style={{
                    borderLeftWidth: moderateScale(0.5),
                    borderRightWidth: moderateScale(0.5),
                    borderTopWidth: moderateScale(0.5),
                    borderTopLeftRadius: moderateScale(20),
                    borderTopRightRadius: moderateScale(20),
                    paddingHorizontal: scale(16),
                    paddingTop: verticalScale(16),
                    paddingBottom: verticalScale(20) + insets.bottom
                }}
            >
                <Text
                    className="text-[#1F1F1F] font-bold"
                    style={{ fontSize: moderateScale(16) }}
                >
                    Select delivery location
                </Text>

                {locationMessage ? (
                    <View
                        className="flex-row items-center bg-[#E8B93F]/10 border border-[#E8B93F]/20"
                        style={{
                            borderRadius: moderateScale(14),
                            paddingHorizontal: scale(10),
                            paddingVertical: verticalScale(10),
                            marginTop: verticalScale(14)
                        }}
                    >
                        <LocationIcon width={moderateScale(20)} height={moderateScale(20)} color="#3F2516" />

                        <Text
                            className="flex-1 text-[#3F2516] font-medium"
                            style={{
                                fontSize: moderateScale(11),
                                lineHeight: moderateScale(16),
                                marginLeft: scale(8)
                            }}
                        >
                            {locationMessage}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{ marginTop: verticalScale(10) }}
                    >
                        {loadingAddress || loadingLocation ? (
                            <View
                                className="items-center justify-center"
                                style={{ height: moderateScale(42) }}
                            >
                                <LottieView
                                    source={require(
                                        "../../../assets/animations/Loading3.json"
                                    )}
                                    autoPlay
                                    loop
                                    style={{
                                        width: moderateScale(42),
                                        height: moderateScale(42)
                                    }}
                                />
                            </View>
                        ) : (
                            <View className="flex-row items-start">
                                <LocationIcon width={moderateScale(23)} height={moderateScale(23)} color="#3F2516" />

                                <Text
                                    className="flex-1 text-[#1F1F1F]/75 font-medium"
                                    style={{
                                        fontSize: moderateScale(12),
                                        lineHeight: moderateScale(16),
                                        marginLeft: scale(6)
                                    }}
                                >
                                    {selectedLocation?.address ??
                                        "Move the map to select a location"
                                    }
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    activeOpacity={0.95}
                    disabled={
                        loadingLocation ||
                        loadingAddress ||
                        (
                            !needsLocationPermission &&
                            !selectedLocation
                        )
                    }
                    onPress={
                        needsLocationPermission
                            ? handleLocationAccess
                            : handleConfirmLocation
                    }
                    className="items-center justify-center bg-[#3F2516]"
                    style={{
                        height: verticalScale(48),
                        borderRadius: moderateScale(18),
                        marginTop: verticalScale(16)
                    }}
                >
                    {loadingLocation ? (
                        <View className="flex-row items-center justify-center">
                            <Text
                                className="text-[#FFFFFF] font-bold"
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Getting Location
                            </Text>

                            <LoadingDots color="#FFFFFF" />
                        </View>
                    ) : (
                        <Text
                            className="text-[#FFFFFF] font-bold"
                            style={{ fontSize: moderateScale(14) }}
                        >
                            {needsLocationPermission
                                ? "Enable Location"
                                : "Confirm Location"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}