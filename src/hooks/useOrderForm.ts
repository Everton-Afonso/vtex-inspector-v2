import { useEffect, useState } from "react"
import { sendMessage } from "../services/chrome"
import type { OrderForm } from "../types/orderform"

export function useOrderForm() {
    const [orderForm, setOrderForm] = useState<OrderForm | null>(null)

    useEffect(() => {
        sendMessage<OrderForm>({
            type: "GET_ORDERFORM"
        }).then(setOrderForm)
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