import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import ClipboardIcon from '@/assets/icon/ClipboardIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import CustomerServiceIcon from '@/assets/icon/CustomerServiceIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import GiftIcon from '@/assets/icon/GiftFilledIcon.svg'
import DownloadIcon from '@/assets/icon/InvoiceIcon.svg'
import PrinterIcon from '@/assets/icon/PrinterIcon.svg'
import StarIcon from '@/assets/icon/RatingIcon3.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import StarBadgeIcon from '@/assets/icon/StarBadgeIcon.svg'
import SuccessIcon from '@/assets/icon/SuccessIcon2.svg'
import UserIcon from '@/assets/icon/UserFilledIcon.svg'
import WalletIcon from '@/assets/icon/WalletIcon.svg'
import { invoiceItems } from '@/constant/InvoiceItemsData'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { FlatList, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import OrderPriceRow from '../Cart/Components/OrderPriceRow'
import InvoiceItem from './Components/InvoiceItem'

export default function OrderInvoiceScreen() {
    const insets = useSafeAreaInsets()

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
                    marginBottom: verticalScale(10),
                    gap: scale(8)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() => router.back()}
                    className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                    style={{
                        width: moderateScale(38),
                        height: moderateScale(38)
                    }}
                >
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color="#1F1F1F" strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="text-[#1F1F1F] font-extrabold"
                        style={{ fontSize: moderateScale(16) }}
                    >
                        Invoice
                    </Text>

                    <Text
                        className="text-[#1F1F1F]/65 font-medium"
                        style={{ fontSize: moderateScale(11) }}
                    >
                        Order Summary & Tax Invoice
                    </Text>
                </View>

                <View
                    className="flex-row items-center"
                    style={{ gap: moderateScale(10) }}
                >
                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                        style={{
                            width: moderateScale(38),
                            height: moderateScale(38)
                        }}
                    >
                        <DownloadIcon width={moderateScale(19)} height={moderateScale(19)} color={"#3F2516"} strokeWidth={1.5} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="items-center justify-center bg-white border border-[#1F1F1F]/10 rounded-full"
                        style={{
                            width: moderateScale(38),
                            height: moderateScale(38)
                        }}
                    >
                        <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={"#3F2516"} strokeWidth={1.5} style={{ marginRight: moderateScale(2.5)} } />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={[{}]}
                renderItem={null}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginTop: verticalScale(8),
                    paddingHorizontal: scale(14),
                    paddingBottom: insets.bottom + verticalScale(45)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="flex-row items-center justify-center bg-[#E3F2E8] self-start"
                            style={{
                                gap: moderateScale(6),
                                paddingHorizontal: moderateScale(10),
                                paddingVertical: moderateScale(6),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <SuccessIcon width={moderateScale(16)} height={moderateScale(16)} color="#4d9151" />

                            <Text
                                className="font-semibold text-[#4d9151]"
                                style={{ fontSize: moderateScale(11) }}
                            >
                                Paid Successfully
                            </Text>
                        </View>

                        <View
                            className="p-4 items-center bg-[#FFFFFF] border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(8)
                            }}
                        >
                            <View className="flex-row gap-3 justify-center">
                                <Image
                                    source={{
                                        uri: "https://i.pinimg.com/736x/36/b7/fa/36b7fa818d446a5ccba21e95f2e738b0.jpg"
                                    }}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    style={{
                                        width: moderateScale(58),
                                        height: moderateScale(58),
                                        borderRadius: moderateScale(16)
                                   }}
                                />

                                <View className='gap-2 flex-1 justify-center'>
                                    <Text
                                        className='text-[#1F1F1F] font-bold'
                                        style={{ fontSize: moderateScale(15) }}
                                    >
                                        The Burger King
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Tax Invoice / Bill of Supply
                                    </Text>
                                </View>
                            </View>

                            <Text
                                className='text-[#1F1F1F] font-semibold self-start mt-4 ml-2'
                                style={{ fontSize: moderateScale(12) }}
                            >
                                GST: {" "}

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    07AAAAA0000A1Z5
                                </Text>
                            </Text>

                            <Text
                                className='text-[#1F1F1F] font-semibold self-start mt-2 ml-2'
                                style={{ fontSize: moderateScale(12) }}
                            >
                                FSSAI: {" "}

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    10023011000124
                                </Text>
                            </Text>

                            <Text
                                className='text-[#1F1F1F] font-semibold self-start mt-2 ml-2'
                                style={{ fontSize: moderateScale(12) }}
                            >
                                INVOICE NO: {" "}

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium'
                                    style={{ fontSize: moderateScale(12) }}
                                >
                                    INV-BFD-2026-000458
                                </Text>
                            </Text>

                            <View
                                style={{
                                    paddingHorizontal: scale(4),
                                    marginVertical: verticalScale(12),
                                    width: "100%"
                                }}
                            >
                                <View
                                    className="rounded-full bg-[#E8DDD3]/55"
                                    style={{ height: verticalScale(0.7) }}
                                />
                            </View>

                            <View className="flex-row items-center justify-between  mb-2" >
                                <View className="flex-row items-center flex-1">
                                    <View
                                        className="items-center justify-center"
                                        style={{
                                            width: moderateScale(28),
                                            height: moderateScale(28),
                                            marginRight: moderateScale(2)
                                        }}
                                    >
                                        <ClipboardIcon width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" strokeWidth={1.8} />
                                    </View>

                                    <View>
                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium uppercase"
                                            style={{
                                                fontSize: moderateScale(9),
                                                letterSpacing: moderateScale(0.5)
                                            }}
                                        >
                                            Order ID
                                        </Text>

                                        <Text
                                            className="text-[#1F1F1F] font-medium"
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(2)
                                            }}
                                        >
                                            #BFD-882941
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center flex-1">
                                    <View
                                        className="items-center justify-center"
                                        style={{
                                            width: moderateScale(28),
                                            height: moderateScale(28),
                                            marginRight: moderateScale(2)
                                        }}
                                    >
                                        <ClockIcon width={moderateScale(18)} height={moderateScale(18)} color="#5C4639" />
                                    </View>

                                    <View>
                                        <Text
                                            className="text-[#1F1F1F]/75 font-medium uppercase"
                                            style={{
                                                fontSize: moderateScale(9),
                                                letterSpacing: moderateScale(0.5)
                                            }}
                                        >
                                            Date & Time
                                        </Text>

                                        <Text
                                            className="text-[#1F1F1F] font-medium"
                                            style={{
                                                fontSize: moderateScale(11),
                                                marginTop: verticalScale(2)
                                            }}
                                        >
                                            Oct 24, 2026 • 08:45 PM
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View
                            className='p-3 mt-4 items-center bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-2 justify-center items-center self-start'>
                                <View
                                    className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <UserIcon width={moderateScale(18)} height={moderateScale(18)} color={"#3F2516"} />
                                </View>

                                <Text
                                    className='text-[#5C4639] font-semibold'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Bill To
                                </Text>
                            </View>

                            <Text
                                className='text-[#1F1F1F] font-bold self-start mt-2 ml-1'
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Alexander Hamilton
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium self-start mt-1 ml-1'
                                style={{ fontSize: moderateScale(12), lineHeight: moderateScale(16) }}
                            >
                                Apartment 4B, The Gentry Residences
                                Park Avenue, South Extension II
                                New Delhi, 110049
                            </Text>
                        </View>

                        <View
                            className='p-3 mt-4 items-center bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className='flex-row gap-2 justify-center items-center self-start'>
                                <View
                                    className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <DeliveryIcon width={moderateScale(17)} height={moderateScale(17)} color={"#3F2516"} />
                                </View>

                                <Text
                                    className='text-[#5C4639] font-semibold'
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Delivery Method
                                </Text>
                            </View>

                            <Text
                                className='text-[#1F1F1F] font-bold self-start mt-2 ml-1'
                                style={{ fontSize: moderateScale(14) }}
                            >
                                Priority Concierge
                            </Text>

                            <Text
                                className='text-[#1F1F1F]/75 font-medium self-start mt-1 ml-1'
                                style={{ fontSize: moderateScale(12)}}
                            >
                                Estimated Delivery :{" "}

                                <Text
                                    className='text-[#1F1F1F] font-bold'
                                    style={{ fontSize: moderateScale(12)}}
                                >
                                    25-30 Mins
                                </Text>
                            </Text>

                            <View
                                className="self-start flex-row items-center bg-[#E8B93F]/20 gap-1 mt-4"
                                style={{
                                    paddingHorizontal: moderateScale(8),
                                    paddingVertical: moderateScale(3.5),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <CrownIcon width={moderateScale(18)} height={moderateScale(18)} color="#3F2516" />

                                <Text
                                    className="font-bold text-[#3F2516]"
                                    style={{
                                        fontSize: moderateScale(10),
                                        marginLeft: moderateScale(2),
                                        marginRight: moderateScale(2)
                                    }}
                                >
                                    PREMIUM MEMBER BENEFIT APPLIED
                                </Text>
                            </View>
                        </View>

                        <View
                            className='p-4 mt-4 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View className="flex-row items-center">
                                <Text
                                    className="text-[#1F1F1F]/70 font-semibold"
                                    style={{
                                        flex: 1,
                                        fontSize: moderateScale(11)
                                    }}
                                >
                                    Item Description
                                </Text>

                                <View
                                    className="items-center"
                                    style={{ width: moderateScale(50) }}
                                >
                                    <Text
                                        className="text-[#1F1F1F]/70 font-semibold"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Qty
                                    </Text>
                                </View>

                                <View
                                    className="items-center"
                                    style={{ width: moderateScale(45) }}
                                >
                                    <Text
                                        className="text-[#1F1F1F]/70 font-semibold"
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Amount
                                    </Text>
                                </View>
                            </View>

                            <View style={{ marginTop: verticalScale(12) }}>
                                {invoiceItems.map((item, index) => (
                                    <InvoiceItem
                                        key={item.id}
                                        image={item.image}
                                        name={item.name}
                                        description={item.description}
                                        quantity={item.quantity}
                                        amount={item.amount}
                                        showDivider={index !== invoiceItems.length - 1}
                                    />
                                ))}
                            </View>
                        </View>

                        <View
                            className='p-3 mt-4 bg-[#FFFFFF] border border-[#1F1F1F]/10'
                            style={{ borderRadius: moderateScale(18) }}
                        >
                            <View
                                className="self-start flex-row items-center bg-[#E8B93F]/20"
                                style={{
                                    paddingHorizontal: moderateScale(8),
                                    paddingVertical: moderateScale(3.5),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <GiftIcon width={moderateScale(17)} height={moderateScale(17)} color="#3F2516" />

                                <Text
                                    className="font-bold text-[#3F2516]"
                                    style={{
                                        fontSize: moderateScale(9),
                                        marginLeft: moderateScale(2),
                                        marginRight: moderateScale(2)
                                    }}
                                >
                                    EPICUREAN REWARDS SUMMARY
                                </Text>
                            </View>

                            <View className='flex-row gap-2 justify-center items-center self-start mt-4'>
                                <View
                                    className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <StarIcon width={moderateScale(17)} height={moderateScale(17)} color={"#3F2516"} />
                                </View>

                                <View className='justify-center gap-1 flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-bold'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Points Earned
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Added to your vault
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#5C4639] font-extrabold mr-2'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    +120
                                </Text>
                            </View>

                            <View className='flex-row gap-2 justify-center items-center self-start mt-4'>
                                <View
                                    className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <WalletIcon width={moderateScale(17)} height={moderateScale(17)} color={"#3F2516"} />
                                </View>

                                <View className='justify-center gap-1 flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-bold'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Cashback
                                    </Text>

                                    <Text
                                        className='text-[#1F1F1F]/75 font-medium'
                                        style={{ fontSize: moderateScale(11) }}
                                    >
                                        Next order credit
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#5C4639] font-extrabold mr-2'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    ₹25
                                </Text>
                            </View>

                            <View className='flex-row gap-2 justify-center items-center self-start mt-4'>
                                <View
                                    className="self-start rounded-full items-center justify-center bg-[#E8B93F]/20"
                                    style={{
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <StarBadgeIcon width={moderateScale(17)} height={moderateScale(17)} color={"#3F2516"} />
                                </View>

                                <View className='justify-center gap-1 flex-1'>
                                    <Text
                                        className='text-[#1F1F1F] font-bold'
                                        style={{ fontSize: moderateScale(12) }}
                                    >
                                        Membership Savings
                                    </Text>
                                </View>

                                <Text
                                    className='text-[#5C4639] font-extrabold mr-2'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    ₹40
                                </Text>
                            </View>
                        </View>

                        <View
                            className="p-5 bg-white border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <Text
                                className="text-[#1F1F1F] font-bold"
                                style={{
                                    fontSize: moderateScale(14),
                                    marginBottom: verticalScale(8)
                                }}
                            >
                                Order Summary
                            </Text>

                            <OrderPriceRow label="Item Total" value={707} />

                            <OrderPriceRow label="Delivery Fee" value={"FREE"} />

                            <OrderPriceRow label="Platform Fee" value={5} />

                            <OrderPriceRow label="Restaurant Packing" value={20} />

                            <OrderPriceRow label="GST and Taxes" value={38} />

                            <View
                                className="items-center flex-row justify-center bg-[#E3F2E8] mt-3 -mx-1"
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="text-[#4d9151] font-semibold self-start flex-1"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Coupon Savings
                                </Text>

                                <Text
                                    className="text-[#4d9151] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    -₹100
                                </Text>
                            </View>

                            <View
                                className="items-center flex-row justify-center bg-[#E3F2E8] mt-3 -mx-1"
                                style={{
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="text-[#4d9151] font-semibold self-start flex-1"
                                    style={{ fontSize: moderateScale(13) }}
                                >
                                    Reward Points Used
                                </Text>

                                <Text
                                    className="text-[#4d9151] font-bold"
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    -₹50
                                </Text>
                            </View>

                            <View
                                className="rounded-full bg-[#E8DDD3]/65"
                                style={{
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View
                                className="flex-row justify-between items-center"
                            >
                                <Text
                                    className="text-[#1F1F1F]/85 font-extrabold"
                                    style={{ fontSize: moderateScale(15) }}
                                >
                                    Grand Total
                                </Text>

                                <Text
                                    className="text-[#1F1F1F] font-black tracking-wide"
                                    style={{ fontSize: moderateScale(16) }}
                                >
                                    ₹620
                                </Text>
                            </View>
                        </View>

                        <View
                            className="p-4 bg-white flex-row gap-2 border border-[#1F1F1F]/10"
                            style={{
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1'>
                                <Text
                                    className='text-[#1F1F1F] font-bold'
                                    style={{ fontSize: moderateScale(14) }}
                                >
                                    Thank you for dining with Brothers.
                                </Text>

                                <Text
                                    className='text-[#1F1F1F]/75 font-medium mt-2'
                                    style={{ fontSize: moderateScale(11) }}
                                >
                                    Your culinary journey is our priority.
                                    We look forward to serving you again
                                    soon with even more exclusive
                                    flavors.
                                </Text>
                            </View>

                            <View className='justify-center gap-2'>
                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='bg-[#3F2516] flex-row gap-2 items-center justify-center'
                                    style={{
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <PrinterIcon width={moderateScale(14)} height={moderateScale(14)} color={"#FFFFFF"} />

                                    <Text
                                        className='text-[#FFFFFF] font-semibold'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Print Invoice
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='bg-[#F8D56A] flex-row gap-2 items-center justify-center'
                                    style={{
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <DownloadIcon width={moderateScale(14)} height={moderateScale(14)} color={"#3F2516"} />

                                    <Text
                                        className='text-[#3F2516] font-semibold'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        PDF Copy
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='bg-[#FFFFFF] flex-row gap-2 border border-[#1F1F1F]/15 items-center justify-center'
                                    style={{
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <ShareIcon width={moderateScale(14)} height={moderateScale(14)} color={"#1F1F1F"} />

                                    <Text
                                        className='text-[#1F1F1F] font-semibold'
                                        style={{ fontSize: moderateScale(10) }}
                                    >
                                        Share
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-2 p-3 items-center bg-[#E8B93F]/15 border border-[#E8B93F]/25"
                            style={{
                                borderRadius: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <CustomerServiceIcon width={moderateScale(18)} height={moderateScale(18)} color={"#5c4639"} strokeWidth={1.8} />

                            <Text
                                className="text-[#3F2516] font-semibold flex-1"
                                style={{ fontSize: moderateScale(10)}}
                            >
                                Need help with this order?
                            </Text>

                            <Pressable
                                onPress={() => {}}
                                className='items-center justify-center'
                            >
                                <Text
                                    className="text-[#3F2516] font-semibold"
                                    style={{ fontSize: moderateScale(9)}}
                                >
                                    Support Center
                                </Text>
                            </Pressable>

                            <View
                                className="rounded-full bg-[#E8DDD3]/75"
                                style={{
                                    width: scale(1),
                                    height: verticalScale(12)
                                }}
                            />

                            <Pressable
                                onPress={() => {}}
                                className='items-center justify-center'
                            >
                                <Text
                                    className="text-[#3F2516] font-semibold"
                                    style={{ fontSize: moderateScale(9)}}
                                >
                                    Terms of Service
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    )
}