import { useMemo, useState } from "react"

import { useComponents } from "@/hooks/useComponents"
import { usePinnedApps } from "@/hooks/usePinnedApps"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    ArrowDownAZ,
    ArrowUpAZ,
    Copy,
    Check,
    Pin,
    PinOff,
    Search,
} from "lucide-react"

export function ComponentsList() {
    const components = useComponents()
    const { togglePin, isPinned } = usePinnedApps()
    const { copy, isCopied } = useCopyClipboard()
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const hasComponents = Object.values(components).length > 0

    const filteredComponents = useMemo(() => {
        const value = searchTerm.toLowerCase().trim()

        return Object.values(components)
            .filter(({ app }) =>
                app.toLowerCase().includes(value)
            )
            .sort((a, b) => {
                const aPinned = isPinned(a.id)
                const bPinned = isPinned(b.id)

                if (aPinned !== bPinned) {
                    return aPinned ? -1 : 1
                }

                const comparison = a.app.localeCompare(b.app)

                return sortOrder === "asc" ? comparison : -comparison
            })
    }, [components, searchTerm, isPinned, sortOrder])

    const totalApps = filteredComponents.length

    return (
        <div className="flex flex-col gap-3">
            {hasComponents && (
                <>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search app..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                            Apps ({totalApps})
                        </span>

                        <Select
                            value={sortOrder}
                            onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
                        >
                            <SelectTrigger size="sm" className="w-[110px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">
                                    <div className="flex items-center gap-2">
                                        <ArrowDownAZ className="size-4" />
                                        A - Z
                                    </div>
                                </SelectItem>
                                <SelectItem value="desc">
                                    <div className="flex items-center gap-2">
                                        <ArrowUpAZ className="size-4" />
                                        Z - A
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />
                </>
            )}

            <div className="flex flex-col gap-1.5">
                {filteredComponents.map((app) => (
                    <div
                        key={app.id}
                        className="flex flex-col gap-1 p-3 rounded-lg border bg-card text-card-foreground"
                    >
                        <div className="flex justify-between items-center">
                            <Badge
                                variant={app.type === "VTEX" ? "default" : "secondary"}
                                className="uppercase text-[10px]"
                            >
                                {app.type}
                            </Badge>

                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() =>
                                        copy(app.id, `${app.app}@${app.version}`)
                                    }
                                >
                                    {isCopied(app.id) ? (
                                        <Check className="size-3.5 text-green-500" />
                                    ) : (
                                        <Copy className="size-3.5 text-muted-foreground" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => togglePin(app.id)}
                                >
                                    {isPinned(app.id) ? (
                                        <Pin className="size-3.5 text-primary" />
                                    ) : (
                                        <PinOff className="size-3.5 text-muted-foreground opacity-50" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <span className="text-sm font-semibold break-words">
                            {app.app}
                        </span>

                        <span className="text-xs text-muted-foreground">
                            {app.version}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
