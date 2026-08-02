import { useActiveTab } from "@/hooks/useActiveTab"
import { useTheme } from "@/hooks/useTheme"
import { useVtexStore } from "@/hooks/useVtexStore"

import { Tab, type TabType } from "@/types/Tab"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ComponentsList } from "./components/ComponentsList/ComponentsList"
import { Logo } from "./components/Logo"
import { OrderForm } from "./components/OrderForm/OrderForm"
import { Runtime } from "./components/Runtime/Runtime"
import { Tokens } from "./components/Tokens/Tokens"

import { Boxes, KeyRound, LoaderCircle, Moon, Package, Server, Sun, Store } from "lucide-react"

const tabs = [
    {
        id: Tab.Runtime,
        label: "Runtime",
        icon: Server,
    },
    {
        id: Tab.Apps,
        label: "Apps",
        icon: Boxes,
    },
    {
        id: Tab.OrderForm,
        label: "OrderForm",
        icon: Package,
    },
    {
        id: Tab.Tokens,
        label: "Tokens",
        icon: KeyRound,
    },
] as const

export function Popup() {
    const { activeTab, changeTab } = useActiveTab();
    const { theme, toggleTheme } = useTheme();
    const { isVtex } = useVtexStore();

    if (isVtex === null) {
        return (
            <div className="w-full flex items-center justify-center gap-3 py-4 px-6">
                <LoaderCircle className="size-5 animate-spin text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground leading-snug">
                    Detectando página VTEX...
                </p>
            </div>
        );
    }

    if (isVtex === false) {
        return (
            <div className="w-full flex items-center justify-center gap-3 py-4 px-6">
                <Store className="size-8 text-muted-foreground opacity-40 shrink-0" />
                <div className="text-left">
                    <p className="text-xs text-muted-foreground leading-snug">
                        Esta página não é uma loja VTEX.
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                        Abra uma página VTEX para usar o inspector.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Tabs
            value={activeTab}
            onValueChange={(v) => changeTab(v as TabType)}
            className="w-full h-full flex flex-col vtex-popup"
        >
            <div className="flex items-center justify-between py-1 shrink-0">
<div className="w-7" />
                <Logo />
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </Button>
            </div>

            <Separator className="!w-4/5 mx-auto shrink-0" />

            <TabsList className="grid grid-cols-4 w-full shrink-0 bg-background">
                {tabs.map((t) => {
                    const Icon = t.icon
                    return (
                        <TabsTrigger
                            key={t.id}
                            value={t.id}
                            className="gap-1"
                        >
                            <Icon className="size-3.5" />
                            <span className="text-xs">{t.label}</span>
                        </TabsTrigger>
                    )
                })}
            </TabsList>

            <Separator className="w-full shrink-0" />

            <TabsContent value={Tab.Runtime} className="pt-3 flex-1 overflow-y-auto">
                <Runtime />
            </TabsContent>

            <TabsContent value={Tab.Apps} className="pt-3 flex-1 overflow-hidden">
                <ComponentsList />
            </TabsContent>

            <TabsContent value={Tab.OrderForm} className="pt-3 flex-1 overflow-y-auto">
                <OrderForm />
            </TabsContent>

            <TabsContent value={Tab.Tokens} className="pt-3 flex-1 overflow-y-auto">
                <Tokens />
            </TabsContent>

            <footer className="flex flex-col items-center justify-center shrink-0" style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                <Separator className="!w-[90%] mx-auto mb-1" />
                <span className="text-[10px] text-muted-foreground">SDS • VTEX Inspector</span>
            </footer>
        </Tabs>
    );
}
