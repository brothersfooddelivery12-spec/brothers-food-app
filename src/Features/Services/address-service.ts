import { api } from "./http-client"

export type Address = {
    id: string
    label: string
    receiver_name: string
    receiver_phone: string
    address_line: string
    landmark: string
    area: string
    city: string
    state: string
    pincode: string
    latitude: number
    longitude: number
    is_default?: boolean
}

export type AddAddressRequest = {
    label: string
    receiver_name: string
    receiver_phone: string
    address_line: string
    landmark: string
    area: string
    city: string
    state: string
    pincode: string
    latitude: number
    longitude: number
}

export type UpdateAddressRequest = {
    id: string
    label: string
    receiver_name: string
    receiver_phone: string
    address_line: string
    landmark: string
    area: string
    city: string
    state: string
    pincode: string
    latitude: number
    longitude: number
}

export const getAllAddresses = () => {
    return api.get("/user/me/address")
}

export const addAddress = (req: AddAddressRequest) => {
    return api.post("/user/me/address", req)
}

export const getAddressById = (addressId: string) => {
    return api.get(`/user/me/address/${addressId}`)
}

export const updateAddress = (addressId: string, req: UpdateAddressRequest) => {
    return api.put(`/user/me/address/${addressId}`, req)
}

export const deleteAddress = (addressId: string) => {
    return api.delete(`/user/me/address/${addressId}`)
}

export const setDefaultAddress = (addressId: string) => {
    return api.patch(`/user/me/address/${addressId}/default`)
}