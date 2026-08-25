export async function removeAllCookies(): Promise<number> {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    const url = tabs[0]?.url

    if (!url) return 0

    const cookies = await chrome.cookies.getAll({ url })
    const origin = new URL(url).origin

    await Promise.all(
        cookies.map(cookie =>
            chrome.cookies.remove({
                url: origin,
                name: cookie.name,
                storeId: cookie.storeId,
            })
        )
    )

    return cookies.length
}
