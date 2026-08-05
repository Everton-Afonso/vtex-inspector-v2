import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "@sds.vtex-inspector.theme";

function getSystemTheme(): Theme {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

    return "light";
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;

        if (stored === "light" || stored === "dark") {
            return stored;
        }

        return getSystemTheme();
    });

    const resolvedTheme: ResolvedTheme = theme;

    const changeTheme = useCallback((next: Theme) => {
        setTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }, []);

    const toggleTheme = useCallback(() => {
        changeTheme(theme === "dark" ? "light" : "dark");
    }, [theme, changeTheme]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        function handleChange() {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) {
                const system = getSystemTheme();

                setTheme(system);
                applyTheme(system);
            }
        }

        media.addEventListener("change", handleChange);

        return () => media.removeEventListener("change", handleChange);
    }, []);

    return {
        theme,
        resolvedTheme,
        changeTheme,
        toggleTheme,
    };
}
