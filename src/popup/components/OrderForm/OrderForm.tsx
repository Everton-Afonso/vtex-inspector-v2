import { formatPrice } from "../../../utils/formatPrice"
import { useOrderForm } from "../../../hooks/useOrderForm"
import { useRuntime } from "../../../hooks/useRuntime"
import { useCopyClipboard } from "../../../hooks/useCopyClipboard"

import { ActionButton } from "../../../ui/ActionButton"

import "./styles.css"

export function OrderForm() {
    const orderForm = useOrderForm()
    const runtime = useRuntime()
    const { copy, isCopied } = useCopyClipboard()

    if (!orderForm || !runtime) return <></>

    const locale =
        orderForm.clientPreferencesData?.locale ?? "pt-BR"

    const currency =
        orderForm.storePreferencesData?.currencyCode ?? "BRL"

    function downloadOrderForm(orderForm: unknown) {
        const blob = new Blob(
            [JSON.stringify(orderForm, null, 2)],
            { type: "application/json" }
        )

        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")

        a.href = url
        a.download = `orderForm-${Date.now()}.json`
        a.click()

        URL.revokeObjectURL(url)
    }

    function copyOrderForm() {
        copy(
            "orderform-json",
            JSON.stringify(orderForm, null, 2)
        )
    }

    return (
        <div id="orderform-panel">
            <div id="orderform">
                <div className="orderform-row">
                    <span className="orderform-label">ID</span>

                    <span className="orderform-value">
                        {orderForm.orderFormId}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">Email</span>

                    <span className="orderform-value">
                        {orderForm.clientProfileData?.email ?? "-"}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">City</span>

                    <span className="orderform-value">
                        {orderForm.shippingData?.address?.city ?? "-"}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">
                        Postal Code
                    </span>

                    <span className="orderform-value">
                        {orderForm.shippingData?.address?.postalCode ?? "-"}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">
                        Country
                    </span>

                    <span className="orderform-value">
                        {orderForm.shippingData?.address?.country ?? "-"}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">
                        State
                    </span>

                    <span className="orderform-value">
                        {orderForm.shippingData?.address?.state ?? "-"}
                    </span>
                </div>

                <div className="orderform-items">
                    <h3>
                        Items ({orderForm.items.length})
                    </h3>

                    {orderForm.items.map((item) => (
                        <div
                            key={item.uniqueId}
                            className="orderform-item"
                        >
                            <div className="item-name">
                                {item.name}
                            </div>

                            <div className="item-info">
                                <span>
                                    Qty: {item.quantity}
                                </span>

                                <span>
                                    {formatPrice(
                                        item.sellingPrice,
                                        locale,
                                        currency
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="orderform-row orderform-total">
                    <span className="orderform-label">
                        Total
                    </span>

                    <span className="orderform-value">
                        {formatPrice(
                            orderForm.value,
                            locale,
                            currency
                        )}
                    </span>
                </div>

                <div className="orderform-actions">
                    <ActionButton
                        onClick={() => downloadOrderForm(orderForm)}
                    >
                        ⬇ Download JSON
                    </ActionButton>

                    <ActionButton
                        onClick={copyOrderForm}
                    >
                        {isCopied("orderform-json") ? "✔ Copied" : "📋 Copy"}
                    </ActionButton>
                </div>
            </div>
        </div>
    )
}