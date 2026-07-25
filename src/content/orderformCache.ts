import type { OrderForm } from "../types/orderform";

let orderFormCache: OrderForm | null = null;

export function getOrderFormCache() {
    return orderFormCache;
}

export function setOrderFormCache(orderForm: OrderForm | null) {
    orderFormCache = orderForm;
}