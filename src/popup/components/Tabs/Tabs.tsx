import { Tab, type TabType } from "../../../types/Tab";

import "./styles.css"

interface Props {
    value: TabType;
    onChange(tab: TabType): void;
}

export function Tabs({ value, onChange }: Props) {
    return (
        <div className="tabs">
            <button
                className={value === Tab.Runtime ? "active" : ""}
                onClick={() => onChange(Tab.Runtime)}
            >
                Runtime
            </button>

            <button
                className={value === Tab.Apps ? "active" : ""}
                onClick={() => onChange(Tab.Apps)}
            >
                Apps
            </button>

            <button
                className={value === Tab.OrderForm ? "active" : ""}
                onClick={() => onChange(Tab.OrderForm)}
            >
                OrderForm
            </button>
        </div>
    );
}