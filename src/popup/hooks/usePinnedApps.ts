import { useEffect, useState } from "react";

const STORAGE_KEY = "vtex-inspector-pinned-apps";

export function usePinnedApps() {
    const [pinnedApps, setPinnedApps] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            setPinnedApps(JSON.parse(stored));
        }
    }, []);

    function togglePin(id: string) {
        setPinnedApps((current) => {
            const exists = current.includes(id);

            const updated = exists ? current.filter((appId) => appId !== id) : [...current, id];

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updated)
            );

            return updated;
        });
    }

    function isPinned(id: string) {
        return pinnedApps.includes(id);
    }

    return {
        pinnedApps,
        togglePin,
        isPinned,
    };
}