import { useEffect, useState } from "react"

import { sendMessage } from "../services/chrome"
import type { Runtime } from "../types/runtime"

const MAX_RETRIES = 10
const RETRY_DELAY = 300

export function useVtexStore() {
    const [isVtex, setIsVtex] = useState<boolean | null>(null)

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = () => {
            if (cancelled) return

            sendMessage<Runtime>({ type: "GET_RUNTIME_INFOS" }).then((runtime) => {
                if (cancelled) return

                if (runtime && runtime.account) {
                    setIsVtex(true)
                    return
                }

                attempt++

                if (attempt >= MAX_RETRIES) {
                    setIsVtex(false)
                    return
                }

                setTimeout(check, RETRY_DELAY)
            })
        }

        check()

        return () => {
            cancelled = true
        }
    }, [])

    return isVtex
}
