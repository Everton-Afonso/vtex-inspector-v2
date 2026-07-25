import { useState } from "react"

import { Tabs } from "./components/Tabs/Tabs"
import { ComponentsList } from "./components/ComponentsList/ComponentsList"
import { OrderForm } from "./components/OrderForm/OrderForm"

export const Popup = () => {
    const [tab, setTab] = useState("components")

    return (
        <div>
            <h2>VTEX Inspector</h2>

            <Tabs tab={tab} setTab={setTab} />

            { tab === "components" ? <ComponentsList /> : <OrderForm /> }
        </div>
    )
}

export default Popup