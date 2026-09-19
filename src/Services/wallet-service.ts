import { api } from "./http-client"

export type Wallet = {
    wallet_id: string
    balance: string
    currency: string
}

export const getMyWallet = () => {
    return api.get("/wallet/me")
}

export interface WalletTopupRequest {
    amount: number,
    description?: string
}

export const topupWallet = (payload: WalletTopupRequest) => {
    return api.post("/wallet/topup", payload)
}

export interface WalletTransactionsParams {
    wallet_id: string
}

export const getMyWalletTransactions = (walletId: string) => {
    return api.get("/wallet/transactions/me",
        {
            params: {
                wallet_id: walletId
            }
        }
    )
}