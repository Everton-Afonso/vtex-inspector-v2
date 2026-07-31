import { useState } from "react"

import { Tab, type TabType } from "@/types/Tab"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ComponentsList } from "./components/ComponentsList/ComponentsList"
import { OrderForm } from "./components/OrderForm/OrderForm"
import { Runtime } from "./components/Runtime/Runtime"
import { Tokens } from "./components/Tokens/Tokens"

import { Boxes, KeyRound, Package, Server } from "lucide-react"

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
    const [tab, setTab] = useState<TabType>(Tab.Runtime);

    return (
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as TabType)}
            className="w-full"
        >
            <TabsList className="grid grid-cols-4 w-full sticky top-0 z-50 bg-background">
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

            <TabsContent value={Tab.Runtime} className="mt-3">
                <Runtime />
            </TabsContent>

            <TabsContent value={Tab.Apps} className="mt-3">
                <ComponentsList />
            </TabsContent>

            <TabsContent value={Tab.OrderForm} className="mt-3">
                <OrderForm />
            </TabsContent>

            <TabsContent value={Tab.Tokens} className="mt-3">
                <Tokens />
            </TabsContent>
        </Tabs>
    );
}
