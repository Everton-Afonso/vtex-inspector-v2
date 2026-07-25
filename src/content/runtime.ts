interface Runtime {
    components: string[];
}

interface RuntimeMessage {
    type: "VTEX_RUNTIME";
    runtime: Runtime;
}

let vtexRuntime: Runtime | null = null;

window.addEventListener("message", (event: MessageEvent<RuntimeMessage>) => {
    if (event.source !== window || event.data.type !== "VTEX_RUNTIME") {
        return
    }

    vtexRuntime = event.data.runtime
})

export function getRuntime() {
    return vtexRuntime
}