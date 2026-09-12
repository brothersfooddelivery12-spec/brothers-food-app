import * as Location from "expo-location"

export type UserLocationDetails = {
    latitude: number
    longitude: number

    addressLine: string
    landmark: string
    area: string
    city: string
    state: string
    pincode: string
    country: string
}

const isPlusCode = (value?: string | null) => {
    if (!value) return false

    return /^[23456789CFGHJMPQRVWX]{4,}\+[23456789CFGHJMPQRVWX]{2,}/i.test(
        value.trim()
    )
}

const buildAddressLine = (address: Location.LocationGeocodedAddress) => {
    const parts: string[] = []

    // Add building/place name only when it isn't a Google Plus Code
    if (
        address.name &&
        !isPlusCode(address.name) &&
        address.name !== address.street &&
        address.name !== address.streetNumber
    ) {
        parts.push(address.name)
    }

    // House/building number
    if (address.streetNumber) {
        parts.push(address.streetNumber)
    }

    // Road/street
    if (address.street) {
        parts.push(address.street)
    }

    return [...new Set(parts)]
        .filter(Boolean)
        .join(", ")
}

export const getCurrentLocationDetails =
    async (): Promise<UserLocationDetails> => {

    // 1. Check device location services
    const servicesEnabled = await Location.hasServicesEnabledAsync()

    if (!servicesEnabled) {
        throw new Error("Please enable location services on your device.")
    }

    // 2. Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
        throw new Error("Location permission is required to detect your address.")
    }

    // 3. Get coordinates
    const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High})

    const {latitude, longitude} = location.coords

    console.log("Coordinates:", {latitude, longitude})

    // 4. Reverse geocode
    const addresses = await Location.reverseGeocodeAsync({latitude, longitude})

    if (!addresses.length) {
        throw new Error("Unable to find address for your current location.")
    }

    const address = addresses[0]

    console.log("Reverse Geocode:", JSON.stringify(address, null, 2))

    const addressLine = buildAddressLine(address)

    const area =
        address.district ||
        address.subregion ||
        ""

    const city =
        address.city ||
        address.subregion ||
        address.district ||
        ""

    return {
        latitude,
        longitude,
        addressLine,
        landmark: "",
        area,
        city,
        state: address.region || "",
        pincode: address.postalCode || "",
        country: address.country || ""
    }
}