export async function getOrderForm() {
	try {
		const response = await fetch("/api/checkout/pub/orderForm", { credentials: "include" });
		if (!response.ok) return null;
		return response.json();
	} catch {
		return null;
	}
}
