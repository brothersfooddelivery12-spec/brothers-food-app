import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import LocateFixedIcon from '@/assets/icon/LocateFixedIcon.svg'
import LocationIcon from '@/assets/icon/LocationIcon2.svg'
import LocationFilledIcon from '@/assets/icon/LocationIcon3.svg'
import SearchBar from "@/components/SearchBar"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

export default function SelectLocationScreen(){
    const [search, setsearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")

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

            <View
                style={{
                    marginBottom: verticalScale(10),
                    paddingHorizontal: scale(14),
                }}
            >
                <SearchBar
                    value={search}
                    onChangeText={setsearch}
                    placeholder="Search for area,street name..."
                    onRightPress={() => {}}
                />
            </View>

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
                            onPress={() => {}}
                            className="p-4 items-center flex-row gap-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
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
                            onPress={() => {}}
                            className="p-4 items-center flex-row gap-3 mt-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18) }}
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
                            className="p-4 flex-row items-center gap-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), marginTop: verticalScale(8) }}
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
                            className="p-4 flex-row items-center gap-3 bg-white border border-[#1F1F1F]/10"
                            style={{ borderRadius: moderateScale(18), marginTop: verticalScale(8) }}
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