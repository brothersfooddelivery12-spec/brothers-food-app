import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { moderateScale } from "react-native-size-matters"

type LoadingDotsProps = {
    color?: string
}

export const LoadingDots = React.memo(({ color = "#3F2516" }: LoadingDotsProps) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev === 3 ? 0 : prev + 1)
        }, 450)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <View
            style={{ width: moderateScale(16) }}
        >
            <Text
                className="font-extrabold"
                style={{
                    color,
                    fontSize: moderateScale(15.5)
                }}
            >
                {".".repeat(count)}
            </Text>
        </View>
    )
})