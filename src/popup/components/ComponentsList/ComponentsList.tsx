import { useMemo, useState } from "react";

import { useComponents } from "@/hooks/useComponents";
import { useCopyClipboard } from "@/hooks/useCopyClipboard";
import { usePinnedApps } from "@/hooks/usePinnedApps";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  Copy,
  Pin,
  PinOff,
  Search,
  Star,
} from "lucide-react";

export function ComponentsList() {
  const components = useComponents();
  const { togglePin, isPinned, pinnedApps } = usePinnedApps();
  const { copy, isCopied } = useCopyClipboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCustomOnly, setShowCustomOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const hasComponents = Object.values(components).length > 0;

  const filteredComponents = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    return Object.values(components)
      .filter(({ app }) => app.toLowerCase().includes(value))
      .filter((app) => !showCustomOnly || app.app.toLowerCase().includes("samsung"))
      .filter((app) => !showPinnedOnly || isPinned(app.id))
      .sort((a, b) => {
        const aPinned = isPinned(a.id);
        const bPinned = isPinned(b.id);

        if (aPinned !== bPinned) {
          return aPinned ? -1 : 1;
        }

        const comparison = a.app.localeCompare(b.app);

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [components, searchTerm, isPinned, sortOrder, showCustomOnly, showPinnedOnly]);

  const totalApps = filteredComponents.length;

  return (
    <div className="flex flex-col h-full gap-3">
      {hasComponents && (
        <>
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search app..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex items-center justify-between shrink-0">
            <span className="text-sm font-semibold">Apps ({totalApps})</span>

            <div className="flex items-center gap-1.5">
              <Button
                variant={showPinnedOnly ? "default" : "outline"}
                size="icon"
                className="size-7"
                title="Mostrar apenas apps fixados"
                disabled={pinnedApps.length === 0}
                onClick={() => setShowPinnedOnly((prev) => !prev)}
              >
                <Pin className="size-3.5" />
              </Button>

              <Button
                variant={showCustomOnly ? "default" : "outline"}
                size="icon"
                className="size-7"
                title="Mostrar apenas apps custom"
                onClick={() => setShowCustomOnly((prev) => !prev)}
              >
                <Star className="size-3.5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-7"
                title={sortOrder === "asc" ? "Ordenar Z-A" : "Ordenar A-Z"}
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortOrder === "asc" ? (
                  <ArrowDownAZ className="size-3.5" />
                ) : (
                  <ArrowUpAZ className="size-3.5" />
                )}
              </Button>
            </div>
          </div>

          <Separator className="shrink-0" />
        </>
      )}

      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1.5">
        {filteredComponents.map((app) => (
          <div
            key={app.id}
            className="flex items-center gap-2 p-2.5 rounded-lg border bg-card text-card-foreground"
          >
            <Badge
              variant={app.app.toLowerCase().startsWith("vtex") ? "default" : "secondary"}
              className="uppercase text-[10px] shrink-0"
              style={
                app.app.toLowerCase().startsWith("vtex")
                  ? { backgroundColor: "#F71963" }
                  : app.app.toLowerCase().includes("samsung")
                    ? { backgroundColor: "#1428a0", color: "#fff" }
                    : undefined
              }
            >
              {app.app.toLowerCase().startsWith("vtex") ? "VTEX" : "CUSTOM"}
            </Badge>

            <span className="text-sm font-semibold break-words flex-1">
              {app.app}
            </span>

            <span className="text-xs text-muted-foreground shrink-0">
              {app.version}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onClick={() => copy(app.id, `${app.app}@${app.version}`)}
            >
              {isCopied(app.id) ? (
                <Check className="size-3.5 text-success" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onClick={() => togglePin(app.id)}
            >
              {isPinned(app.id) ? (
                <Pin className="size-3.5 text-primary" />
              ) : (
                <PinOff className="size-3.5 text-muted-foreground opacity-50" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
