import { Tab, type TabType } from "../../../types/Tab";

import "./styles.css"

interface Props {
    value: TabType;
    onChange(tab: TabType): void;
}

const tabs = [
    {
        id: Tab.Runtime,
        label: "Runtime",
    },
    {
        id: Tab.Apps,
        label: "Apps",
    },
    {
        id: Tab.OrderForm,
        label: "OrderForm",
    },
    {
        id: Tab.Tokens,
        label: "Tokens",
    },
];

export function Tabs({ value, onChange }: Props) {
    return (
        <header className="tabs">
            <nav className="tabs-nav" aria-label="Navigation">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={value === tab.id ? "active" : ""}
                        onClick={() => onChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </header>
    );
}