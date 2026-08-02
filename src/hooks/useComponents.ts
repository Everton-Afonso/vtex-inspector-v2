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

export function useComponents(): Apps {
    const [components, setComponents] = useState<Apps>({});

    useEffect(() => {
        let cancelled = false
        let attempt = 0

        const check = async () => {
            if (cancelled) return

            const fromContent = await sendMessage<Apps>({ type: "GET_COMPONENTS" })

            if (cancelled) return

            if (fromContent && Object.keys(fromContent).length > 0) {
                setComponents(fromContent)
                return
            }

            const componentList = await getComponentsFromPage<string[]>()

            if (cancelled) return

            if (componentList && componentList.length > 0) {
                setComponents(parseComponents(componentList))
                return
            }

            attempt++
            if (attempt >= MAX_RETRIES) {
                setComponents({})
                return
            }

            setTimeout(check, RETRY_DELAY)
        }

        check()

        return () => {
            cancelled = true
        }
    }, []);

    return components;
}
