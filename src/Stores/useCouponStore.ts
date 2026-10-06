import { create } from "zustand"

type AppliedCoupon = {
    id: string
    code: string
    title: string
    description: string

    discount_type: "FLAT" | "PERCENTAGE"
    discount_value: string
    max_discount: string | null
    min_order_amount: string
}

type CouponStore = {
    appliedCoupon: AppliedCoupon | null

    setAppliedCoupon: (coupon: AppliedCoupon) => void

    clearAppliedCoupon: () => void
}

export const useCouponStore =
    create<CouponStore>((set) => ({
        appliedCoupon: null,

        setAppliedCoupon: (coupon) =>
            set({
                appliedCoupon: coupon
            }),

        clearAppliedCoupon: () =>
            set({
                appliedCoupon: null
            })
    }))