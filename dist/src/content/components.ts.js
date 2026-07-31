import { getRuntime } from "/src/content/runtime.ts.js";
export function getComponents() {
	const components = getRuntime()?.components;
	if (!components) {
		return {};
	}
	const apps = {};
	components.forEach((component) => {
		const match = component.match(/^(.+?)@([^/]+)\/(.+)$/);
		if (!match) {
			return;
		}
		const [, app, version] = match;
		const id = `${app}@${version}`;
		if (apps[id]) {
			return;
		}
		apps[id] = {
			id,
			app,
			version,
			component,
			type: app.startsWith("vtex.") ? "VTEX" : "CUSTOM"
		};
	});
	return apps;
}
