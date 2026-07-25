export interface AppInfo {
    app: string;
    version: string;
}

export type Apps = Record<string, AppInfo>;