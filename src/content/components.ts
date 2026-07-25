import type { Apps } from "../types/components"
import { getRuntime } from "./runtime"

export function getComponents() {
    const components = getRuntime()?.components

    if (!components) return {}

    const apps: Apps = {}

    components.forEach((key: string) => {
        const match = key.match(/^(.+?)@([^/]+)\/(.+)$/)

        if (!match) return

        const [, app, version] = match
        const appKey = `${app}@${version}`

        if (!apps[appKey]) {
            apps[appKey] = {
                app,
                version
            }
        }
    })

    return apps
}