import { api } from "./http-client"

export type Wallet = {
    wallet_id: string
    balance: string
    currency: string
}

export const getMyWallet = () => {
    return api.get("/wallet/me")
}