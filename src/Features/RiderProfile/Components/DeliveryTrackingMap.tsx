import { useRef } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type Location = {
    latitude: number
    longitude: number
}

type DeliveryTrackingMapProps = {
    driverLocation: Location
    distance: string
    eta: string
}

export default function DeliveryTrackingMap({
    driverLocation,
    distance,
    eta,
}: DeliveryTrackingMapProps) {
    const mapRef = useRef<MapView>(null)

    return (
        <View
            className="relative overflow-hidden border border-[#1F1F1F]/10"
            style={{
                height: verticalScale(160),
                borderRadius: moderateScale(18),
            }}
        >
            <MapView
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                initialRegion={{
                    ...driverLocation,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                }}
                showsCompass={false}
                showsMyLocationButton={false}
                toolbarEnabled={false}
            >
                <Marker
                    coordinate={driverLocation}
                    title="Delivery Partner"
                    description="Your order is on the way"
                />
            </MapView>

            {/* Live Tracking */}
            <View
                className="absolute flex-row items-center bg-[#1F1F1F]/90"
                style={{
                    top: verticalScale(10),
                    left: scale(10),
                    paddingHorizontal: scale(9),
                    paddingVertical: verticalScale(5),
                    borderRadius: moderateScale(16),
                    gap: scale(5),
                }}
            >
                <View
                    className="rounded-full bg-[#EF4444]"
                    style={{
                        width: moderateScale(7),
                        height: moderateScale(7),
                    }}
                />

                <Text
                    className="text-white font-semibold"
                    style={{
                        fontSize: moderateScale(9),
                        letterSpacing: 0.5,
                    }}
                >
                    LIVE TRACKING
                </Text>
            </View>

            {/* Re-center */}
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    mapRef.current?.animateToRegion(
                        {
                            ...driverLocation,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.015,
                        },
                        500
                    )
                }}
                className="absolute bg-white items-center justify-center border border-[#1F1F1F]/10"
                style={{
                    right: scale(10),
                    top: verticalScale(10),
                    width: moderateScale(32),
                    height: moderateScale(32),
                    borderRadius: moderateScale(16),
                }}
            >
                <Text
                    style={{
                        fontSize: moderateScale(16),
                    }}
                >
                    ◎
                </Text>
            </TouchableOpacity>

            {/* Delivery Details */}
            <View
                className="absolute flex-row items-center bg-white border border-[#1F1F1F]/10"
                style={{
                    left: scale(12),
                    right: scale(12),
                    bottom: verticalScale(10),
                    paddingHorizontal: scale(14),
                    paddingVertical: verticalScale(10),
                    borderRadius: moderateScale(14),
                }}
            >
                {/* Distance */}
                <View className="flex-1">
                    <Text
                        className="text-[#1F1F1F]/60 font-medium"
                        style={{
                            fontSize: moderateScale(9),
                        }}
                    >
                        DISTANCE AWAY
                    </Text>

                    <Text
                        className="text-[#1F1F1F] font-semibold"
                        style={{
                            fontSize: moderateScale(13),
                            marginTop: verticalScale(2),
                        }}
                    >
                        {distance}
                    </Text>
                </View>

                {/* Divider */}
                <View
                    className="bg-[#1F1F1F]/10"
                    style={{
                        width: 1,
                        height: verticalScale(28),
                        marginHorizontal: scale(14),
                    }}
                />

                {/* ETA */}
                <View className="flex-1 items-end">
                    <Text
                        className="text-[#1F1F1F]/60 font-medium"
                        style={{
                            fontSize: moderateScale(9),
                        }}
                    >
                        EST. ARRIVAL
                    </Text>

                    <Text
                        className="text-[#22A06B] font-semibold"
                        style={{
                            fontSize: moderateScale(13),
                            marginTop: verticalScale(2),
                        }}
                    >
                        {eta}
                    </Text>
                </View>
            </View>
        </View>
    )
}