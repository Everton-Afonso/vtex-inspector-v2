
export interface OrderForm {
    orderFormId: string;
    salesChannel: string;
    loggedIn: boolean;
    value: number;
    items: OrderFormItem[];
    totalizers: Totalizer[];
    clientProfileData: ClientProfileData;
    paymentData: PaymentData;
    shippingData: ShippingData;
}

export interface OrderFormItem {
    uniqueId: string;
    id: string;
    productId: string;
    name: string;
    skuName: string;
    quantity: number;
    seller: string;
    price: number;
    listPrice: number;
    sellingPrice: number;
    imageUrl: string;
    detailUrl: string;
}

export interface Totalizer {
    id: string;
    name: string;
    value: number;
}

export interface ClientProfileData {
    email: string;
    firstName: string;
    lastName: string;
}

export interface Installment {
    count: number;
    value: number;
    total: number;
    interestRate: number;
    hasInterestRate: boolean;
}

export interface ShippingData {
    address: Address;
}

export interface Address {
    postalCode: string;
    city: string;
    state: string;
    country: string;
}

export interface InstallmentOption {
    paymentSystem: string;
    value: number;
    installments: Installment[];
}

export interface PaymentData {
    installmentOptions: InstallmentOption[];
}
