import { useEffect, useState } from "react"

import { sendMessage } from "../services/chrome"
import type { Runtime } from "../types/runtime"

export function useRuntime() {
    const [runtime, setRuntime] = useState<Runtime | null>(null)

    useEffect(() => {
        sendMessage<Runtime>({
            type: "GET_RUNTIME_INFOS",
        }).then(setRuntime)
    }, [])

    return runtime
}