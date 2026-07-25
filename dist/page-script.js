function sendRuntime() {
    const runtime = window.__RUNTIME__

    window.postMessage(
        {
            type: "VTEX_RUNTIME",
            runtime: {
                components: Object.keys(runtime.components)
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