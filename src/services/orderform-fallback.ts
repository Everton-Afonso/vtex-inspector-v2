import type { OrderForm } from "../types/orderform"

export async function fetchOrderFormDirect(): Promise<OrderForm | null> {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        const url = tabs[0]?.url

        if (!url) return null

        const origin = new URL(url).origin
        const response = await fetch(`${origin}/api/checkout/pub/orderForm`, {
            credentials: "include"
        })

        if (!response.ok) return null

        return response.json()
    } catch {
        return null
    }
}