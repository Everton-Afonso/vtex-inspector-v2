import { useRuntime } from "@/hooks/useRuntime"

import { Label } from "@/components/ui/label"

export function Runtime() {
    const runtime = useRuntime()

    if (!runtime) return null

    const items = [
        {
            label: "Conta",
            value: runtime.account,
        },
        {
            label: "Workspace",
            value: runtime.workspace,
        },
        {
            label: "Página",
            value: runtime.page,
        },
        {
            label: "Caminho Raiz",
            value: runtime.rootPath,
        },
        {
            label: "Localidade",
            value: runtime.culture?.locale,
        },
        {
            label: "Moeda",
            value: runtime.culture?.currency,
        },
        {
            label: "Produção",
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
