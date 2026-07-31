import { getOrderForm } from "/src/content/orderform.ts.js";
import { setOrderFormCache } from "/src/content/orderformCache.ts.js";
window.addEventListener("message", (event) => {
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
