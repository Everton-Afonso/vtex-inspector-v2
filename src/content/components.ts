import type { Apps } from "../types/components"
import { getRuntime } from "./runtime"

export function getComponents(): Apps {
    const components = getRuntime()?.components

    if (!components) {
        return {}
    }

    const apps: Apps = {}

    components.forEach((component: string) => {
        const match = component.match(/^(.+?)@([^/]+)\/(.+)$/)

        if (!match) {
            return
        }

        const [, app, version] = match

        const id = `${app}@${version}`

        if (apps[id]) {
            return
        }

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