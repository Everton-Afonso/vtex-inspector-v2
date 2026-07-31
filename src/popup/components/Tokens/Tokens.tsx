import { useEffect, useState } from "react"

import { decodeJwt } from "@/utils/decodeJwt"
import { formatDate } from "@/utils/formatDate"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"
import { getCookies } from "@/services/getCookies"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { Copy, Check, Eye, EyeOff, ShieldCheck, Globe, User } from "lucide-react"

interface TokenData {
    name: string
    token: string
    account?: string
    type?: string
    expires?: string
}

export function Tokens() {
    const [tokens, setTokens] = useState<TokenData[]>([])
    const [visibleTokens, setVisibleTokens] = useState<Record<string, boolean>>({})
    const { copy, isCopied } = useCopyClipboard()

    useEffect(() => {
        async function loadTokens() {
            const cookies = await getCookies()

            const vtexTokens = cookies
                .filter(cookie =>
                    cookie.name.includes("VtexIdclientAutCookie") ||
                    cookie.name === "vtex_session"
                )
                .map(cookie => {
                    const payload = decodeJwt(cookie.value)

                    return {
                        name: cookie.name,
                        token: cookie.value,
                        account: payload?.account,
                        type: payload?.audience ?? payload?.sub,
                        expires: payload?.exp
                            ? formatDate(payload.exp)
                            : undefined,
                    }
                })

            setTokens(vtexTokens)
        }

        loadTokens()
    }, [])

    function toggleToken(name: string) {
        setVisibleTokens(prev => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    function getTokenIcon(type?: string) {
        if (type === "admin") return <ShieldCheck className="size-4 text-primary" />
        if (type === "webstore") return <Globe className="size-4 text-blue-500" />
        if (type === "session") return <User className="size-4 text-muted-foreground" />
        return <ShieldCheck className="size-4 text-muted-foreground" />
    }

    function getTokenTitle(type?: string) {
        if (type === "admin") return "Admin"
        if (type === "webstore") return "Storefront"
        if (type === "session") return "Session"
        return "Token"
    }

    return (
        <div className="flex flex-col gap-3">
            {tokens.map(token => (
                <div
                    key={token.name}
                    className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground"
                >
                    <div className="flex items-center gap-2">
                        {getTokenIcon(token.type)}
                        <h3 className="text-sm font-semibold m-0">
                            {getTokenTitle(token.type)}
                        </h3>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex justify-between">
                            <Label className="text-muted-foreground">Account</Label>
                            <span className="text-foreground">{token.account}</span>
                        </div>

                        <div className="flex justify-between">
                            <Label className="text-muted-foreground">Name</Label>
                            <span className="text-foreground max-w-[200px] truncate" title={token.name}>
                                {token.name}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <Label className="text-muted-foreground">Type</Label>
                            <span className="text-foreground">{token.type}</span>
                        </div>

                        <div className="flex justify-between">
                            <Label className="text-muted-foreground">Expires</Label>
                            <span className="text-foreground">{token.expires}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => toggleToken(token.name)}
                        >
                            {visibleTokens[token.name] ? (
                                <EyeOff className="size-3.5" />
                            ) : (
                                <Eye className="size-3.5" />
                            )}
                            <span className="text-xs">
                                {visibleTokens[token.name] ? "Hide" : "Show"}
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => copy(token.name, token.token)}
                        >
                            {isCopied(token.name) ? (
                                <Check className="size-3.5 text-green-500" />
                            ) : (
                                <Copy className="size-3.5" />
                            )}
                            <span className="text-xs">
                                {isCopied(token.name) ? "Copied" : "Copy"}
                            </span>
                        </Button>
                    </div>

                    {visibleTokens[token.name] && (
                        <textarea
                            readOnly
                            value={token.token}
                            className="w-full text-[10px] p-2 rounded-md border bg-muted/50 text-muted-foreground break-all resize-none"
                            rows={4}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}
