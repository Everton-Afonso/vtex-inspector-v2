import { getComponents } from "./components"
import { detectVtex } from "./detectVtex"
import {
    clearOrderForm,
    getOrderForm,
    newOrderForm,
    updateItems
} from "./orderform"
import { getRuntimeInfos } from "./runtimeInfos";

type Message =
    | { type: "CHECK_VTEX" }
    | { type: "GET_COMPONENTS" }
    | { type: "GET_RUNTIME_INFOS" }
    | { type: "GET_ORDERFORM" }
    | { type: "CLEAR_ORDERFORM"; orderFormId: string }
    | { type: "UPDATE_ITEM"; orderFormId: string; index: number; quantity: number }
    | { type: "NEW_ORDERFORM" }
    | { type: "CLEAR_STORAGE"; keys: string[] }

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
    switch (message.type) {
        case "CHECK_VTEX": sendResponse(detectVtex())
            return true

        case "GET_COMPONENTS": sendResponse(getComponents())
            return true

        case "GET_RUNTIME_INFOS": sendResponse(getRuntimeInfos())
            return true

        case "GET_ORDERFORM": getOrderForm().then(sendResponse);
            return true;

        case "CLEAR_ORDERFORM": clearOrderForm(message.orderFormId).then(sendResponse);
            return true;

        case "UPDATE_ITEM": updateItems(message.orderFormId, [{
            index: message.index, quantity: message.quantity
        }]).then(sendResponse);
            return true;

        case "NEW_ORDERFORM": newOrderForm().then(sendResponse);
            return true;

        case "CLEAR_STORAGE":
            (message.keys ?? []).forEach((key) => localStorage.removeItem(key));
            sendResponse(true);
            return true;
    }
})