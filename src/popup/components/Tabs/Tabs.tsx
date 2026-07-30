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
        <div className="tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={value === tab.id ? "active" : ""}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}