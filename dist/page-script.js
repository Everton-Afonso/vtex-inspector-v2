function sendRuntime() {
    const runtime = window.__RUNTIME__

    window.postMessage(
        {
            type: "VTEX_RUNTIME",
            runtime: {
                account: runtime?.account,
                workspace: runtime?.workspace,
                production: runtime?.production,
                platform: runtime?.platform,
                page: runtime?.page,
                route: runtime?.route?.id,
                rootPath: runtime?.route?.path,
                publicEndpoint: runtime?.publicEndpoint,
                renderMajor: runtime?.renderMajor,
                runtimeVersion: runtime?.runtimeMeta?.version,
                culture: runtime?.culture,
                hints: runtime?.hints,
                loadedDevices: runtime?.loadedDevices,
                binding: runtime?.binding,
                components: Object.keys(runtime?.components ?? {}),
                pages: Object.keys(runtime?.pages ?? {}),
            }
        }, "*"
    )
}

const interval = setInterval(() => {
    const runtime = window.__RUNTIME__

    if (runtime && runtime.components && Object.keys(runtime.components).length > 0) {
        clearInterval(interval)

        sendRuntime()
    }
}, 500)

//Monitora alterações no orderForm

const originalFetch = window.fetch

window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    const url = typeof args[0] === "string" ?
        args[0] : args[0] instanceof Request ? args[0].url : ""

    if (url.includes("/api/checkout/pub/orderForm")) {
        window.postMessage(
            {
                type: "ORDERFORM_UPDATED",
            }, "*"
        )
    }

    return response
}