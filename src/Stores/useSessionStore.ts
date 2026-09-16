import { create } from "zustand"

interface SessionState {
    sessionExpired: boolean

    showSessionExpired: () => void
    hideSessionExpired: () => void
}

export const useSessionStore =
create<SessionState>((set) => ({
    sessionExpired: false,

    showSessionExpired: () =>
        set(state => {
            if (state.sessionExpired) {
                return state
            }

            return {
                sessionExpired: true
            }
        }),

    hideSessionExpired: () =>
        set({
            sessionExpired: false
        })
}))