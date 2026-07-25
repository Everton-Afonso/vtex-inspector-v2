export interface AppInfo {
    id: string
    app: string
    version: string
    component: string
    type: "VTEX" | "CUSTOM"
}

export type Apps = Record<string, AppInfo>