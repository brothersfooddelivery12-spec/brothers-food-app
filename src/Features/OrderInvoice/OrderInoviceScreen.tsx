import BackArrowIcon from '@/assets/icon/ArrowLeft.svg'
import CircleStarIcon from '@/assets/icon/CircleStarIcon.svg'
import ClipboardIcon from '@/assets/icon/ClipboardIcon.svg'
import ClockIcon from '@/assets/icon/ClockIcon3.svg'
import CrownIcon from '@/assets/icon/CrownIcon.svg'
import CustomerServiceIcon from '@/assets/icon/CustomerServiceIcon.svg'
import DeliveryIcon from '@/assets/icon/DeliveryIcon.svg'
import GiftIcon from '@/assets/icon/GiftFilledIcon.svg'
import DownloadIcon from '@/assets/icon/InvoiceIcon.svg'
import PrinterIcon from '@/assets/icon/PrinterIcon.svg'
import ShareIcon from '@/assets/icon/ShareIcon.svg'
import StarBadgeIcon from '@/assets/icon/StarBadgeFilledIcon.svg'
import SuccessIcon from '@/assets/icon/SuccessIcon2.svg'
import UserIcon from '@/assets/icon/UserFilledIcon.svg'
import WalletIcon from '@/assets/icon/WalletFilledIcon.svg'
import { COLORS } from '@/constant/colors'
import { invoiceItems } from '@/constant/InvoiceItemsData'
import { hexToRgba } from '@/utils/hexToRgba'
import { Image } from 'expo-image'
import { router } from "expo-router"
import { FlatList, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import OrderPriceRow from '../Cart/Components/OrderPriceRow'
import InvoiceItem from './Components/InvoiceItem'

export default function OrderInvoiceScreen() {
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
                    marginBottom: verticalScale(10),
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
                    <BackArrowIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryTextColor} strokeWidth={2} style={{ marginRight: moderateScale(4) }} />
                </TouchableOpacity>

                <View className="items-start gap-1 flex-1">
                    <Text
                        className="font-extrabold"
                        style={{
                            fontSize: moderateScale(16),
                            color: COLORS.primaryTextColor
                        }}
                    >
                        Invoice
                    </Text>

                    <Text
                        className="font-medium"
                        style={{
                            fontSize: moderateScale(11),
                            color: hexToRgba(COLORS.primaryTextColor, 0.65)
                        }}
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
                        className="items-center justify-center rounded-full"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            width: moderateScale(38),
                            height: moderateScale(38)
                        }}
                    >
                        <DownloadIcon width={moderateScale(19)} height={moderateScale(19)} color={COLORS.primaryTextColor} strokeWidth={1.5} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => {}}
                        className="items-center justify-center rounded-full"
                        style={{
                            backgroundColor: COLORS.secondaryBackgroundColor,
                            borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                            borderWidth: moderateScale(0.5),
                            width: moderateScale(38),
                            height: moderateScale(38)
                        }}
                    >
                        <ShareIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryTextColor} strokeWidth={1.5} style={{ marginRight: moderateScale(2.5)} } />
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
                    paddingBottom: verticalScale(25)
                }}
                ListHeaderComponent={
                    <View>
                        <View
                            className="flex-row items-center justify-center self-start"
                            style={{
                                backgroundColor: COLORS.activeStatusBackgroundColor,
                                gap: moderateScale(6),
                                paddingHorizontal: moderateScale(10),
                                paddingVertical: moderateScale(6),
                                borderRadius: moderateScale(12)
                            }}
                        >
                            <SuccessIcon width={moderateScale(16)} height={moderateScale(16)} color={COLORS.activeStatusTextColor} strokeWidth={1.5} />

                            <Text
                                className="font-medium"
                                style={{
                                    fontSize: moderateScale(11),
                                    color: COLORS.activeStatusTextColor
                                }}
                            >
                                Paid Successfully
                            </Text>
                        </View>

                        <View
                            className="p-4 items-center"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
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
                                        className='font-bold'
                                        style={{
                                            fontSize: moderateScale(15),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        The Burger King
                                    </Text>

                                    <Text
                                        className='font-medium'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Tax Invoice / Bill of Supply
                                    </Text>
                                </View>
                            </View>

                            <Text
                                className='font-semibold self-start mt-4 ml-2'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                GST: {" "}

                                <Text
                                    className='font-medium'
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    07AAAAA0000A1Z5
                                </Text>
                            </Text>

                            <Text
                                className='font-semibold self-start mt-2 ml-2'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                FSSAI: {" "}

                                <Text
                                    className='font-medium'
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
                                >
                                    10023011000124
                                </Text>
                            </Text>

                            <Text
                                className='font-semibold self-start mt-2 ml-2'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                INVOICE NO: {" "}

                                <Text
                                    className='font-medium'
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
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
                                    className="rounded-full"
                                    style={{
                                        height: verticalScale(0.7),
                                        backgroundColor: hexToRgba(COLORS.borderColor, 0.6)
                                    }}
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
                                        <ClipboardIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} strokeWidth={1.8} />
                                    </View>

                                    <View>
                                        <Text
                                            className="font-medium uppercase"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                                fontSize: moderateScale(9),
                                                letterSpacing: moderateScale(0.5)
                                            }}
                                        >
                                            Order ID
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: COLORS.primaryTextColor,
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
                                        <ClockIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.secondaryColor} />
                                    </View>

                                    <View>
                                        <Text
                                            className="font-medium uppercase"
                                            style={{
                                                color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                                fontSize: moderateScale(9),
                                                letterSpacing: moderateScale(0.5)
                                            }}
                                        >
                                            Date & Time
                                        </Text>

                                        <Text
                                            className="font-medium"
                                            style={{
                                                color: COLORS.primaryTextColor,
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
                            className='p-3 mt-4 items-center'
                            style={{
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5),
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1)
                            }}
                        >
                            <View className='flex-row gap-2 justify-center items-center self-start'>
                                <View
                                    className="self-start rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <UserIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />
                                </View>

                                <Text
                                    className='font-semibold'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Bill To
                                </Text>
                            </View>

                            <Text
                                className='font-bold self-start mt-2 ml-1'
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Alexander Hamilton
                            </Text>

                            <Text
                                className='font-medium self-start mt-1 ml-1'
                                style={{
                                    fontSize: moderateScale(12),
                                    lineHeight: moderateScale(16),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                Apartment 4B, The Gentry Residences
                                Park Avenue, South Extension II
                                New Delhi, 110049
                            </Text>
                        </View>

                        <View
                            className='p-3 mt-4 items-center'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className='flex-row gap-2 justify-center items-center self-start'>
                                <View
                                    className="self-start rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <DeliveryIcon width={moderateScale(17)} height={moderateScale(17)} color={COLORS.primaryColor} />
                                </View>

                                <Text
                                    className='font-semibold'
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Delivery Method
                                </Text>
                            </View>

                            <Text
                                className='font-bold self-start mt-2 ml-1'
                                style={{
                                    fontSize: moderateScale(14),
                                    color: COLORS.primaryTextColor
                                }}
                            >
                                Priority Concierge
                            </Text>

                            <Text
                                className='font-medium self-start mt-1 ml-1'
                                style={{
                                    fontSize: moderateScale(12),
                                    color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                }}
                            >
                                Estimated Delivery :{" "}

                                <Text
                                    className='font-bold'
                                    style={{
                                        fontSize: moderateScale(12),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    25-30 Mins
                                </Text>
                            </Text>

                            <View
                                className="self-start flex-row items-center gap-1 mt-4"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                    paddingHorizontal: moderateScale(8),
                                    paddingVertical: moderateScale(3.5),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <CrownIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />

                                <Text
                                    className="font-bold"
                                    style={{
                                        color: COLORS.primaryColor,
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
                            className='p-4 mt-4'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View className="flex-row items-center">
                                <Text
                                    className="font-semibold"
                                    style={{
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75),
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
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                        }}
                                    >
                                        Qty
                                    </Text>
                                </View>

                                <View
                                    className="items-center"
                                    style={{ width: moderateScale(45) }}
                                >
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75),
                                        }}
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
                            className='p-3 mt-4'
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderRadius: moderateScale(18),
                                borderWidth: moderateScale(0.5)
                            }}
                        >
                            <View
                                className="self-start flex-row items-center"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                    paddingHorizontal: moderateScale(8),
                                    paddingVertical: moderateScale(3.5),
                                    borderRadius: moderateScale(14)
                                }}
                            >
                                <GiftIcon width={moderateScale(17)} height={moderateScale(17)} color={COLORS.primaryColor} />

                                <Text
                                    className="font-bold"
                                    style={{
                                        color: COLORS.primaryColor,
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
                                    className="self-start rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <CircleStarIcon width={moderateScale(20)} height={moderateScale(20)} color={COLORS.primaryColor} />
                                </View>

                                <View className='justify-center gap-1 flex-1'>
                                    <Text
                                        className='font-bold'
                                        style={{
                                            fontSize: moderateScale(12),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Points Earned
                                    </Text>

                                    <Text
                                        className='font-medium'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Added to your vault
                                    </Text>
                                </View>

                                <Text
                                    className='font-extrabold mr-2'
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    +120
                                </Text>
                            </View>

                            <View className='flex-row gap-2 justify-center items-center self-start mt-4'>
                                <View
                                    className="self-start rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <WalletIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} />
                                </View>

                                <View className='justify-center gap-1 flex-1'>
                                    <Text
                                        className='font-bold'
                                        style={{
                                            fontSize: moderateScale(12),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Cashback
                                    </Text>

                                    <Text
                                        className='font-medium'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                        }}
                                    >
                                        Next order credit
                                    </Text>
                                </View>

                                <Text
                                    className='font-extrabold mr-2'
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    ₹25
                                </Text>
                            </View>

                            <View className='flex-row gap-2 justify-center items-center self-start mt-4'>
                                <View
                                    className="self-start rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: hexToRgba(COLORS.accentColor, 0.15),
                                        width: moderateScale(32),
                                        height: moderateScale(32)
                                    }}
                                >
                                    <StarBadgeIcon width={moderateScale(17)} height={moderateScale(17)} color={COLORS.primaryColor} />
                                </View>

                                <View className='justify-center gap-1 flex-1'>
                                    <Text
                                        className='font-bold'
                                        style={{
                                            fontSize: moderateScale(12),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Membership Savings
                                    </Text>
                                </View>

                                <Text
                                    className='font-extrabold mr-2'
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    ₹40
                                </Text>
                            </View>
                        </View>

                        <View
                            className="p-5"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <Text
                                className="font-bold"
                                style={{
                                    color: COLORS.primaryTextColor,
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
                                className="items-center flex-row justify-center mt-3 -mx-1"
                                style={{
                                    backgroundColor: COLORS.activeStatusBackgroundColor,
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="font-semibold self-start flex-1"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.activeStatusTextColor
                                    }}
                                >
                                    Coupon Savings
                                </Text>

                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.activeStatusTextColor
                                    }}
                                >
                                    -₹100
                                </Text>
                            </View>

                            <View
                                className="items-center flex-row justify-center mt-3 -mx-1"
                                style={{
                                    backgroundColor: COLORS.activeStatusBackgroundColor,
                                    paddingHorizontal: scale(12),
                                    paddingVertical: verticalScale(8),
                                    borderRadius: moderateScale(12)
                                }}
                            >
                                <Text
                                    className="font-semibold self-start flex-1"
                                    style={{
                                        fontSize: moderateScale(13),
                                        color: COLORS.activeStatusTextColor
                                    }}
                                >
                                    Reward Points Used
                                </Text>

                                <Text
                                    className="font-bold"
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.activeStatusTextColor
                                    }}
                                >
                                    -₹50
                                </Text>
                            </View>

                            <View
                                className="rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.borderColor, 0.75),
                                    height: verticalScale(0.7),
                                    marginVertical: verticalScale(12),
                                    marginHorizontal: verticalScale(2)
                                }}
                            />

                            <View className="flex-row justify-between items-center">
                                <Text
                                    className="font-extrabold"
                                    style={{
                                        fontSize: moderateScale(15),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.85)
                                    }}
                                >
                                    Grand Total
                                </Text>

                                <Text
                                    className="font-black tracking-wide"
                                    style={{
                                        fontSize: moderateScale(16),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    ₹620
                                </Text>
                            </View>
                        </View>

                        <View
                            className="p-4 flex-row gap-2"
                            style={{
                                backgroundColor: COLORS.secondaryBackgroundColor,
                                borderColor: hexToRgba(COLORS.primaryTextColor, 0.1),
                                borderWidth: moderateScale(0.5),
                                borderRadius: moderateScale(18),
                                marginTop: verticalScale(14)
                            }}
                        >
                            <View className='justify-center flex-1'>
                                <Text
                                    className='font-bold'
                                    style={{
                                        fontSize: moderateScale(14),
                                        color: COLORS.primaryTextColor
                                    }}
                                >
                                    Thank you for dining with Brothers.
                                </Text>

                                <Text
                                    className='font-medium mt-2'
                                    style={{
                                        fontSize: moderateScale(11),
                                        color: hexToRgba(COLORS.primaryTextColor, 0.75)
                                    }}
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
                                    className='flex-row gap-2 items-center justify-center'
                                    style={{
                                        backgroundColor: COLORS.primaryColor,
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <PrinterIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryBackgroundColor} strokeWidth={1.8} />

                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: COLORS.primaryBackgroundColor
                                        }}
                                    >
                                        Print Invoice
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='flex-row gap-2 items-center justify-center'
                                    style={{
                                        backgroundColor: COLORS.accentLightColor,
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <DownloadIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryColor} strokeWidth={1.8}/>

                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: COLORS.primaryColor
                                        }}
                                    >
                                        PDF Copy
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.95}
                                    onPress={() => {}}
                                    className='flex-row gap-2 items-center justify-center'
                                    style={{
                                        backgroundColor: COLORS.primaryBackgroundColor,
                                        borderColor: hexToRgba(COLORS.primaryTextColor, 0.15),
                                        borderWidth: moderateScale(0.7),
                                        paddingHorizontal: scale(8),
                                        paddingVertical: verticalScale(6),
                                        borderRadius: moderateScale(18)
                                    }}
                                >
                                    <ShareIcon width={moderateScale(14)} height={moderateScale(14)} color={COLORS.primaryTextColor} strokeWidth={1.8}/>

                                    <Text
                                        className='font-semibold'
                                        style={{
                                            fontSize: moderateScale(11),
                                            color: COLORS.primaryTextColor
                                        }}
                                    >
                                        Share
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View
                            className="flex-row gap-2 p-3 items-center"
                            style={{
                                backgroundColor: hexToRgba(COLORS.accentColor, 0.1),
                                borderColor: hexToRgba(COLORS.accentColor, 0.15),
                                borderWidth: moderateScale(0.7),
                                borderRadius: moderateScale(16),
                                marginTop: verticalScale(18)
                            }}
                        >
                            <CustomerServiceIcon width={moderateScale(18)} height={moderateScale(18)} color={COLORS.primaryColor} strokeWidth={1.8} />

                            <Text
                                className="font-semibold flex-1"
                                style={{
                                    fontSize: moderateScale(10),
                                    color: COLORS.primaryColor
                                }}
                            >
                                Need help with this order?
                            </Text>

                            <Pressable
                                onPress={() => {}}
                                className='items-center justify-center'
                            >
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(9),
                                        color: COLORS.primaryColor
                                    }}
                                >
                                    Support Center
                                </Text>
                            </Pressable>

                            <View
                                className="rounded-full"
                                style={{
                                    backgroundColor: hexToRgba(COLORS.borderColor, 0.6),
                                    width: scale(1),
                                    height: verticalScale(12)
                                }}
                            />

                            <Pressable
                                onPress={() => {}}
                                className='items-center justify-center'
                            >
                                <Text
                                    className="font-semibold"
                                    style={{
                                        fontSize: moderateScale(9),
                                        color: COLORS.primaryColor
                                    }}
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