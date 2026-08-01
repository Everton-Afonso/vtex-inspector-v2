import { useEffect, useState } from "react"

import { sendMessage } from "../services/chrome"
import type { Runtime } from "../types/runtime"

export function useVtexStore() {
    const [isVtex, setIsVtex] = useState<boolean | null>(null)

    useEffect(() => {
        sendMessage<Runtime>({ type: "GET_RUNTIME_INFOS" }).then((runtime) => {
            setIsVtex(runtime !== null)
        })
    }, [])

    return isVtex
}
