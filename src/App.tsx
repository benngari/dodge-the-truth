import { useEffect, useState } from "react";
import Home from "./pages/Home";

/**
 * Root component. Owns dark mode state and syncs it to the <html>
 * element so Tailwind's `dark:` variants take effect, persisting the
 * preference (and respecting the OS preference on first load).
 */
export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("dodge-the-truth:theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("dodge-the-truth:theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return <Home darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} />;
}
