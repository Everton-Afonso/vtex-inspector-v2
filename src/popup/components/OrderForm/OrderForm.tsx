import { formatPrice } from "../../../utils/formatPrice"
import { useOrderForm } from "../../../hooks/useOrderForm"

import "./styles.css"

export function OrderForm() {
    const orderForm = useOrderForm()

    if (!orderForm) return <></>

    const locale =
        orderForm.clientPreferencesData?.locale ?? "pt-BR"

    const currency =
        orderForm.storePreferencesData?.currencyCode ?? "BRL"

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
            </div>
        </div>
    )
}