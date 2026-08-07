import type { Runtime } from "@/types/runtime"
import type { OrderForm } from "../types/orderform"

export function getRuntimeFromPage(): Promise<Runtime | null> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
            if (!tab?.id) {
                resolve(null)
                return
            }

            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: () => {
                        const runtime = window.__RUNTIME__

                        if (!runtime) return null

                        return {
                            account: runtime.account,
                            workspace: runtime.workspace,
                            production: runtime.production,
                            platform: runtime.platform,
                            page: runtime.page,
                            route: runtime.route?.id,
                            rootPath: runtime.route?.path,
                            publicEndpoint: runtime.publicEndpoint,
                            renderMajor: runtime.renderMajor,
                            runtimeVersion: runtime.runtimeMeta?.version,
                            culture: runtime.culture,
                            hints: runtime.hints,
                            loadedDevices: runtime.loadedDevices,
                            binding: runtime.binding,
                            components: Object.keys(runtime.components ?? {}),
                            pages: Object.keys(runtime.pages ?? {}),
                        }
                    },
                })

                resolve((results?.[0]?.result as Runtime) ?? null)
            } catch {
                resolve(null)
            }
        })
    })
}

export function getComponentsFromPage(): Promise<string[] | null> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
            if (!tab?.id) {
                resolve(null)
                return
            }

            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: () => {
                        const runtime = window.__RUNTIME__
                        if (!runtime?.components) return null

                        return Object.keys(runtime.components)
                    },
                })

                resolve((results?.[0]?.result as string[]) ?? null)
            } catch {
                resolve(null)
            }
        })
    })
}

export function getOrderFormFromCheckout(): Promise<OrderForm | null> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
            if (!tab?.id) {
                resolve(null)
                return
            }

            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: () => {
                        const checkout = window.__CHECKOUT__

                        if (!checkout?.orderForm?.orderFormId) return null

                        return checkout.orderForm
                    },
                })

                resolve((results?.[0]?.result as OrderForm) ?? null)
            } catch {
                resolve(null)
            }
        })
    })
}

export function updateOrderFormItem(index: number, quantity: number): Promise<OrderForm | null> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
            if (!tab?.id) {
                resolve(null)
                return
            }

            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: async (itemIndex: number, itemQuantity: number) => {
                        try {
                            let orderFormId: string | null = null

                            const runtime = window.__RUNTIME__

                            if (runtime?.page) {
                                if (runtime.page === "store.checkout") {
                                    const checkout = window.__CHECKOUT__

                                    orderFormId = checkout?.orderForm?.orderFormId ?? null
                                } else {
                                    const of = JSON.parse(localStorage.getItem("orderform") || "{}")
                                    orderFormId = of.id || of.orderFormId
                                }
                            }

                            if (!orderFormId) {
                                const vtexjs = window.vtexjs

                                orderFormId = vtexjs?.checkout?.orderForm?.orderFormId ?? null
                            }

                            if (!orderFormId) return null

                            const response = await fetch(
                                `/api/checkout/pub/orderForm/${orderFormId}/items/update`,
                                {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json"
                                    },
                                    body: JSON.stringify({
                                        orderItems: [
                                            {
                                                index: itemIndex,
                                                quantity: itemQuantity,
                                            },
                                        ],
                                    })
                                }
                            )

                            if (!response.ok) return null

                            return response.json()
                        } catch {
                            return null
                        }
                    },
                    args: [index, quantity]
                })

                resolve((results?.[0]?.result as OrderForm) ?? null)
            } catch {
                resolve(null)
            }
        })
    })
}

export function removeOrderFormItem(index: number): Promise<OrderForm | null> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
            if (!tab?.id) {
                resolve(null)
                
                return
            }

            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: "MAIN",
                    func: async (itemIndex: number) => {
                        try {
                            let orderFormId: string | null = null

                            const runtime = window.__RUNTIME__

                            if (runtime?.page) {
                                if (runtime.page === "store.checkout") {
                                    const checkout = window.__CHECKOUT__

                                    orderFormId = checkout?.orderForm?.orderFormId ?? null
                                } else {
                                    const of = JSON.parse(localStorage.getItem("orderform") || "{}")
                                    orderFormId = of.id || of.orderFormId
                                }
                            }

                            if (!orderFormId) {
                                const vtexjs = window.vtexjs

                                orderFormId = vtexjs?.checkout?.orderForm?.orderFormId ?? null
                            }

                            if (!orderFormId) return null

                            const response = await fetch(
                                `/api/checkout/pub/orderForm/${orderFormId}/items/update`,
                                {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json"
                                    },
                                    body: JSON.stringify({
                                        orderItems: [
                                            {
                                                index: itemIndex,
                                                quantity: 0,
                                            },
                                        ],
                                    })
                                }
                            )

                            if (!response.ok) return null

                            return response.json()
                        } catch {
                            return null
                        }
                    },
                    args: [index],
                })

                resolve((results?.[0]?.result as OrderForm) ?? null)
            } catch {
                resolve(null)
            }
        })
    })
}
