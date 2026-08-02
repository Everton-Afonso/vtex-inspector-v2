import { useEffect, useState } from "react"
import { sendMessage } from "../services/chrome"
import { fetchOrderFormDirect } from "../services/orderform-fallback"
import { getOrderFormFromCheckout } from "../services/runtime-scripting"
import type { OrderForm } from "../types/orderform"

const MAX_RETRIES = 15
const RETRY_DELAY = 400

export function useOrderForm() {
    const [orderForm, setOrderForm] = useState<OrderForm | null>(null)

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = async () => {
            if (cancelled) return

            const fromCheckout = await getOrderFormFromCheckout()

            if (cancelled) return

            if (fromCheckout && fromCheckout.orderFormId) {
                setOrderForm(fromCheckout)
                return
            }

            const result = await sendMessage<OrderForm>({ type: "GET_ORDERFORM" })

            if (cancelled) return

            if (result && result.orderFormId) {
                setOrderForm(result)
                return
            }

            const direct = await fetchOrderFormDirect()

            if (cancelled) return

            if (direct && direct.orderFormId) {
                setOrderForm(direct)
                return
            }

            attempt++
            if (attempt >= MAX_RETRIES) {
                setOrderForm(null)
                return
            }

            setTimeout(check, RETRY_DELAY)
        }

        check()

        return () => {
            cancelled = true
        }
    }, [])

    async function clearOrderForm() {
        if (!orderForm?.orderFormId) return

        const updated = await sendMessage<OrderForm>({
            type: "CLEAR_ORDERFORM",
            orderFormId: orderForm.orderFormId
        })

        if (updated) setOrderForm(updated)
    }

    async function refreshOrderForm() {
        await sendMessage<OrderForm>({ type: "NEW_ORDERFORM" })

        await sendMessage<boolean>({
            type: "CLEAR_STORAGE",
            keys: ["zipcode_configured", "zipcode_cached", "visible_zipcode_modal"]
        })

        const fresh = await sendMessage<OrderForm>({ type: "GET_ORDERFORM" })

        if (fresh) setOrderForm(fresh)

        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (tab?.id) chrome.tabs.reload(tab.id)
        })
    }

    return { orderForm, clearOrderForm, refreshOrderForm }
}