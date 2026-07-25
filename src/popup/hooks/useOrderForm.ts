import { useEffect, useState } from "react";
import { sendMessage } from "../services/chrome";
import type { OrderForm } from "../../types/orderform";

export function useOrderForm() {
    const [orderForm, setOrderForm] = useState<OrderForm | null>(null);

    useEffect(() => {
        sendMessage<OrderForm>({
            type: "GET_ORDERFORM"
        }).then(setOrderForm);
    }, []);

    return orderForm;
}