import { useEffect, useState } from "react";

import { sendMessage } from "../services/chrome";
import { getComponentsFromPage } from "../services/runtime-scripting";
import type { Apps } from "../types/components";

const MAX_RETRIES = 20
const RETRY_DELAY = 300

function parseComponents(componentList: string[]): Apps {
    const apps: Apps = {}

    componentList.forEach((component: string) => {
        const match = component.match(/^(.+?)@([^/]+)\/(.+)$/)

        if (!match) return

        const [, app, version] = match
        const id = `${app}@${version}`

        if (apps[id]) return

        apps[id] = {
            id,
            app,
            version,
            component,
            type: app.startsWith("vtex.") ? "VTEX" : "CUSTOM",
        }
    })

    return apps
}

async function fetchComponents(): Promise<Apps> {
    const fromContent = await sendMessage<Apps>({ type: "GET_COMPONENTS" })

    if (fromContent && Object.keys(fromContent).length > 0) {
        return fromContent
    }

    const componentList = await getComponentsFromPage()

    if (componentList && componentList.length > 0) {
        return parseComponents(componentList)
    }

    return {}
}

export function useComponents() {
    const [components, setComponents] = useState<Apps>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = async () => {
            if (cancelled) return

            const result = await fetchComponents()

            if (cancelled) return

            if (Object.keys(result).length > 0) {
                setComponents(result)
                setLoading(false)

                return
            }

            attempt++

            if (attempt >= MAX_RETRIES) {
                setComponents({})
                setLoading(false)

                return
            }

            setTimeout(check, RETRY_DELAY)
        }

        check()

        return () => {
            cancelled = true
        }
    }, []);

    async function refreshComponents() {
        setLoading(true)

        const result = await fetchComponents()
        
        setComponents(result)
        setLoading(false)
    }

    return { components, loading, refreshComponents };
}