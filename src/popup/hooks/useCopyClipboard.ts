import { useState } from "react";

export function useCopyClipboard() {
    const [copied, setCopied] = useState<string | null>(null);

    async function copy(id: string, value: string) {
        await navigator.clipboard.writeText(value);

        setCopied(id);

        setTimeout(() => {
            setCopied(null);
        }, 1500);
    }

    function isCopied(id: string) {
        return copied === id;
    }

    return {
        copy,
        isCopied,
    };
}