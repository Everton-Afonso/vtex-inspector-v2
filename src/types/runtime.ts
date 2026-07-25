export interface Runtime {
    account?: string
    workspace?: string
    production?: boolean
    platform?: string
    page?: string
    route?: string
    rootPath?: string
    publicEndpoint?: string
    culture?: {
        country: string
        currency: string
        language: string
        locale: string
    }
    hints?: {
        desktop: boolean
        mobile: boolean
        tablet: boolean
        phone: boolean
    }
    loadedDevices?: string[]
    binding?: {
        id: string
        canonicalBaseAddress: string
    }
    pages: string[]
}