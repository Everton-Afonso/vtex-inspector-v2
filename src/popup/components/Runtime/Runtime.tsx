import { useRuntime } from "../../../hooks/useRuntime"

import "./styles.css"

export function Runtime() {
    const runtime = useRuntime()

    if (!runtime) return <></>

    const items = [
        {
            label: "Account",
            value: runtime.account,
        },
        {
            label: "Workspace",
            value: runtime.workspace,
        },
        {
            label: "Page",
            value: runtime.page,
        },
        {
            label: "Root Path",
            value: runtime.rootPath,
        },
        {
            label: "Locale",
            value: runtime.culture?.locale,
        },
        {
            label: "Currency",
            value: runtime.culture?.currency,
        },
        {
            label: "Production",
            value: runtime.production ? "Yes" : "No",
        }
    ]

    return (
        <div className="runtime">
            {items.map(({ label, value }) => (
                <div key={label} className="runtime-card">
                    <span className="runtime-label">
                        {label}
                    </span>

                    <span className="runtime-value">
                        {value ?? "-"}
                    </span>
                </div>
            ))}
        </div>
    )
}