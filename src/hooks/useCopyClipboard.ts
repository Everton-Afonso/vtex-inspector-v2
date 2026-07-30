import { useState } from "react";

export function useCopyClipboard() {
    const [copied, setCopied] = useState<string | null>(null);

    async function copy(id: string, value: string) {
        try {
            await navigator.clipboard.writeText(value)

            setCopied(id)

            setTimeout(() => {
                setCopied(null)
            }, 1500)
        } catch (error) {
            console.error('Erro ao copiar:', error)
        }
    }

    function isCopied(id: string) {
        return copied === id;
    }

    return {
        copy,
        isCopied,
    };
}