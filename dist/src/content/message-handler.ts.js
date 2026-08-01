import { getComponents } from "/src/content/components.ts.js";
import { clearOrderForm, getOrderForm, newOrderForm } from "/src/content/orderform.ts.js";
import { getRuntimeInfos } from "/src/content/runtimeInfos.ts.js";
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
	switch (message.type) {
		case "GET_COMPONENTS":
			sendResponse(getComponents());
			return true;
		case "GET_RUNTIME_INFOS":
			sendResponse(getRuntimeInfos());
			return true;
		case "GET_ORDERFORM":
			getOrderForm().then(sendResponse);
			return true;
		case "CLEAR_ORDERFORM":
			clearOrderForm(message.orderFormId).then(sendResponse);
			return true;
		case "NEW_ORDERFORM":
			newOrderForm().then(sendResponse);
			return true;
		case "CLEAR_STORAGE":
			(message.keys ?? []).forEach((key) => localStorage.removeItem(key));
			sendResponse(true);
			return true;
	}
});
