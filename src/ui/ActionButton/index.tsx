import "./styles.css"

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
        <button
            className="action-button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}