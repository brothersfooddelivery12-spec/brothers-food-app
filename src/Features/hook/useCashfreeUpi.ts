import { CFEnvironment, CFSession, CFUPI, CFUPIPayment, UPIMode } from "cashfree-pg-api-contract"
import { useCallback, useEffect, useState } from "react"
import { CFErrorResponse, CFPaymentGatewayService } from "react-native-cashfree-pg-sdk"

export type UpiApp = {
    appPackage: string
    appName?: string
    [key: string]: unknown
}

type StartPaymentParams = {
    orderId: string
    paymentSessionId: string
    appPackage: string
}

export type CashfreePaymentError = {
    message: string
    orderId?: string
    code?: string
    type?: string
    status?: string
    originalError?: unknown
}

type UseCashfreeUpiProps = {
    onVerify: (orderId: string) => void | Promise<void>

    onError?: (error: CashfreePaymentError) => void
}

const getCashfreeErrorMessage = (
    error: CFErrorResponse
): string => {
    const message = error.getMessage().toLowerCase()
    const code = error.getCode().toLowerCase()

    // User cancelled / closed payment
    if (
        message.includes("cancel") ||
        message.includes("user dropped") ||
        message.includes("closed") ||
        message.includes("abort")
    ) {
        return "Payment was cancelled. You can try again."
    }

    // Network problem
    if (
        message.includes("network") ||
        message.includes("internet") ||
        message.includes("connection")
    ) {
        return "Please check your internet connection and try again."
    }

    // Timeout
    if (message.includes("timeout")) {
        return "The payment request timed out. Please check your payment status before trying again."
    }

    // Session expired
    if (
        message.includes("expired") ||
        message.includes("session") ||
        message.includes("token")
    ) {
        return "Your payment session has expired. Please try again."
    }

    // UPI app problem
    if (
        message.includes("upi app") ||
        message.includes("application")
    ) {
        return "Unable to open the selected UPI app. Please try another payment method."
    }

    // Order problem
    if (
        code.includes("order") ||
        message.includes("invalid order")
    ) {
        return "Unable to process this payment. Please try again."
    }

    return "Payment could not be completed. Please try again."
}

export const useCashfreeUpi = ({ onVerify, onError }: UseCashfreeUpiProps) => {
    const [upiApps, setUpiApps] = useState<UpiApp[]>([])
    const [loadingApps, setLoadingApps] = useState(false)

    useEffect(() => {
        CFPaymentGatewayService.setCallback({
            onVerify(orderId: string): void {
                console.log("Cashfree onVerify:", orderId)

                void onVerify(orderId)
            },

            onError(
                error: CFErrorResponse,
                orderId: string
            ): void {
                console.log("Cashfree payment error:", {
                    orderId,
                    message: error.getMessage(),
                    code: error.getCode(),
                    type: error.getType(),
                    status: error.getStatus()
                })

                onError?.({
                    message: getCashfreeErrorMessage(error),
                    orderId,
                    code: error.getCode(),
                    type: error.getType(),
                    status: error.getStatus(),
                    originalError: error
                })
            }
        })

        return () => {
            CFPaymentGatewayService.removeCallback()
        }
    }, [onVerify, onError])

    const fetchUpiApps = useCallback(async () => {
        try {
            setLoadingApps(true)

            const response = await CFPaymentGatewayService.getInstalledUpiApps()

            console.log("Cashfree UPI apps:", response)

            const parsed =
                typeof response === "string"
                    ? JSON.parse(response)
                    : response

            if (!Array.isArray(parsed)) {
                setUpiApps([])

                return
            }

            const validApps = parsed.filter(
                (app: unknown): app is UpiApp => {

                    if (!app || typeof app !== "object") {
                        return false
                    }

                    const candidate = app as UpiApp

                    return (
                        typeof candidate.appPackage === "string" &&
                        candidate.appPackage.length > 0
                    )
                }
            )

            setUpiApps(validApps)
        } catch (error) {
            console.log("Fetch UPI apps error:", error)

            setUpiApps([])
        } finally {
            setLoadingApps(false)
        }
    }, [])

    const startUpiPayment = useCallback(
        async ({
            orderId,
            paymentSessionId,
            appPackage
        }: StartPaymentParams) => {

            try {
                if (!orderId) {
                    throw new Error("Invalid payment order.")
                }

                if (!paymentSessionId) {
                    throw new Error("Invalid payment session.")
                }

                if (!appPackage) {
                    throw new Error("Please select a UPI app." )
                }

                const session = new CFSession(
                    paymentSessionId,
                    orderId,
                    CFEnvironment.SANDBOX
                )

                const upi = new CFUPI(UPIMode.INTENT, appPackage)

                const payment = new CFUPIPayment(session, upi)

                CFPaymentGatewayService.makePayment(payment)
            } catch (error: unknown) {
                console.log("Start UPI payment error:", error)

                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to start UPI payment."

                onError?.({message, orderId, originalError: error})
            }
        },
        [onError]
    )

    return {
        upiApps,
        loadingApps,
        fetchUpiApps,
        startUpiPayment
    }
}