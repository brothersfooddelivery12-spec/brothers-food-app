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

type UseCashfreeUpiProps = {
    onVerify: (orderId: string) => void | Promise<void>

    onError?: (message: string, orderId?: string) => void
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

            onError(error: CFErrorResponse, orderId: string): void {
                console.log("Cashfree onError:", JSON.stringify(error), orderId)

                onError?.("Payment was not completed.", orderId)
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
        }, []
    )

    const startUpiPayment = useCallback(
        async ({ orderId, paymentSessionId, appPackage}: StartPaymentParams) => {
            try {
                if (!orderId || !paymentSessionId) {
                    throw new Error("Invalid payment session.")
                }

                if (!appPackage) {
                    throw new Error("Please select a UPI app.")
                }

                const session = new CFSession(
                    paymentSessionId,
                    orderId,
                    CFEnvironment.SANDBOX
                )

                const upi = new CFUPI(UPIMode.INTENT, appPackage)

                const payment = new CFUPIPayment(session,upi)

                CFPaymentGatewayService.makePayment(payment)
            } catch (error: any) {
                console.log("Start UPI error:", error)

                onError?.(error?.message || "Unable to start UPI payment.")
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