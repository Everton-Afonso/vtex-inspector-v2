export async function getOrderForm() {
	try {
		const response = await fetch("/api/checkout/pub/orderForm", { credentials: "include" });
		if (!response.ok) return null;
		return response.json();
	} catch {
		return null;
	}
}
export async function newOrderForm() {
	try {
		const response = await fetch("/api/checkout/pub/orderForm?forceNewCart=true", {
			credentials: "include",
			headers: { "Accept": "application/json" }
		});
		if (!response.ok) return null;
		return response.json();
	} catch {
		return null;
	}
}
export async function clearOrderForm(orderFormId) {
	try {
		const response = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/items/removeAll`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: "[]"
		});
		if (!response.ok) return null;
		return response.json();
	} catch {
		return null;
	}
}
