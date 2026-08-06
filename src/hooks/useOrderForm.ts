import { useEffect, useState } from "react"
import { sendMessage } from "../services/chrome"
import { fetchOrderFormDirect } from "../services/orderform-fallback"
import { 
    getOrderFormFromCheckout, 
    updateOrderFormItem 
} from "../services/runtime-scripting"
import type { OrderForm } from "../types/orderform"

const MAX_RETRIES = 15
const RETRY_DELAY = 400

async function fetchOrderFormData(): Promise<OrderForm | null> {
    const fromCheckout = await getOrderFormFromCheckout()

    if (fromCheckout && fromCheckout.orderFormId) {
        return fromCheckout
    }

    const result = await sendMessage<OrderForm>({ type: "GET_ORDERFORM" })

    if (result && result.orderFormId) {
        return result
    }

    const direct = await fetchOrderFormDirect()

    if (direct && direct.orderFormId) {
        return direct
    }

    return null
}

export function useOrderForm() {
    const [orderForm, setOrderForm] = useState<OrderForm | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = async () => {
            if (cancelled) return

            const result = await fetchOrderFormData()

            if (cancelled) return

            if (result) {
                setOrderForm(result)
                setLoading(false)

                return
            }

            attempt++
            if (attempt >= MAX_RETRIES) {
                setOrderForm(null)
                setLoading(false)

                return
            }

            setTimeout(check, RETRY_DELAY)
        }

        check()

        return () => {
            cancelled = true
        }
    }, [])

    async function refreshOrderFormData() {
        setLoading(true)
        
        const result = await fetchOrderFormData()

        setOrderForm(result)
        setLoading(false)
    }

    async function clearOrderForm() {
        if (!orderForm?.orderFormId) return

        const updated = await sendMessage<OrderForm>({
            type: "CLEAR_ORDERFORM",
            orderFormId: orderForm.orderFormId
        })

        if (updated) setOrderForm(updated)
    }

    async function updateItemQuantity(index: number, quantity: number) {
        const updated = await updateOrderFormItem(index, quantity)

        if (updated) {
            setOrderForm(updated)
        } else {
            if (!orderForm?.orderFormId) return

            const fallback = await sendMessage<OrderForm>({
                type: "UPDATE_ITEM",
                orderFormId: orderForm.orderFormId,
                index,
                quantity
            })

            if (fallback) setOrderForm(fallback)
        }
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

    return { 
        orderForm, 
        loading, 
        clearOrderForm, 
        updateItemQuantity, 
        refreshOrderForm, 
        refreshOrderFormData 
    }
}