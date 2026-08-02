import { useState } from "react"

import { formatPrice } from "@/utils/formatPrice"
import { useOrderForm } from "@/hooks/useOrderForm"
import { useRuntime } from "@/hooks/useRuntime"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { Download, Copy, Check, Trash2, RefreshCw, ShoppingBag, Ticket, ChevronDown } from "lucide-react"

export function OrderForm() {
    const { orderForm, clearOrderForm, refreshOrderForm } = useOrderForm()
    const runtime = useRuntime()
    const { copy, isCopied } = useCopyClipboard()
    const [showTotalizers, setShowTotalizers] = useState(false)

    if (!orderForm) return null

    const locale = orderForm.clientPreferencesData?.locale ?? runtime?.culture?.locale ?? "pt-BR"
    const currency = orderForm.storePreferencesData?.currencyCode ?? runtime?.culture?.currency ?? "BRL"

    const totalizerLabels: Record<string, string> = {
        Items: "Subtotal",
        Shipping: "Frete",
        Discounts: "Descontos",
        Tax: "Taxa",
        GiftCard: "Vale-presente",
        Interest: "Juros",
    }

    const visibleTotalizers = orderForm.totalizers.filter((t) => t.value !== 0)

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
        { label: "Email", value: orderForm.clientProfileData?.email ?? "-" },
        { label: "City", value: orderForm.shippingData?.address?.city ?? "-" },
        { label: "Postal Code", value: orderForm.shippingData?.address?.postalCode ?? "-" },
        { label: "Country", value: orderForm.shippingData?.address?.country ?? "-" },
        { label: "State", value: orderForm.shippingData?.address?.state ?? "-" },
    ]

    return (
        <div className="flex flex-col gap-3 h-full overflow-x-hidden">
            <div className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground">
                <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-muted-foreground">
                        ID
                    </Label>

                    <div className="flex items-center gap-1.5">
                        <span className="text-primary text-right">
                            {orderForm.orderFormId}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-4"
                            title="Copiar ID do orderForm"
                            onClick={() => copy("orderform-id", orderForm.orderFormId)}
                        >
                            {isCopied("orderform-id") ? (
                                <Check className="size-2.5 text-success" />
                            ) : (
                                <Copy className="size-2.5 text-muted-foreground" />
                            )}
                        </Button>
                    </div>
                </div>

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

                {orderForm.marketingData?.coupon && (
                    <div className="flex justify-between items-center text-xs">
                        <Label className="font-semibold text-muted-foreground">
                            Coupon
                        </Label>

                        <div className="flex items-center gap-1.5">
                            <Ticket className="size-3 text-success" />
                            <span className="text-primary text-right">
                                {orderForm.marketingData.coupon}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-4"
                                title="Copiar cupom"
                                onClick={() => copy("orderform-coupon", orderForm.marketingData!.coupon)}
                            >
                                {isCopied("orderform-coupon") ? (
                                    <Check className="size-2.5 text-success" />
                                ) : (
                                    <Copy className="size-2.5 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-1 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Baixar JSON"
                    onClick={() => downloadOrderForm(orderForm)}
                >
                    <Download className="size-3.5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Copiar JSON do orderForm"
                    onClick={copyOrderForm}
                >
                    {isCopied("orderform-json") ? (
                        <Check className="size-3.5 text-success" />
                    ) : (
                        <Copy className="size-3.5" />
                    )}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Gerar novo orderForm"
                    onClick={() =>
                        confirm("Gerar um novo orderForm?")
                        && refreshOrderForm()
                    }
                >
                    <RefreshCw className="size-3.5" />
                </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold leading-none">
                    Items ({orderForm.items.length})
                </h3>

                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    title="Limpar orderForm"
                    disabled={orderForm.items.length === 0}
                    onClick={() =>
                        confirm("Limpar todos os itens do orderForm?")
                        && clearOrderForm()
                    }
                >
                    <Trash2 className="size-3.5 text-destructive" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                {orderForm.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                        <ShoppingBag className="size-8 opacity-40" />
                        <span className="text-xs">Nenhum item no orderForm</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 pr-1.5">
                        {orderForm.items.map((item) => (
                    <div
                        key={item.uniqueId}
                        className="flex gap-3 p-2.5 rounded-lg border bg-card text-card-foreground"
                    >
                        <div className="size-16 shrink-0 overflow-hidden rounded-md border bg-white">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="size-full object-cover p-1"
                                loading="lazy"
                            />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1 justify-between">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold leading-tight line-clamp-2">
                                    {item.name}
                                </span>

                                <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[11px] text-muted-foreground">
                                            skuId: {item.id}                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-4"
                                            onClick={() => copy(`sku-${item.uniqueId}`, item.id)}
                                        >
                                            {isCopied(`sku-${item.uniqueId}`) ? (
                                                <Check className="size-2.5 text-success" />
                                            ) : (
                                                <Copy className="size-2.5 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <span className="text-[11px] text-muted-foreground">
                                            productId: {item.productId}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-4"
                                            onClick={() => copy(`prod-${item.uniqueId}`, item.productId)}
                                        >
                                            {isCopied(`prod-${item.uniqueId}`) ? (
                                                <Check className="size-2.5 text-success" />
                                            ) : (
                                                <Copy className="size-2.5 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Qtd: {item.quantity}</span>
                                <span className="text-primary font-medium">
                                    {formatPrice(item.sellingPrice, locale, currency)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                    </div>
                )}
            </div>

            <Separator className="mt-auto" />

            <div className="flex flex-col gap-1.5">
                <div
                    className="flex justify-between items-center text-sm font-bold cursor-pointer select-none"
                    onClick={() => setShowTotalizers((prev) => !prev)}
                >
                    <span>Total</span>                    <span className="flex items-center gap-1">
                        {formatPrice(orderForm.value, locale, currency)}
                        {visibleTotalizers.length > 0 && (
                            <ChevronDown
                                className={`size-3.5 text-muted-foreground transition-transform ${showTotalizers ? "rotate-180" : ""}`}
                            />
                        )}
                    </span>
                </div>

                {showTotalizers && visibleTotalizers.map((totalizer) => {
                    const label = totalizerLabels[totalizer.id] ?? totalizer.name

                    return (
                        <div
                            key={totalizer.id}
                            className="flex justify-between items-center text-xs text-muted-foreground pr-5"
                        >
                            <span>{label}</span>
                            <span className={totalizer.id === "Discounts" ? "text-success" : ""}>
                                {formatPrice(totalizer.value, locale, currency)}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
