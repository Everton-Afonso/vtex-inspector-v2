import { useMemo, useState } from "react";
import { useComponents } from "../../hooks/useComponents";

import "./styles.css"

export function ComponentsList() {
    const components = useComponents();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredComponents = useMemo(() => {
        const value = searchTerm.toLowerCase().trim();

        return Object.values(components ?? {}).filter((component) =>
            component.app.toLowerCase().includes(value)
        );
    }, [components, searchTerm]);

    const hasComponents = Object.keys(components ?? {}).length > 0;

    return (
        <>
            {hasComponents && (
                <input
                    type="text"
                    placeholder="Search app..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search"
                />
            )}

            <div className="apps">
                {filteredComponents.map((app) => (
                    <div key={app.app} className="app-card">
                        <div className="app-info">
                            <span className="label">App:</span>
                            <span className="app-name">{app.app}</span>
                        </div>

                        <div className="app-info">
                            <span className="label">Version:</span>
                            <span className="version">{app.version}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}