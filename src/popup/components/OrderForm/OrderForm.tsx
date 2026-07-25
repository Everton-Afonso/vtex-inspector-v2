import { useOrderForm } from "../../hooks/useOrderForm"

import "./styles.css"

export function OrderForm() {
    const orderForm = useOrderForm()

    if (!orderForm) {
        return (
            <div id="orderform-panel">
                <div id="orderform">
                    <p>OrderForm not found</p>
                </div>
            </div>
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
                    <span className="orderform-label">Items</span>
                    <span className="orderform-value">
                        {orderForm.items.length}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">Value</span>
                    <span className="orderform-value">
                        {orderForm.value}
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
                        {orderForm.shippingData.address.city ?? "-"}
                    </span>
                </div>
                <div className="orderform-row">
                    <span className="orderform-label">PostalCode</span>
                    <span className="orderform-value">
                        {orderForm.shippingData.address.postalCode ?? "-"}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">Country</span>
                    <span className="orderform-value">
                        {orderForm.shippingData.address.country ?? "-"}
                    </span>
                </div>

                <div className="orderform-row">
                    <span className="orderform-label">State</span>
                    <span className="orderform-value">
                        {orderForm.shippingData.address.state ?? "-"}
                    </span>
                </div>
            </div>
        </div>
    )
}