import type { OrderForm } from "./orderform"
import type { Runtime } from "./Runtime"

export { }

declare global {
  interface Window {
    __RUNTIME__?: Runtime
    __CHECKOUT__?: {
      orderForm?: OrderForm
    }
    vtexjs?: {
      checkout?: {
        orderForm?: OrderForm
      }
    }
  }
}