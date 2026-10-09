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
    amount: number
    description?: string
}

export const topupWallet = (payload: WalletTopupRequest) => {
    return api.post(
        "/wallet/topup",
        null,
        {
            params: {
                amount: payload.amount
            }
        }
    )
}

export interface WalletTransaction {
    id: string
    amount: number
    description: string
    transaction_type:
        | "DEBIT"
        | "CREDIT"
        | "REFUND"
        | "ADJUSTMENT"
        | string

    wallet_id: string
    order_id: string | null
    created_at: string
}

export interface WalletTransactionsParams {
    wallet_id: string
}

export const getMyWalletTransactions = ({wallet_id}: WalletTransactionsParams) => {
    return api.get("/wallet/transactions/me",
        {
            params: {
                wallet_id
            }
        }
    )
}