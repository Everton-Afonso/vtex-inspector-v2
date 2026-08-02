import { useRuntime } from "@/hooks/useRuntime"

import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

export function Runtime() {
    const { runtime, loading } = useRuntime()

    if (loading) {
        return (
            <div className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center px-3 py-2 border rounded-md bg-card"
                    >
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        )
    }

    if (!runtime) return null

    const items = [
        {
            label: "Account",
            value: runtime.account,
        },
        {
            label: "Workspace",
            value: runtime.workspace,
        },
        {
            label: "Page",
            value: runtime.page,
        },
        {
            label: "Root Path",
            value: runtime.rootPath,
        },
        {
            label: "Locale",
            value: runtime.culture?.locale,
        },
        {
            label: "Currency",
            value: runtime.culture?.currency,
        },
        {
            label: "Production",
            value: runtime.production ? "Sim" : "Não",
        },
    ]

    return (
        <div className="flex flex-col gap-1">
            {items.map(({ label, value }) => (
                <div
                    key={label}
                    className="flex justify-between items-center px-3 py-2 border rounded-md bg-card text-card-foreground"
                >
                    <Label className="text-xs text-muted-foreground">
                        {label}
                    </Label>

                    <span className="text-xs text-right break-words max-w-[180px] text-foreground">
                        {value ?? "-"}
                    </span>
                </div>
            ))}
        </div>
    )
}