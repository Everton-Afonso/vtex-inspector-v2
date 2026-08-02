import { getRuntime } from "./runtime"

export function getRuntimeInfos() {
    const runtime = getRuntime()

    if (!runtime) {
        return null
    }

    return {
        account: runtime.account,
        workspace: runtime.workspace,
        production: runtime.production,
        platform: runtime.platform,
        page: runtime.page,
        route: runtime.route,
        rootPath: runtime.rootPath,
        publicEndpoint: runtime.publicEndpoint,
        culture: runtime.culture,
        hints: runtime.hints,
        loadedDevices: runtime.loadedDevices,
        binding: runtime.binding,
        pages: (runtime.pages ?? []).length
    }
}