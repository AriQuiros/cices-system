import { useEffect, useState } from "react";

export function useDarkMode() {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const stored = localStorage.getItem("theme");

        if (stored) return stored === "dark";

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return { darkMode, toggleDarkMode };
}