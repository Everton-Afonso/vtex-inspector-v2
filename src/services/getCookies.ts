export async function getCookies() {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })

    const url = tabs[0]?.url

    if (!url) return []

    return await chrome.cookies.getAll({
        url,
    })
}