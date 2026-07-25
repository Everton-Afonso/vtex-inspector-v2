import "./styles.css"

type Props = {
    tab: string
    setTab: (tab: string) => void
}

export function Tabs({ tab, setTab }: Props) {
    return (
        <div className="tabs">
            <button
                className={tab === "components" ? "active" : ""}
                onClick={() => setTab("components")}
            >
                Components
            </button>

            <button
                className={tab === "orderform" ? "active" : ""}
                onClick={() => setTab("orderform")}
            >
                OrderForm
            </button>
        </div>
    )
}