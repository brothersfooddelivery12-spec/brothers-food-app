import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type SavedPaymentMethodType = "UPI" | "CARD"

export interface SavedPaymentMethod {
    id: string
    type: SavedPaymentMethodType

    // UPI
    packageName?: string
    name?: string
    isDefault?: boolean

    // Card
    cardToken?: string
    cardNetwork?: string
    cardLast4?: string
}

interface PaymentMethodState {
    savedPaymentMethods: SavedPaymentMethod[]

    addPaymentMethod: (method: SavedPaymentMethod) => void

    removePaymentMethod: (id: string) => void

    setDefaultPaymentMethod: (id: string) => void

    clearPaymentMethods: () => void
}

export const usePaymentMethodStore =
    create<PaymentMethodState>()(
        persist(
            (set) => ({
                savedPaymentMethods: [],

                addPaymentMethod: (method) => {
                    set((state) => {
                        const alreadyExists = state.savedPaymentMethods.some((item) => item.id === method.id)

                        if (alreadyExists) {
                            return state
                        }

                        return {
                            savedPaymentMethods: [
                                ...state.savedPaymentMethods,
                                method
                            ]
                        }
                    })
                },

                removePaymentMethod: (id) => {
                    set((state) => ({
                        savedPaymentMethods: state.savedPaymentMethods.filter((item) => item.id !== id)
                    }))
                },

                setDefaultPaymentMethod: (id) => {
                    set((state) => ({
                        savedPaymentMethods:
                            state.savedPaymentMethods.map(
                                (item) => ({
                                    ...item,
                                    isDefault: item.id === id
                                })
                            )
                    }))
                },

                clearPaymentMethods: () => {
                    set({
                        savedPaymentMethods: []
                    })
                }
            }),
            {
                name: "saved-payment-methods",
                storage:
                    createJSONStorage(
                        () => AsyncStorage
                    )
            }
        )
    )