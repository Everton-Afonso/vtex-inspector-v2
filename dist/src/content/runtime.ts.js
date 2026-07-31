let vtexRuntime = null;
window.addEventListener("message", (event) => {
	if (event.source !== window || event.data.type !== "VTEX_RUNTIME") {
		return;
	}
	vtexRuntime = event.data.runtime;
});
export function getRuntime() {
	return vtexRuntime;
}
