import { Button } from "@/components/ui/button"

interface Props {
    children: React.ReactNode
    onClick(): void
    disabled?: boolean
}

export function ActionButton({
    children,
    onClick,
    disabled = false,
}: Props) {
    return (
        <Button
            variant="outline"
            className="flex-1"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </Button>
    )
}
