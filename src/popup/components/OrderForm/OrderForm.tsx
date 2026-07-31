import { formatPrice } from "@/utils/formatPrice"
import { useOrderForm } from "@/hooks/useOrderForm"
import { useRuntime } from "@/hooks/useRuntime"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { Download, Copy, Check } from "lucide-react"

export function OrderForm() {
    const orderForm = useOrderForm()
    const runtime = useRuntime()
    const { copy, isCopied } = useCopyClipboard()

    if (!orderForm || !runtime) return null

    const locale = orderForm.clientPreferencesData?.locale ?? "pt-BR"
    const currency = orderForm.storePreferencesData?.currencyCode ?? "BRL"

    function downloadOrderForm(orderForm: unknown) {
        const blob = new Blob(
            [JSON.stringify(orderForm, null, 2)],
            { type: "application/json" }
        )

        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")

        a.href = url
        a.download = `orderForm-${Date.now()}.json`
        a.click()

        URL.revokeObjectURL(url)
    }

    function copyOrderForm() {
        copy("orderform-json", JSON.stringify(orderForm, null, 2))
    }

    const infoRows = [
        { label: "ID", value: orderForm.orderFormId },
        { label: "Email", value: orderForm.clientProfileData?.email ?? "-" },
        { label: "City", value: orderForm.shippingData?.address?.city ?? "-" },
        { label: "Postal Code", value: orderForm.shippingData?.address?.postalCode ?? "-" },
        { label: "Country", value: orderForm.shippingData?.address?.country ?? "-" },
        { label: "State", value: orderForm.shippingData?.address?.state ?? "-" },
    ]

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground">
                {infoRows.map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                        <Label className="font-semibold text-muted-foreground">
                            {label}
                        </Label>

                        <span className="text-primary text-right">
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">
                    Items ({orderForm.items.length})
                </h3>

                {orderForm.items.map((item) => (
                    <div
                        key={item.uniqueId}
                        className="flex flex-col gap-1 pb-2 border-b last:border-b-0"
                    >
                        <span className="text-sm font-semibold">
                            {item.name}
                        </span>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            <span>
                                {formatPrice(item.sellingPrice, locale, currency)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>
                    {formatPrice(orderForm.value, locale, currency)}
                </span>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => downloadOrderForm(orderForm)}
                >
                    <Download className="size-4" />
                    <span className="text-xs">Download JSON</span>
                </Button>

                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={copyOrderForm}
                >
                    {isCopied("orderform-json") ? (
                        <Check className="size-4 text-green-500" />
                    ) : (
                        <Copy className="size-4" />
                    )}
                    <span className="text-xs">
                        {isCopied("orderform-json") ? "Copied" : "Copy"}
                    </span>
                </Button>
            </div>
        </div>
    )
}
