interface ChromeMessage {
    type: "GET_COMPONENTS" | "GET_ORDERFORM";
}

export function sendMessage<T>(message: ChromeMessage): Promise<T> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(
                tab.id!,
                message,
                resolve
            )
        })
    })
}