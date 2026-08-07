export async function getOrderForm() {
    try {
        const response = await fetch("/api/checkout/pub/orderForm", {
            credentials: "include"
        })

        if (!response.ok) return null

        return response.json()
    } catch {
        return null
    }
}

export async function newOrderForm() {
    try {
        const response = await fetch("/api/checkout/pub/orderForm?forceNewCart=true", {
            credentials: "include",
            headers: { "Accept": "application/json" }
        })

        if (!response.ok) return null

        return response.json()
    } catch {
        return null
    }
}

export async function updateItems(
    orderFormId: string,
    items: { index: number; quantity: number }[]
) {
    try {
        const response = await fetch(
            `/api/checkout/pub/orderForm/${orderFormId}/items/update`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(items)
            }
        )

        if (!response.ok) return null

        return response.json()
    } catch {
        return null
    }
}

export async function clearOrderForm(orderFormId: string) {
    try {
        const response = await fetch(
            `/api/checkout/pub/orderForm/${orderFormId}/items/removeAll`,
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: "[]"
            }
        )

        if (!response.ok) return null

        return response.json()
    } catch {
        return null
    }
}