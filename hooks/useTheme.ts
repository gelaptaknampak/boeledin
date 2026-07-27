"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("theme");

    let current: "light" | "dark";

    if (stored === "light" || stored === "dark") {
      current = stored;
    } else {
      current = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    setTheme(current);
    applyTheme(current);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement;

    html.classList.remove("light", "dark");

    html.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme, mounted };
}
