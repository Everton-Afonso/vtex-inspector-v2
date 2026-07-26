import { getComponents } from "./components"
import { getOrderForm } from "./orderform"
import { getRuntimeInfos } from "./runtimeInfos";


chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    switch (message.type) {
        case "GET_COMPONENTS": sendResponse(getComponents())
            return true

        case "GET_RUNTIME_INFOS": sendResponse(getRuntimeInfos())
            return true

        case "GET_ORDERFORM": getOrderForm().then(sendResponse);
            return true;
    }
})