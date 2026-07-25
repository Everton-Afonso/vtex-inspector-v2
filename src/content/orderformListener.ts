import { getOrderForm } from "./orderform";
import { setOrderFormCache } from "./orderformCache";

window.addEventListener("message", (event: MessageEvent) => {
    if (event.source !== window) {
        return;
    }

    if (event.data.type !== "ORDERFORM_UPDATED") {
        return;
    }

    getOrderForm().then((orderForm) => {
        setOrderFormCache(orderForm);
    });
});