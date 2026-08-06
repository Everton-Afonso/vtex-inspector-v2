import { useEffect, useState } from "react"

import { sendMessage } from "../services/chrome"
import { getRuntimeFromPage } from "../services/runtime-scripting"
import type { Runtime } from "../types/runtime"

const MAX_RETRIES = 20
const RETRY_DELAY = 300

export function useRuntime() {
    const [runtime, setRuntime] = useState<Runtime | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = async () => {
            if (cancelled) return

            const fromContent = await sendMessage<Runtime>({ type: "GET_RUNTIME_INFOS" })

            if (cancelled) return

            if (fromContent && fromContent.account) {
                setRuntime(fromContent)
                setLoading(false)
                return
            }

            const fromScripting = await getRuntimeFromPage()

            if (cancelled) return

            if (fromScripting && fromScripting.account) {
                setRuntime(fromScripting)
                setLoading(false)

                return
            }

            attempt++
            if (attempt >= MAX_RETRIES) {
                setRuntime(null)
                setLoading(false)
                
                return
            }

            setTimeout(check, RETRY_DELAY)
        }

        check()

        return () => {
            cancelled = true
        }
    }, [])

    return { runtime, loading }
}