export function detectVtex(): boolean {
    if (typeof window.__RUNTIME__ !== "undefined" && window.__RUNTIME__) {
        return true
    }

    const cookie = document.cookie
    if (
        cookie.includes("VtexIdclientAutCookie") ||
        cookie.includes("vtex_session") ||
        cookie.includes("vtex_localized-")
    ) {
        return true
    }

    const scripts = document.querySelectorAll("script[src]")
    for (const script of scripts) {
        const src = script.getAttribute("src") ?? ""
        if (
            src.includes("vtex.io") ||
            src.includes("vtexassets.com") ||
            src.includes("/vtex.") ||
            src.includes("__runtime") ||
            src.includes("render-vtex")
        ) {
            return true
        }
    }

    if (document.querySelector("[data-vtex]")) {
        return true
    }

    if (document.querySelector('meta[name="vtex-version"]')) {
        return true
    }

    if (document.title.toLowerCase().includes("vtex")) {
        return true
    }

    const url = window.location.href
    if (
        url.includes("myvtex.com") ||
        url.includes("vtexlocal.com.br") ||
        url.includes("vtexcommercestable") ||
        url.includes("vteximg.com.br")
    ) {
        return true
    }

    return false
}
