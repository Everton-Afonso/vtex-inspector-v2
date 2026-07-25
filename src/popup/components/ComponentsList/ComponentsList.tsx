import { useMemo, useState } from "react"

import { useComponents } from "../../hooks/useComponents"
import { usePinnedApps } from "../../hooks/usePinnedApps"
import { useCopyClipboard } from "../../hooks/useCopyClipboard"

import "./styles.css"

export function ComponentsList() {
    const components = useComponents()
    const { togglePin, isPinned } = usePinnedApps()
    const { copy, isCopied } = useCopyClipboard();
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const filteredComponents = useMemo(() => {
        const value = searchTerm.toLowerCase().trim();

        return Object.values(components)
            .filter(({ app }) =>
                app.toLowerCase().includes(value)
            )
            .sort((a, b) => {
                const aPinned = isPinned(a.id);
                const bPinned = isPinned(b.id);

                if (aPinned !== bPinned) {
                    return aPinned ? -1 : 1;
                }

                const comparison = a.app.localeCompare(
                    b.app
                );

                return sortOrder === "asc" ? comparison : -comparison;
            });

    }, [components, searchTerm, isPinned, sortOrder]);

    const totalApps = filteredComponents.length

    return (
        <>
            <input
                type="text"
                placeholder="Search app..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search"
            />

            <div className="apps-header">
                <div className="apps-count">
                    Apps ({totalApps})
                </div>

                <select
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(e.target.value as "asc" | "desc")
                    }
                    className="sort-select"
                >
                    <option value="asc">
                        A - Z
                    </option>

                    <option value="desc">
                        Z - A
                    </option>
                </select>
            </div>

            <div className="apps">
                {filteredComponents.map((app) => (
                    <div key={app.id} className="app-card">
                        <div className="app-header">
                            <span className={`badge ${app.type === "VTEX"
                                ? "badge-vtex"
                                : "badge-custom"}`}>
                                {app.type}
                            </span>

                            <div className="actions">
                                <button
                                    title={isCopied(app.id) ? "Copied!" : "Copy"}
                                    onClick={() =>
                                        copy(app.id, `${app.app}@${app.version}`)
                                    }
                                >
                                    {isCopied(app.id) ? "✔️" : "📄"}
                                </button>

                                <button
                                    title={isPinned(app.id) ? "Unpin" : "Pin"}
                                    className={isPinned(app.id) ? "active" : ""}
                                    onClick={() => togglePin(app.id)}
                                >
                                    📌
                                </button>
                            </div>
                        </div>

                        <div className="app-name">
                            {app.app}
                        </div>

                        <div className="app-version">
                            {app.version}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}