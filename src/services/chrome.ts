interface ChromeMessage {
    type: "CHECK_VTEX" | "GET_COMPONENTS" | "GET_ORDERFORM" | "GET_RUNTIME_INFOS" | "CLEAR_ORDERFORM" | "NEW_ORDERFORM" | "CLEAR_STORAGE"
    orderFormId?: string;
    keys?: string[];
}

export function sendMessage<T>(message: ChromeMessage): Promise<T | null> {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab?.id) {
                resolve(null)
                return
            }

            chrome.tabs.sendMessage(tab.id, message, response => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message)
                    resolve(null)
                    return
                }

                resolve(response)
            })
        })
    })
}