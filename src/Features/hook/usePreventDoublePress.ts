import { useRef } from "react"

export const usePreventDoublePress = (delay = 600) => {
    const locked = useRef(false)

    const preventDoublePress = (callback: () => void) => {
        if (locked.current) return

        locked.current = true
        callback()

        setTimeout(() => {
            locked.current = false
        }, delay)
    }

    return preventDoublePress
}