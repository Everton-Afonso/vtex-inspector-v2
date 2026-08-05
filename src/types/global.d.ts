import type { Runtime } from "./Runtime" 

export {}

declare global {
  interface Window {
    __RUNTIME__?: Runtime
  }
}