import ArrowLeftIcon from '@/assets/icon/ArrowLeft.svg'
import ArrowRightIcon from '@/assets/icon/ArrowRight.svg'
import { useEffect, useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"

type Props = {
  visible: boolean
  title: string
  selectedDate?: Date

  onConfirm: (date: Date) => void
  onClose: () => void

  futureDisable?: boolean
  pastDisable?: boolean
  action?: string
}

const MONTHS_SHORT: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const DAYS: string[] = ["S", "M", "T", "W", "T", "F", "S"]

function stripTime(d: Date): Date {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

const DAY_SIZE = moderateScale(34)

export default function CalendarPicker({
  visible,
  selectedDate,
  onConfirm,
  onClose,
  futureDisable = false,
  pastDisable = false,
  action = "OK",
}: Props) {
  const today: Date = stripTime(new Date())

  const [calYear, setCalYear] = useState<number>(today.getFullYear())
  const [calMonth, setCalMonth] = useState<number>(today.getMonth())
  const [tempDate, setTempDate] = useState<Date | null>(null)

  useEffect(() => {
    if (visible && selectedDate) {
      const date = stripTime(selectedDate)

      setTempDate(date)
      setCalYear(date.getFullYear())
      setCalMonth(date.getMonth())
    }
  }, [visible, selectedDate])

  const changeMonth = (delta: number): void => {
    let m = calMonth + delta
    let y = calYear

    if (m < 0) {
      m = 11
      y--
    }

    if (m > 11) {
      m = 0
      y++
    }

    setCalMonth(m)
    setCalYear(y)
  }

  const changeYear = (delta: number): void => {
    setCalYear((y) => y + delta)
  }

  const daysInMonth: number = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay: number = new Date(calYear, calMonth, 1).getDay()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center px-6"
        activeOpacity={0.95}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View 
            className="bg-[#FFFFFF] w-full overflow-hidden"
            style={{ borderRadius: moderateScale(24) }}  
          >
            <View className="flex-row items-center px-4 pt-4 pb-3">
              <View className="flex-1 flex-row items-center">
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => changeMonth(-1)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="p-1"
                >
                  <ArrowLeftIcon width={moderateScale(16)} height={moderateScale(16)} color="#1F1F1F95" strokeWidth={1.8} />
                </TouchableOpacity>

                <View className="flex-row items-center mx-1.5">
                  <Text className=" font-semibold text-[#1F1F1F]">
                    {MONTHS_SHORT[calMonth]}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => changeMonth(1)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="p-1"
                >
                  <ArrowRightIcon width={moderateScale(16)} height={moderateScale(16)} color="#1F1F1F95" strokeWidth={1.8} />
                </TouchableOpacity>
              </View>

              <View className="flex-1 flex-row items-center justify-end">
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => changeYear(-1)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="p-1"
                >
                  <ArrowLeftIcon width={moderateScale(16)} height={moderateScale(16)} color="#1F1F1F95" strokeWidth={1.8} />
                </TouchableOpacity>

                <View className="flex-row items-center mx-1.5">
                  <Text className=" font-semibold text-[#1F1F1F]">
                    {calYear}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => changeYear(1)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  className="p-1"
                >
                  <ArrowRightIcon width={moderateScale(16)} height={moderateScale(16)} color="#1F1F1F95" strokeWidth={1.8} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="h-px bg-gray-200 mx-5" />

            <View className="px-3 pt-3 pb-2">
              <View className="flex-row mb-1">
                {DAYS.map((d, idx) => (
                  <View
                    key={`${d}-${idx}`}
                    className="flex-1 items-center py-1"
                  >
                    <Text 
                      className="font-semibold text-[#1F1F1F]/55"
                      style={{ fontSize: moderateScale(10) }}
                    >
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row flex-wrap">
                {cells.map((day, i) => {
                  if (!day) {
                    return <View key={`e-${i}`} style={{ width: "14.28%" }} />
                  }

                  const cellDate = stripTime(new Date(calYear, calMonth, day))
                  const isBeforeToday = cellDate.getTime() < today.getTime()
                  const isAfterToday = cellDate.getTime() > today.getTime()

                  let disabled = false
                  if (!futureDisable && pastDisable) disabled = isBeforeToday
                  else if (futureDisable && !pastDisable) disabled = isAfterToday

                  const isToday = cellDate.getTime() === today.getTime()
                  const isSelected = !!tempDate && cellDate.getTime() === tempDate.getTime()

                  return (
                    <TouchableOpacity
                      key={day}
                      activeOpacity={0.95}
                      disabled={disabled}
                      onPress={() => setTempDate(cellDate)}
                      className="items-center py-0.5 w-[14.28%]"
                    >
                      <View
                        style={{
                          width: DAY_SIZE,
                          height: DAY_SIZE,
                          borderRadius: DAY_SIZE / 2,
                          backgroundColor: isSelected
                              ? "#3F2516"
                              : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden"
                        }}
                      >
                        <Text
                            className={`${
                              isSelected
                                ? "text-[#FFFFFF] font-extrabold"
                                : disabled
                                  ? "text-[#1F1F1F]/35 font-semibold"
                                  : isToday
                                    ? "text-[#3F2516] font-extrabold"
                                    : "text-[#1F1F1F]/75 font-semibold"
                            }`}
                            style={{ fontSize: moderateScale(12) }}
                        >
                          {day}
                      </Text>
                    </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View className="h-px bg-gray-200 mx-5" />

            <View className="flex-row justify-end items-center px-6 py-4 gap-4">
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className='items-center justify-center bg-[#3F2516]'
                style={{
                  paddingHorizontal: scale(16),
                  paddingVertical: verticalScale(7),
                  borderRadius: moderateScale(16)
                }}
              >
                <Text 
                  className="text-[#FFFFFF] font-medium"
                  style={{ fontSize: moderateScale(12) }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => {
                  if (tempDate) {
                    onConfirm(tempDate)
                    onClose()
                  }
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className='items-center justify-center bg-[#3F2516]'
                style={{
                  paddingHorizontal: scale(16),
                  paddingVertical: verticalScale(7),
                  borderRadius: moderateScale(16)
                }}
              >
                <Text 
                  className="text-[#FFFFFF] font-medium"
                  style={{ fontSize: moderateScale(12) }}
                >
                  {action}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}
