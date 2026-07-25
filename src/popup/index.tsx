import { useState } from "react"

import { Tab, type TabType } from "../types/Tab"

import { Tabs } from "./components/Tabs/Tabs"
import { ComponentsList } from "./components/ComponentsList/ComponentsList"
import { OrderForm } from "./components/OrderForm/OrderForm"
import { Runtime } from "./components/Runtime/Runtime"

export const Popup = () => {
    const [tab, setTab] = useState<TabType>(Tab.Runtime);

    return (
        <>
            <Tabs value={tab} onChange={setTab} />

            {tab === Tab.Runtime && <Runtime />}
            {tab === Tab.Apps && <ComponentsList />}
            {tab === Tab.OrderForm && <OrderForm />}
        </>
    );
}

export default Popup