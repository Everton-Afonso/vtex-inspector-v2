import type { OrderForm } from "../types/orderform";
import { getComponents } from "./components"
import { getOrderForm } from "./orderform"
import { getRuntimeInfos } from "./runtimeInfos";

let orderFormCache: OrderForm | null = null

async function updateOrderForm() {
    const orderForm: OrderForm = await getOrderForm()

    if (orderForm) {
        orderFormCache = orderForm
    }
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    switch (message.type) {
        case "GET_COMPONENTS": sendResponse(getComponents())
            return true

        case "GET_RUNTIME_INFOS": sendResponse(getRuntimeInfos())
            return true

        case "GET_ORDERFORM":
            if (orderFormCache) {
                sendResponse(orderFormCache)
            } else {
                updateOrderForm().then(() => sendResponse(orderFormCache))
            }

            return true
    }
})