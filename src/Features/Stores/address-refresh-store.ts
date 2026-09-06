import { create } from "zustand"

type AddressRefreshStore = {
    addressesDirty: boolean

    markAddressesDirty: () => void
    clearAddressesDirty: () => void
}

export const useAddressRefreshStore =
    create<AddressRefreshStore>((set) => ({
        addressesDirty: false,

        markAddressesDirty: () =>
            set({
                addressesDirty: true
            }),

        clearAddressesDirty: () =>
            set({
                addressesDirty: false
            })
    }))