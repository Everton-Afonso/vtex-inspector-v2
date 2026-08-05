import type { OrderForm } from "../types/orderform"

export function getRuntimeFromPage<T>(): Promise<T | null> {
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
                        // @ts-expect-error __RUNTIME__ is a VTEX global
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

                resolve(results?.[0]?.result ?? null)
            } catch {
                resolve(null)
            }
        })
    })
}

export function getComponentsFromPage<T>(): Promise<T | null> {
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
                        // @ts-expect-error __RUNTIME__ is a VTEX global
                        const runtime = window.__RUNTIME__
                        if (!runtime?.components) return null

                        return Object.keys(runtime.components)
                    },
                })

                resolve(results?.[0]?.result ?? null)
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
                        const checkout = (window as Record<string, unknown>).__CHECKOUT__ as { orderForm?: Record<string, unknown> } | undefined
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
