export function injectPageScript() {
	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("page-script.js");
	script.onload = () => {
		script.remove();
	};
	document.documentElement.appendChild(script);
}
