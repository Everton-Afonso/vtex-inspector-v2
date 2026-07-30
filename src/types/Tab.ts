export const Tab = {
    Runtime: "runtime",
    Apps: "apps",
    OrderForm: "orderform",
    Tokens: "tokens",
} as const

export type TabType = (typeof Tab)[keyof typeof Tab]