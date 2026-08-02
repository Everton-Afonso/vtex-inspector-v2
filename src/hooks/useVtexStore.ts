import { useEffect, useState } from "react"

import { sendMessage } from "../services/chrome"
import type { Runtime } from "../types/runtime"

const MAX_RETRIES = 20
const RETRY_DELAY = 250

async function detectVtexFromCookies(): Promise<boolean> {
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        const url = tabs[0]?.url

        if (!url) return false

        if (
            url.includes("myvtex.com") ||
            url.includes("vtexlocal.com.br") ||
            url.includes("vtexcommercestable")
        ) {
            return true
        }

        const cookies = await chrome.cookies.getAll({ url })
        return cookies.some(
            cookie =>
                cookie.name.includes("VtexIdclientAutCookie") ||
                cookie.name === "vtex_session"
        )
    } catch {
        return false
    }
}

export function useVtexStore() {
    const [isVtex, setIsVtex] = useState<boolean | null>(null)

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = async () => {
            if (cancelled) return

            const detected = await sendMessage<boolean>({ type: "CHECK_VTEX" })

            if (cancelled) return

            if (detected === true) {
                const runtime = await sendMessage<Runtime>({ type: "GET_RUNTIME_INFOS" })

                if (cancelled) return

                if (runtime && runtime.account) {
                    setIsVtex(true)
                    return
                }

                attempt++
                if (attempt >= MAX_RETRIES) {
                    setIsVtex(true)
                    return
                }

                setTimeout(check, RETRY_DELAY)
                return
            }

            const cookieDetected = await detectVtexFromCookies()

            if (cancelled) return

            if (cookieDetected) {
                attempt++
                if (attempt >= MAX_RETRIES) {
                    setIsVtex(true)
                    return
                }

                setTimeout(check, RETRY_DELAY)
                return
            }

            attempt++
            if (attempt >= 3) {
                setIsVtex(false)
                return
            }

            setTimeout(check, RETRY_DELAY)
        }

        check()

        return () => {
            cancelled = true
        }
    }, [])

    return isVtex
}
