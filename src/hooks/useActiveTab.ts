import { useState } from "react";

import { Tab, type TabType } from "@/types/Tab";

const STORAGE_KEY = "@sds.vtex-inspector.active-tab";

function getInitialTab(): TabType {
    const stored = localStorage.getItem(STORAGE_KEY) as TabType | null;

    if (stored && Object.values(Tab).includes(stored)) {
        return stored;
    }

    return Tab.Runtime;
}

export function useActiveTab() {
    const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

    function changeTab(tab: TabType) {
        setActiveTab(tab);
        localStorage.setItem(STORAGE_KEY, tab);
    }

    return {
        activeTab,
        changeTab,
    };
}
